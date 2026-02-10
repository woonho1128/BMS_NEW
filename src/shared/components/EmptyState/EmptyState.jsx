import React from 'react';
import styles from './EmptyState.module.css';

/**
 * @param {{ message?: string; children?: React.ReactNode }} props
 */
export function EmptyState({ message = '내용이 없습니다.', children }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.message}>{message}</p>
      {children}
    </div>
  );
}
