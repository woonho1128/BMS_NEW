import { Search, Download, Printer } from 'lucide-react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { formatNumber } from '../../../shared/utils/formatters';
import { usePartnerDeliveryState } from './usePartnerDeliveryState';
import styles from './PartnerDeliveryPage.module.css';

export function PartnerDeliveryPage() {
  const state = usePartnerDeliveryState();

  const factoryOptions = [
    { value: '', label: '?꾩껜' },
    { value: '?쒖슱怨듭옣', label: '?쒖슱怨듭옣' },
    { value: '遺?곌났??', label: '遺?곌났??' },
    { value: '?援ш났??', label: '?援ш났??' },
  ];

  const shipTypeOptions = [
    { value: '', label: '?꾩껜' },
    { value: '吏곸넚', label: '吏곸넚' },
    { value: '?앸같', label: '?앸같' },
  ];

  const monthlyFields = [
    { id: 'year', label: '?꾨룄', type: 'select', options: state.yearOptions, width: 120, row: 0 },
    ...(!state.isAgencyRole
      ? [{ id: 'partnerQuery', label: '?由ъ젏寃??', type: 'text', placeholder: '?由ъ젏 寃??', wide: true, row: 0 }]
      : []),
    {
      id: 'partnerId',
      label: '?由ъ젏',
      type: 'select',
      options: state.isAgencyRole
        ? [{ value: state.partnerId, label: state.selectedPartnerLabel || '???由ъ젏' }]
        : state.partnerOptionsFiltered,
      disabled: state.isAgencyRole,
      wide: true,
      row: 0,
    },
  ];

  const statusFields = [
    { id: 'factory', label: '怨듭옣紐?', type: 'select', options: factoryOptions, width: 140, row: 0 },
    { id: 'shipType', label: '異쒓퀬?뺥깭', type: 'select', options: shipTypeOptions, width: 120, row: 0 },
    {
      id: 'shipStatus',
      label: '異쒓퀬?곹깭',
      type: 'radio',
      options: [
        { value: '?꾩껜', label: '?꾩껜' },
        { value: '異쒓퀬?湲?', label: '異쒓퀬?湲?' },
        { value: '異쒓퀬?꾨즺', label: '異쒓퀬?꾨즺' },
      ],
      row: 0,
    },
    { id: 'range', label: '異쒓퀬?쇱옄', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 },
    ...(!state.isAgencyRole
      ? [{ id: 'partnerQuery', label: '?由ъ젏寃??', type: 'text', placeholder: '?由ъ젏 寃??', wide: true, row: 1 }]
      : []),
    {
      id: 'partnerId',
      label: '?由ъ젏',
      type: 'select',
      options: state.isAgencyRole
        ? [{ value: state.partnerId, label: state.selectedPartnerLabel || '???由ъ젏' }]
        : state.partnerOptionsFiltered,
      disabled: state.isAgencyRole,
      wide: true,
      row: 1,
    },
  ];

  return (
    <PageShell path="/partner/delivery" title="異쒓퀬 ?뺣낫 議고쉶" description="?붾퀎 ?댁뿭 諛?異쒓퀬 ?꾪솴 議고쉶">
      <div className={styles.page}>
        <div className={styles.tabs} role="tablist" aria-label="異쒓퀬 ?뺣낫 ??">
          <button type="button" role="tab" aria-selected={state.activeTab === 'monthly'} className={`${styles.tabBtn} ${state.activeTab === 'monthly' ? styles.tabBtnActive : ''}`} onClick={() => state.setActiveTab('monthly')}>
            ?붾퀎 ?댁뿭
          </button>
          <button type="button" role="tab" aria-selected={state.activeTab === 'status'} className={`${styles.tabBtn} ${state.activeTab === 'status' ? styles.tabBtnActive : ''}`} onClick={() => state.setActiveTab('status')}>
            異쒓퀬 ?꾪솴
          </button>
        </div>

        {state.activeTab === 'monthly' ? (
          <ListFilter
            className={`${styles.card} ${styles.filterCard}`}
            fields={monthlyFields}
            value={state.monthlyFilterValue}
            onChange={state.onMonthlyChange}
            onReset={state.resetMonthlyFilter}
            actionsAddon={
              <button type="button" className={styles.actionBtn} onClick={state.runMonthlySearch} disabled={state.isAgencyRole || !state.partnerId || state.monthlyLoading}>
                <Search size={16} />
                議고쉶
              </button>
            }
            showReset={false}
          />
        ) : (
          <ListFilter
            className={`${styles.card} ${styles.filterCard}`}
            fields={statusFields}
            value={state.statusFilterValue}
            onChange={state.onStatusChange}
            onReset={state.resetStatusFilter}
            actionsAddon={
              <button type="button" className={styles.actionBtn} onClick={state.runStatusSearch} disabled={state.isAgencyRole || !state.partnerId || state.statusLoading}>
                <Search size={16} />
                議고쉶
              </button>
            }
            showReset={false}
          />
        )}

        {state.activeTab === 'monthly' ? (
          <section className={styles.card} aria-label="?붾퀎 ?댁뿭 ?뚯씠釉?">
            <div className={styles.tableTop}>
              <div>
                <div className={styles.tableTitle}>?붾퀎 ?댁뿭</div>
                <div className={styles.hint}>
                  {state.partnerId ? state.selectedPartnerLabel : '?由ъ젏???좏깮?섏꽭??'} 쨌 珥?{formatNumber(state.monthlyResult.totalCount)}嫄?쨌 ?⑷퀎 {formatNumber(state.monthlyResult.totalSum)}??
                </div>
              </div>
              <div className={styles.tableActions}>
                <button type="button" className={styles.actionBtn} onClick={state.handleMonthlyDownload} disabled={!state.monthlyResult.rows.length}><Download size={16} />?묒?</button>
                <button type="button" className={styles.actionBtn} onClick={() => window.print()}><Printer size={16} />?몄뇙</button>
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>출고 월</th>
                    <th>대리점명</th>
                    <th>출고형태</th>
                    <th>부가유형</th>
                    <th className={styles.thNum}>금액</th>
                    <th className={styles.thNum}>부가세</th>
                    <th className={styles.thNum}>합계</th>
                  </tr>
                </thead>
                <tbody>
                  {state.monthlyLoading ? (
                    <tr><td colSpan={7} className={styles.emptyCell}>濡쒕뵫 以?..</td></tr>
                  ) : state.monthlyResult.rows.length === 0 ? (
                    <tr><td colSpan={7} className={styles.emptyCell}>?곗씠?곌? ?놁뒿?덈떎.</td></tr>
                  ) : (
                    state.monthlyResult.rows.map((r) => (
                      <tr key={`${r.shipYm}-${r.shipType}-${r.vatType}`}>
                        <td>{r.shipYm}</td><td>{r.partnerName}</td><td>{r.shipType}</td><td>{r.vatType}</td><td className={styles.tdNum}>{formatNumber(r.amount)}</td><td className={styles.tdNum}>{formatNumber(r.vat)}</td><td className={styles.tdTotal}>{formatNumber(r.total)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className={styles.card} aria-label="異쒓퀬 ?꾪솴 ?뚯씠釉?">
            <div className={styles.tableTop}>
              <div>
                <div className={styles.tableTitle}>異쒓퀬 ?꾪솴</div>
                <div className={styles.hint}>珥?{formatNumber(state.statusResult.totalCount)}嫄?/ ?섎웾 {formatNumber(state.statusResult.totalQty)} / 湲덉븸 {formatNumber(state.statusResult.totalAmount)}??</div>
              </div>
              <div className={styles.tableActions}>
                <button type="button" className={styles.actionBtn} onClick={state.handleStatusDownload} disabled={!state.statusResult.rows.length}><Download size={16} />?묒?</button>
                <button type="button" className={styles.actionBtn} onClick={() => window.print()}><Printer size={16} />?몄뇙</button>
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>?곸뾽洹몃９</th><th>怨듭옣援щ텇</th><th>異쒓퀬?뺥깭</th><th className={styles.thNum}>?섎웾</th><th className={styles.thNum}>湲덉븸(??</th></tr></thead>
                <tbody>
                  {state.statusLoading ? (
                    <tr><td colSpan={5} className={styles.emptyCell}>濡쒕뵫 以?..</td></tr>
                  ) : state.statusResult.rows.length === 0 ? (
                    <tr><td colSpan={5} className={styles.emptyCell}>?곗씠?곌? ?놁뒿?덈떎.</td></tr>
                  ) : (
                    state.statusResult.rows.map((r) => (
                      <tr key={r.id}><td>{r.salesGroup}</td><td>{r.factoryCategory}</td><td>{r.shipType}</td><td className={styles.tdNum}>{formatNumber(r.qty)}</td><td className={styles.tdNum}>{formatNumber(r.amount)}</td></tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}

export default PartnerDeliveryPage;
