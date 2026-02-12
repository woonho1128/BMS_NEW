import React, { useState, useMemo } from 'react';
import styles from './ChangeHistoryComparison.module.css';
import { MOCKED_COMPARISON_DATA, PLAN_SNAPSHOTS } from '../../data/planDummyData';

import { DetailModal } from '../modals/DetailModal';

export const ChangeHistoryComparison = () => {
    // Mock State: In real app, these would come from props or API
    const [snapshotA, setSnapshotA] = useState(PLAN_SNAPSHOTS[0]?.id || '2026.01');
    const [snapshotB, setSnapshotB] = useState(PLAN_SNAPSHOTS[1]?.id || '2026.02');
    const [expandedRows, setExpandedRows] = useState([]);

    // Detail Modal State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Filter out 'none' changes just in case
    const rows = useMemo(() => MOCKED_COMPARISON_DATA.filter(r => r.changeType !== 'none'), []);

    // toggle accordion
    const toggleRow = (id) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    const handleSiteClick = (e, row) => {
        e.stopPropagation(); // Prevent accordion toggle
        setSelectedRow(row);
        setDetailModalOpen(true);
    };

    // Calculate Stats
    const totalChanges = rows.length;
    const scheduleChanges = rows.filter(r => r.prevDeliveryDate !== r.currDeliveryDate).length;
    const qtyChanges = rows.filter(r => r.prevQty !== r.currQty).length;
    const amtChanges = rows.filter(r => r.prevAmt !== r.currAmt).length;

    // Helper for Diff Rendering
    const renderDiff = (prev, curr, type = 'text', suffix = '') => {
        if (prev === curr) return <span>{curr}{suffix}</span>;

        let className = '';
        let icon = '';

        if (type === 'number') {
            const diff = curr - prev;
            if (diff > 0) {
                className = styles.inc;
                icon = `(+${diff.toLocaleString()})`;
            } else {
                className = styles.dec;
                icon = `(${diff.toLocaleString()})`;
            }
            return (
                <div className={styles.diffValue}>
                    <span style={{ color: '#8c8c8c', textDecoration: 'line-through', fontSize: '12px' }}>{prev.toLocaleString()}</span>
                    <span className={styles.arrow}>→</span>
                    <span className={className}>
                        {curr.toLocaleString()} {suffix}
                        <span style={{ fontSize: '11px', marginLeft: '4px' }}>{icon}</span>
                    </span>
                </div>
            );
        } else if (type === 'date') {
            const d1 = new Date(prev);
            const d2 = new Date(curr);
            if (d2 > d1) className = styles.dec; // Delayed (Bad) -> Red
            else className = styles.inc; // Advanced (Good) -> Blue

            return (
                <div className={styles.diffValue}>
                    <span style={{ color: '#8c8c8c', textDecoration: 'line-through', fontSize: '12px' }}>{prev}</span>
                    <span className={styles.arrow}>→</span>
                    <span className={className}>{curr}</span>
                </div>
            );
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.title}>
                    <span>📉 변경 이력 비교</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select
                        className={styles.compareSelect}
                        value={snapshotA}
                        onChange={(e) => setSnapshotA(e.target.value)}
                    >
                        {PLAN_SNAPSHOTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                    <span>vs</span>
                    <select
                        className={styles.compareSelect}
                        value={snapshotB}
                        onChange={(e) => setSnapshotB(e.target.value)}
                    >
                        {PLAN_SNAPSHOTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryContainer}>
                <div className={styles.summaryCard}>
                    <span className={styles.cardLabel}>총 변경 건수</span>
                    <span className={styles.cardValue}>{totalChanges}건</span>
                </div>
                <div className={styles.summaryCard}>
                    <span className={styles.cardLabel}>일정 변경</span>
                    <span className={`${styles.cardValue} ${scheduleChanges > 0 ? styles.dec : ''}`}>{scheduleChanges}건</span>
                </div>
                <div className={styles.summaryCard}>
                    <span className={styles.cardLabel}>수량 변경</span>
                    <span className={styles.cardValue}>{qtyChanges}건</span>
                </div>
                <div className={styles.summaryCard}>
                    <span className={styles.cardLabel}>금액 변경</span>
                    <span className={styles.cardValue}>{amtChanges}건</span>
                </div>
            </div>

            {/* Diff Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th} style={{ width: '40px' }}></th>
                            <th className={styles.th}>건설회사</th>
                            <th className={styles.th}>현장명</th>
                            <th className={styles.th}>대리점</th>
                            <th className={styles.th}>품목 / 색상</th>
                            <th className={styles.th}>납품예정일 (기존 → 변경)</th>
                            <th className={styles.th} style={{ textAlign: 'right' }}>수량 (기존 → 변경)</th>
                            <th className={styles.th} style={{ textAlign: 'right' }}>금액 (기존 → 변경)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => {
                            const isExpanded = expandedRows.includes(row.id);
                            return (
                                <React.Fragment key={row.id}>
                                    <tr
                                        className={`${styles.tr} ${isExpanded ? styles.expanded : ''}`}
                                        onClick={() => toggleRow(row.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className={styles.td} style={{ textAlign: 'center' }}>
                                            <span className={`${styles.chevron} ${isExpanded ? styles.open : ''}`}>▶</span>
                                        </td>
                                        <td className={styles.td}>{row.company}</td>
                                        <td
                                            className={styles.td}
                                            style={{ fontWeight: 600, color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}
                                            onClick={(e) => handleSiteClick(e, row)}
                                        >
                                            {row.site}
                                        </td>
                                        <td className={styles.td}>{row.agency}</td>
                                        <td className={styles.td}>{row.item} <span style={{ color: '#8c8c8c' }}>({row.color})</span></td>
                                        <td className={styles.td}>
                                            {renderDiff(row.prevDeliveryDate, row.currDeliveryDate, 'date')}
                                        </td>
                                        <td className={styles.td} style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
                                            {renderDiff(row.prevQty, row.currQty, 'number')}
                                        </td>
                                        <td className={styles.td} style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
                                            {renderDiff(row.prevAmt, row.currAmt, 'number')}
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className={styles.detailRow}>
                                            <td colSpan={8} className={styles.detailCell}>
                                                <div className={styles.detailContentWrapper}>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}>변경 사유</span>
                                                        <span className={styles.detailText}>{row.reason}</span>
                                                    </div>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}>비고</span>
                                                        <span className={styles.detailText}>{row.memo}</span>
                                                    </div>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}>변경 정보</span>
                                                        <span className={styles.detailText}>{row.changer} / {row.changedAt}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {detailModalOpen && (
                <DetailModal
                    row={selectedRow}
                    onClose={() => setDetailModalOpen(false)}
                />
            )}
        </div>
    );
};
