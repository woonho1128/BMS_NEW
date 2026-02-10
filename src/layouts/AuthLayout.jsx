import React from 'react';
import styles from './AuthLayout.module.css';

export function AuthLayout({ children }) {
  return <div className={styles.layout}>{children}</div>;
}
