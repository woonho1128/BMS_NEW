import React, { useState, useMemo } from 'react';
import styles from './PlanTable.module.css';
import { PLAN_COLUMNS } from '../../data/planDummyData';

export const PlanTable = ({ rows, onCellChange, onAction, onSiteClick, hideManage = false }) => {
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (rowId) => {
        setExpandedRows(prev => ({
            ...prev,
            [rowId]: !prev[rowId]
        }));
    };

    // Sorting State & Logic
    const [sortConfig, setSortConfig] = useState(null);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            setSortConfig(null);
            return;
        }
        setSortConfig({ key, direction });
    };

    const sortedRows = useMemo(() => {
        if (!sortConfig) return rows;
        const sorted = [...rows];
        sorted.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === bValue) return 0;
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === 'string') {
                return sortConfig.direction === 'asc' 
                    ? String(aValue).localeCompare(String(bValue)) 
                    : String(bValue).localeCompare(String(aValue));
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [rows, sortConfig]);

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
        else if (status === '취소') badgeClass = styles.badgeCancel;

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
                        <th className={styles.th}></th>
                        {PLAN_COLUMNS.map(col => (
                            <th 
                                key={col.key} 
                                className={`${styles.th} ${styles.sortableHeader}`}
                                onClick={() => requestSort(col.key)}
                                title={`${col.label} 정렬`}
                            >
                                <div className={styles.thContent}>
                                    {col.label}
                                    <span className={styles.sortIndicator}>
                                        {sortConfig?.key === col.key 
                                            ? (sortConfig.direction === 'asc' ? '▲' : '▼') 
                                            : '↕'}
                                    </span>
                                </div>
                            </th>
                        ))}
                        {!hideManage && <th className={styles.th}>관리</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedRows.map(row => {
                        const isCompleted = row.status === '완료' || row.status === '취소';
                        const isExpanded = expandedRows[row.id];

                        return (
                            <React.Fragment key={row.id}>
                                <tr
                                    className={`${styles.tr} ${isCompleted && !hideManage ? styles.trCompleted : ''} ${row.isChanged ? styles.trChanged : ''}`}
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
                                        const isEditable = !isCompleted && ['deliveryDate', 'qty'].includes(col.key);
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
                                                        type={col.key === 'deliveryDate' ? 'month' : col.key.includes('Date') ? 'date' : 'text'}
                                                        className={styles.input}
                                                        defaultValue={value}
                                                        key={`${row.id}-${col.key}-${value}`}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                if (!e.target.value) {
                                                                    e.target.value = value;
                                                                } else if (e.target.value !== value) {
                                                                    onCellChange(row, col.label, value, e.target.value);
                                                                }
                                                                e.target.blur();
                                                            }
                                                            if (e.key === 'Escape') {
                                                                e.target.value = value;
                                                                e.target.blur();
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            if (!e.target.value) {
                                                                e.target.value = value;
                                                                return;
                                                            }
                                                            if (e.target.value !== value) {
                                                                onCellChange(row, col.label, value, e.target.value);
                                                            }
                                                        }}
                                                        onClick={(e) => {
                                                            if (e.target.showPicker) {
                                                                e.target.showPicker();
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
                                    {!hideManage && (
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
                                    )}
                                </tr>

                                {/* Accordion Content Row */}
                                {isExpanded && (
                                    <tr>
                                        <td colSpan={PLAN_COLUMNS.length + (hideManage ? 1 : 2)} className={styles.expandedRow}>
                                            <div className={styles.expandedContent}>
                                                {/* Detailed Info Section */}
                                                <div className={styles.expandedSection}>
                                                    <div className={styles.sectionTitle}>[상세 정보]</div>
                                                    <div className={styles.detailText}>
                                                        <span className={styles.detailLabel}>색상:</span> {row.color || '-'}, &nbsp;
                                                        <span className={styles.detailLabel}>단위 중량:</span> {row.weight}kg, &nbsp;
                                                        <span className={styles.detailLabel}>총 중량:</span> {formatNumber(row.totalWeightKg)}kg, &nbsp;
                                                        <span className={styles.detailLabel}>입주예정:</span> {row.moveInDate || '-'}, &nbsp;
                                                        <span className={styles.detailLabel}>구분:</span> {row.category || '-'}
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
