import React, { useEffect, useState } from 'react';
import styles from '../ShortProjectRegisterPage.module.css';
import { Button } from '../../../../shared/components/Button/Button';
import ShortProjectProfitReadonlyTable from './ShortProjectProfitReadonlyTable';

const TAB = {
  COVER: 'cover',
  DETAIL: 'detail',
};

export default function ShortProjectSubmitModal({
  open,
  selectedSitesForSubmit,
  submitSiteTableData,
  submitCoverTotals,
  activeSubmitSite,
  activeSubmitSiteId,
  setActiveSubmitSiteId,
  submitSummary,
  activeSubmitProfitRows,
  activeSubmitProfitTotal,
  formatNumber,
  formatDateRange,
  baseDiscountRate,
  approverOptions,
  approvalStep1,
  approvalStep2,
  approvalStep3,
  setApprovalStep1,
  setApprovalStep2,
  setApprovalStep3,
  hasDuplicateApprover,
  submitComment,
  setSubmitComment,
  isSubmitModalValid,
  onClose,
  onSubmit,
}) {
  const [activeTab, setActiveTab] = useState(TAB.COVER);

  useEffect(() => {
    if (open) {
      setActiveTab(TAB.COVER);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.submitModalBackdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.submitModal}
        role="dialog"
        aria-modal="true"
        aria-label="결재선 지정 후 상신"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.submitModalHeader}>
          <strong className={styles.submitModalTitle}>결재선 지정 후 상신</strong>
          <button type="button" className={styles.previewCloseButton} onClick={onClose}>
            닫기
          </button>
        </div>

        <div className={styles.submitModalBody}>
          <div className={styles.submitTopTabs}>
            <button
              type="button"
              className={`${styles.submitTopTab} ${activeTab === TAB.COVER ? styles.submitTopTabActive : ''}`}
              onClick={() => setActiveTab(TAB.COVER)}
            >
              갑지(요약)
            </button>
            <button
              type="button"
              className={`${styles.submitTopTab} ${activeTab === TAB.DETAIL ? styles.submitTopTabActive : ''}`}
              onClick={() => setActiveTab(TAB.DETAIL)}
            >
              현장별 상세
            </button>
          </div>

          {activeTab === TAB.COVER ? (
            <section className={styles.submitSection}>
              <h3 className={styles.submitSectionTitle}>요약</h3>
              <div className={styles.coverTotals}>
                <div className={styles.coverTotalCard}>
                  <span>총 공장도가 금액</span>
                  <strong>{formatNumber(submitCoverTotals.factoryAmount)}</strong>
                </div>
                <div className={styles.coverTotalCard}>
                  <span>총 기본할인가 금액</span>
                  <strong>{formatNumber(submitCoverTotals.baseDiscountAmount)}</strong>
                </div>
                <div className={styles.coverTotalCard}>
                  <span>총 단납공급가 금액</span>
                  <strong>{formatNumber(submitCoverTotals.appliedDiscountAmount)}</strong>
                </div>
              </div>

              <div className={styles.coverSiteStack}>
                {submitSiteTableData.map((entry) => (
                  <div key={`cover-${entry.site.id}`} className={styles.coverSiteCard}>
                    <div className={styles.coverSiteTitleRow}>
                      <strong>{entry.site.siteName}</strong>
                      <span>{formatDateRange(entry.site.deliveryFrom, entry.site.deliveryTo)}</span>
                    </div>
                    <ShortProjectProfitReadonlyTable
                      rows={entry.rows}
                      total={entry.total}
                      formatNumber={formatNumber}
                      baseDiscountRate={baseDiscountRate}
                      rowKeyPrefix={`submit-cover-${entry.site.id}`}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className={styles.submitSection}>
              <h3 className={styles.submitSectionTitle}>선택 건 요약</h3>
              <div className={styles.submitSummaryBar}>
                <span>선택 건수: {submitSummary.count}건</span>
                <span>대표품번 수: {submitSummary.itemCount}개</span>
                <span>기본 할인 금액: {formatNumber(submitSummary.baseDiscountAmount)}</span>
                <span>단납 할인 금액: {formatNumber(submitSummary.shortDiscountAmount)}</span>
              </div>

              <div className={styles.submitSiteTabs} role="tablist" aria-label="상신 대상 현장 선택">
                {selectedSitesForSubmit.map((site) => {
                  const isActive = activeSubmitSite?.id === site.id;
                  return (
                    <button
                      key={`tab-${site.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`${styles.submitSiteTab} ${isActive ? styles.submitSiteTabActive : ''}`}
                      onClick={() => setActiveSubmitSiteId(site.id)}
                    >
                      {site.siteName}
                    </button>
                  );
                })}
              </div>

              {activeSubmitSite && (
                <>
                  <div className={styles.submitSiteInfoGrid}>
                    <div className={styles.submitInfoItem}>
                      <span className={styles.submitInfoLabel}>현장명</span>
                      <strong className={styles.submitInfoValue}>{activeSubmitSite.siteName}</strong>
                    </div>
                    <div className={styles.submitInfoItem}>
                      <span className={styles.submitInfoLabel}>건설사</span>
                      <strong className={styles.submitInfoValue}>{activeSubmitSite.builder}</strong>
                    </div>
                    <div className={styles.submitInfoItem}>
                      <span className={styles.submitInfoLabel}>대리점</span>
                      <strong className={styles.submitInfoValue}>{activeSubmitSite.dealer}</strong>
                    </div>
                    <div className={styles.submitInfoItem}>
                      <span className={styles.submitInfoLabel}>납품예정일</span>
                      <strong className={styles.submitInfoValue}>
                        {formatDateRange(activeSubmitSite.deliveryFrom, activeSubmitSite.deliveryTo)}
                      </strong>
                    </div>
                  </div>

                  <ShortProjectProfitReadonlyTable
                    rows={activeSubmitProfitRows}
                    total={activeSubmitProfitTotal}
                    formatNumber={formatNumber}
                    baseDiscountRate={baseDiscountRate}
                    rowKeyPrefix={`submit-${activeSubmitSiteId || 'site'}`}
                  />
                </>
              )}
            </section>
          )}

          <section className={styles.submitSection}>
            <h3 className={styles.submitSectionTitle}>결재선</h3>
            <div className={styles.approvalLineGrid}>
              <label className={styles.field}>
                <span className={styles.label}>1차 결재자 *</span>
                <select className={styles.input} value={approvalStep1} onChange={(e) => setApprovalStep1(e.target.value)}>
                  {approverOptions.map((approver) => (
                    <option key={approver.id} value={approver.id}>
                      {approver.name} ({approver.dept})
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>2차 결재자</span>
                <select className={styles.input} value={approvalStep2} onChange={(e) => setApprovalStep2(e.target.value)}>
                  <option value="">선택 안함</option>
                  {approverOptions.map((approver) => (
                    <option key={`step2-${approver.id}`} value={approver.id}>
                      {approver.name} ({approver.dept})
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>3차 결재자</span>
                <select className={styles.input} value={approvalStep3} onChange={(e) => setApprovalStep3(e.target.value)}>
                  <option value="">선택 안함</option>
                  {approverOptions.map((approver) => (
                    <option key={`step3-${approver.id}`} value={approver.id}>
                      {approver.name} ({approver.dept})
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {hasDuplicateApprover && <p className={styles.submitError}>동일 결재자를 중복 선택할 수 없습니다.</p>}
          </section>

          <section className={styles.submitSection}>
            <h3 className={styles.submitSectionTitle}>상신 의견</h3>
            <textarea
              className={styles.textarea}
              rows={4}
              value={submitComment}
              onChange={(e) => setSubmitComment(e.target.value)}
              placeholder="결재자가 확인할 핵심 내용을 입력하세요."
            />
          </section>
        </div>

        <div className={styles.submitModalFooter}>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" onClick={onSubmit} disabled={!isSubmitModalValid}>
            {submitSummary.count}건 상신 실행
          </Button>
        </div>
      </div>
    </div>
  );
}
