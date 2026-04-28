import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { formatDateRange, formatNumber } from '../../../shared/utils/formatters';
import styles from './ShortProjectRegisterPage.module.css';
import {
  ShortProjectRegisterFormView,
  ShortProjectRegisterListView,
} from './components/ShortProjectRegisterViews';
import { useShortProjectRegisterState } from './useShortProjectRegisterState';

const ShortProjectPricingPreviewModal = lazy(() => import('./components/ShortProjectPricingPreviewModal'));
const ShortProjectSubmitModal = lazy(() => import('./components/ShortProjectSubmitModal'));
const ShortProjectCompareModal = lazy(() => import('./components/ShortProjectCompareModal'));

export function ShortProjectRegisterPage() {
  const navigate = useNavigate();
  const state = useShortProjectRegisterState(navigate);

  const listActions = (
    <Button variant="primary" onClick={state.openForm}>
      등록하기
    </Button>
  );

  const formActions = (
    <Button variant="secondary" onClick={state.backToList}>
      목록으로
    </Button>
  );

  return (
    <PageShell
      path={ROUTES.SHORT_PROJECT_REGISTER}
      title="단납 현장 등록"
      description={
        state.mode === state.VIEW_MODE.LIST
          ? '기존 등록 현장을 조회하고 신규 등록으로 이어서 작업하세요'
          : '기본 정보와 대표품번을 입력하여 결재 상신할 수 있습니다.'
      }
      actions={state.mode === state.VIEW_MODE.LIST ? listActions : formActions}
      className={styles.shellWide}
    >
      <div className={styles.page}>
        {state.mode === state.VIEW_MODE.LIST ? (
          <ShortProjectRegisterListView
            styles={styles}
            dealerFilter={state.dealerFilter}
            setDealerFilter={state.setDealerFilter}
            builderFilter={state.builderFilter}
            setBuilderFilter={state.setBuilderFilter}
            siteFilter={state.siteFilter}
            setSiteFilter={state.setSiteFilter}
            deliveryFromFilter={state.deliveryFromFilter}
            setDeliveryFromFilter={state.setDeliveryFromFilter}
            deliveryToFilter={state.deliveryToFilter}
            setDeliveryToFilter={state.setDeliveryToFilter}
            listSites={state.listSites}
            allVisibleSelected={state.allVisibleSelected}
            hasAnyVisibleSelected={state.hasAnyVisibleSelected}
            toggleAllVisibleSelection={state.toggleAllVisibleSelection}
            selectedSiteIds={state.selectedSiteIds}
            toggleSiteSelection={state.toggleSiteSelection}
            loadSiteToForm={state.loadSiteToForm}
            expandedSiteId={state.expandedSiteId}
            setExpandedSiteId={state.setExpandedSiteId}
            openCompareModal={state.openCompareModal}
            openSubmitModal={state.openSubmitModal}
          />
        ) : (
          <ShortProjectRegisterFormView
            styles={styles}
            siteName={state.siteName}
            setSiteName={state.setSiteName}
            duplicateHint={state.duplicateHint}
            builder={state.builder}
            setBuilder={state.setBuilder}
            dealer={state.dealer}
            setDealer={state.setDealer}
            partnerOptions={state.partnerOptions}
            deliveryFrom={state.deliveryFrom}
            setDeliveryFrom={state.setDeliveryFrom}
            deliveryTo={state.deliveryTo}
            setDeliveryTo={state.setDeliveryTo}
            isGovernmentProject={state.isGovernmentProject}
            setIsGovernmentProject={state.setIsGovernmentProject}
            addItemRow={state.addItemRow}
            computedItems={state.computedItems}
            updateItem={state.updateItem}
            removeItemRow={state.removeItemRow}
            total={state.total}
            hasProfitRows={state.hasProfitRows}
            commonDiscountRate={state.commonDiscountRate}
            setCommonDiscountRate={state.setCommonDiscountRate}
            sanitizeNumber={state.sanitizeNumber}
            applyCommonDiscountRate={state.applyCommonDiscountRate}
            profitRows={state.profitRows}
            extraDiscountDisabledByItemId={state.extraDiscountDisabledByItemId}
            setExtraDiscountDisabledByItemId={state.setExtraDiscountDisabledByItemId}
            profitTotal={state.profitTotal}
            specialNotes={state.specialNotes}
            setSpecialNotes={state.setSpecialNotes}
            addAttachments={state.addAttachments}
            attachments={state.attachments}
            removeAttachment={state.removeAttachment}
            backToList={state.backToList}
            saveDraft={state.saveDraft}
            submitForm={state.submitForm}
            isFormValid={state.isFormValid}
          />
        )}

        <Suspense fallback={null}>
          <ShortProjectPricingPreviewModal
            open={Boolean(state.previewSite)}
            site={state.previewSite}
            rows={state.previewProfitRows}
            total={state.previewProfitTotal}
            formatNumber={formatNumber}
            baseDiscountRate={state.BASE_DISCOUNT_RATE}
            onClose={() => state.setExpandedSiteId('')}
          />
          <ShortProjectSubmitModal
            open={state.submitModalOpen}
            selectedSitesForSubmit={state.selectedSitesForSubmit}
            submitSiteTableData={state.submitSiteTableData}
            submitCoverTotals={state.submitCoverTotals}
            activeSubmitSite={state.activeSubmitSite}
            activeSubmitSiteId={state.activeSubmitSiteId}
            setActiveSubmitSiteId={state.setActiveSubmitSiteId}
            submitSummary={state.submitSummary}
            activeSubmitProfitRows={state.activeSubmitProfitRows}
            activeSubmitProfitTotal={state.activeSubmitProfitTotal}
            formatNumber={formatNumber}
            formatDateRange={formatDateRange}
            baseDiscountRate={state.BASE_DISCOUNT_RATE}
            approverOptions={state.APPROVER_OPTIONS}
            approvalStep1={state.approvalStep1}
            approvalStep2={state.approvalStep2}
            approvalStep3={state.approvalStep3}
            setApprovalStep1={state.setApprovalStep1}
            setApprovalStep2={state.setApprovalStep2}
            setApprovalStep3={state.setApprovalStep3}
            hasDuplicateApprover={state.hasDuplicateApprover}
            submitComment={state.submitComment}
            setSubmitComment={state.setSubmitComment}
            isSubmitModalValid={state.isSubmitModalValid}
            onClose={() => state.setSubmitModalOpen(false)}
            onSubmit={state.submitSelectedSites}
          />
          <ShortProjectCompareModal
            open={state.compareModalOpen}
            compareData={state.compareData}
            formatNumber={formatNumber}
            baseDiscountRate={state.BASE_DISCOUNT_RATE}
            onClose={() => state.setCompareModalOpen(false)}
          />
        </Suspense>
      </div>
    </PageShell>
  );
}

export default ShortProjectRegisterPage;
