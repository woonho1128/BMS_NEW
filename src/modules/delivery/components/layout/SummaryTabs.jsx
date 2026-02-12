import React from 'react';
import styles from './SummaryTabs.module.css';

export const SummaryTabs = ({ activeTab, onChange }) => {
    const tabs = [
        { id: 'summary', label: '년도 요약', count: null },
        { id: 'plan', label: '납품 계획', count: 12, disabled: false },
        { id: 'history', label: '변경 이력', count: 5, disabled: false },
        { id: 'completed', label: '납품 완료', count: 15, disabled: false },
        { id: 'spec', label: '스펙 추가', count: null, disabled: false },
        { id: 'cancelled', label: '스펙 취소', count: null, disabled: false },
    ];

    const handleClick = (tab) => {
        if (tab.disabled) {
            alert('준비중입니다.');
            return;
        }
        onChange(tab.id);
    };

    return (
        <div className={styles.tabsContainer}>
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ''
                        } ${tab.disabled ? styles.disabled : ''}`}
                    onClick={() => handleClick(tab)}
                >
                    {tab.label}
                    {tab.count !== null && <span className={styles.badge}>{tab.count}</span>}
                </div>
            ))}
        </div>
    );
};
