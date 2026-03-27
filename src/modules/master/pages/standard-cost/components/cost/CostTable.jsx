import React from 'react';
import { CostRow } from './CostRow';
import { CostRowExpand } from './CostRowExpand';
import styles from './CostPage.module.css';

export function CostTable(props) {
  const {
    rows,
    columns,
    expandedRowId,
    selectedRowId,
    activeCell,
    editingCell,
    selectedRows,
    onRowClick,
    onToggleExpand,
    onCellSelect,
    onCellStartEdit,
    onCellStopEdit,
    onCellChange,
    onCellMove,
    applyToSelected,
  } = props;

  return (
    <div className={styles.tableWrap}>
      <div className={styles.tableBody}>
        <table className={styles.grid}>
          <colgroup>
            {columns.map((col) => (
              <col key={col.key} style={{ width: col.width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${col.align === 'right' ? styles.alignRight : ''} ${col.align === 'center' ? styles.alignCenter : ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const expanded = expandedRowId === row.id;
              return (
                <React.Fragment key={row.id}>
                  <CostRow
                    row={row}
                    index={index}
                    columns={columns}
                    selectedRow={selectedRowId === row.id}
                    activeCell={activeCell}
                    editingCell={editingCell}
                    onRowClick={(id) => {
                      onRowClick(id);
                      onToggleExpand(id);
                    }}
                    onCellSelect={onCellSelect}
                    onCellStartEdit={onCellStartEdit}
                    onCellStopEdit={onCellStopEdit}
                    onCellChange={onCellChange}
                    onCellMove={onCellMove}
                    applyToSelected={applyToSelected}
                    selectedRows={selectedRows}
                  />
                  {expanded && (
                    <tr className={styles.expandRow}>
                      <td colSpan={columns.length}>
                        <CostRowExpand row={row} onFieldChange={onCellChange} />
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
  );
}
