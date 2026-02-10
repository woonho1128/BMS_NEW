import React from 'react';
import styles from './EmptyState.module.css';

export function EmptyState({ message = '데이터가 없습니다.', className }) {
  return (
    <div className={`${styles.emptyState} ${className || ''}`}>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
