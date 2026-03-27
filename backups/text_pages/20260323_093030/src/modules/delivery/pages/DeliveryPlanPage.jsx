import { useState } from 'react';
import styles from './DeliveryPlanPage.module.css';
import { SummaryTabs } from '../components/layout/SummaryTabs';
import { YearSummary } from '../components/summary/YearSummary';
import { DeliveryPlan } from '../components/plan/DeliveryPlan';
import { CompletedDeliveryList } from '../components/completed/CompletedDeliveryList';
import { ChangeHistoryComparison } from '../components/history/ChangeHistoryComparison';

import { INITIAL_PLAN_ROWS } from '../data/planDummyData';

import { SpecRegistrationList } from '../components/spec/SpecRegistrationList';
import { CancelledSpecList } from '../components/spec/CancelledSpecList';

import { useModal } from '../hooks/useModal';
import { AddPlanModal } from '../components/modals/AddPlanModal';

export const DeliveryPlanPage = () => {
  const [activeTab, setActiveTab] = useState('plan');
  const [planRows, setPlanRows] = useState(INITIAL_PLAN_ROWS);
  const addPlanModal = useModal(null);

  const handleSaveNewPlan = (newPlan) => {
    setPlanRows(prev => [newPlan, ...prev]);
    addPlanModal.close();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.pageTitle}>
          현장 별 품목 관리
          <span className={styles.subTitle}>
            {activeTab === 'summary' && '년도 요약'}
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
              style={{ backgroundColor: '#1890ff', color: 'white', borderColor: '#1890ff' }}
            >
              + 납품계획 추가
            </button>
          )}
          <button className={styles.actionButton} onClick={() => console.log('Excel')}>
            엑셀다운로드
          </button>
          <button className={styles.actionButton} onClick={() => console.log('Print')}>
            인쇄
          </button>
        </div>
      </header>

      <SummaryTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'summary' && <YearSummary />}
      {activeTab === 'plan' && <DeliveryPlan rows={planRows} setRows={setPlanRows} />}
      {activeTab === 'completed' && <CompletedDeliveryList />}
      {activeTab === 'history' && <ChangeHistoryComparison />}
      {activeTab === 'spec' && <SpecRegistrationList rows={planRows} setRows={setPlanRows} />}
      {activeTab === 'cancelled' && <CancelledSpecList />}

      {/* Add Plan Modal */}
      {addPlanModal.isOpen && (
        <AddPlanModal 
            onClose={addPlanModal.close} 
            onSave={handleSaveNewPlan} 
        />
      )}
    </div>
  );
};
