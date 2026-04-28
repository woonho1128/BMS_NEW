import React from 'react';
import DiscountPromotionManageTable from './DiscountPromotionManageTable';
import { useDiscountPromotionManageState } from './useDiscountPromotionManageState';

export default function DiscountPromotionManageTab({
  styles,
  readOnly = false,
  rows: controlledRows,
  onRowsChange,
  promoLabel: controlledPromoLabel,
  onPromoLabelChange,
  onSave,
  onCancel,
  onTempSave,
}) {
  const {
    rows,
    promoLabel,
    setPromoLabel,
    selectedIds,
    expandedIds,
    selectableRows,
    selectedCount,
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
  } = useDiscountPromotionManageState({
    readOnly,
    controlledRows,
    onRowsChange,
    controlledPromoLabel,
    onPromoLabelChange,
    onSave,
    onCancel,
    onTempSave,
  });

  return (
    <div className={`${styles.promoManageFrame} ${readOnly ? styles.promoManageFrameReadOnly : ''}`}>
      <div className={styles.promoManageTopBar}>
        <div className={styles.promoManageLeftControls}>
          <h3 className={styles.promoManageTitle}>프로모션 등록</h3>
          <span className={styles.promoControlLabel}>프로모션</span>
          <input className={styles.promoControlInput} value={promoLabel} disabled={readOnly} onChange={(e) => setPromoLabel(e.target.value)} />
          {!readOnly && (
            <button type="button" className={styles.promoGhostBtn} onClick={notifyPriceLoad}>
              판매단가 관리(단가표) 불러오기
            </button>
          )}
        </div>

        {!readOnly && (
          <div className={styles.promoManageRightControls}>
            <button type="button" className={styles.promoTinyBtn} onClick={handleAddRow}>행추가</button>
            <button type="button" className={styles.promoTinyBtn} onClick={handleAddSubtotal}>소계 추가</button>
            <button type="button" className={styles.promoTinyBtnDanger} onClick={handleDelete}>삭제</button>
          </div>
        )}
      </div>

      <DiscountPromotionManageTable
        styles={styles}
        readOnly={readOnly}
        rows={rows}
        selectedIds={selectedIds}
        expandedIds={expandedIds}
        selectableRows={selectableRows}
        selectedCount={selectedCount}
        totals={totals}
        toggleRow={toggleRow}
        toggleExpand={toggleExpand}
        toggleAll={toggleAll}
        updateField={updateField}
      />

      {!readOnly && (
        <div className={styles.promoManageBottomBar}>
          <div className={styles.promoActionWrap}>
            <button type="button" className={styles.promoActionSecondary} onClick={handleCancel}>취소</button>
            <button type="button" className={styles.promoActionSecondary} onClick={handleTempSave}>임시저장</button>
            <button type="button" className={styles.promoActionPrimary} onClick={handleSave}>저장</button>
          </div>
        </div>
      )}
    </div>
  );
}
