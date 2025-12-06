import { prisma } from '../lib/prisma';

export const XP_RULES = {
  DAILY_LOGIN: 10,
  LESSON_COMPLETION: 50,
  MODULE_COMPLETION: 100,
  QUIZ_BASE: 20,
  PERFECT_QUIZ: 50,
};

export const STREAK_MULTIPLIERS = {
  3: 1.1,
  7: 1.2,
  14: 1.5,
  30: 2.0,
};

export async function awardXP(
  userId: string,
  amount: number,
  reason: string,
  metadata?: any
): Promise<{ totalXP: number; level: number; leveledUp: boolean }> {
  let userLevel = await prisma.userLevel.findUnique({ where: { userId } });
  
  if (!userLevel) {
    userLevel = await prisma.userLevel.create({
      data: { userId, totalXP: 0, level: 1 },
    });
  }

  await prisma.xPTransaction.create({
    data: {
      userId,
      amount,
      reason,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });

  const newTotalXP = userLevel.totalXP + amount;
  const oldLevel = userLevel.level;
  const newLevel = calculateLevel(newTotalXP);

  userLevel = await prisma.userLevel.update({
    where: { userId },
    data: {
      totalXP: newTotalXP,
      level: newLevel,
    },
  });

  return {
    totalXP: newTotalXP,
    level: newLevel,
    leveledUp: newLevel > oldLevel,
  };
}

export function calculateLevel(totalXP: number): number {
  let level = 1;
  let xpForNextLevel = 100;
  let xpAccumulated = 0;

  while (xpAccumulated + xpForNextLevel <= totalXP) {
    xpAccumulated += xpForNextLevel;
    level++;
    xpForNextLevel = level * 100;
  }

  return level;
}

export function getXPForLevel(level: number): number {
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += i * 100;
  }
  return totalXP;
}

export function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * 100;
}

export async function getStreakMultiplier(userId: string): Promise<number> {
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

  if (!streakLog) {
    return 1.0;
  }

  const streakCount = streakLog.streakCount;
  
  if (streakCount >= 30) return STREAK_MULTIPLIERS[30];
  if (streakCount >= 14) return STREAK_MULTIPLIERS[14];
  if (streakCount >= 7) return STREAK_MULTIPLIERS[7];
  if (streakCount >= 3) return STREAK_MULTIPLIERS[3];
  
  return 1.0;
}

export async function awardLessonCompletionXP(
  userId: string,
  lessonId: string
): Promise<{ totalXP: number; level: number; leveledUp: boolean }> {
  const multiplier = await getStreakMultiplier(userId);
  const xp = Math.floor(XP_RULES.LESSON_COMPLETION * multiplier);

  return awardXP(userId, xp, 'lesson_completion', { lessonId, multiplier });
}

export async function awardQuizXP(
  userId: string,
  lessonId: string,
  score: number
): Promise<{ totalXP: number; level: number; leveledUp: boolean }> {
  const multiplier = await getStreakMultiplier(userId);
  let xp = Math.floor(XP_RULES.QUIZ_BASE * (score / 100) * multiplier);

  if (score === 100) {
    xp += XP_RULES.PERFECT_QUIZ;
  }

  return awardXP(userId, xp, 'quiz_completion', { lessonId, score, multiplier });
}

export async function awardModuleCompletionXP(
  userId: string,
  moduleId: string
): Promise<{ totalXP: number; level: number; leveledUp: boolean }> {
  const multiplier = await getStreakMultiplier(userId);
  const xp = Math.floor(XP_RULES.MODULE_COMPLETION * multiplier);

  return awardXP(userId, xp, 'module_completion', { moduleId, multiplier });
}

export async function checkModuleCompletion(
  userId: string,
  moduleId: string
): Promise<boolean> {
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      lessons: {
        select: { id: true },
      },
    },
  });

  if (!module || module.lessons.length === 0) {
    return false;
  }

  const lessonIds = module.lessons.map((l) => l.id);
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: lessonIds },
      completed: true,
    },
  });

  return completedLessons === lessonIds.length;
}
