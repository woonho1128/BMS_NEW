import React, { useState } from 'react';
import styles from './PlanTable.module.css';
import { PLAN_COLUMNS } from '../../data/planDummyData';

export const PlanTable = ({ rows, onCellChange, onAction, onSiteClick }) => {
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (rowId) => {
        setExpandedRows(prev => ({
            ...prev,
            [rowId]: !prev[rowId]
        }));
    };

    // Helper to format numbers with commas
    const formatNumber = (val) => {
        if (val === 0 || val === null || val === undefined) return '-';
        return val.toLocaleString();
    };

    const renderStatusBadge = (status) => {
        let badgeClass = '';
        if (status === '진행') badgeClass = styles.badgeProgress;
        else if (status === '부분납품') badgeClass = styles.badgePartial;
        else if (status === '완료') badgeClass = styles.badgeComplete;

        return <span className={`${styles.badge} ${badgeClass}`}>{status}</span>;
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <colgroup>
                    <col style={{ width: 40 }} />{PLAN_COLUMNS.map(col => <col key={col.key} style={{ width: col.width }} />)}<col style={{ width: 50 }} />
                </colgroup>
                <thead>
                    <tr>
                        <th className={styles.th}></th>{PLAN_COLUMNS.map(col => <th key={col.key} className={styles.th}>{col.label}</th>)}<th className={styles.th}>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => {
                        const isCompleted = row.status === '완료';
                        const isExpanded = expandedRows[row.id];

                        return (
                            <React.Fragment key={row.id}>
                                <tr
                                    className={`${styles.tr} ${isCompleted ? styles.trCompleted : ''} ${row.isChanged ? styles.trChanged : ''}`}
                                >
                                    {/* Chevron Cell */}
                                    <td
                                        className={`${styles.td} ${styles.chevronCell}`}
                                        onClick={() => toggleRow(row.id)}
                                    >
                                        <span className={`${styles.chevronIcon} ${isExpanded ? styles.expanded : ''}`}>
                                            ▶
                                        </span>
                                    </td>

                                    {/* Data Cells */}
                                    {PLAN_COLUMNS.map(col => {
                                        const isEditable = !isCompleted && ['deliveryDate', 'moveInDate', 'qty'].includes(col.key);
                                        const value = row[col.key];
                                        let displayValue = value;

                                        if (['qty', 'agencyPrice', 'weight', 'totalWeightKg', 'totalWeightTon', 'amount'].includes(col.key)) {
                                            displayValue = formatNumber(value);
                                        }

                                        // Site Link
                                        if (col.key === 'site') {
                                            return (
                                                <td key={`${row.id}-${col.key}`} className={styles.td}>
                                                    <span
                                                        className={styles.linkText}
                                                        onClick={() => onSiteClick(row)}
                                                    >
                                                        {displayValue}
                                                    </span>
                                                </td>
                                            );
                                        }

                                        return (
                                            <td key={`${row.id}-${col.key}`} className={styles.td} style={{ textAlign: col.align || 'left' }}>
                                                {isEditable ? (
                                                    <input
                                                        type={col.key.includes('Date') ? 'date' : 'text'}
                                                        className={styles.input}
                                                        value={value}
                                                        onChange={(e) => { }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                onCellChange(row, col.label, value, e.target.value);
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            if (e.target.value != value) {
                                                                onCellChange(row, col.label, value, e.target.value);
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    displayValue
                                                )}
                                            </td>
                                        );
                                    })}

                                    {/* Actions */}
                                    <td className={styles.td} style={{ textAlign: 'center' }}>
                                        {!isCompleted && (
                                            <button
                                                className={`${styles.actionButton} ${styles.manageButton}`}
                                                onClick={() => onAction(row)}
                                            >
                                                관리
                                            </button>
                                        )}
                                        {isCompleted && renderStatusBadge(row.status)}
                                    </td>
                                </tr>

                                {/* Accordion Content Row */}
                                {isExpanded && (
                                    <tr>
                                        <td colSpan={PLAN_COLUMNS.length + 2} className={styles.expandedRow}>
                                            <div className={styles.expandedContent}>
                                                {/* Detailed Info Section */}
                                                <div className={styles.expandedSection}>
                                                    <div className={styles.sectionTitle}>[상세 정보]</div>
                                                    <div className={styles.detailText}>
                                                        <span className={styles.detailLabel}>색상:</span> {row.color || '-'}, &nbsp;
                                                        <span className={styles.detailLabel}>단위 중량:</span> {row.weight}kg, &nbsp;
                                                        <span className={styles.detailLabel}>총 중량:</span> {formatNumber(row.totalWeightKg)}kg
                                                        {/* User asked for Color, Weight, Total Weight. Ton is not explicitly asked for but could be added if needed. Keeping it simple as per request. */}
                                                    </div>
                                                </div>

                                                {/* Memo Section */}
                                                <div className={styles.expandedSection}>
                                                    <div className={styles.sectionTitle}>[비고]</div>
                                                    <div className={styles.sectionText}>
                                                        {row.memo || "비고 없음"}
                                                    </div>
                                                </div>

                                                {/* Partial History Section */}
                                                {row.partialHistory && row.partialHistory.length > 0 && (
                                                    <div className={styles.expandedSection}>
                                                        <div className={styles.sectionTitle}>[부분 납품 이력]</div>
                                                        <ul className={styles.historyList}>
                                                            {row.partialHistory.map((h, i) => (
                                                                <li key={i} className={styles.historyItem}>
                                                                    <span>• {h.date}</span>
                                                                    <strong>{h.qty.toLocaleString()}개</strong>
                                                                    <span>({h.note})</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Change History Section */}
                                                {row.changeHistory && row.changeHistory.length > 0 && (
                                                    <div className={styles.expandedSection}>
                                                        <div className={styles.sectionTitle}>[변경 이력]</div>
                                                        <ul className={styles.historyList}>
                                                            {row.changeHistory.map((h, i) => (
                                                                <li key={i} className={styles.historyItem}>
                                                                    <span>• {h.date}</span>
                                                                    <span>[{h.field}]</span>
                                                                    <span style={{ color: '#ff4d4f' }}>{h.oldValue}</span>
                                                                    <span>→</span>
                                                                    <span style={{ color: '#52c41a' }}>{h.newValue}</span>
                                                                    <span>({h.reason})</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
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
    );
};
