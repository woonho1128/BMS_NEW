import { Search, Download, Printer } from 'lucide-react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { formatNumber } from '../../../shared/utils/formatters';
import { usePartnerDeliveryState } from './usePartnerDeliveryState';
import { buildMonthlyFields, buildStatusFields } from './partnerDelivery.helpers';
import styles from './PartnerDeliveryPage.module.css';

export function PartnerDeliveryPage() {
  const state = usePartnerDeliveryState();

  const monthlyFields = buildMonthlyFields({
    yearOptions: state.yearOptions,
    isAgencyRole: state.isAgencyRole,
    partnerId: state.partnerId,
    selectedPartnerLabel: state.selectedPartnerLabel,
    partnerOptionsFiltered: state.partnerOptionsFiltered,
  });

  const statusFields = buildStatusFields({
    isAgencyRole: state.isAgencyRole,
    partnerId: state.partnerId,
    selectedPartnerLabel: state.selectedPartnerLabel,
    partnerOptionsFiltered: state.partnerOptionsFiltered,
  });

  return (
    <PageShell path="/partner/delivery" title="출고 정보 조회" description="월별 내역 및 출고 현황 조회">
      <div className={styles.page}>
        <div className={styles.tabs} role="tablist" aria-label="출고 정보 탭">
          <button type="button" role="tab" aria-selected={state.activeTab === 'monthly'} className={`${styles.tabBtn} ${state.activeTab === 'monthly' ? styles.tabBtnActive : ''}`} onClick={() => state.setActiveTab('monthly')}>
            월별 내역
          </button>
          <button type="button" role="tab" aria-selected={state.activeTab === 'status'} className={`${styles.tabBtn} ${state.activeTab === 'status' ? styles.tabBtnActive : ''}`} onClick={() => state.setActiveTab('status')}>
            출고 현황
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
                조회
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
                조회
              </button>
            }
            showReset={false}
          />
        )}

        {state.activeTab === 'monthly' ? (
          <section className={styles.card} aria-label="월별 내역 테이블">
            <div className={styles.tableTop}>
              <div>
                <div className={styles.tableTitle}>월별 내역</div>
                <div className={styles.hint}>
                  {state.partnerId ? state.selectedPartnerLabel : '대리점을 선택하세요'} · 총 {formatNumber(state.monthlyResult.totalCount)}건 · 합계 {formatNumber(state.monthlyResult.totalSum)}원
                </div>
              </div>
              <div className={styles.tableActions}>
                <button type="button" className={styles.actionBtn} onClick={state.handleMonthlyDownload} disabled={!state.monthlyResult.rows.length}><Download size={16} />엑셀</button>
                <button type="button" className={styles.actionBtn} onClick={() => window.print()}><Printer size={16} />인쇄</button>
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
                    <tr><td colSpan={7} className={styles.emptyCell}>로딩 중...</td></tr>
                  ) : state.monthlyResult.rows.length === 0 ? (
                    <tr><td colSpan={7} className={styles.emptyCell}>데이터가 없습니다.</td></tr>
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
          <section className={styles.card} aria-label="출고 현황 테이블">
            <div className={styles.tableTop}>
              <div>
                <div className={styles.tableTitle}>출고 현황</div>
                <div className={styles.hint}>총 {formatNumber(state.statusResult.totalCount)}건 / 수량 {formatNumber(state.statusResult.totalQty)} / 금액 {formatNumber(state.statusResult.totalAmount)}원</div>
              </div>
              <div className={styles.tableActions}>
                <button type="button" className={styles.actionBtn} onClick={state.handleStatusDownload} disabled={!state.statusResult.rows.length}><Download size={16} />엑셀</button>
                <button type="button" className={styles.actionBtn} onClick={() => window.print()}><Printer size={16} />인쇄</button>
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>영업그룹</th><th>공장구분</th><th>출고형태</th><th className={styles.thNum}>수량</th><th className={styles.thNum}>금액(원)</th></tr></thead>
                <tbody>
                  {state.statusLoading ? (
                    <tr><td colSpan={5} className={styles.emptyCell}>로딩 중...</td></tr>
                  ) : state.statusResult.rows.length === 0 ? (
                    <tr><td colSpan={5} className={styles.emptyCell}>데이터가 없습니다.</td></tr>
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
