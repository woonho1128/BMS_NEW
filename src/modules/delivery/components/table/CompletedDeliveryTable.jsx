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
                    {rows.map(row => (
                        <React.Fragment key={row.id}>
                            <tr className={`${tableStyles.tr} ${expandedRows[row.id] ? tableStyles.expanded : ''}`}>
                                <td className={tableStyles.td} style={{ textAlign: 'center' }}>
                                    <button
                                        className={tableStyles.expandButton}
                                        onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}
                                    >
                                        {expandedRows[row.id] ? '▼' : '▶'}
                                    </button>
                                </td>
                                <td className={tableStyles.td}>{row.company}</td>
                                <td className={tableStyles.td}>
                                    <span
                                        className={tableStyles.link}
                                        onClick={() => onSiteClick(row)}
                                    >
                                        {row.site}
                                    </span>
                                </td>
                                <td className={tableStyles.td}>{row.agency}</td>
                                <td className={tableStyles.td}>{row.completedMonth}</td>
                                <td className={tableStyles.td}>{row.deliveryDate ? row.deliveryDate.substring(0, 7) : '-'}</td>
                                <td className={tableStyles.td}>{row.item}</td>
                                <td className={tableStyles.td}>{row.color}</td>
                                <td className={tableStyles.td} style={{ textAlign: 'right' }}>{formatNumber(row.qty)}</td>
                                <td className={tableStyles.td} style={{ textAlign: 'right' }}>{formatNumber(row.price)}</td>
                                <td className={tableStyles.td} style={{ textAlign: 'right' }}>{formatNumber(row.weight)}</td>
                                <td className={tableStyles.td} style={{ textAlign: 'right' }}>{formatNumber(row.totalWeightKg)}</td>
                                <td className={tableStyles.td} style={{ textAlign: 'right' }}>{row.totalWeightTon}</td>
                                <td className={tableStyles.td} style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(row.amount)}</td>
                                <td className={tableStyles.td}>{row.spec}</td>
                                <td className={tableStyles.td}>{row.manager}</td>
                                <td className={tableStyles.td}>{row.category}</td>
                                <td className={tableStyles.td}>{row.specManager}</td>
                            </tr>
                            {expandedRows[row.id] && (
                                <tr className={tableStyles.detailTr}>
                                    <td colSpan={18} className={tableStyles.detailTd}>
                                        <div className={tableStyles.detailContent}>
                                            <strong>비고:</strong> {row.memo || '내용 없음'}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
