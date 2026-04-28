import React from 'react';

export function PromotionHistoryDataTable({
  styles,
  columns,
  rows,
  filters,
  onFiltersChange,
  rowKey = 'id',
  onRowClick,
  selectedId,
  mobileTitleKey,
  mobileFields = [],
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${styles.desktopTable}`}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.align === 'right' ? styles.alignRight : ''}>
                {col.label}
              </th>
            ))}
          </tr>
          <tr className={styles.filterRow}>
            {columns.map((col) => (
              <th key={`${col.key}-filter`}>
                <input
                  value={filters[col.key] ?? ''}
                  onChange={(e) => onFiltersChange((prev) => ({ ...prev, [col.key]: e.target.value }))}
                  placeholder="필터"
                  className={styles.columnFilterInput}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className={styles.emptyCell}>조건에 맞는 데이터가 없습니다.</td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row[rowKey]} className={`${onRowClick ? styles.clickableRow : ''} ${selectedId === row[rowKey] ? styles.selectedRow : ''}`} onClick={() => onRowClick?.(row[rowKey])}>
              {columns.map((col) => (
                <td key={`${row[rowKey]}-${col.key}`} className={col.align === 'right' ? styles.alignRight : ''}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.mobileList}>
        {rows.length === 0 && <div className={styles.mobileEmpty}>조건에 맞는 데이터가 없습니다.</div>}
        {rows.map((row) => (
          <button type="button" key={`m-${row[rowKey]}`} className={`${styles.mobileCard} ${selectedId === row[rowKey] ? styles.mobileCardSelected : ''}`} onClick={() => onRowClick?.(row[rowKey])}>
            <div className={styles.mobileCardTitle}>{row[mobileTitleKey]}</div>
            <div className={styles.mobileCardRows}>
              {mobileFields.map((field) => (
                <div key={`${row[rowKey]}-${field.key}`} className={styles.mobileRow}>
                  <span className={styles.mobileLabel}>{field.label}</span>
                  <span className={styles.mobileValue}>{row[field.key]}</span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default PromotionHistoryDataTable;
