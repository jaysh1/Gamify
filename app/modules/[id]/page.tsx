'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api, Module, LessonProgress } from '@/app/lib/api';
import styles from './module.module.css';

export default function ModulePage() {
  const params = useParams();
  const moduleId = params.id as string;
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState('clkr8fn8q0000oq8g8f8f8f8f');
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const modulesResponse = await api.modules.getAll();
        const foundModule = modulesResponse.data.find((m) => m.id === moduleId);
        if (foundModule) {
          setModule(foundModule);

          // Fetch progress for each lesson
          if (foundModule.lessons) {
            const progressData: Record<string, LessonProgress> = {};
            for (const lesson of foundModule.lessons) {
              try {
                const progressResponse = await api.progress.get(userId, lesson.id);
                progressData[lesson.id] = progressResponse.data;
              } catch (err) {
                // Progress not found is okay
              }
            }
            setProgressMap(progressData);
          }
        } else {
          setError('Module not found');
        }
      } catch (err) {
        console.error('Error fetching module:', err);
        setError('Failed to load module');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId, userId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Loading module...</div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className={styles.container}>
        <div className={styles.error} role="alert">
          {error || 'Module not found'}
        </div>
        <Link href="/" className={styles.backLink}>
          ← Back to modules
        </Link>
      </div>
    );
  }

  const moduleProgress = module.lessons
    ? Math.round(
        module.lessons.reduce((sum, lesson) => {
          const progress = progressMap[lesson.id];
          return sum + (progress?.progress || 0);
        }, 0) / module.lessons.length
      )
    : 0;

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Back to modules
      </Link>

      <header className={styles.header}>
        <h1>{module.name}</h1>
        {module.description && <p>{module.description}</p>}
      </header>

      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${moduleProgress}%` }}
            role="progressbar"
            aria-valuenow={moduleProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <span className={styles.progressText}>{moduleProgress}% Complete</span>
      </div>

      <section className={styles.lessonsSection}>
        <h2>Lessons</h2>
        {module.lessons && module.lessons.length > 0 ? (
          <div className={styles.lessonsList}>
            {module.lessons.map((lesson) => {
              const progress = progressMap[lesson.id];
              const isCompleted = progress?.completed || false;
              const progressPercent = progress?.progress || 0;

              return (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                  <div className={`${styles.lessonCard} ${isCompleted ? styles.completed : ''}`}>
                    <div className={styles.lessonHeader}>
                      <span className={styles.lessonNumber}>Lesson {lesson.order}</span>
                      {isCompleted && <span className={styles.completedBadge}>✓ Completed</span>}
                    </div>
                    <h3>{lesson.title}</h3>
                    {lesson.description && <p>{lesson.description}</p>}
                    <div className={styles.lessonProgress}>
                      <div className={styles.smallProgressBar}>
                        <div
                          className={styles.smallProgressFill}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span>{progressPercent}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p>No lessons available in this module.</p>
        )}
      </section>
    </div>
  );
}
