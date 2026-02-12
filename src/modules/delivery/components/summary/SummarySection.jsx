import React from 'react';
import styles from './SummarySection.module.css';

export const SummarySection = ({ title, unitText, children }) => {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.unitText}>
          {unitText}
          <span className={styles.infoIcon} title="단위 설명">i</span>
        </span>
      </div>
      {children}
    </div>
  );
};
