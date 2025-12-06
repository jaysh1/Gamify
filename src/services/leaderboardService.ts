import { prisma } from '../lib/prisma';

export interface LeaderboardEntry {
  userId: string;
  userName: string | null;
  totalXP: number;
  level: number;
  rank: number;
}

export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  userRank: number | null;
  totalUsers: number;
}

export async function getGlobalLeaderboard(
  limit: number = 10,
  offset: number = 0
): Promise<LeaderboardEntry[]> {
  const userLevels = await prisma.userLevel.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      { totalXP: 'desc' },
      { updatedAt: 'asc' },
    ],
    take: limit,
    skip: offset,
  });

  return userLevels.map((ul, index) => ({
    userId: ul.userId,
    userName: ul.user.name,
    totalXP: ul.totalXP,
    level: ul.level,
    rank: offset + index + 1,
  }));
}

export async function getClassLeaderboard(
  classId: string,
  limit: number = 10,
  offset: number = 0
): Promise<LeaderboardEntry[]> {
  const userLevels = await prisma.userLevel.findMany({
    where: {
      user: {
        classId,
      },
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      { totalXP: 'desc' },
      { updatedAt: 'asc' },
    ],
    take: limit,
    skip: offset,
  });

  return userLevels.map((ul, index) => ({
    userId: ul.userId,
    userName: ul.user.name,
    totalXP: ul.totalXP,
    level: ul.level,
    rank: offset + index + 1,
  }));
}

export async function getSubjectLeaderboard(
  subjectId: string,
  limit: number = 10,
  offset: number = 0
): Promise<LeaderboardEntry[]> {
  const modules = await prisma.module.findMany({
    where: { subjectId },
    include: {
      lessons: {
        select: { id: true },
      },
    },
  });

  const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));

  if (lessonIds.length === 0) {
    return [];
  }

  const transactions = await prisma.xPTransaction.findMany({
    where: {
      metadata: {
        contains: 'lessonId',
      },
    },
  });

  const userXPMap = new Map<string, number>();
  
  for (const transaction of transactions) {
    if (transaction.metadata) {
      try {
        const metadata = JSON.parse(transaction.metadata);
        if (metadata.lessonId && lessonIds.includes(metadata.lessonId)) {
          const currentXP = userXPMap.get(transaction.userId) || 0;
          userXPMap.set(transaction.userId, currentXP + transaction.amount);
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }

  const sortedUsers = Array.from(userXPMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(offset, offset + limit);

  if (sortedUsers.length === 0) {
    return [];
  }

  const userIds = sortedUsers.map((u) => u[0]);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true },
  });

  const userLevels = await prisma.userLevel.findMany({
    where: { userId: { in: userIds } },
  });

  const userMap = new Map(users.map((u) => [u.id, u.name]));
  const levelMap = new Map(userLevels.map((ul) => [ul.userId, ul]));

  return sortedUsers.map(([userId, xp], index) => ({
    userId,
    userName: userMap.get(userId) || null,
    totalXP: xp,
    level: levelMap.get(userId)?.level || 1,
    rank: offset + index + 1,
  }));
}

export async function getUserRank(userId: string): Promise<number> {
  const userLevel = await prisma.userLevel.findUnique({
    where: { userId },
  });

  if (!userLevel) {
    return -1;
  }

  const higherRankedUsers = await prisma.userLevel.count({
    where: {
      OR: [
        { totalXP: { gt: userLevel.totalXP } },
        {
          totalXP: userLevel.totalXP,
          updatedAt: { lt: userLevel.updatedAt },
        },
      ],
    },
  });

  return higherRankedUsers + 1;
}

export async function getUserClassRank(
  userId: string,
  classId: string
): Promise<number> {
  const userLevel = await prisma.userLevel.findUnique({
    where: { userId },
  });

  if (!userLevel) {
    return -1;
  }

  const higherRankedUsers = await prisma.userLevel.count({
    where: {
      user: {
        classId,
      },
      OR: [
        { totalXP: { gt: userLevel.totalXP } },
        {
          totalXP: userLevel.totalXP,
          updatedAt: { lt: userLevel.updatedAt },
        },
      ],
    },
  });

  return higherRankedUsers + 1;
}

export async function getLeaderboardWithUser(
  userId: string,
  type: 'global' | 'class' | 'subject' = 'global',
  classId?: string,
  subjectId?: string,
  topLimit: number = 10
): Promise<LeaderboardResult> {
  let topEntries: LeaderboardEntry[];
  let userRank: number;
  let totalUsers: number;

  if (type === 'class' && classId) {
    topEntries = await getClassLeaderboard(classId, topLimit);
    userRank = await getUserClassRank(userId, classId);
    totalUsers = await prisma.userLevel.count({
      where: { user: { classId } },
    });
  } else if (type === 'subject' && subjectId) {
    topEntries = await getSubjectLeaderboard(subjectId, topLimit);
    userRank = await getUserRank(userId);
    totalUsers = await prisma.userLevel.count();
  } else {
    topEntries = await getGlobalLeaderboard(topLimit);
    userRank = await getUserRank(userId);
    totalUsers = await prisma.userLevel.count();
  }

  return {
    entries: topEntries,
    userRank,
    totalUsers,
  };
}
