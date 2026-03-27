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
          ?꾩옣 蹂??덈ぉ 愿由?
          <span className={styles.subTitle}>
            {activeTab === 'summary' && '?꾨룄 ?붿빟'}
            {activeTab === 'plan' && '?⑺뭹 怨꾪쉷'}
            {activeTab === 'history' && '蹂寃??대젰'}
            {activeTab === 'completed' && '?⑺뭹 ?꾨즺'}
            {activeTab === 'spec' && '?ㅽ럺 異붽?'}
            {activeTab === 'cancelled' && '?ㅽ럺 痍⑥냼'}
          </span>
        </div>
        <div className={styles.actionGroup}>
          {activeTab === 'plan' && (
            <button 
              className={styles.actionButton}
              onClick={() => addPlanModal.open()}
              style={{ backgroundColor: '#2f7df6', color: 'white', borderColor: '#2f7df6' }}
            >
              + ?⑺뭹怨꾪쉷 異붽?
            </button>
          )}
          <button className={styles.actionButton} onClick={() => console.log('Excel')}>
            ?묒??ㅼ슫濡쒕뱶
          </button>
          <button className={styles.actionButton} onClick={() => console.log('Print')}>
            ?몄뇙
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

