import React, { useState, useMemo } from 'react';
import styles from './SpecRegistrationList.module.css';
import { APPROVED_SPEC_DATA } from '../../data/planDummyData';
import { SpecDetailTable } from './SpecDetailTable';

export const SpecRegistrationList = ({ setRows }) => {
  const [specList, setSpecList] = useState(APPROVED_SPEC_DATA);
  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterStatus, setFilterStatus] = useState('pending');

  const filteredSpecs = useMemo(() => {
    return specList.filter((spec) => {
      if (filterStatus === 'all') return true;
      return spec.status === filterStatus;
    });
  }, [specList, filterStatus]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const handleCheckboxChange = (id, isChecked) => {
    if (isChecked) setSelectedIds((prev) => [...prev, id]);
    else setSelectedIds((prev) => prev.filter((sid) => sid !== id));
  };

  const handleAddToPlan = () => {
    if (selectedIds.length === 0) {
      alert('반영할 SPEC을 선택해주세요.');
      return;
    }

    const selectedSpecs = specList.filter((s) => selectedIds.includes(s.id));
    const newRows = [];

    selectedSpecs.forEach((spec) => {
      if (!spec.items) return;
      spec.items.forEach((item, idx) => {
        newRows.push({
          id: `added-${spec.id}-${idx}-${Date.now()}`,
          company: spec.company,
          site: spec.site,
          agency: spec.agency,
          deliveryDate: spec.deliveryDate,
          moveInDate: spec.moveInDate,
          manager: spec.manager,
          category: spec.category,
          specManager: spec.specManager,
          item1: item.item1,
          color: item.color,
          qty: item.qty,
          agencyPrice: item.agencyPrice,
          weight: item.weight,
          totalWeightKg: item.totalWeightKg || item.qty * item.weight,
          totalWeightTon: item.totalWeightTon || (item.qty * item.weight) / 1000,
          amount: item.amount || item.qty * item.agencyPrice,
          spec: item.spec,
          memo: item.memo,
          status: '진행',
          source: 'spec',
          partialHistory: [],
          changeHistory: []
        });
      });
    });

    setRows((prev) => [...prev, ...newRows]);
    setSpecList((prev) => prev.map((s) => (selectedIds.includes(s.id) ? { ...s, status: 'completed' } : s)));
    setSelectedIds([]);
    alert(`${selectedSpecs.length}건의 스펙을 납품 계획에 반영했습니다.`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filterGroup}>
          <div className={styles.filterItem}>
            <span className={styles.label}>결재월</span>
            <input type="month" className={styles.input} />
          </div>
          <div className={styles.filterItem}>
            <span className={styles.label}>상태</span>
            <select className={styles.select} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="pending">미반영</option>
              <option value="completed">반영완료</option>
              <option value="all">전체</option>
            </select>
          </div>
          <div className={styles.filterItem}>
            <span className={styles.label}>건설사</span>
            <input className={styles.input} placeholder="전체" />
          </div>
        </div>

        <button className={styles.primaryButton} onClick={handleAddToPlan} disabled={selectedIds.length === 0} style={{ opacity: selectedIds.length === 0 ? 0.5 : 1 }}>
          납품 계획으로 추가
        </button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th} style={{ width: '40px', textAlign: 'center' }}></th>
                <th className={styles.th} style={{ width: '40px' }}></th>
                <th className={styles.th}>상태</th>
                <th className={styles.th}>건설사</th>
                <th className={styles.th}>현장명</th>
                <th className={styles.th}>대리점</th>
                <th className={styles.th}>납품예정</th>
                <th className={styles.th}>입주예정</th>
                <th className={styles.th}>담당자</th>
                <th className={styles.th}>구분</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecs.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '32px', textAlign: 'center', color: '#8ea0b8' }}>
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredSpecs.map((spec) => {
                  const isExpanded = expandedRows.includes(spec.id);
                  const isCompleted = spec.status === 'completed';

                  return (
                    <React.Fragment key={spec.id}>
                      <tr className={`${styles.tr} ${isExpanded ? styles.expandedRow : ''}`} style={isCompleted ? { backgroundColor: '#f7faff', color: '#8ea0b8' } : {}} onClick={() => toggleRow(spec.id)}>
                        <td className={styles.td} onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            disabled={isCompleted}
                            checked={selectedIds.includes(spec.id)}
                            onChange={(e) => handleCheckboxChange(spec.id, e.target.checked)}
                            style={{ cursor: isCompleted ? 'not-allowed' : 'pointer' }}
                          />
                        </td>
                        <td className={styles.td} style={{ textAlign: 'center', cursor: 'pointer' }}>
                          <span className={`${styles.chevron} ${isExpanded ? styles.open : ''}`}>▶</span>
                        </td>
                        <td className={styles.td}>{isCompleted ? <span className={styles.badgeCompleted}>반영완료</span> : <span className={styles.badgePending}>미반영</span>}</td>
                        <td className={styles.td}>{spec.company}</td>
                        <td className={styles.td} style={{ fontWeight: 600 }}>{spec.site}</td>
                        <td className={styles.td}>{spec.agency}</td>
                        <td className={styles.td}>{spec.deliveryDate}</td>
                        <td className={styles.td}>{spec.moveInDate}</td>
                        <td className={styles.td}>{spec.manager}</td>
                        <td className={styles.td}>{spec.category}</td>
                      </tr>

                      {isExpanded && (
                        <tr className={styles.detailRow}>
                          <td colSpan={10} style={{ padding: 0 }}>
                            <SpecDetailTable items={spec.items} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
