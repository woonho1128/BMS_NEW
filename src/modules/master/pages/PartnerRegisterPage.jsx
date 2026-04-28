import { lazy, Suspense, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { getBusinessCardsList } from '../../sales/data/businessCardMock';
import { classnames } from '../../../shared/utils/classnames';
import styles from './PartnerRegisterPage.module.css';
import PartnerRegisterTopCards from './components/PartnerRegisterTopCards';
import PartnerRegisterMiddleCards from './components/PartnerRegisterMiddleCards';
import { PartnerRegisterFooterActions, PartnerRegisterHistoryModal } from './components/PartnerRegisterExtraSections';
import { parseEmail } from './PartnerRegisterPage.helpers';
import { usePartnerRegisterState } from './usePartnerRegisterState';

const EditHistoryModalContent = lazy(() => import('./components/EditHistoryModalContent'));
const PartnerMapCard = lazy(() => import('./components/PartnerMapCard'));

export function PartnerRegisterPage({ mode = 'register', partnerId: initialPartnerId = '' }) {
  const navigate = useNavigate();
  const { id: routePartnerId } = useParams();
  const resolvedPartnerId = initialPartnerId || routePartnerId || '';
  const isDetailMode = mode === 'detail';
  const businessCards = useMemo(() => getBusinessCardsList({}), []);

  const state = usePartnerRegisterState({ navigate, isDetailMode, resolvedPartnerId, businessCards });

  const pageTitle = isDetailMode ? `${state.divisionLabels.entityName} 상세` : `${state.divisionLabels.entityName} 등록`;
  const pageDescription = isDetailMode
    ? `등록 화면과 동일한 구성의 읽기 전용 ${state.divisionLabels.entityName} 상세 화면입니다.`
    : `상세 화면 구조와 동일한 ${state.divisionLabels.entityName} 등록 화면입니다.`;

  return (
    <PageShell path="/master/partners" title={pageTitle} description={pageDescription}>
      <div className={classnames(styles.page, isDetailMode && !state.isEditMode && styles.readOnlyPage)}>
        <PartnerRegisterTopCards
          styles={styles}
          divisionLabels={state.divisionLabels}
          formData={state.formData}
          isDetailMode={isDetailMode}
          isEditMode={state.isEditMode}
          partnerKeyword={state.partnerKeyword}
          setPartnerKeyword={state.setPartnerKeyword}
          setPartnerSearchMessage={state.setPartnerSearchMessage}
          setIsPartnerDropdownOpen={state.setIsPartnerDropdownOpen}
          autoPartnerResults={state.isPartnerDropdownOpen ? state.autoPartnerResults : []}
          onPartnerSelect={state.onPartnerSelect}
          partnerSearchMessage={state.partnerSearchMessage}
          partnerRegionOptions={state.partnerRegionOptions}
          partnerTraitCodes={state.partnerTraitCodes}
          handlePartnerTraitToggle={state.handlePartnerTraitToggle}
          handlePartnerTraitRatioChange={state.handlePartnerTraitRatioChange}
          updateEditable={state.updateEditable}
          cardKeyword={state.cardKeyword}
          setCardKeyword={state.setCardKeyword}
          setCardSearchMessage={state.setCardSearchMessage}
          setIsCardDropdownOpen={state.setIsCardDropdownOpen}
          handleLoadBusinessCardByKeyword={state.handleLoadBusinessCardByKeyword}
          handleManualRepresentative={state.handleManualRepresentative}
          hasBusinessCardLinked={state.hasBusinessCardLinked}
          onNavigateSalesCard={() => navigate('/sales/card')}
          autoCardResults={state.isCardDropdownOpen ? state.autoCardResults : []}
          handleCardSelect={state.handleCardSelect}
          cardSearchMessage={state.cardSearchMessage}
          updateRepresentative={state.updateRepresentative}
          isRepresentativeEditable={state.isRepresentativeEditable}
          emailLocal={state.emailLocal}
          handleEmailLocalChange={state.handleEmailLocalChange}
          emailDomainType={state.emailDomainType}
          handleEmailDomainTypeChange={state.handleEmailDomainTypeChange}
          emailDomainDirect={state.emailDomainDirect}
          handleEmailDomainDirectChange={state.handleEmailDomainDirectChange}
          handleAddStaff={state.handleAddStaff}
          handleRemoveStaff={state.handleRemoveStaff}
          parseEmail={parseEmail}
          setStaffEmailParts={state.setStaffEmailParts}
          updateStaff={state.updateStaff}
        />

        <PartnerRegisterMiddleCards
          styles={styles}
          classnamesFn={classnames}
          divisionLabels={state.divisionLabels}
          isDetailMode={isDetailMode}
          isEditMode={state.isEditMode}
          salesByYearRows={state.salesByYearRows}
          salesChartMode={state.salesChartMode}
          setSalesChartMode={state.setSalesChartMode}
          selectedSalesCategory={state.selectedSalesCategory}
          setSelectedSalesCategory={state.setSelectedSalesCategory}
          salesCategoryOptions={state.salesCategoryOptions}
          salesChartModel={state.salesChartModel}
          visibleSalesSeries={state.visibleSalesSeries}
          salesChartData={state.salesChartData}
          selectedPartnerDetail={state.selectedPartnerDetail}
          staffByYearRows={state.staffByYearRows}
          formData={state.formData}
          isEditableMode={state.isEditableMode}
          handleAddCompetitorBrand={state.handleAddCompetitorBrand}
          handleCompetitorChange={state.handleCompetitorChange}
          handleRemoveCompetitorBrand={state.handleRemoveCompetitorBrand}
          financeSearchMessage={state.financeSearchMessage}
          financeLoaded={state.financeLoaded}
          financeTab={state.financeTab}
          setFinanceTab={state.setFinanceTab}
          financePreview={state.financePreview}
          financeCumulative={state.financeCumulative}
          outstandingTabRows={state.outstandingTabRows}
          mapCardNode={(
            <Suspense fallback={<div style={{ padding: 12 }}>지도 카드 불러오는 중...</div>}>
              <PartnerMapCard
                formData={state.formData}
                mapPins={state.mapPins}
                handleMapCenterChange={state.handleMapCenterChange}
                handleAddPoint={state.handleAddPoint}
                handlePointChange={state.handlePointChange}
                handleRemovePoint={state.handleRemovePoint}
              />
            </Suspense>
          )}
          updateEditable={state.updateEditable}
        />

        <PartnerRegisterFooterActions
          isDetailMode={isDetailMode}
          isEditMode={state.isEditMode}
          handleStartEditMode={state.handleStartEditMode}
          handleOpenHistory={state.handleOpenHistory}
          navigate={navigate}
          handleReset={state.handleReset}
          handleSubmit={state.handleSubmit}
        />

        {state.saved && <p className={styles.toast}>등록 데이터를 저장했습니다.</p>}
      </div>

      <PartnerRegisterHistoryModal
        isDetailMode={isDetailMode}
        historyModalOpen={state.historyModalOpen}
        setHistoryModalOpen={state.setHistoryModalOpen}
        selectedPartnerDetail={state.selectedPartnerDetail}
        formData={state.formData}
        editHistoryRows={state.editHistoryRows}
        EditHistoryModalContent={EditHistoryModalContent}
      />
    </PageShell>
  );
}

export default PartnerRegisterPage;
