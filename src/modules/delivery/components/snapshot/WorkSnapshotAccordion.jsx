import React, { useState } from 'react';
import styles from './WorkSnapshotAccordion.module.css';
import { PLAN_SNAPSHOTS } from '../../data/planDummyData';

export const WorkSnapshotAccordion = ({
  snapshotMonth,
  onMonthChange,
  onCreateSnapshot,
  onSave,
  onOpenSummary
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentSnapshot = PLAN_SNAPSHOTS.find((s) => s.id === snapshotMonth) || PLAN_SNAPSHOTS[0];

  const toggleAccordion = () => setIsOpen(!isOpen);
  const handleSummaryClick = () => onOpenSummary('amount');

  return (
    <div className={styles.accordionContainer}>
      <div className={styles.collapsedHeader} onClick={toggleAccordion}>
        <div className={styles.headerTitle}>
          <span>작업 기준</span>
          <span style={{ color: '#cad6e6' }}>|</span>
          <span>{currentSnapshot.label}</span>
          <span style={{ color: '#cad6e6' }}>|</span>
          <span style={{ fontWeight: 400, color: '#6a7991' }}>저장: {currentSnapshot.savedAt.split(' ')[0]}</span>
        </div>
        <div className={`${styles.chevron} ${isOpen ? styles.expanded : ''}`}>▾</div>
      </div>

      {isOpen && (
        <div className={styles.expandedContent}>
          <div className={styles.row}>
            <span className={styles.label}>작업 기준월</span>
            <select
              className={styles.select}
              value={snapshotMonth}
              onChange={(e) => onMonthChange(e.target.value)}
            >
              {PLAN_SNAPSHOTS.map((snapshot) => (
                <option key={snapshot.id} value={snapshot.id}>
                  {snapshot.label}
                </option>
              ))}
            </select>

            <button className={styles.actionButton} onClick={handleSummaryClick}>
              요약 보기
            </button>
          </div>

          <div className={`${styles.row} ${styles.spaceBetween}`}>
            <div className={styles.infoText}>
              저장일시: {currentSnapshot.savedAt} | 작성자: {currentSnapshot.author}
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.actionButton} onClick={onCreateSnapshot}>
                새 스냅샷 생성
              </button>
              <button className={`${styles.actionButton} ${styles.primaryButton}`} onClick={onSave}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
