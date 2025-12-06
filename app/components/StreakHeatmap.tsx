'use client';

import { useEffect, useState } from 'react';
import styles from './StreakHeatmap.module.css';

interface StreakHeatmapProps {
  userId: string;
}

interface StreakDay {
  date: string;
  loggedIn: boolean;
  streakCount: number;
}

interface StreakData {
  currentStreak: number;
  history: StreakDay[];
}

export default function StreakHeatmap({ userId }: StreakHeatmapProps) {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStreakData() {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}/gamification/streak?days=90`);
        const data = await response.json();
        setStreakData(data);
      } catch (error) {
        console.error('Error fetching streak data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStreakData();
  }, [userId]);

  if (loading) {
    return <div className={styles.loading} aria-busy="true">Loading streak data...</div>;
  }

  if (!streakData) {
    return <div className={styles.error}>Failed to load streak data</div>;
  }

  const weeks = [];
  for (let i = 0; i < streakData.history.length; i += 7) {
    weeks.push(streakData.history.slice(i, i + 7));
  }

  return (
    <div className={styles.streakHeatmap} role="region" aria-label="Login Streak Heatmap">
      <div className={styles.header}>
        <h2 className={styles.title}>Login Streak</h2>
        <div className={styles.currentStreak}>
          <span className={styles.streakIcon}>🔥</span>
          <span className={styles.streakNumber}>{streakData.currentStreak}</span>
          <span className={styles.streakLabel}>day{streakData.currentStreak !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className={styles.heatmapGrid} role="grid">
        <div className={styles.weekLabels}>
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>
        <div className={styles.grid}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={styles.week} role="row">
              {week.map((day, dayIndex) => {
                const date = new Date(day.date);
                const intensity = day.loggedIn ? 'active' : 'inactive';
                return (
                  <div
                    key={dayIndex}
                    className={`${styles.day} ${styles[intensity]}`}
                    role="gridcell"
                    aria-label={`${date.toLocaleDateString()}: ${day.loggedIn ? 'Logged in' : 'No activity'}`}
                    title={`${date.toLocaleDateString()}: ${day.loggedIn ? `Streak: ${day.streakCount}` : 'No activity'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        <div className={`${styles.day} ${styles.inactive}`} />
        <div className={`${styles.day} ${styles.active}`} />
        <span className={styles.legendLabel}>More</span>
      </div>
    </div>
  );
}
