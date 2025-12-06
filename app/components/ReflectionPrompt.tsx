'use client';

import { useState } from 'react';
import { InteractiveComponent } from '@/app/lib/api';
import styles from './interactive.module.css';

interface ReflectionPromptProps {
  component: InteractiveComponent;
  onSubmit: () => void;
}

export default function ReflectionPrompt({ component, onSubmit }: ReflectionPromptProps) {
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (response.trim().length > 0) {
      setSubmitted(true);
      setTimeout(() => {
        onSubmit();
      }, 500);
    }
  };

  const handleNew = () => {
    setResponse('');
    setSubmitted(false);
  };

  return (
    <div className={styles.component}>
      <div className={styles.componentHeader}>
        <span className={styles.componentType}>Reflection</span>
        <h3>{component.title}</h3>
      </div>

      <p className={styles.prompt}>{component.prompt}</p>

      {!submitted ? (
        <>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Share your thoughts here..."
            className={styles.textarea}
            rows={5}
            aria-label="Reflection response"
          />
          <button
            onClick={handleSubmit}
            disabled={response.trim().length === 0}
            className={styles.submitButton}
            aria-label="Submit your reflection"
          >
            Submit Reflection
          </button>
        </>
      ) : (
        <div className={styles.feedback}>
          <p className={styles.successMessage}>
            ✓ Thank you for your reflection! This will help your learning.
          </p>
          <button
            onClick={handleNew}
            className={styles.retryButton}
            aria-label="Write another reflection"
          >
            Write Another
          </button>
        </div>
      )}
    </div>
  );
}
