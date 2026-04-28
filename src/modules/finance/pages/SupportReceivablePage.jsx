import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import styles from './SupportReceivablePage.module.css';
import { SupportReceivableTabPanel } from './components/SupportReceivableTabs';

import {  TAB,} from './supportReceivable.helpers';
export const SupportReceivablePage = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(TAB.RECEIVABLE);

  const preset = useMemo(
    () => ({
      tab: searchParams.get('tab') || '',
      customerCode: searchParams.get('customerCode') || '',
      customerName: searchParams.get('customerName') || '',
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || '',
      accountNo: searchParams.get('accountNo') || '',
    }),
    [searchParams],
  );

  useEffect(() => {
    if (preset.tab === TAB.COLLECTION) setActiveTab(TAB.COLLECTION);
  }, [preset.tab]);

  return (
    <PageShell path={pathname} className={styles.shellWide}>
      <div className={styles.page}>
        <div className={styles.mainCard}>
          <h2 className={styles.pageTitle}>채신/수금 관리</h2>
          <div className={styles.tabs} role="tablist">
            <button type="button" role="tab" aria-selected={activeTab === TAB.RECEIVABLE} className={activeTab === TAB.RECEIVABLE ? styles.tabActive : styles.tab} onClick={() => setActiveTab(TAB.RECEIVABLE)}>
              채권 및 채신 현황
            </button>
            <button type="button" role="tab" aria-selected={activeTab === TAB.COLLECTION} className={activeTab === TAB.COLLECTION ? styles.tabActive : styles.tab} onClick={() => setActiveTab(TAB.COLLECTION)}>
              수금 현황
            </button>
            <button type="button" role="tab" aria-selected={activeTab === TAB.NOTE} className={activeTab === TAB.NOTE ? styles.tabActive : styles.tab} onClick={() => setActiveTab(TAB.NOTE)}>
              어음 현황
            </button>
            <button type="button" role="tab" aria-selected={activeTab === TAB.OUTSTANDING} className={activeTab === TAB.OUTSTANDING ? styles.tabActive : styles.tab} onClick={() => setActiveTab(TAB.OUTSTANDING)}>
              미수금 현황
            </button>
          </div>

          <SupportReceivableTabPanel activeTab={activeTab} preset={preset} />
        </div>
      </div>
    </PageShell>
  );
};

export default SupportReceivablePage;


