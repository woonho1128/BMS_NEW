import React, { useState } from 'react';
import styles from './PlanFilterBar.module.css';

export const PlanFilterBar = ({
    showBidetsOnly,
    onBidetFilterChange,
    isExpanded,
    onToggleExpand
}) => {
    // If props are not provided (e.g. usage in other parents without state), use local state fallback?
    // User requested changes in DeliveryPlanPage context, so we'll control it from there.
    // However, to be safe, we can default if undefined. But controlled is better.

    return (
        <div className={styles.filterContainer}>
            <div className={styles.header} onClick={onToggleExpand}>
                <div className={styles.headerTitle}>
                    검색 필터
                </div>
                <div className={`${styles.toggleIcon} ${isExpanded ? styles.expanded : ''}`}>
                    ▼
                </div>
            </div>

            {isExpanded && (
                <div className={styles.content}>
                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <span className={styles.label}>건설회사</span>
                            <input type="text" className={styles.input} placeholder="전체" />
                        </div>
                        <div className={styles.inputGroup}>
                            <span className={styles.label}>현장명</span>
                            <input type="text" className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <span className={styles.label}>대리점</span>
                            <input type="text" className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <span className={styles.label}>담당자</span>
                            <input type="text" className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <span className={styles.label}>품목</span>
                            <input type="text" className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <span className={styles.label}>구분</span>
                            <select className={styles.select}>
                                <option value="">전체</option>
                                <option value="retail">리테일</option>
                                <option value="special">특판</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <span className={styles.label}>납품예정</span>
                            <input type="date" className={styles.input} />
                            <span>~</span>
                            <input type="date" className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <span className={styles.label}>입주예정</span>
                            <input type="date" className={styles.input} />
                            <span>~</span>
                            <input type="date" className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <span className={styles.label}>상태</span>
                            <select className={styles.select}>
                                <option value="">전체</option>
                                <option value="진행">진행</option>
                                <option value="부분납품">부분납품</option>
                                <option value="완료">완료</option>
                            </select>
                        </div>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" />
                            일정변경만
                        </label>

                        {/* New FIlter */}
                        <label className={styles.checkboxLabel} style={{ marginLeft: '12px', fontWeight: 'bold', color: '#1890ff' }}>
                            <input
                                type="checkbox"
                                checked={showBidetsOnly}
                                onChange={(e) => onBidetFilterChange(e.target.checked)}
                            />
                            비데만 보기
                        </label>

                        <button className={styles.searchButton}>검색</button>
                    </div>
                </div>
            )}
        </div>
    );
};
