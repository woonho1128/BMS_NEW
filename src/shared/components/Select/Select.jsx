import React from 'react';
import { classnames } from '../../utils/classnames';
import styles from './Select.module.css';

/**
 * @param {{ label?: string; options: { value: string; label: string }[]; value?: string; onChange?: (value: string) => void } & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'>}
 */
export function Select({ label, options, value, onChange, className, id, ...props }) {
  const selectId = id ?? `select-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={classnames(styles.select, className)}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
