'use client';

import { useState } from 'react';
import { InteractiveComponent } from '@/app/lib/api';
import styles from './interactive.module.css';

interface DiscussionPromptProps {
  component: InteractiveComponent;
  onSubmit: () => void;
}

export default function DiscussionPrompt({ component, onSubmit }: DiscussionPromptProps) {
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
        <span className={styles.componentType}>Discussion</span>
        <h3>{component.title}</h3>
      </div>

      <p className={styles.prompt}>{component.prompt}</p>

      {!submitted ? (
        <>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Share your thoughts with the class..."
            className={styles.textarea}
            rows={5}
            aria-label="Discussion response"
          />
          <button
            onClick={handleSubmit}
            disabled={response.trim().length === 0}
            className={styles.submitButton}
            aria-label="Submit your discussion response"
          >
            Share Your Thoughts
          </button>
        </>
      ) : (
        <div className={styles.feedback}>
          <p className={styles.successMessage}>
            ✓ Your response has been submitted! Great perspective!
          </p>
          <button
            onClick={handleNew}
            className={styles.retryButton}
            aria-label="Respond to this discussion again"
          >
            Write Another Response
          </button>
        </div>
      )}
    </div>
  );
}
