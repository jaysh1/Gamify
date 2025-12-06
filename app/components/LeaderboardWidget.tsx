'use client';

import { useEffect, useState } from 'react';
import styles from './LeaderboardWidget.module.css';

interface LeaderboardWidgetProps {
  userId: string;
}

interface LeaderboardEntry {
  userId: string;
  userName: string | null;
  totalXP: number;
  level: number;
  rank: number;
}

interface LeaderboardData {
  entries: LeaderboardEntry[];
  userRank: number | null;
  totalUsers: number;
}

export default function LeaderboardWidget({ userId }: LeaderboardWidgetProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'global' | 'class' | 'subject'>('global');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/gamification/leaderboard?type=${filter}&userId=${userId}&limit=10`
        );
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [userId, filter]);

  if (loading) {
    return <div className={styles.loading} aria-busy="true">Loading leaderboard...</div>;
  }

  if (!leaderboard) {
    return <div className={styles.error}>Failed to load leaderboard</div>;
  }

  return (
    <div className={styles.leaderboard} role="region" aria-label="Leaderboard">
      <div className={styles.header}>
        <h2 className={styles.title}>Leaderboard</h2>
      </div>

      <div className={styles.filters} role="tablist">
        <button
          className={`${styles.filterButton} ${filter === 'global' ? styles.active : ''}`}
          onClick={() => setFilter('global')}
          role="tab"
          aria-selected={filter === 'global'}
          aria-label="Global leaderboard"
        >
          🌍 Global
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'class' ? styles.active : ''}`}
          onClick={() => setFilter('class')}
          role="tab"
          aria-selected={filter === 'class'}
          aria-label="Class leaderboard"
        >
          🎓 Class
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'subject' ? styles.active : ''}`}
          onClick={() => setFilter('subject')}
          role="tab"
          aria-selected={filter === 'subject'}
          aria-label="Subject leaderboard"
        >
          📚 Subject
        </button>
      </div>

      {leaderboard.userRank && (
        <div className={styles.userRank}>
          <span className={styles.rankLabel}>Your Rank:</span>
          <span className={styles.rankNumber}>#{leaderboard.userRank}</span>
          <span className={styles.totalUsers}>of {leaderboard.totalUsers}</span>
        </div>
      )}

      <div className={styles.entries} role="list">
        {leaderboard.entries.map((entry) => (
          <div
            key={entry.userId}
            className={`${styles.entry} ${entry.userId === userId ? styles.currentUser : ''}`}
            role="listitem"
            aria-label={`Rank ${entry.rank}: ${entry.userName || 'Anonymous'}, Level ${entry.level}, ${entry.totalXP} XP`}
          >
            <div className={styles.rankBadge}>
              {entry.rank <= 3 ? getRankEmoji(entry.rank) : `#${entry.rank}`}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {entry.userName || 'Anonymous'}
                {entry.userId === userId && <span className={styles.youBadge}>You</span>}
              </div>
              <div className={styles.userStats}>
                Level {entry.level} • {entry.totalXP.toLocaleString()} XP
              </div>
            </div>
          </div>
        ))}
      </div>

      {leaderboard.entries.length === 0 && (
        <div className={styles.empty}>
          <p>No leaderboard data available yet.</p>
        </div>
      )}
    </div>
  );
}

function getRankEmoji(rank: number): string {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return `#${rank}`;
  }
}
