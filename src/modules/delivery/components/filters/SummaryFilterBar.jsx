import React from 'react';
import styles from './SummaryFilterBar.module.css';
import { SUMMARY_YEARS } from '../../data/summaryData';

export const SummaryFilterBar = ({ year, onYearChange, onRefresh }) => {
    return (
        <div className={styles.filterBarContainer}>
            <div className={styles.leftGroup}>
                <select
                    className={styles.select}
                    value={year}
                    onChange={(e) => onYearChange(e.target.value)}
                >
                    {SUMMARY_YEARS.map((y) => (
                        <option key={y} value={y}>
                            {y}년
                        </option>
                    ))}
                </select>
                <span className={styles.unitText}>단위: 백만원, TON (표별 상이)</span>
            </div>
            <button className={styles.refreshButton} onClick={onRefresh}>
                새로고침
            </button>
        </div>
    );
};
