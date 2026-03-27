import React from 'react';
import { EditableCell } from './EditableCell';
import styles from './CostPage.module.css';

const RIGHT_ALIGN_KEYS = new Set([
  'weight',
  'factoryPrice',
  'standardCost',
  'stdVsPurchase',
  'totalCost',
  'otherCost',
  'salePrice',
  'marginPercent',
]);

const GROUP_CLASS_MAP = {
  factoryPrice: styles.costArea,
  otherCost: styles.costArea,
  standardCost: styles.standardArea,
  stdVsPurchase: styles.standardArea,
  totalCost: styles.standardArea,
  salePrice: styles.saleArea,
  marginPercent: styles.saleArea,
};

const EDITABLE_KEYS = new Set([
  'factoryPrice',
  'standardCost',
  'stdVsPurchase',
  'totalCost',
  'otherCost',
  'salePrice',
  'marginPercent',
  'note',
]);

function formatValue(key, value) {
  if (value == null || value === '') return '';
  const raw = Number(String(value).replace(/,/g, ''));
  if (RIGHT_ALIGN_KEYS.has(key) && !Number.isNaN(raw)) return raw.toLocaleString();
  return value;
}

export function CostRow(props) {
  const {
    row,
    index,
    columns,
    selectedRow,
    activeCell,
    editingCell,
    onRowClick,
    onCellSelect,
    onCellStartEdit,
    onCellStopEdit,
    onCellChange,
    onCellMove,
    applyToSelected,
    selectedRows,
  } = props;

  const rowClass = `${styles.rowBase} ${selectedRow ? styles.rowSelected : ''} ${index % 2 === 1 ? styles.rowStripe : ''}`;

  return (
    <tr className={rowClass} onClick={() => onRowClick(row.id)}>
      {columns.map((col) => {
        const key = col.key;
        const value = row[key];
        const align = RIGHT_ALIGN_KEYS.has(key) ? 'right' : col.align;
        const isSelected = activeCell?.rowId === row.id && activeCell?.colKey === key;
        const isEditing = editingCell?.rowId === row.id && editingCell?.colKey === key;
        const marginClass =
          key === 'marginPercent'
            ? Number(value) <= 0
              ? styles.marginLow
              : Number(value) < 10
                ? styles.marginWarn
                : ''
            : '';

        return (
          <td
            key={key}
            className={`${GROUP_CLASS_MAP[key] || ''} ${align === 'right' ? styles.alignRight : ''} ${align === 'center' ? styles.alignCenter : ''} ${marginClass}`}
            onClick={(e) => {
              e.stopPropagation();
              onCellSelect(row.id, key, e.shiftKey);
            }}
          >
            {EDITABLE_KEYS.has(key) ? (
              <EditableCell
                value={value}
                rowId={row.id}
                colKey={key}
                isSelected={isSelected}
                isEditing={isEditing}
                align={align}
                formatter={(v) => formatValue(key, v)}
                onSelect={onCellSelect}
                onChange={onCellChange}
                onStartEdit={onCellStartEdit}
                onStopEdit={onCellStopEdit}
                onMove={onCellMove}
                applyToSelected={(colKey, nextValue, sourceRowId) => applyToSelected(colKey, nextValue, sourceRowId, selectedRows)}
              />
            ) : (
              <span onDoubleClick={() => onCellStartEdit(row.id, key)}>{formatValue(key, value)}</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}
