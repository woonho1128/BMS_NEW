import React from 'react';
import { EmptyState } from './EmptyState';
import styles from './OrgHistoryList.module.css';

export function OrgHistoryList({ history }) {
  if (!history || history.length === 0) {
    return <EmptyState message="변경 이력이 없습니다." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.historyList}>
        {history.map((item) => (
          <div key={item.id} className={styles.historyItem}>
            <div className={styles.historyHeader}>
              <span className={styles.historyDate}>{item.at}</span>
              <span className={styles.historyActor}>변경자: {item.actorName}</span>
            </div>
            <div className={styles.historyContent}>
              <span className={styles.historyTarget}>{item.targetUserName}</span>
              <span className={styles.historyArrow}>→</span>
              <span className={styles.historyChange}>
                {item.fromOrgName} → {item.toOrgName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
