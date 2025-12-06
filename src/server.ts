import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma/client';

const app = express();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
} as any);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
    const { completed, progress } = req.body;

    const existingProgress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    let updated;
    if (existingProgress) {
      updated = await prisma.lessonProgress.update({
        where: { userId_lessonId: { userId, lessonId } },
        data: {
          completed: completed !== undefined ? completed : existingProgress.completed,
          progress: progress !== undefined ? progress : existingProgress.progress,
          completedAt: completed ? new Date() : null,
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

    res.json(updated);
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
