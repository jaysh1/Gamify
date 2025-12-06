import { prisma } from '../lib/prisma';
import { awardXP } from './xpService';

export interface BadgeCriteria {
  type: 'streak' | 'lesson_count' | 'quiz_perfect' | 'module_complete' | 'subject_mastery';
  value: number;
  subjectId?: string;
}

export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  const badges = await prisma.badge.findMany();
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });

  const userBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));
  const newlyAwardedBadges: string[] = [];

  for (const badge of badges) {
    if (userBadgeIds.has(badge.id)) {
      continue;
    }

    const criteria: BadgeCriteria = JSON.parse(badge.criteria);
    const earned = await checkBadgeCriteria(userId, criteria);

    if (earned) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      if (badge.xpReward > 0) {
        await awardXP(userId, badge.xpReward, 'badge_earned', { badgeId: badge.id });
      }

      newlyAwardedBadges.push(badge.id);
    }
  }

  return newlyAwardedBadges;
}

async function checkBadgeCriteria(
  userId: string,
  criteria: BadgeCriteria
): Promise<boolean> {
  switch (criteria.type) {
    case 'streak': {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const streakLog = await prisma.streakLog.findUnique({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
      });

      return (streakLog?.streakCount || 0) >= criteria.value;
    }

    case 'lesson_count': {
      const count = await prisma.lessonProgress.count({
        where: {
          userId,
          completed: true,
        },
      });

      return count >= criteria.value;
    }

    case 'quiz_perfect': {
      const perfectQuizzes = await prisma.xPTransaction.count({
        where: {
          userId,
          reason: 'quiz_completion',
          metadata: {
            contains: '"score":100',
          },
        },
      });

      return perfectQuizzes >= criteria.value;
    }

    case 'module_complete': {
      const userLessons = await prisma.lessonProgress.findMany({
        where: {
          userId,
          completed: true,
        },
        select: {
          lesson: {
            select: {
              moduleId: true,
            },
          },
        },
      });

      const completedModuleIds = new Set<string>();

      for (const progress of userLessons) {
        const module = await prisma.module.findUnique({
          where: { id: progress.lesson.moduleId },
          include: {
            lessons: {
              select: { id: true },
            },
          },
        });

        if (module) {
          const lessonIds = module.lessons.map((l) => l.id);
          const completedInModule = await prisma.lessonProgress.count({
            where: {
              userId,
              lessonId: { in: lessonIds },
              completed: true,
            },
          });

          if (completedInModule === lessonIds.length) {
            completedModuleIds.add(module.id);
          }
        }
      }

      return completedModuleIds.size >= criteria.value;
    }

    case 'subject_mastery': {
      if (!criteria.subjectId) return false;

      const modules = await prisma.module.findMany({
        where: { subjectId: criteria.subjectId },
        include: {
          lessons: {
            select: { id: true },
          },
        },
      });

      for (const module of modules) {
        const lessonIds = module.lessons.map((l) => l.id);
        const completedInModule = await prisma.lessonProgress.count({
          where: {
            userId,
            lessonId: { in: lessonIds },
            completed: true,
          },
        });

        if (completedInModule < lessonIds.length) {
          return false;
        }
      }

      return modules.length > 0;
    }

    default:
      return false;
  }
}

export async function getUserBadges(userId: string) {
  const allBadges = await prisma.badge.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true,
    },
  });

  const userBadgeMap = new Map(userBadges.map((ub) => [ub.badgeId, ub.awardedAt]));

  return allBadges.map((badge) => ({
    ...badge,
    earned: userBadgeMap.has(badge.id),
    awardedAt: userBadgeMap.get(badge.id) || null,
  }));
}

export async function initializeBadges(): Promise<void> {
  const badges = [
    {
      name: '3-Day Streak',
      description: 'Log in for 3 consecutive days',
      category: 'streak',
      criteria: JSON.stringify({ type: 'streak', value: 3 }),
      rarity: 'common',
      xpReward: 25,
    },
    {
      name: '7-Day Streak',
      description: 'Log in for 7 consecutive days',
      category: 'streak',
      criteria: JSON.stringify({ type: 'streak', value: 7 }),
      rarity: 'common',
      xpReward: 50,
    },
    {
      name: '14-Day Streak',
      description: 'Log in for 14 consecutive days',
      category: 'streak',
      criteria: JSON.stringify({ type: 'streak', value: 14 }),
      rarity: 'rare',
      xpReward: 100,
    },
    {
      name: '30-Day Streak',
      description: 'Log in for 30 consecutive days',
      category: 'streak',
      criteria: JSON.stringify({ type: 'streak', value: 30 }),
      rarity: 'epic',
      xpReward: 250,
    },
    {
      name: '90-Day Streak',
      description: 'Log in for 90 consecutive days',
      category: 'streak',
      criteria: JSON.stringify({ type: 'streak', value: 90 }),
      rarity: 'legendary',
      xpReward: 500,
    },
    {
      name: 'First Steps',
      description: 'Complete your first lesson',
      category: 'completion',
      criteria: JSON.stringify({ type: 'lesson_count', value: 1 }),
      rarity: 'common',
      xpReward: 10,
    },
    {
      name: 'Dedicated Learner',
      description: 'Complete 10 lessons',
      category: 'completion',
      criteria: JSON.stringify({ type: 'lesson_count', value: 10 }),
      rarity: 'common',
      xpReward: 50,
    },
    {
      name: 'Knowledge Seeker',
      description: 'Complete 50 lessons',
      category: 'completion',
      criteria: JSON.stringify({ type: 'lesson_count', value: 50 }),
      rarity: 'rare',
      xpReward: 200,
    },
    {
      name: 'Master Student',
      description: 'Complete 100 lessons',
      category: 'completion',
      criteria: JSON.stringify({ type: 'lesson_count', value: 100 }),
      rarity: 'epic',
      xpReward: 500,
    },
    {
      name: 'Perfect Score',
      description: 'Get 100% on a quiz',
      category: 'performance',
      criteria: JSON.stringify({ type: 'quiz_perfect', value: 1 }),
      rarity: 'common',
      xpReward: 30,
    },
    {
      name: 'Quiz Master',
      description: 'Get 100% on 10 quizzes',
      category: 'performance',
      criteria: JSON.stringify({ type: 'quiz_perfect', value: 10 }),
      rarity: 'rare',
      xpReward: 150,
    },
    {
      name: 'Module Complete',
      description: 'Complete an entire module',
      category: 'completion',
      criteria: JSON.stringify({ type: 'module_complete', value: 1 }),
      rarity: 'common',
      xpReward: 50,
    },
    {
      name: 'Module Master',
      description: 'Complete 5 modules',
      category: 'completion',
      criteria: JSON.stringify({ type: 'module_complete', value: 5 }),
      rarity: 'rare',
      xpReward: 200,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: {
        name_category: {
          name: badge.name,
          category: badge.category,
        },
      },
      update: badge,
      create: badge,
    });
  }
}
