import React, { useState } from 'react';
import { CompletedDeliveryTable } from '../table/CompletedDeliveryTable';
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
            <div className={styles.filterBar} style={{ padding: '16px', background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600 }}>납품완료월:</span>
                        <select
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
                        >
                            <option value="">전체</option>
                            <option value="2026-01">2026-01</option>
                            <option value="2026-02">2026-02</option>
                            <option value="2026-03">2026-03</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', background: '#f5f5f5', padding: '8px 16px', borderRadius: '4px' }}>
                        <div>총 수량: <strong>{summary.qty.toLocaleString()}</strong></div>
                        <div style={{ width: '1px', background: '#d9d9d9' }}></div>
                        <div>총 TON: <strong>{summary.ton.toFixed(1)}</strong></div>
                        <div style={{ width: '1px', background: '#d9d9d9' }}></div>
                        <div>총 금액: <strong>{(summary.amount / 1000000).toLocaleString()} 백만원</strong></div>
                    </div>
                </div>

                <button
                    className={styles.primaryButton}
                    onClick={() => setYearModalOpen(true)}
                    style={{ background: '#722ed1', borderColor: '#722ed1' }} // Purple accent
                >
                    연도별 실적 보기
                </button>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper} style={{ flex: 1, overflow: 'hidden' }}>
                <CompletedDeliveryTable
                    rows={filteredRows}
                    onSiteClick={handleSiteClick}
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
