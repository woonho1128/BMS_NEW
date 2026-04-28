import React, { Fragment } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { formatDateRange, formatNumber } from '../../../shared/utils/formatters';
import ShortProjectProfitReadonlyTable from './components/ShortProjectProfitReadonlyTable';
import { BASE_DISCOUNT_RATE } from './shortProjectPage.helpers';
import { useShortProjectData } from './useShortProjectData';
import styles from './ShortProjectPage.module.css';

export function ShortProjectPage() {
  const {
    filters,
    setFilters,
    viewMode,
    setViewMode,
    chartMetric,
    setChartMetric,
    previewSite,
    setPreviewSite,
    expandedItemCode,
    setExpandedItemCode,
    summaryOpen,
    setSummaryOpen,
    sortedSites,
    itemRows,
    summary,
    pie,
    runSearch,
    resetFilters,
    toggleSort,
    sortMark,
  } = useShortProjectData();

  return (
    <PageShell
      path={ROUTES.SHORT_PROJECT}
      title="단납 현장 내역"
      description="단납 현장 등록에서 확신 및 결재 완료된 데이터만 조회합니다."
    >
      <div className={styles.page}>
        <Card className={styles.sectionCard}>
          <CardBody>
            <button
              type="button"
              className={styles.summaryToggle}
              onClick={() => setSummaryOpen((prev) => !prev)}
              aria-expanded={summaryOpen}
            >
              {summaryOpen ? '-' : '+'} 종합현황
            </button>

            {summaryOpen ? (
              <div className={styles.topRow}>
                <div className={styles.summaryRow}>
                  <div><span>단납 현장 수:</span><strong>{summary.siteCount}건</strong></div>
                  <div><span>납품 금액 :</span><strong>{formatNumber(summary.deliveryAmount)}</strong></div>
                  <div><span>매출 총 이익 :</span><strong>{formatNumber(summary.profitAmount)}</strong></div>
                  <div><span>관급공사 수:</span><strong>{summary.governmentCount}건</strong></div>
                </div>
                <div className={styles.chartPanel}>
                  <div className={styles.metricToggle}>
                    <label>
                      <input type="radio" name="chartMetric" checked={chartMetric === 'delivery'} onChange={() => setChartMetric('delivery')} />
                      납품금액
                    </label>
                    <label>
                      <input type="radio" name="chartMetric" checked={chartMetric === 'profit'} onChange={() => setChartMetric('profit')} />
                      매출총이익
                    </label>
                  </div>
                  <div className={styles.pieWrap}>
                    <div className={styles.pieChart} style={{ background: pie.gradient }} />
                    <ul className={styles.legend}>
                      {pie.entries.map((entry) => (
                        <li key={entry.label}>
                          <span className={styles.legendDot} style={{ backgroundColor: entry.color || '#d0d7e5' }} />
                          <span>{entry.label}</span>
                          <strong>{entry.percent.toFixed(0)}%</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            <div className={styles.filterRow}>
              <div className={styles.periodInline}>
                <span className={styles.periodLabel}>기간</span>
                <input className={`${styles.input} ${styles.periodInput}`} type="date" value={filters.dateFrom} onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))} />
                <span className={styles.tilde}>~</span>
                <input className={`${styles.input} ${styles.periodInput}`} type="date" value={filters.dateTo} onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))} />
              </div>
              <input className={styles.input} placeholder="대리점명" value={filters.dealer} onChange={(e) => setFilters((prev) => ({ ...prev, dealer: e.target.value }))} />
              <input className={styles.input} placeholder="현장명" value={filters.siteName} onChange={(e) => setFilters((prev) => ({ ...prev, siteName: e.target.value }))} />
              <input className={`${styles.input} ${styles.managerInput}`} placeholder="담당자" value={filters.manager} onChange={(e) => setFilters((prev) => ({ ...prev, manager: e.target.value }))} />
              <input className={styles.input} placeholder="품목" value={filters.itemCode} onChange={(e) => setFilters((prev) => ({ ...prev, itemCode: e.target.value }))} />
              <Button onClick={runSearch}>조회</Button>
              <Button variant="secondary" onClick={resetFilters}>초기화</Button>
            </div>

            <div className={styles.modeTabs}>
              <button type="button" className={`${styles.modeTab} ${viewMode === 'site' ? styles.modeTabActive : ''}`} onClick={() => setViewMode('site')}>현장별</button>
              <button type="button" className={`${styles.modeTab} ${viewMode === 'item' ? styles.modeTabActive : ''}`} onClick={() => setViewMode('item')}>품목별</button>
            </div>

            <div className={styles.tableWrap}>
              {viewMode === 'site' ? (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.thCenter}><button type="button" className={styles.sortButton} onClick={() => toggleSort('deliveryDate')}>순번 {sortMark('deliveryDate')}</button></th>
                      <th className={styles.thCenter}><button type="button" className={styles.sortButton} onClick={() => toggleSort('deliveryMonth')}>납품월 {sortMark('deliveryMonth')}</button></th>
                      <th><button type="button" className={styles.sortButton} onClick={() => toggleSort('siteName')}>현장명 {sortMark('siteName')}</button></th>
                      <th><button type="button" className={styles.sortButton} onClick={() => toggleSort('dealer')}>대리점명 {sortMark('dealer')}</button></th>
                      <th><button type="button" className={styles.sortButton} onClick={() => toggleSort('drafter')}>담당자 {sortMark('drafter')}</button></th>
                      <th><button type="button" className={styles.sortButton} onClick={() => toggleSort('builder')}>건설사 {sortMark('builder')}</button></th>
                      <th className={styles.thRight}><button type="button" className={styles.sortButton} onClick={() => toggleSort('deliveryAmount')}>납품금액 {sortMark('deliveryAmount')}</button></th>
                      <th className={styles.thRight}><button type="button" className={styles.sortButton} onClick={() => toggleSort('profitAmount')}>매출총이익 {sortMark('profitAmount')}</button></th>
                      <th className={styles.thRight}><button type="button" className={styles.sortButton} onClick={() => toggleSort('grossProfitRate')}>매출총이익률 {sortMark('grossProfitRate')}</button></th>
                      <th className={styles.thRight}><button type="button" className={styles.sortButton} onClick={() => toggleSort('effectiveDiscountRate')}>실적할인율 {sortMark('effectiveDiscountRate')}</button></th>
                      <th className={styles.thCenter}><button type="button" className={styles.sortButton} onClick={() => toggleSort('itemCount')}>품목내역 {sortMark('itemCount')}</button></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSites.length === 0 ? (
                      <tr>
                        <td colSpan={11} className={styles.empty}>결재 완료된 단납 현장이 없습니다.</td>
                      </tr>
                    ) : (
                      sortedSites.map((site, index) => (
                        <tr key={site.id}>
                          <td className={styles.centerCell}>{index + 1}</td>
                          <td className={styles.centerCell}>{site.deliveryMonth}</td>
                          <td>{site.siteName}</td>
                          <td>{site.dealer}</td>
                          <td>{site.drafter}</td>
                          <td>{site.builder}</td>
                          <td className={styles.numberCell}>{formatNumber(site.deliveryAmount)}</td>
                          <td className={styles.numberCell}>{formatNumber(site.profitAmount)}</td>
                          <td className={styles.numberCell}>{site.grossProfitRate.toFixed(2)}%</td>
                          <td className={styles.numberCell}>{Math.max(0, site.effectiveDiscountRate).toFixed(2)}%</td>
                          <td className={styles.centerCell}>
                            <button type="button" className={styles.linkButton} onClick={() => setPreviewSite(site)}>
                              보기
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.thCenter}>순번</th>
                      <th>품목코드</th>
                      <th>품목명</th>
                      <th className={styles.thRight}>총출고수량</th>
                      <th className={styles.thRight}>평균출고가</th>
                      <th className={styles.thRight}>총출고금액</th>
                      <th className={styles.thRight}>총매출총이익</th>
                      <th className={styles.thRight}>총매출총이익률</th>
                      <th className={styles.thRight}>평균할인율</th>
                      <th className={styles.thCenter}>출고현장수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemRows.length === 0 ? (
                      <tr>
                        <td colSpan={10} className={styles.empty}>표시할 품목 데이터가 없습니다.</td>
                      </tr>
                    ) : (
                      itemRows.map((row, index) => (
                        <Fragment key={row.key}>
                          <tr>
                            <td className={styles.centerCell}>{index + 1}</td>
                            <td>{row.itemCode}</td>
                            <td>{row.itemName}</td>
                            <td className={styles.numberCell}>{formatNumber(row.totalQty)}</td>
                            <td className={styles.numberCell}>{formatNumber(row.avgUnitPrice)}</td>
                            <td className={styles.numberCell}>{formatNumber(row.totalAmount)}</td>
                            <td className={styles.numberCell}>{formatNumber(row.totalProfit)}</td>
                            <td className={styles.numberCell}>{row.grossProfitRate.toFixed(2)}%</td>
                            <td className={styles.numberCell}>{row.avgDiscountRate.toFixed(2)}%</td>
                            <td className={styles.centerCell}>
                              <button
                                type="button"
                                className={styles.linkButton}
                                onClick={() => setExpandedItemCode((prev) => (prev === row.itemCode ? '' : row.itemCode))}
                              >
                                {row.siteCount}개
                              </button>
                            </td>
                          </tr>
                          {expandedItemCode === row.itemCode ? (
                            <tr className={styles.accordionDetailRow}>
                              <td colSpan={10}>
                                <div className={styles.accordionDetailWrap}>
                                  <table className={styles.accordionDetailTable}>
                                    <thead>
                                      <tr>
                                        <th>대리점-현장</th>
                                        <th>담당자</th>
                                        <th className={styles.thRight}>수량</th>
                                        <th className={styles.thRight}>출고가</th>
                                        <th className={styles.thRight}>금액</th>
                                        <th className={styles.thRight}>이익</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {row.sites.map((entry, idx) => (
                                        <tr key={`${row.key}-${entry.siteId}-${idx}`}>
                                          <td>{entry.dealer} - {entry.siteName}</td>
                                          <td>{entry.drafter}</td>
                                          <td className={styles.numberCell}>{formatNumber(entry.qty)}</td>
                                          <td className={styles.numberCell}>{formatNumber(entry.unitPrice)}</td>
                                          <td className={styles.numberCell}>{formatNumber(entry.amount)}</td>
                                          <td className={styles.numberCell}>{formatNumber(entry.profit)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {previewSite ? (
        <div className={styles.previewModalBackdrop} role="presentation" onClick={() => setPreviewSite(null)}>
          <div className={styles.previewModal} role="dialog" aria-modal="true" aria-label="자동 계산 테이블" onClick={(e) => e.stopPropagation()}>
            <div className={styles.previewModalHeader}>
              <strong className={styles.previewModalTitle}>자동 계산 테이블(읽기보기) - {previewSite.siteName}</strong>
              <button type="button" className={styles.previewCloseButton} onClick={() => setPreviewSite(null)}>닫기</button>
            </div>
            <div className={styles.previewModalBody}>
              <ShortProjectProfitReadonlyTable
                rows={previewSite.profitRows}
                total={previewSite.profitTotal}
                formatNumber={formatNumber}
                baseDiscountRate={BASE_DISCOUNT_RATE}
                rowKeyPrefix={`short-project-${previewSite.id}`}
              />
              <div className={styles.previewMeta}>
                <span>납품예정일: {formatDateRange(previewSite.deliveryFrom, previewSite.deliveryTo)}</span>
                <span>담당자: {previewSite.drafter}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

    </PageShell>
  );
}

export default ShortProjectPage;
