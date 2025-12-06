'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api, Lesson, LessonProgress, InteractiveComponent } from '@/app/lib/api';
import QuizComponent from '@/app/components/QuizComponent';
import ReflectionPrompt from '@/app/components/ReflectionPrompt';
import DiscussionPrompt from '@/app/components/DiscussionPrompt';
import styles from './lesson.module.css';

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState('clkr8fn8q0000oq8g8f8f8f8f');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const lessonResponse = await api.lessons.get(lessonId);
        setLesson(lessonResponse.data);

        const progressResponse = await api.progress.get(userId, lessonId);
        setProgress(progressResponse.data);
        setCurrentProgress(progressResponse.data.progress);
        setIsCompleted(progressResponse.data.completed);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId, userId]);

  const handleProgressUpdate = async (newProgress: number, completed: boolean = false) => {
    try {
      const updated = await api.progress.update(userId, lessonId, {
        progress: newProgress,
        completed,
      });
      setProgress(updated.data);
      setCurrentProgress(updated.data.progress);
      setIsCompleted(updated.data.completed);

      if (completed && !isCompleted) {
        setShowCompletionMessage(true);
        setTimeout(() => setShowCompletionMessage(false), 3000);
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleMarkComplete = async () => {
    await handleProgressUpdate(100, true);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Loading lesson...</div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className={styles.container}>
        <div className={styles.error} role="alert">
          {error || 'Lesson not found'}
        </div>
        <Link href="/" className={styles.backLink}>
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href={`/modules/${lesson.module?.id || ''}`} className={styles.backLink}>
        ← Back to module
      </Link>

      {showCompletionMessage && (
        <div className={styles.completionMessage} role="status" aria-live="polite">
          🎉 Lesson completed! Great job!
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          {lesson.module?.subject?.name} / {lesson.module?.name}
        </div>
        <h1>{lesson.title}</h1>
        {lesson.description && <p>{lesson.description}</p>}
      </header>

      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${currentProgress}%` }}
            role="progressbar"
            aria-valuenow={currentProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <span className={styles.progressText}>{currentProgress}% Complete</span>
      </div>

      <div className={styles.content}>
        {/* Main content */}
        <section className={styles.mainContent}>
          <div className={styles.lessonContent}>
            <h2>Content</h2>
            <p>{lesson.content}</p>
          </div>

          {/* Video section */}
          {lesson.videoUrl && (
            <section className={styles.videoSection}>
              <h2>Video</h2>
              <div className={styles.videoContainer}>
                <iframe
                  width="100%"
                  height="400"
                  src={lesson.videoUrl}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          {/* Interactive components */}
          {lesson.interactiveComponents && lesson.interactiveComponents.length > 0 && (
            <section className={styles.interactiveSection}>
              <h2>Interactive Activities</h2>
              <div className={styles.componentsList}>
                {lesson.interactiveComponents.map((component) => (
                  <div key={component.id} className={styles.componentWrapper}>
                    {component.type === 'quiz' && (
                      <QuizComponent
                        component={component}
                        onComplete={() => handleProgressUpdate(currentProgress + 10)}
                      />
                    )}
                    {component.type === 'reflection_prompt' && (
                      <ReflectionPrompt
                        component={component}
                        onSubmit={() => handleProgressUpdate(currentProgress + 15)}
                      />
                    )}
                    {component.type === 'discussion' && (
                      <DiscussionPrompt
                        component={component}
                        onSubmit={() => handleProgressUpdate(currentProgress + 10)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Media assets */}
          {lesson.mediaAssets && lesson.mediaAssets.length > 0 && (
            <section className={styles.mediaSection}>
              <h2>Resources</h2>
              <div className={styles.mediaGrid}>
                {lesson.mediaAssets.map((asset) => (
                  <div key={asset.id} className={styles.mediaCard}>
                    {asset.type === 'image' && (
                      <img src={asset.url} alt={asset.title || 'Media'} />
                    )}
                    {asset.type === 'video' && (
                      <video controls>
                        <source src={asset.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {asset.title && <p>{asset.title}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completion button */}
          <div className={styles.actionSection}>
            {!isCompleted ? (
              <button
                onClick={handleMarkComplete}
                className={styles.completeButton}
                aria-label="Mark this lesson as complete"
              >
                Mark as Complete
              </button>
            ) : (
              <div className={styles.completedBanner}>
                <span>✓ You have completed this lesson</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
