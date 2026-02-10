import React from 'react';
import { classnames } from '../../utils/classnames';
import styles from './DatePicker.module.css';

/**
 * Simple date input (native). Use for mockup; replace with library later if needed.
 * @param {{ label?: string; value?: string; onChange?: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'|'onChange'>}
 */
export function DatePicker({ label, value, onChange, className, id, ...props }) {
  const inputId = id ?? `date-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        type="date"
        id={inputId}
        className={classnames(styles.input, className)}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
    </div>
  );
}
