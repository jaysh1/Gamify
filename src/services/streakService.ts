import { prisma } from '../lib/prisma';
import { awardXP, XP_RULES } from './xpService';

export async function recordDailyLogin(userId: string): Promise<{
  streakCount: number;
  xpAwarded: number;
  isNewStreak: boolean;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingLog = await prisma.streakLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  if (existingLog) {
    return {
      streakCount: existingLog.streakCount,
      xpAwarded: 0,
      isNewStreak: false,
    };
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayLog = await prisma.streakLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: yesterday,
      },
    },
  });

  const streakCount = yesterdayLog ? yesterdayLog.streakCount + 1 : 1;

  await prisma.streakLog.create({
    data: {
      userId,
      date: today,
      loggedIn: true,
      streakCount,
    },
  });

  await awardXP(userId, XP_RULES.DAILY_LOGIN, 'daily_login', { streakCount });

  return {
    streakCount,
    xpAwarded: XP_RULES.DAILY_LOGIN,
    isNewStreak: true,
  };
}

export async function getCurrentStreak(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayLog = await prisma.streakLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  if (todayLog) {
    return todayLog.streakCount;
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayLog = await prisma.streakLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: yesterday,
      },
    },
  });

  return yesterdayLog ? yesterdayLog.streakCount : 0;
}

export async function getStreakHistory(
  userId: string,
  days: number = 90
): Promise<{ date: string; loggedIn: boolean; streakCount: number }[]> {
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  const logs = await prisma.streakLog.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  const result: { date: string; loggedIn: boolean; streakCount: number }[] = [];
  const logMap = new Map(logs.map((log) => [log.date.toISOString().split('T')[0], log]));

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const log = logMap.get(dateStr);

    result.push({
      date: dateStr,
      loggedIn: log?.loggedIn || false,
      streakCount: log?.streakCount || 0,
    });
  }

  return result;
}

export async function checkAndResetStreaks(): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const usersWithYesterdayStreak = await prisma.streakLog.findMany({
    where: {
      date: yesterday,
      loggedIn: true,
    },
    select: {
      userId: true,
    },
  });

  const userIds = usersWithYesterdayStreak.map((log) => log.userId);

  const usersWithTodayLog = await prisma.streakLog.findMany({
    where: {
      date: today,
      userId: { in: userIds },
    },
    select: {
      userId: true,
    },
  });

  const usersWithTodayLogSet = new Set(usersWithTodayLog.map((log) => log.userId));
  const usersMissedToday = userIds.filter((id) => !usersWithTodayLogSet.has(id));

  for (const userId of usersMissedToday) {
    await prisma.streakLog.create({
      data: {
        userId,
        date: today,
        loggedIn: false,
        streakCount: 0,
      },
    });
  }
}
