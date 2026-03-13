import { useState } from 'react';
import { PlanTable } from '../table/PlanTable';
import { YearlyPerformanceModal } from '../modals/YearlyPerformanceModal';
import { DetailModal } from '../modals/DetailModal';
import { COMPLETED_DELIVERY_DATA } from '../../data/planDummyData'; // Import mock data
import styles from './CompletedDeliveryList.module.css'; // Correct CSS module
import { calculateSummary } from '../../utils/summaryUtils';

export const CompletedDeliveryList = () => {
    const [yearModalOpen, setYearModalOpen] = useState(false);
    const [detailModal, setDetailModal] = useState({ isOpen: false, row: null });
    const [filterMonth, setFilterMonth] = useState('2026-01');

    // Filter Logic
    const filteredRows = COMPLETED_DELIVERY_DATA.filter(row => {
        if (!filterMonth) return true;
        return row.completedMonth === filterMonth;
    });


    // Summary Logic
    const summary = calculateSummary(filteredRows);

    const handleSiteClick = (row) => {
        setDetailModal({ isOpen: true, row });
    };

    return (
        <div className={styles.container}>
            {/* Top Bar */}
            <div className={styles.filterBar}>
                <div className={styles.filterGroup}>
                    <div className={styles.filterItem}>
                        <span className={styles.filterLabel}>납품완료월</span>
                        <select
                            className={styles.selectInput}
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="2026-01">2026.01</option>
                            <option value="2026-02">2026.02</option>
                            <option value="2026-03">2026.03</option>
                        </select>
                    </div>

                    <div className={styles.summaryGroup}>
                        <div className={styles.summaryCard}>
                            <span className={styles.summaryTitle}>총 수량</span>
                            <span className={styles.summaryValue}>{summary.qty.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryDivider}></div>
                        <div className={styles.summaryCard}>
                            <span className={styles.summaryTitle}>총 TON</span>
                            <span className={styles.summaryValue}>{summary.ton.toFixed(1)}</span>
                        </div>
                        <div className={styles.summaryDivider}></div>
                        <div className={styles.summaryCard}>
                            <span className={styles.summaryTitle}>총 금액</span>
                            <span className={styles.summaryValue}>{(summary.amount / 1000000).toLocaleString()} 백만원</span>
                        </div>
                    </div>
                </div>

                <button
                    className={styles.primaryButton}
                    onClick={() => setYearModalOpen(true)}
                >
                    연도별 실적 보기
                </button>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                <PlanTable
                    rows={filteredRows}
                    onSiteClick={handleSiteClick}
                    hideManage={true}
                />
            </div>

            {/* Modals */}
            <YearlyPerformanceModal
                isOpen={yearModalOpen}
                onClose={() => setYearModalOpen(false)}
            />

            {detailModal.isOpen && (
                <DetailModal
                    row={detailModal.row}
                    onClose={() => setDetailModal({ isOpen: false, row: null })}
                />
            )}
        </div>
    );
};
