import React, { useId } from 'react';
import { classnames } from '../../utils/classnames';
import styles from './Input.module.css';

/**
 * @param {React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }}
 */
export function Input({ label, error, className, id, ...props }) {
  const fallbackId = useId();
  const inputId = id ?? `input-${fallbackId}`;
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={classnames(styles.input, error && styles.hasError, className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
