import React, { useMemo, useState } from 'react';
import { notify } from '../../../../shared/utils/notify';
import {
  addOrRemoveId,
  includesNormalized,
  isAllRowsSelected,
  normalizeQuery,
  toggleIdInList,
} from './specListUtils';
import styles from './SpecRegistrationList.module.css';

const INITIAL_ROWS = [
  {
    id: 'spec-101',
    company: 'DL건설',
    site: '광교 A1 현장',
    specNo: 'SPEC-2026-101',
    requestedAt: '2026-04-05',
    manager: '김영업',
    status: 'pending',
    items: ['벽타일 600x600', '바닥타일 300x300'],
  },
  {
    id: 'spec-102',
    company: '대림주택',
    site: '제주 신도시 2차',
    specNo: 'SPEC-2026-102',
    requestedAt: '2026-04-06',
    manager: '이담당',
    status: 'pending',
    items: ['대형타일 1200x600'],
  },
  {
    id: 'spec-103',
    company: 'DL건설',
    site: '부산 워터파크',
    specNo: 'SPEC-2026-103',
    requestedAt: '2026-04-07',
    manager: '박현장',
    status: 'completed',
    items: ['욕실타일 300x600', '몰딩세라믹'],
  },
];

export const SpecRegistrationList = ({ setRows }) => {
  const [specRows, setSpecRows] = useState(INITIAL_ROWS);
  const [companyFilter, setCompanyFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);

  const companies = useMemo(() => ['all', ...Array.from(new Set(specRows.map((row) => row.company)))], [specRows]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = normalizeQuery(query);
    return specRows.filter((row) => {
      if (companyFilter !== 'all' && row.company !== companyFilter) return false;
      if (showPendingOnly && row.status !== 'pending') return false;
      if (!normalizedQuery) return true;
      return (
        includesNormalized(row.site, normalizedQuery) ||
        includesNormalized(row.specNo, normalizedQuery) ||
        includesNormalized(row.manager, normalizedQuery)
      );
    });
  }, [companyFilter, query, showPendingOnly, specRows]);

  const pendingRows = filteredRows.filter((row) => row.status === 'pending');
  const isAllSelected = isAllRowsSelected(pendingRows, selectedIds);

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => toggleIdInList(prev, id));
  };

  const handleSelectAll = (checked) => {
    if (!checked) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(pendingRows.map((row) => row.id));
  };

  const handleSelectOne = (id, checked) => {
    setSelectedIds((prev) => addOrRemoveId(prev, id, checked));
  };

  const handleAddToPlan = () => {
    const targets = specRows.filter((row) => selectedIds.includes(row.id) && row.status === 'pending');
    if (!targets.length) {
      notify.info('반영할 스펙을 선택해주세요.');
      return;
    }

    setRows?.((prev) => [
      ...targets.map((row) => ({
        id: `plan-${row.id}-${Date.now()}`,
        company: row.company,
        site: row.site,
        source: 'spec',
      })),
      ...(prev || []),
    ]);

    setSpecRows((prev) =>
      prev.map((row) => (selectedIds.includes(row.id) ? { ...row, status: 'completed' } : row))
    );
    setSelectedIds([]);
    notify.success(`${targets.length}건의 스펙이 납품 계획으로 반영되었습니다.`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filterGroup}>
          <div className={styles.filterItem}>
            <span className={styles.label}>건설사</span>
            <select className={styles.select} value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company === 'all' ? '전체' : company}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterItem}>
            <span className={styles.label}>검색</span>
            <input
              className={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="현장명 / SPEC NO / 담당자"
            />
          </div>
          <label className={styles.filterItem}>
            <input
              type="checkbox"
              checked={showPendingOnly}
              onChange={(e) => setShowPendingOnly(e.target.checked)}
            />
            <span className={styles.label}>미반영만 보기</span>
          </label>
        </div>
        <button type="button" className={styles.primaryButton} onClick={handleAddToPlan} disabled={!selectedIds.length}>
          납품 계획으로 추가
        </button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>
                  <input type="checkbox" checked={isAllSelected} onChange={(e) => handleSelectAll(e.target.checked)} />
                </th>
                <th className={styles.th}>상태</th>
                <th className={styles.th}>건설사</th>
                <th className={styles.th}>현장명</th>
                <th className={styles.th}>SPEC NO</th>
                <th className={styles.th}>요청일</th>
                <th className={styles.th}>담당자</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td className={styles.td} colSpan={7}>조회 결과가 없습니다.</td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const expanded = expandedIds.includes(row.id);
                  const completed = row.status === 'completed';
                  return (
                    <React.Fragment key={row.id}>
                      <tr className={`${styles.accordionRow} ${expanded ? styles.expandedRow : ''}`}>
                        <td className={styles.td}>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(row.id)}
                            disabled={completed}
                            onChange={(e) => handleSelectOne(row.id, e.target.checked)}
                          />
                        </td>
                        <td className={styles.td}>
                          <span className={completed ? styles.badgeCompleted : styles.badgePending}>
                            {completed ? '반영완료' : '대기'}
                          </span>
                        </td>
                        <td className={styles.td}>{row.company}</td>
                        <td className={styles.td} onClick={() => toggleExpanded(row.id)}>
                          <span className={`${styles.chevron} ${expanded ? 'open' : ''}`}>{'>'}</span>
                          {row.site}
                        </td>
                        <td className={styles.td}>{row.specNo}</td>
                        <td className={styles.td}>{row.requestedAt}</td>
                        <td className={styles.td}>{row.manager}</td>
                      </tr>
                      {expanded && (
                        <tr className={styles.detailRow}>
                          <td className={styles.td} colSpan={7}>
                            품목: {row.items.join(', ')}
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
