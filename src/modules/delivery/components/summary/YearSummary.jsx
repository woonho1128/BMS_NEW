import React, { useState } from 'react';
import styles from '../../pages/DeliveryPlanPage.module.css'; // Shared styles
import { SummaryFilterBar } from '../filters/SummaryFilterBar';
import { SummarySection } from './SummarySection';
import { SummaryTable } from '../table/SummaryTable';
import { SummaryDetailModal } from '../modals/SummaryDetailModal'; // NEW
import {
    DEFAULT_YEAR,
    CATEGORY_AMOUNT_DATA,
    CATEGORY_WEIGHT_DATA,
} from '../../data/summaryData';

export const YearSummary = () => {
    const [year, setYear] = useState(DEFAULT_YEAR);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [detailMode, setDetailMode] = useState('itemCode');

    // Mock Refresh
    const handleRefresh = () => {
        setLoading(true);
        console.log('Fetching data for year:', year);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const handleOpenDetail = (mode) => {
        setDetailMode(mode);
        setDetailModalOpen(true);
    };

    return (
        <>
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

                {/* New Action Button Area */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <button
                        className={styles.actionButton} // Using shared style from page module if available, or inline
                        style={{
                            height: '40px',
                            padding: '0 24px',
                            border: '1px solid #1890ff',
                            backgroundColor: '#fff',
                            color: '#1890ff',
                            borderRadius: '4px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onClick={() => handleOpenDetail('itemCode')}
                    >
                        <span>📊</span> 품번, 품목 요약 보기
                    </button>
                </div>
            </div>

            {/* Detail Modal */}
            <SummaryDetailModal
                isOpen={detailModalOpen}
                initialMode={detailMode}
                onClose={() => setDetailModalOpen(false)}
            />
        </>
    );
};
