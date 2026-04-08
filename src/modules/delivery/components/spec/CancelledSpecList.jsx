import React, { useMemo, useState } from 'react';
import { notify } from '../../../../shared/utils/notify';
import styles from './CancelledSpecList.module.css';

const INITIAL_CANCELLED = [
  {
    id: 'c1',
    company: 'DL건설',
    site: '취소 현장 1',
    cancelledAt: '2026-03-29',
    reason: '현장 설계 변경',
  },
  {
    id: 'c2',
    company: '대리주택',
    site: '취소 현장 2',
    cancelledAt: '2026-03-30',
    reason: '예산 조정',
  },
  {
    id: 'c3',
    company: 'DL건설',
    site: '취소 현장 3',
    cancelledAt: '2026-04-01',
    reason: '납기 일정 변경',
  },
];

export const CancelledSpecList = () => {
  const [rows, setRows] = useState(INITIAL_CANCELLED);
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return rows;
    return rows.filter(
      (row) =>
        row.company.toLowerCase().includes(normalizedQuery) ||
        row.site.toLowerCase().includes(normalizedQuery) ||
        row.reason.toLowerCase().includes(normalizedQuery)
    );
  }, [query, rows]);

  const isAllSelected = filteredRows.length > 0 && filteredRows.every((row) => selectedIds.includes(row.id));

  const restoreItems = (ids) => {
    if (!ids.length) {
      notify.info('복원할 대상을 선택해주세요.');
      return;
    }
    setRows((prev) => prev.filter((row) => !ids.includes(row.id)));
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    notify.success(`${ids.length}건을 복원했습니다.`);
  };

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filterGroup}>
          <div className={styles.filterItem}>
            <span className={styles.label}>검색</span>
            <input
              className={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="건설사 / 현장명 / 취소사유"
            />
          </div>
        </div>
        <button type="button" className={styles.restoreButton} onClick={() => restoreItems(selectedIds)}>
          선택 복원
        </button>
      </div>

      <div className={styles.summaryBar}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>조회 건수</span>
          <strong className={styles.summaryValue}>{filteredRows.length}</strong>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>선택 건수</span>
          <strong className={styles.summaryValue}>{selectedIds.length}</strong>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => setSelectedIds(e.target.checked ? filteredRows.map((row) => row.id) : [])}
                  />
                </th>
                <th className={styles.th}>건설사</th>
                <th className={styles.th}>현장명</th>
                <th className={styles.th}>취소일</th>
                <th className={styles.th}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td className={styles.td} colSpan={5}>취소된 스펙이 없습니다.</td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const expanded = expandedIds.includes(row.id);
                  return (
                    <React.Fragment key={row.id}>
                      <tr className={`${styles.tr} ${expanded ? styles.expandedRow : ''}`}>
                        <td className={styles.td}>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(row.id)}
                            onChange={(e) =>
                              setSelectedIds((prev) =>
                                e.target.checked ? [...new Set([...prev, row.id])] : prev.filter((id) => id !== row.id)
                              )
                            }
                          />
                        </td>
                        <td className={styles.td}>{row.company}</td>
                        <td className={styles.td} onClick={() => toggleExpanded(row.id)}>
                          <span className={`${styles.chevron} ${expanded ? 'open' : ''}`}>▸</span>
                          {row.site}
                        </td>
                        <td className={styles.tdCancelDate}>{row.cancelledAt}</td>
                        <td className={styles.td}>
                          <button type="button" className={styles.restoreButton} onClick={() => restoreItems([row.id])}>
                            복원
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr className={styles.detailRow}>
                          <td className={styles.td} colSpan={5}>
                            취소사유: {row.reason}
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
