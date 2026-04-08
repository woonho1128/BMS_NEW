import React from 'react';
import { notify } from '../../../../shared/utils/notify';
import styles from './PlanHeaderBar.module.css';
import { PLAN_SNAPSHOTS } from '../../data/planDummyData';

export const PlanHeaderBar = ({ selectedSnapshot, onSnapshotChange }) => {
  const currentSnapshot = PLAN_SNAPSHOTS.find((snapshot) => snapshot.id === selectedSnapshot) || PLAN_SNAPSHOTS[0];

  return (
    <div className={styles.headerBarContainer}>
      <div className={styles.leftGroup}>
        <select className={styles.snapshotSelect} value={selectedSnapshot} onChange={(e) => onSnapshotChange(e.target.value)}>
          {PLAN_SNAPSHOTS.map((snapshot) => (
            <option key={snapshot.id} value={snapshot.id}>
              작업 기준: {snapshot.label}
            </option>
          ))}
        </select>
        <span className={styles.infoText}>저장일: {currentSnapshot.savedAt} | 작성자: {currentSnapshot.author}</span>
      </div>

      <div className={styles.rightGroup}>
        <button className={styles.actionButton} onClick={() => notify.info('새 스냅샷 기능은 준비 중입니다.')}>
          새 스냅샷 생성
        </button>
        <button className={`${styles.actionButton} ${styles.primaryButton}`} onClick={() => notify.success('저장이 완료되었습니다. (목업)')}>
          저장
        </button>
      </div>
    </div>
  );
};
