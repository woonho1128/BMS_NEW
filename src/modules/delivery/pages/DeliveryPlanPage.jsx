import { lazy, startTransition, Suspense, useEffect, useState } from 'react';
import styles from './DeliveryPlanPage.module.css';
import { SummaryTabs } from '../components/layout/SummaryTabs';
import { DeliveryPlan } from '../components/plan/DeliveryPlan';
import { useModal } from '../hooks/useModal';
import { AddPlanModal } from '../components/modals/AddPlanModal';

const YearSummary = lazy(() =>
  import('../components/summary/YearSummary').then((module) => ({ default: module.YearSummary }))
);
const CompletedDeliveryList = lazy(() =>
  import('../components/completed/CompletedDeliveryList').then((module) => ({ default: module.CompletedDeliveryList }))
);
const ChangeHistoryComparison = lazy(() =>
  import('../components/history/ChangeHistoryComparison').then((module) => ({ default: module.ChangeHistoryComparison }))
);
const SpecRegistrationList = lazy(() =>
  import('../components/spec/SpecRegistrationList').then((module) => ({ default: module.SpecRegistrationList }))
);
const CancelledSpecList = lazy(() =>
  import('../components/spec/CancelledSpecList').then((module) => ({ default: module.CancelledSpecList }))
);

const TabLoadingFallback = () => <div className={styles.loadingBox}>데이터를 불러오는 중입니다...</div>;

export const DeliveryPlanPage = () => {
  const [activeTab, setActiveTab] = useState('plan');
  const [planRows, setPlanRows] = useState([]);
  const [isPlanRowsLoading, setIsPlanRowsLoading] = useState(true);
  const [isPlanRowsLoaded, setIsPlanRowsLoaded] = useState(false);
  const addPlanModal = useModal(null);

  useEffect(() => {
    let ignore = false;

    const loadPlanRows = async () => {
      try {
        const response = await fetch('/data/deliveryPlanRows.json', { cache: 'force-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const rows = await response.json();
        if (ignore) return;
        startTransition(() => {
          setPlanRows(Array.isArray(rows) ? rows : []);
        });
      } catch (error) {
        console.error('납품 계획 데이터를 불러오지 못했습니다.', error);
      } finally {
        if (!ignore) {
          setIsPlanRowsLoading(false);
          setIsPlanRowsLoaded(true);
        }
      }
    };

    loadPlanRows();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [activeTab]);

  const handleSaveNewPlan = (newPlan) => {
    setPlanRows((prev) => [newPlan, ...prev]);
    addPlanModal.close();
  };

  const shouldShowPlanLoading = (activeTab === 'plan' || activeTab === 'spec') && !isPlanRowsLoaded && isPlanRowsLoading;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.pageTitle}>
          현장/품목 관리
          <span className={styles.subTitle}>
            {activeTab === 'summary' && '연도 요약'}
            {activeTab === 'plan' && '납품 계획'}
            {activeTab === 'history' && '변경 이력'}
            {activeTab === 'completed' && '납품 완료'}
            {activeTab === 'spec' && '스펙 추가'}
            {activeTab === 'cancelled' && '스펙 취소'}
          </span>
        </div>
        <div className={styles.actionGroup}>
          {activeTab === 'plan' && (
            <button
              className={styles.actionButton}
              onClick={() => addPlanModal.open()}
              style={{ backgroundColor: '#2f7df6', color: 'white', borderColor: '#2f7df6' }}
            >
              + 납품계획 추가
            </button>
          )}
          <button className={styles.actionButton} onClick={() => console.log('Excel')}>
            엑셀 다운로드
          </button>
          <button className={styles.actionButton} onClick={() => console.log('Print')}>
            인쇄
          </button>
        </div>
      </header>

      <SummaryTabs activeTab={activeTab} onChange={setActiveTab} />

      <Suspense fallback={<TabLoadingFallback />}>
        {activeTab === 'summary' && <YearSummary />}
        {activeTab === 'plan' && (shouldShowPlanLoading ? <TabLoadingFallback /> : <DeliveryPlan rows={planRows} setRows={setPlanRows} />)}
        {activeTab === 'completed' && <CompletedDeliveryList />}
        {activeTab === 'history' && <ChangeHistoryComparison />}
        {activeTab === 'spec' && (shouldShowPlanLoading ? <TabLoadingFallback /> : <SpecRegistrationList rows={planRows} setRows={setPlanRows} />)}
        {activeTab === 'cancelled' && <CancelledSpecList />}
      </Suspense>

      {addPlanModal.isOpen && <AddPlanModal onClose={addPlanModal.close} onSave={handleSaveNewPlan} />}
    </div>
  );
};
