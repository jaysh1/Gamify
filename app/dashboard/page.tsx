'use client';

import { useEffect } from 'react';
import XPMeter from '../components/XPMeter';
import StreakHeatmap from '../components/StreakHeatmap';
import BadgeGallery from '../components/BadgeGallery';
import LeaderboardWidget from '../components/LeaderboardWidget';
import styles from './page.module.css';

const DEFAULT_USER_ID = 'clkr8fn8q0000oq8g8f8f8f8f';

export default function DashboardPage() {
  useEffect(() => {
    async function recordLogin() {
      try {
        await fetch(`http://localhost:3000/api/users/${DEFAULT_USER_ID}/gamification/login`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error recording login:', error);
      }
    }

    recordLogin();
  }, []);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gamification Dashboard</h1>
        <p className={styles.subtitle}>Track your progress, earn badges, and compete with peers</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.topSection}>
          <div className={styles.xpSection}>
            <XPMeter userId={DEFAULT_USER_ID} />
          </div>
          <div className={styles.leaderboardSection}>
            <LeaderboardWidget userId={DEFAULT_USER_ID} />
          </div>
        </div>

        <div className={styles.streakSection}>
          <StreakHeatmap userId={DEFAULT_USER_ID} />
        </div>

        <div className={styles.badgeSection}>
          <BadgeGallery userId={DEFAULT_USER_ID} />
        </div>
      </div>
    </div>
  );
}
