'use client';

import { useEffect, useState } from 'react';
import styles from './XPMeter.module.css';

interface XPMeterProps {
  userId: string;
}

interface GamificationStats {
  level: number;
  totalXP: number;
  xpForNextLevel: number;
  currentStreak: number;
}

export default function XPMeter({ userId }: XPMeterProps) {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}/gamification/stats`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching gamification stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  if (loading) {
    return <div className={styles.loading} aria-busy="true">Loading stats...</div>;
  }

  if (!stats) {
    return <div className={styles.error}>Failed to load stats</div>;
  }

  const xpInCurrentLevel = stats.totalXP - getXPForLevel(stats.level - 1);
  const xpProgress = (xpInCurrentLevel / stats.xpForNextLevel) * 100;

  return (
    <div className={styles.xpMeter} role="region" aria-label="Experience Points Meter">
      <div className={styles.header}>
        <h2 className={styles.title}>Level {stats.level}</h2>
        <p className={styles.xpCount} aria-label={`Total XP: ${stats.totalXP}`}>
          {stats.totalXP.toLocaleString()} XP
        </p>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressBar} role="progressbar" aria-valuenow={xpProgress} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.progressFill} style={{ width: `${xpProgress}%` }}>
            <span className={styles.progressText}>{Math.round(xpProgress)}%</span>
          </div>
        </div>
        <p className={styles.progressLabel}>
          {xpInCurrentLevel} / {stats.xpForNextLevel} XP to Level {stats.level + 1}
        </p>
      </div>

      <div className={styles.streakBadge}>
        <span className={styles.streakIcon}>🔥</span>
        <span className={styles.streakCount}>{stats.currentStreak} day streak</span>
      </div>
    </div>
  );
}

function getXPForLevel(level: number): number {
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += i * 100;
  }
  return totalXP;
}
