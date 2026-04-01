import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './PlanTable.module.css';
import { PLAN_COLUMNS } from '../../data/planColumns';

const ROW_HEIGHT = 49;
const OVERSCAN = 16;

export const PlanTable = ({
  rows,
  tableView,
  yearOptions = [],
  onTableViewChange,
  onCellChange,
  onAction,
  onSiteClick,
  hideManage = false,
}) => {
  const tableHeadRef = useRef(null);
  const tableBodyRef = useRef(null);
  const rafRef = useRef(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [sortConfig, setSortConfig] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(600);

  const toggleRow = (rowId) => {
    setExpandedRows((prev) => (prev[rowId] ? {} : { [rowId]: true }));
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig?.key === key && sortConfig.direction === 'desc') {
      setSortConfig(null);
      return;
    }
    setSortConfig({ key, direction });
  };

  const sortedRows = useMemo(() => {
    const filtered = rows.filter((row) => {
      if (tableView?.category && row.category !== tableView.category) return false;

      const deliveryDate = String(row.deliveryDate || '');
      if (tableView?.periodType === 'monthly' && tableView?.year && tableView?.month) {
        const monthText = String(tableView.month).padStart(2, '0');
        if (!deliveryDate.startsWith(`${tableView.year}-${monthText}`)) return false;
      }
      if (tableView?.periodType === 'yearly' && tableView?.year) {
        if (!deliveryDate.startsWith(`${tableView.year}-`)) return false;
      }
      return true;
    });

    const baseSort = sortConfig
      || (tableView?.sortBy ? { key: tableView.sortBy, direction: tableView.sortOrder || 'asc' } : null);
    if (!baseSort) return filtered;

    return [...filtered].sort((a, b) => {
      const aValue = a[baseSort.key];
      const bValue = b[baseSort.key];
      if (aValue === bValue) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'string') {
        return baseSort.direction === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
      return baseSort.direction === 'asc' ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1);
    });
  }, [rows, sortConfig, tableView]);

  const enableVirtualization = sortedRows.length > 200;

  useEffect(() => {
    const container = tableBodyRef.current;
    if (!container) return undefined;
    const handleResize = () => setViewportHeight(container.clientHeight || 600);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetScroll = () => {
    const head = tableHeadRef.current;
    const body = tableBodyRef.current;
    if (!body) return;
    body.scrollTop = 0;
    body.scrollLeft = 0;
    if (head) head.scrollLeft = 0;
    setScrollTop(0);
  };

  useLayoutEffect(() => {
    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    resetScroll();
  }, [rows, sortConfig, tableView]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const totalRows = sortedRows.length;
  const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT) + OVERSCAN * 2;
  const startIndex = enableVirtualization ? Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN) : 0;
  const endIndex = enableVirtualization ? Math.min(totalRows, startIndex + visibleCount) : totalRows;
  const topSpacerHeight = enableVirtualization ? startIndex * ROW_HEIGHT : 0;
  const bottomSpacerHeight = enableVirtualization ? Math.max(0, (totalRows - endIndex) * ROW_HEIGHT) : 0;
  const renderRows = enableVirtualization ? sortedRows.slice(startIndex, endIndex) : sortedRows;

  const formatNumber = (value) => (value === 0 || value == null ? '-' : Number(value).toLocaleString());

  const renderStatusBadge = (status) => {
    let badgeClass = '';
    if (status === '진행') badgeClass = styles.badgeProgress;
    else if (status === '부분납품') badgeClass = styles.badgePartial;
    else if (status === '완료') badgeClass = styles.badgeComplete;
    else if (status === '취소') badgeClass = styles.badgeCancel;
    return <span className={`${styles.badge} ${badgeClass}`}>{status}</span>;
  };

  const renderColGroup = () => (
    <colgroup>
      <col style={{ width: 40 }} />
      {PLAN_COLUMNS.map((col) => (
        <col key={col.key} style={{ width: col.width }} />
      ))}
      {!hideManage && <col style={{ width: 68 }} />}
    </colgroup>
  );

  const renderCell = (row, col, isCompleted) => {
    const isEditable = !isCompleted && ['deliveryDate', 'qty'].includes(col.key);
    const value = row[col.key];
    let displayValue = value;

    if (['qty', 'agencyPrice', 'weight', 'totalWeightKg', 'totalWeightTon', 'amount'].includes(col.key)) {
      displayValue = formatNumber(value);
    }

    if (col.key === 'site') {
      return (
        <td key={`${row.id}-${col.key}`} className={styles.td}>
          <span className={styles.linkText} onClick={() => onSiteClick(row)}>
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
                if (!e.target.value) e.target.value = value;
                else if (e.target.value !== value) onCellChange(row, col.label, value, e.target.value);
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
              if (e.target.value !== value) onCellChange(row, col.label, value, e.target.value);
            }}
            onClick={(e) => {
              if (e.target.showPicker) e.target.showPicker();
            }}
          />
        ) : (
          displayValue
        )}
      </td>
    );
  };

  return (
    <div className={styles.tableWrap}>
      <div className={styles.tableTools} onClick={(e) => e.stopPropagation()}>
        <div className={styles.toolGroup}>
          <span className={styles.toolLabel}>카테고리</span>
          <select className={styles.toolSelect} value={tableView?.category || ''} onChange={(e) => onTableViewChange?.('category', e.target.value)}>
            <option value="">전체</option>
            <option value="위생기기">위생도기</option>
            <option value="OEM">OEM</option>
            <option value="수전금구">수전금구</option>
            <option value="비데">비데</option>
            <option value="상품">상품</option>
          </select>
        </div>
        <div className={styles.toolGroup}>
          <span className={styles.toolLabel}>기준</span>
          <select className={styles.toolSelect} value={tableView?.periodType || 'monthly'} onChange={(e) => onTableViewChange?.('periodType', e.target.value)}>
            <option value="monthly">월별</option>
            <option value="yearly">연도별</option>
          </select>
        </div>
        <div className={styles.toolGroup}>
          <span className={styles.toolLabel}>연도</span>
          <select className={styles.toolSelect} value={tableView?.year || ''} onChange={(e) => onTableViewChange?.('year', e.target.value)}>
            <option value="">전체</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        {tableView?.periodType === 'monthly' && (
          <div className={styles.toolGroup}>
            <span className={styles.toolLabel}>월</span>
            <select className={styles.toolSelect} value={tableView?.month || ''} onChange={(e) => onTableViewChange?.('month', e.target.value)}>
              <option value="">전체</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>{i + 1}월</option>
              ))}
            </select>
          </div>
        )}
        <div className={styles.toolGroup}>
          <span className={styles.toolLabel}>정렬기준</span>
          <select className={styles.toolSelect} value={tableView?.sortBy || 'item1'} onChange={(e) => onTableViewChange?.('sortBy', e.target.value)}>
            <option value="item1">품번별</option>
            <option value="agency">대리점별</option>
            <option value="company">건설사별</option>
            <option value="manager">담당자별</option>
          </select>
        </div>
        <div className={styles.toolGroup}>
          <span className={styles.toolLabel}>정렬</span>
          <select className={styles.toolSelect} value={tableView?.sortOrder || 'asc'} onChange={(e) => onTableViewChange?.('sortOrder', e.target.value)}>
            <option value="asc">오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </div>
      </div>

      <div ref={tableHeadRef} className={styles.tableHeadViewport}>
        <table className={styles.table}>
          {renderColGroup()}
          <thead>
            <tr>
              <th className={styles.th}></th>
              {PLAN_COLUMNS.map((col) => (
                <th key={col.key} className={`${styles.th} ${styles.sortableHeader}`} onClick={() => requestSort(col.key)} title={`${col.label} 정렬`}>
                  <div className={styles.thContent}>
                    {col.label}
                    <span className={styles.sortIndicator}>
                      {sortConfig?.key === col.key ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </div>
                </th>
              ))}
              {!hideManage && <th className={styles.th}>관리</th>}
            </tr>
          </thead>
        </table>
      </div>

      <div
        ref={tableBodyRef}
        className={styles.tableBodyViewport}
        onScroll={(e) => {
          const nextTop = e.currentTarget.scrollTop;
          const nextLeft = e.currentTarget.scrollLeft;
          if (tableHeadRef.current) tableHeadRef.current.scrollLeft = nextLeft;
          if (!enableVirtualization) return;
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => setScrollTop(nextTop));
        }}
      >
        <table className={styles.table}>
          {renderColGroup()}
          <tbody>
            {topSpacerHeight > 0 && (
              <tr aria-hidden="true">
                <td colSpan={PLAN_COLUMNS.length + (hideManage ? 1 : 2)} className={styles.virtualSpacerCell} style={{ height: `${topSpacerHeight}px` }} />
              </tr>
            )}

            {renderRows.map((row) => {
              const isCompleted = row.status === '완료' || row.status === '취소';
              const isExpanded = expandedRows[row.id];

              return (
                <React.Fragment key={row.id}>
                  <tr className={`${styles.tr} ${isCompleted && !hideManage ? styles.trCompleted : ''} ${row.isChanged ? styles.trChanged : ''}`}>
                    <td className={`${styles.td} ${styles.chevronCell}`} onClick={() => toggleRow(row.id)}>
                      <span className={`${styles.chevronIcon} ${isExpanded ? styles.expanded : ''}`}>▶</span>
                    </td>
                    {PLAN_COLUMNS.map((col) => renderCell(row, col, isCompleted))}
                    {!hideManage && (
                      <td className={styles.td} style={{ textAlign: 'center' }}>
                        {!isCompleted ? (
                          <button className={`${styles.actionButton} ${styles.manageButton}`} onClick={() => onAction(row)}>관리</button>
                        ) : (
                          renderStatusBadge(row.status)
                        )}
                      </td>
                    )}
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan={PLAN_COLUMNS.length + (hideManage ? 1 : 2)} className={styles.expandedRow}>
                        <div className={styles.expandedContent}>
                          <div className={styles.expandedSection}>
                            <div className={styles.sectionTitle}>[상세 정보]</div>
                            <div className={styles.detailText}>
                              <span className={styles.detailLabel}>색상:</span> {row.color || '-'},&nbsp;
                              <span className={styles.detailLabel}>단위 중량:</span> {row.weight}kg,&nbsp;
                              <span className={styles.detailLabel}>총 중량:</span> {formatNumber(row.totalWeightKg)}kg,&nbsp;
                              <span className={styles.detailLabel}>입주예정:</span> {row.moveInDate || '-'},&nbsp;
                              <span className={styles.detailLabel}>구분:</span> {row.category || '-'}
                            </div>
                          </div>
                          <div className={styles.expandedSection}>
                            <div className={styles.sectionTitle}>[비고]</div>
                            <div className={styles.sectionText}>{row.memo || '비고 없음'}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {bottomSpacerHeight > 0 && (
              <tr aria-hidden="true">
                <td colSpan={PLAN_COLUMNS.length + (hideManage ? 1 : 2)} className={styles.virtualSpacerCell} style={{ height: `${bottomSpacerHeight}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
