'use client';

import { useState } from 'react';
import { InteractiveComponent } from '@/app/lib/api';
import styles from './interactive.module.css';

interface QuizComponentProps {
  component: InteractiveComponent;
  onComplete: () => void;
}

interface QuizOption {
  text: string;
  correct: boolean;
}

export default function QuizComponent({ component, onComplete }: QuizComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  let options: QuizOption[] = [];
  try {
    if (component.options) {
      options = JSON.parse(component.options);
    }
  } catch (err) {
    console.error('Failed to parse quiz options:', err);
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      const answer = options[selectedAnswer];
      setIsCorrect(answer.correct);
      setSubmitted(true);

      if (answer.correct) {
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div className={styles.component}>
      <div className={styles.componentHeader}>
        <span className={styles.componentType}>Quiz</span>
        <h3>{component.title}</h3>
      </div>

      <p className={styles.prompt}>{component.prompt}</p>

      {options.length > 0 ? (
        <div className={styles.quizOptions}>
          {options.map((option, index) => (
            <label key={index} className={styles.optionLabel}>
              <input
                type="radio"
                name={`quiz-${component.id}`}
                value={index}
                checked={selectedAnswer === index}
                onChange={(e) => setSelectedAnswer(parseInt(e.target.value))}
                disabled={submitted}
                aria-label={option.text}
              />
              <span className={styles.optionText}>{option.text}</span>
              {submitted && (
                <>
                  {option.correct && <span className={styles.correctIcon}>✓</span>}
                  {!option.correct && selectedAnswer === index && (
                    <span className={styles.incorrectIcon}>✗</span>
                  )}
                </>
              )}
            </label>
          ))}
        </div>
      ) : (
        <p className={styles.error}>No quiz options available</p>
      )}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className={styles.submitButton}
          aria-label="Submit your answer"
        >
          Submit Answer
        </button>
      ) : (
        <div className={styles.feedback}>
          {isCorrect ? (
            <p className={styles.successMessage}>🎉 Correct! Great job!</p>
          ) : (
            <>
              <p className={styles.errorMessage}>
                Oops! That's not quite right. Try again!
              </p>
              <button
                onClick={handleRetry}
                className={styles.retryButton}
                aria-label="Try this quiz again"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
