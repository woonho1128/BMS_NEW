import React, { useState, useMemo } from 'react';
import styles from './CancelledSpecList.module.css';
import { CANCELLED_SPEC_DATA } from '../../data/planDummyData';
import { SpecDetailTable } from './SpecDetailTable';

export const CancelledSpecList = () => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [cancelledSpecs, setCancelledSpecs] = useState(CANCELLED_SPEC_DATA);

  const summary = useMemo(() => {
    let count = 0;
    let totalAmount = 0;
    let totalTon = 0;

    cancelledSpecs.forEach((spec) => {
      count += 1;
      spec.items.forEach((item) => {
        totalAmount += item.amount || item.qty * item.agencyPrice;
        totalTon += item.totalWeightTon || (item.qty * item.weight) / 1000;
      });
    });

    return { count, totalAmount, totalTon };
  }, [cancelledSpecs]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('취소된 내역을 영구 삭제하시겠습니까?')) {
      setCancelledSpecs((prev) => prev.filter((spec) => spec.id !== id));
    }
  };

  const handleRestore = (id, e) => {
    e.stopPropagation();
    if (window.confirm('해당 취소 내역을 복원하시겠습니까?')) {
      setCancelledSpecs((prev) => prev.filter((spec) => spec.id !== id));
      alert('복원되었습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filterGroup}>
          <div className={styles.filterItem}>
            <span className={styles.label}>취소월</span>
            <input type="month" className={styles.input} />
          </div>
          <div className={styles.filterItem}>
            <span className={styles.label}>건설사</span>
            <input className={styles.input} placeholder="전체" />
          </div>
          <div className={styles.filterItem}>
            <span className={styles.label}>현장명</span>
            <input className={styles.input} placeholder="전체" />
          </div>
        </div>
      </div>

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

      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th} style={{ width: '40px' }}></th>
                <th className={styles.th}>건설사</th>
                <th className={styles.th}>현장명</th>
                <th className={styles.th}>대리점</th>
                <th className={styles.th}>납품예정</th>
                <th className={styles.th}>입주예정</th>
                <th className={styles.th}>담당자</th>
                <th className={styles.th}>구분</th>
                <th className={styles.th}>SPEC담당</th>
                <th className={styles.th}>취소일</th>
                <th className={styles.th}>취소자</th>
                <th className={styles.th} style={{ textAlign: 'center', width: '130px' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {cancelledSpecs.map((spec) => {
                const isExpanded = expandedRows.includes(spec.id);
                return (
                  <React.Fragment key={spec.id}>
                    <tr className={`${styles.tr} ${isExpanded ? styles.expandedRow : ''}`} onClick={() => toggleRow(spec.id)}>
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
                      <td className={styles.td} style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={(e) => handleRestore(spec.id, e)}
                            style={{
                              padding: '4px 12px',
                              backgroundColor: '#edf4ff',
                              border: '1px solid #bcd4fb',
                              borderRadius: '16px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              color: '#2f7df6',
                              fontWeight: 500,
                            }}
                          >
                            복원
                          </button>
                          <button
                            onClick={(e) => handleDelete(spec.id, e)}
                            style={{
                              padding: '4px 12px',
                              backgroundColor: '#fff2f0',
                              border: '1px solid #ffccc7',
                              borderRadius: '16px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              color: '#ff4d4f',
                              fontWeight: 500,
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className={styles.detailRow}>
                        <td colSpan={12} style={{ padding: 0 }}>
                          <SpecDetailTable items={spec.items} />
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
