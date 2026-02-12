import React from 'react';
import styles from './PlanHeaderBar.module.css';
import { PLAN_SNAPSHOTS } from '../../data/planDummyData';

export const PlanHeaderBar = ({ selectedSnapshot, onSnapshotChange }) => {
    const currentSnapshot = PLAN_SNAPSHOTS.find(s => s.id === selectedSnapshot) || PLAN_SNAPSHOTS[0];

    return (
        <div className={styles.headerBarContainer}>
            <div className={styles.leftGroup}>
                <select
                    className={styles.snapshotSelect}
                    value={selectedSnapshot}
                    onChange={(e) => onSnapshotChange(e.target.value)}
                >
                    {PLAN_SNAPSHOTS.map(snapshot => (
                        <option key={snapshot.id} value={snapshot.id}>
                            작업 기준월: {snapshot.label}
                        </option>
                    ))}
                </select>
                <span className={styles.infoText}>
                    저장일시: {currentSnapshot.savedAt} | 작성자: {currentSnapshot.author}
                </span>
            </div>
            <div className={styles.rightGroup}>
                <button className={styles.actionButton} onClick={() => console.log('New Snapshot')}>
                    새 스냅샷 생성
                </button>
                <button className={`${styles.actionButton} ${styles.primaryButton}`} onClick={() => console.log('Save')}>
                    저장
                </button>
            </div>
        </div>
    );
};
