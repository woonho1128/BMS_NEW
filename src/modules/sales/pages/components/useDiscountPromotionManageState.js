import { useMemo, useState } from 'react';
import { notify } from '../../../../shared/utils/notify';
import {
  cloneRows,
  createRow,
  DEFAULT_PROMOTION_LABEL,
  DEFAULT_PROMOTION_ROWS,
} from './discountPromotionManage.helpers';

function resolveRows(updater, baseRows) {
  return typeof updater === 'function' ? updater(baseRows) : updater;
}

export function useDiscountPromotionManageState({
  readOnly,
  controlledRows,
  onRowsChange,
  controlledPromoLabel,
  onPromoLabelChange,
  onSave,
  onCancel,
  onTempSave,
}) {
  const [internalRows, setInternalRows] = useState(() => cloneRows(DEFAULT_PROMOTION_ROWS));
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [internalPromoLabel, setInternalPromoLabel] = useState(DEFAULT_PROMOTION_LABEL);

  const rows = Array.isArray(controlledRows) ? controlledRows : internalRows;
  const promoLabel = typeof controlledPromoLabel === 'string' ? controlledPromoLabel : internalPromoLabel;
  const selectableRows = rows.filter((row) => row.rowType !== 'subtotal');

  const setRows = (updater) => {
    if (onRowsChange) {
      if (typeof updater === 'function') {
        onRowsChange(updater);
        return;
      }
      const nextRows = resolveRows(updater, rows);
      onRowsChange(nextRows);
      return;
    }
    const nextRows = resolveRows(updater, rows);
    setInternalRows(nextRows);
  };

  const setPromoLabel = (nextValue) => {
    if (onPromoLabelChange) {
      onPromoLabelChange(nextValue);
      return;
    }
    setInternalPromoLabel(nextValue);
  };

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        if (row.rowType === 'subtotal') return acc;
        return {
          stockQty: acc.stockQty + Number(row.stockQty || 0),
          stockAmount: acc.stockAmount + Number(row.stockAmount || 0),
          promoSales: acc.promoSales + Number(row.promoSales || 0),
          promoMargin: acc.promoMargin + Number(row.promoMargin || 0),
          salesContribution: acc.salesContribution + Number(row.salesContribution || 0),
          promoContribution: acc.promoContribution + Number(row.promoContribution || 0),
          contributionGap: acc.contributionGap + Number(row.contributionGap || 0),
        };
      },
      { stockQty: 0, stockAmount: 0, promoSales: 0, promoMargin: 0, salesContribution: 0, promoContribution: 0, contributionGap: 0 },
    );
  }, [rows]);

  const toggleRow = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  const toggleExpand = (id) => setExpandedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  const toggleAll = () => {
    if (selectedIds.length === selectableRows.length) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(selectableRows.map((row) => row.id));
  };

  const updateField = (id, field, value) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleAddRow = () => {
    const newRow = createRow();
    setRows((prev) => [...prev, newRow]);
    setExpandedIds((prev) => [...prev, newRow.id]);
  };

  const handleAddSubtotal = () => {
    const lastSubtotalIndex = [...rows]
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => row.rowType === 'subtotal')
      .map(({ index }) => index)
      .pop();

    const startIndex = Number.isInteger(lastSubtotalIndex) ? lastSubtotalIndex + 1 : 0;
    const targetRows = rows.slice(startIndex).filter((row) => row.rowType !== 'subtotal');

    if (!targetRows.length) {
      notify.warning('소계를 계산할 대상 행이 없습니다.');
      return;
    }

    const subtotal = targetRows.reduce(
      (acc, row) => ({
        stockQty: acc.stockQty + Number(row.stockQty || 0),
        stockAmount: acc.stockAmount + Number(row.stockAmount || 0),
        promoSales: acc.promoSales + Number(row.promoSales || 0),
        promoMargin: acc.promoMargin + Number(row.promoMargin || 0),
      }),
      { stockQty: 0, stockAmount: 0, promoSales: 0, promoMargin: 0 },
    );

    const subtotalRow = createRow({
      division: '소계',
      itemType: '-',
      setCode: '-',
      componentCode: '-',
      erpCode: '-',
      stockQty: subtotal.stockQty,
      stockAmount: subtotal.stockAmount,
      promoSales: subtotal.promoSales,
      promoMargin: subtotal.promoMargin,
      remark: '누적 소계',
      rowType: 'subtotal',
    });

    setRows((prev) => [...prev, subtotalRow]);
    notify.success('소계를 추가했습니다.');
  };

  const handleDelete = () => {
    if (!selectedIds.length) {
      notify.info('삭제할 행을 선택해주세요.');
      return;
    }
    setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
    setExpandedIds((prev) => prev.filter((id) => !selectedIds.includes(id)));
    setSelectedIds([]);
    notify.success(`${selectedIds.length}건을 삭제했습니다.`);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    notify.info('편집을 취소했습니다.');
  };

  const handleTempSave = () => {
    if (onTempSave) {
      onTempSave({ rows, promoLabel });
      return;
    }
    notify.success('임시저장되었습니다.');
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ rows, promoLabel });
      return;
    }
    notify.success('저장되었습니다.');
  };

  const notifyPriceLoad = () => notify.info('판매단가 관리 데이터를 불러오는 기능은 다음 단계에서 연결합니다.');

  return {
    rows,
    promoLabel,
    setPromoLabel,
    selectedIds,
    expandedIds,
    selectableRows,
    selectedCount: selectedIds.length,
    totals,
    toggleRow,
    toggleExpand,
    toggleAll,
    updateField,
    handleAddRow,
    handleAddSubtotal,
    handleDelete,
    handleCancel,
    handleTempSave,
    handleSave,
    notifyPriceLoad,
  };
}
