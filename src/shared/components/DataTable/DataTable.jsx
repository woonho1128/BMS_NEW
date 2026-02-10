import React, { useState, useMemo } from 'react';
import { classnames } from '../../utils/classnames';
import styles from './DataTable.module.css';

/**
 * Sortable, filterable data table. Dummy-friendly.
 * @param {{ columns: { key: string; label: string; sortable?: boolean }[]; rows: object[]; filterPlaceholder?: string; onRowClick?: (row: object) => void }}
 */
export function DataTable({ columns, rows, filterPlaceholder = 'Search...', onRowClick }) {
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const filteredRows = useMemo(() => {
    if (!filter.trim()) return rows;
    const f = filter.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => {
        const v = row[col.key];
        return v != null && String(v).toLowerCase().includes(f);
      })
    );
  }, [rows, filter, columns]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });
  }, [filteredRows, sortKey, sortAsc]);

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          placeholder={filterPlaceholder}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter table"
        />
      </div>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={styles.th}>
                  {col.sortable !== false ? (
                    <button
                      type="button"
                      className={classnames(styles.sortBtn, sortKey === col.key && styles.sortActive)}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {sortKey === col.key && (sortAsc ? ' ↑' : ' ↓')}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => (
              <tr
                key={row.id ?? i}
                className={onRowClick ? styles.clickableRow : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
