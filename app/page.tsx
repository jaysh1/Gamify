'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Module } from './lib/api';
import styles from './page.module.css';

export default function Home() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState('clkr8fn8q0000oq8g8f8f8f8f'); // Default user ID

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const response = await api.modules.getAll();
        setModules(response.data);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to load modules');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Loading modules...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Year 8 Dooren Syllabus</h1>
        <p>Interactive learning platform</p>
        <Link href="/dashboard" className={styles.dashboardLink}>
          🎮 View Dashboard
        </Link>
      </header>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <section className={styles.modulesGrid}>
        <h2>Available Modules</h2>
        {modules.length === 0 ? (
          <p>No modules available yet.</p>
        ) : (
          <div className={styles.grid}>
            {modules.map((module) => (
              <Link key={module.id} href={`/modules/${module.id}`}>
                <div className={styles.moduleCard}>
                  <h3>{module.name}</h3>
                  {module.description && <p>{module.description}</p>}
                  <div className={styles.lessonCount}>
                    {module.lessons?.length || 0} lessons
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
