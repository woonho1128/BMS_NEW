import React, { useState, useMemo } from 'react';
import styles from './CancelledSpecList.module.css';
import { CANCELLED_SPEC_DATA } from '../../data/planDummyData';

/**
 * Cancelled Spec List Component
 * Read-only view for cancelled specs with summary statistics.
 */
export const CancelledSpecList = () => {
    const [expandedRows, setExpandedRows] = useState([]);

    // Summary Calculation
    const summary = useMemo(() => {
        let count = 0;
        let totalAmount = 0;
        let totalTon = 0;

        CANCELLED_SPEC_DATA.forEach(spec => {
            count++;
            spec.items.forEach(item => {
                totalAmount += (item.amount || (item.qty * item.agencyPrice));
                totalTon += (item.totalWeightTon || ((item.qty * item.weight) / 1000));
            });
        });

        return { count, totalAmount, totalTon };
    }, []);

    const toggleRow = (id) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    return (
        <div className={styles.container}>
            {/* Top Filter Bar */}
            <div className={styles.header}>
                <div className={styles.filterGroup}>
                    <div className={styles.filterItem}>
                        <span className={styles.label}>취소월</span>
                        <input type="month" className={styles.input} />
                    </div>
                    <div className={styles.filterItem}>
                        <span className={styles.label}>건설회사</span>
                        <input className={styles.input} placeholder="전체" />
                    </div>
                    <div className={styles.filterItem}>
                        <span className={styles.label}>현장명</span>
                        <input className={styles.input} placeholder="전체" />
                    </div>
                </div>
            </div>

            {/* Summary Bar */}
            <div className={styles.summaryBar}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>총 취소 건수</span>
                    <span className={styles.summaryValue}>{summary.count} 건</span>
                </div>
                <div className={styles.summaryDivider}></div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>총 취소 금액</span>
                    <span className={styles.summaryValue}>{summary.totalAmount.toLocaleString()} 원</span>
                </div>
                <div className={styles.summaryDivider}></div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>총 취소 TON</span>
                    <span className={styles.summaryValue}>{summary.totalTon.toFixed(3)} TON</span>
                </div>
            </div>

            {/* List Table */}
            <div className={styles.tableContainer}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th} style={{ width: '40px' }}></th>
                                <th className={styles.th}>건설회사</th>
                                <th className={styles.th}>현장명</th>
                                <th className={styles.th}>대리점</th>
                                <th className={styles.th}>납품예정</th>
                                <th className={styles.th}>입주예정</th>
                                <th className={styles.th}>담당자</th>
                                <th className={styles.th}>구분</th>
                                <th className={styles.th}>SPEC담당</th>
                                <th className={styles.th}>취소일</th>
                                <th className={styles.th}>취소자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {CANCELLED_SPEC_DATA.map(spec => {
                                const isExpanded = expandedRows.includes(spec.id);
                                return (
                                    <React.Fragment key={spec.id}>
                                        <tr
                                            className={`${styles.tr} ${isExpanded ? styles.expandedRow : ''}`}
                                            onClick={() => toggleRow(spec.id)}
                                        >
                                            <td className={styles.td} style={{ textAlign: 'center' }}>
                                                <span className={`${styles.chevron} ${isExpanded ? styles.open : ''}`}>▶</span>
                                            </td>
                                            <td className={styles.td}>{spec.company}</td>
                                            <td className={styles.td} style={{ fontWeight: 600 }}>{spec.site}</td>
                                            <td className={styles.td}>{spec.agency}</td>
                                            <td className={styles.td}>{spec.deliveryDate}</td>
                                            <td className={styles.td}>{spec.moveInDate}</td>
                                            <td className={styles.td}>{spec.manager}</td>
                                            <td className={styles.td}>{spec.category}</td>
                                            <td className={styles.td}>{spec.specManager}</td>
                                            <td className={styles.tdCancelDate}>{spec.cancelDate}</td>
                                            <td className={styles.td}>{spec.cancelledBy}</td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className={styles.detailRow}>
                                                <td colSpan={11} style={{ padding: 0 }}>
                                                    <div className={styles.detailWrapper}>
                                                        <table className={styles.childTable}>
                                                            <thead>
                                                                <tr>
                                                                    <th className={styles.childTh}>품목</th>
                                                                    <th className={styles.childTh}>색상</th>
                                                                    <th className={styles.childTh} style={{ textAlign: 'right' }}>수량</th>
                                                                    <th className={styles.childTh} style={{ textAlign: 'right' }}>대리점가</th>
                                                                    <th className={styles.childTh} style={{ textAlign: 'right' }}>중량(KG)</th>
                                                                    <th className={styles.childTh} style={{ textAlign: 'right' }}>총무게(KG)</th>
                                                                    <th className={styles.childTh} style={{ textAlign: 'right' }}>총무게(TON)</th>
                                                                    <th className={styles.childTh} style={{ textAlign: 'right' }}>금액</th>
                                                                    <th className={styles.childTh}>특수사양</th>
                                                                    <th className={styles.childTh}>비고</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {spec.items.map((item, idx) => (
                                                                    <tr key={idx}>
                                                                        <td className={styles.childTd}>{item.item1}</td>
                                                                        <td className={styles.childTd}>{item.color}</td>
                                                                        <td className={styles.childTd} style={{ textAlign: 'right' }}>{Number(item.qty).toLocaleString()}</td>
                                                                        <td className={styles.childTd} style={{ textAlign: 'right' }}>{Number(item.agencyPrice).toLocaleString()}</td>
                                                                        <td className={styles.childTd} style={{ textAlign: 'right' }}>{item.weight}</td>
                                                                        <td className={styles.childTd} style={{ textAlign: 'right' }}>{Number(item.totalWeightKg).toLocaleString()}</td>
                                                                        <td className={styles.childTd} style={{ textAlign: 'right' }}>{Number(item.totalWeightTon).toFixed(3)}</td>
                                                                        <td className={styles.childTd} style={{ textAlign: 'right' }}>{Number(item.amount).toLocaleString()}</td>
                                                                        <td className={styles.childTd}>{item.spec}</td>
                                                                        <td className={styles.childTd}>{item.memo}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
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
            </div>
        </div>
    );
};
