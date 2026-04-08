import React from 'react';
import styles from '../ShortProjectRegisterPage.module.css';
import ShortProjectProfitReadonlyTable from './ShortProjectProfitReadonlyTable';

export default function ShortProjectCompareModal({
  open,
  compareData,
  formatNumber,
  baseDiscountRate,
  onClose,
}) {
  if (!open || !compareData?.length) return null;

  return (
    <div className={styles.compareModalBackdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.compareModal}
        role="dialog"
        aria-modal="true"
        aria-label="현장 비교"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.previewModalHeader}>
          <strong className={styles.previewModalTitle}>현장 비교 - 자동 계산 테이블 ({compareData.length}건)</strong>
          <button type="button" className={styles.previewCloseButton} onClick={onClose}>
            닫기
          </button>
        </div>

        <div className={styles.compareModalBody}>
          {compareData.map((entry) => (
            <section key={entry.site.id} className={styles.compareItemCard}>
              <h4 className={styles.submitSectionTitle}>{entry.site.siteName}</h4>
              <ShortProjectProfitReadonlyTable
                rows={entry.rows}
                total={entry.total}
                formatNumber={formatNumber}
                baseDiscountRate={baseDiscountRate}
                rowKeyPrefix={`compare-${entry.site.id}`}
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
