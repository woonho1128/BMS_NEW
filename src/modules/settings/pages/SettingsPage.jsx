import React from 'react';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.subtitle}>Admins — system settings (placeholder)</p>
      <p className={styles.placeholder}>Settings content — dummy</p>
    </div>
  );
}
