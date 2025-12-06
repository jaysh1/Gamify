'use client';

import { useEffect, useState } from 'react';
import styles from './BadgeGallery.module.css';

interface BadgeGalleryProps {
  userId: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: string;
  iconUrl: string | null;
  xpReward: number;
  earned: boolean;
  awardedAt: Date | null;
}

export default function BadgeGallery({ userId }: BadgeGalleryProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchBadges() {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}/gamification/badges`);
        const data = await response.json();
        setBadges(data);
      } catch (error) {
        console.error('Error fetching badges:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBadges();
  }, [userId]);

  if (loading) {
    return <div className={styles.loading} aria-busy="true">Loading badges...</div>;
  }

  const categories = ['all', 'streak', 'completion', 'performance', 'mastery'];
  const filteredBadges = filter === 'all' ? badges : badges.filter(b => b.category === filter);
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className={styles.badgeGallery} role="region" aria-label="Badge Gallery">
      <div className={styles.header}>
        <h2 className={styles.title}>Badges</h2>
        <p className={styles.progress}>
          {earnedCount} / {badges.length} earned
        </p>
      </div>

      <div className={styles.filters} role="tablist">
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.filterButton} ${filter === category ? styles.active : ''}`}
            onClick={() => setFilter(category)}
            role="tab"
            aria-selected={filter === category}
            aria-label={`Filter by ${category}`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.badgeGrid} role="list">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className={`${styles.badge} ${!badge.earned ? styles.locked : ''} ${styles[badge.rarity]}`}
            role="listitem"
            aria-label={`${badge.name}: ${badge.description}. ${badge.earned ? 'Earned' : 'Not earned yet'}`}
          >
            <div className={styles.badgeIcon}>
              {badge.earned ? getBadgeEmoji(badge.category) : '🔒'}
            </div>
            <h3 className={styles.badgeName}>{badge.name}</h3>
            <p className={styles.badgeDescription}>{badge.description}</p>
            <div className={styles.badgeFooter}>
              <span className={`${styles.rarity} ${styles[badge.rarity]}`}>
                {badge.rarity}
              </span>
              {badge.xpReward > 0 && (
                <span className={styles.xpReward}>+{badge.xpReward} XP</span>
              )}
            </div>
            {badge.earned && badge.awardedAt && (
              <p className={styles.awardedDate}>
                Earned {new Date(badge.awardedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className={styles.empty}>
          <p>No badges in this category yet.</p>
        </div>
      )}
    </div>
  );
}

function getBadgeEmoji(category: string): string {
  switch (category) {
    case 'streak':
      return '🔥';
    case 'completion':
      return '✅';
    case 'performance':
      return '⭐';
    case 'mastery':
      return '🏆';
    default:
      return '🎖️';
  }
}
