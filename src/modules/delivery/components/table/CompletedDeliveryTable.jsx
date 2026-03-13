import React, { useState } from 'react';
// Reusing table styles from dedicated module
import tableStyles from './CompletedDeliveryTable.module.css';

export const CompletedDeliveryTable = ({ rows, onSiteClick }) => {
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (rowId) => {
        setExpandedRows(prev => ({
            ...prev,
            [rowId]: !prev[rowId]
        }));
    };

    const formatNumber = (num) => num ? num.toLocaleString() : '-';

    return (
        <div className={tableStyles.tableContainer}>
            <table className={tableStyles.table}>
                <thead>
                    <tr>
                        <th className={tableStyles.th} style={{ width: '40px' }}></th>
                        <th className={tableStyles.th}>건설회사</th>
                        <th className={tableStyles.th}>현장명</th>
                        <th className={tableStyles.th}>대리점</th>
                        <th className={tableStyles.th}>납품완료월</th>
                        <th className={tableStyles.th}>기존 납품월</th>
                        <th className={tableStyles.th}>품목</th>
                        <th className={tableStyles.th}>색상</th>
                        <th className={tableStyles.th}>수량</th>
                        <th className={tableStyles.th}>단가</th>
                        <th className={tableStyles.th}>중량(KG)</th>
                        <th className={tableStyles.th}>총무게(KG)</th>
                        <th className={tableStyles.th}>총(TON)</th>
                        <th className={tableStyles.th}>금액</th>
                        <th className={tableStyles.th}>특수사양</th>
                        <th className={tableStyles.th}>담당자</th>
                        <th className={tableStyles.th}>구분</th>
                        <th className={tableStyles.th}>SPEC담당</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={18} className={tableStyles.emptyState}>
                                데이터가 없습니다.
                            </td>
                        </tr>
                    ) : (
                        rows.map(row => (
                            <React.Fragment key={row.id}>
                                <tr className={tableStyles.tr}>
                                    {/* Chevron Cell */}
                                    <td
                                        className={`${tableStyles.td} ${tableStyles.chevronCell}`}
                                        onClick={() => toggleRow(row.id)}
                                    >
                                        <span className={`${tableStyles.chevronIcon} ${expandedRows[row.id] ? tableStyles.expanded : ''}`}>
                                            ▶
                                        </span>
                                    </td>
                                    <td className={tableStyles.td} style={{ textAlign: 'center' }}>{row.company}</td>
                                    <td className={tableStyles.td}>
                                        <span
                                            className={tableStyles.link}
                                            onClick={() => onSiteClick(row)}
                                        >
                                            {row.site}
                                        </span>
                                    </td>
                                    <td className={tableStyles.td} style={{ textAlign: 'center' }}>{row.agency}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'center' }}>{row.completedMonth}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'center' }}>{row.deliveryDate ? row.deliveryDate.substring(0, 7) : '-'}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'center' }}>{row.item}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'center' }}>{row.color}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'right' }}>{formatNumber(row.qty)}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'right' }}>{formatNumber(row.price)}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'right' }}>{formatNumber(row.weight)}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'right' }}>{formatNumber(row.totalWeightKg)}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'right' }}>{row.totalWeightTon}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(row.amount)}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'center' }}>{row.spec}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'center' }}>{row.manager}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'center' }}>{row.category}</td>
                                    <td className={tableStyles.td} style={{ textAlign: 'center' }}>{row.specManager}</td>
                                </tr>
                                {expandedRows[row.id] && (
                                    <tr className={tableStyles.expandedRow}>
                                        <td colSpan={18}>
                                            <div className={tableStyles.expandedContent}>
                                                <div className={tableStyles.expandedSection}>
                                                    <div className={tableStyles.expandedTitle}>비고</div>
                                                    <div className={tableStyles.expandedText}>{row.memo || '내용 없음'}</div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
