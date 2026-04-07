import React from 'react';
import styles from '../ShortProjectRegisterPage.module.css';
import ShortProjectProfitReadonlyTable from './ShortProjectProfitReadonlyTable';

export default function ShortProjectPricingPreviewModal({
  open,
  site,
  rows,
  total,
  formatNumber,
  baseDiscountRate,
  onClose,
}) {
  if (!open || !site) return null;

  return (
    <div className={styles.previewModalBackdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.previewModal}
        role="dialog"
        aria-modal="true"
        aria-label={`자동 계산 테이블 - ${site.siteName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.previewModalHeader}>
          <strong className={styles.previewModalTitle}>자동 계산 테이블 (읽기보기) - {site.siteName}</strong>
          <button type="button" className={styles.previewCloseButton} onClick={onClose}>
            닫기
          </button>
        </div>
        <div className={styles.previewModalBody}>
          <ShortProjectProfitReadonlyTable
            rows={rows}
            total={total}
            formatNumber={formatNumber}
            baseDiscountRate={baseDiscountRate}
            rowKeyPrefix="preview-profit"
          />
        </div>
      </div>
    </div>
  );
}
