import React, { useState } from 'react';
import styles from './SiteItemSummaryPage.module.css';
import { SummaryTabs } from '../components/SiteItemSummary/SummaryTabs';
import { SummaryFilterBar } from '../components/SiteItemSummary/SummaryFilterBar';
import { SummarySection } from '../components/SiteItemSummary/SummarySection';
import { SummaryTable } from '../components/SiteItemSummary/SummaryTable';
import {
    DEFAULT_YEAR,
    CATEGORY_AMOUNT_DATA,
    CATEGORY_WEIGHT_DATA,
    ITEM_CODE_DATA,
    ITEM_NAME_DATA,
} from '../data/summaryData';

export const SiteItemSummaryPage = () => {
    const [activeTab, setActiveTab] = useState('summary');
    const [year, setYear] = useState(DEFAULT_YEAR);
    const [loading, setLoading] = useState(false);

    // Mock Refresh
    const handleRefresh = () => {
        setLoading(true);
        console.log('Fetching data for year:', year);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.pageTitle}>
                    현장 별 품목 관리
                    <span className={styles.subTitle}>년도 요약</span>
                </div>
                <div className={styles.actionGroup}>
                    <button className={styles.actionButton} onClick={() => console.log('Excel')}>
                        엑셀다운로드
                    </button>
                    <button className={styles.actionButton} onClick={() => console.log('Print')}>
                        인쇄
                    </button>
                </div>
            </header>

            <SummaryTabs activeTab={activeTab} onChange={setActiveTab} />

            <SummaryFilterBar
                year={year}
                onYearChange={setYear}
                onRefresh={handleRefresh}
            />

            <div className={styles.content}>
                {/* Section 1 */}
                <SummarySection
                    title={CATEGORY_AMOUNT_DATA.title}
                    unitText={CATEGORY_AMOUNT_DATA.unitText}
                >
                    <SummaryTable
                        columns={CATEGORY_AMOUNT_DATA.columns}
                        rows={CATEGORY_AMOUNT_DATA.rows}
                        loading={loading}
                    />
                </SummarySection>

                {/* Section 2 */}
                <SummarySection
                    title={CATEGORY_WEIGHT_DATA.title}
                    unitText={CATEGORY_WEIGHT_DATA.unitText}
                >
                    <SummaryTable
                        columns={CATEGORY_WEIGHT_DATA.columns}
                        rows={CATEGORY_WEIGHT_DATA.rows}
                        loading={loading}
                    />
                </SummarySection>

                {/* Section 3 */}
                <SummarySection
                    title={ITEM_CODE_DATA.title}
                    unitText={ITEM_CODE_DATA.unitText}
                >
                    <SummaryTable
                        columns={ITEM_CODE_DATA.columns}
                        rows={ITEM_CODE_DATA.rows}
                        loading={loading}
                    />
                </SummarySection>

                {/* Section 4 */}
                <SummarySection
                    title={ITEM_NAME_DATA.title}
                    unitText={ITEM_NAME_DATA.unitText}
                >
                    <SummaryTable
                        columns={ITEM_NAME_DATA.columns}
                        rows={ITEM_NAME_DATA.rows}
                        loading={loading}
                    />
                </SummarySection>
            </div>
        </div>
    );
};
