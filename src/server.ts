import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma';
import {
  awardLessonCompletionXP,
  awardQuizXP,
  awardModuleCompletionXP,
  checkModuleCompletion,
  getXPForNextLevel,
} from './services/xpService';
import {
  recordDailyLogin,
  getCurrentStreak,
  getStreakHistory,
} from './services/streakService';
import {
  checkAndAwardBadges,
  getUserBadges,
} from './services/badgeService';
import {
  getGlobalLeaderboard,
  getClassLeaderboard,
  getSubjectLeaderboard,
  getLeaderboardWithUser,
} from './services/leaderboardService';
import { startCronJobs } from './services/cronService';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

startCronJobs();

// Middleware for error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Get all modules for a subject
app.get('/api/subjects/:subjectId/modules', async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.params;
    const modules = await prisma.module.findMany({
      where: { subjectId },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// Get all modules (simplified)
app.get('/api/modules', async (req: Request, res: Response) => {
  try {
    const modules = await prisma.module.findMany({
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
      orderBy: [
        { subject: { code: 'asc' } },
        { order: 'asc' },
      ],
    });
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// Get lesson details
app.get('/api/lessons/:lessonId', async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        interactiveComponents: {
          orderBy: { order: 'asc' },
        },
        mediaAssets: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Get lesson progress for a user
app.get('/api/users/:userId/progress', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const progress = await prisma.lessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            moduleId: true,
          },
        },
      },
    });

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get specific lesson progress
app.get('/api/users/:userId/lessons/:lessonId/progress', async (req: Request, res: Response) => {
  try {
    const { userId, lessonId } = req.params;

    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    res.status(500).json({ error: 'Failed to fetch lesson progress' });
  }
});

// Update lesson progress
app.put('/api/users/:userId/lessons/:lessonId/progress', async (req: Request, res: Response) => {
  try {
    const { userId, lessonId } = req.params;
    const { completed, progress, quizScore } = req.body;

    const existingProgress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    let updated;
    const wasAlreadyCompleted = existingProgress?.completed || false;

    if (existingProgress) {
      updated = await prisma.lessonProgress.update({
        where: { userId_lessonId: { userId, lessonId } },
        data: {
          completed: completed !== undefined ? completed : existingProgress.completed,
          progress: progress !== undefined ? progress : existingProgress.progress,
          completedAt: completed ? new Date() : existingProgress.completedAt,
        },
      });
    } else {
      updated = await prisma.lessonProgress.create({
        data: {
          userId,
          lessonId,
          completed: completed || false,
          progress: progress || 0,
          completedAt: completed ? new Date() : null,
        },
      });
    }

    let xpResult;
    if (completed && !wasAlreadyCompleted) {
      xpResult = await awardLessonCompletionXP(userId, lessonId);

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { moduleId: true },
      });

      if (lesson) {
        const moduleCompleted = await checkModuleCompletion(userId, lesson.moduleId);
        if (moduleCompleted) {
          const moduleXpResult = await awardModuleCompletionXP(userId, lesson.moduleId);
          xpResult = moduleXpResult;
        }
      }

      await checkAndAwardBadges(userId);
    }

    if (quizScore !== undefined && quizScore !== null) {
      xpResult = await awardQuizXP(userId, lessonId, quizScore);
      await checkAndAwardBadges(userId);
    }

    res.json({ ...updated, xpResult });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get user milestones
app.get('/api/users/:userId/milestones', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const milestones = await prisma.studentMilestone.findMany({
      where: { userId },
      include: {
        milestone: {
          select: {
            id: true,
            name: true,
            description: true,
            threshold: true,
          },
        },
      },
    });

    res.json(milestones);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
});

// Get all subjects
app.get('/api/subjects', async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        modules: {
          select: {
            id: true,
            name: true,
            order: true,
          },
        },
      },
    });
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

app.post('/api/users/:userId/gamification/login', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await recordDailyLogin(userId);
    await checkAndAwardBadges(userId);
    res.json(result);
  } catch (error) {
    console.error('Error recording daily login:', error);
    res.status(500).json({ error: 'Failed to record daily login' });
  }
});

app.get('/api/users/:userId/gamification/stats', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    let userLevel = await prisma.userLevel.findUnique({
      where: { userId },
    });

    if (!userLevel) {
      userLevel = await prisma.userLevel.create({
        data: { userId, totalXP: 0, level: 1 },
      });
    }

    const currentStreak = await getCurrentStreak(userId);
    const xpForNextLevel = getXPForNextLevel(userLevel.level);

    res.json({
      level: userLevel.level,
      totalXP: userLevel.totalXP,
      xpForNextLevel,
      currentStreak,
    });
  } catch (error) {
    console.error('Error fetching gamification stats:', error);
    res.status(500).json({ error: 'Failed to fetch gamification stats' });
  }
});

app.get('/api/users/:userId/gamification/xp-transactions', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const transactions = await prisma.xPTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching XP transactions:', error);
    res.status(500).json({ error: 'Failed to fetch XP transactions' });
  }
});

app.get('/api/users/:userId/gamification/badges', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const badges = await getUserBadges(userId);
    res.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

app.get('/api/users/:userId/gamification/streak', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const days = parseInt(req.query.days as string) || 90;
    const history = await getStreakHistory(userId, days);
    const currentStreak = await getCurrentStreak(userId);

    res.json({
      currentStreak,
      history,
    });
  } catch (error) {
    console.error('Error fetching streak data:', error);
    res.status(500).json({ error: 'Failed to fetch streak data' });
  }
});

app.get('/api/gamification/leaderboard', async (req: Request, res: Response) => {
  try {
    const type = (req.query.type as string) || 'global';
    const userId = req.query.userId as string;
    const classId = req.query.classId as string;
    const subjectId = req.query.subjectId as string;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    let leaderboard;

    if (userId) {
      leaderboard = await getLeaderboardWithUser(
        userId,
        type as 'global' | 'class' | 'subject',
        classId,
        subjectId,
        limit
      );
    } else if (type === 'class' && classId) {
      const entries = await getClassLeaderboard(classId, limit, offset);
      leaderboard = { entries, userRank: null, totalUsers: 0 };
    } else if (type === 'subject' && subjectId) {
      const entries = await getSubjectLeaderboard(subjectId, limit, offset);
      leaderboard = { entries, userRank: null, totalUsers: 0 };
    } else {
      const entries = await getGlobalLeaderboard(limit, offset);
      leaderboard = { entries, userRank: null, totalUsers: 0 };
    }

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Error handler for unhandled routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    prisma.$disconnect();
    process.exit(0);
  });
});
