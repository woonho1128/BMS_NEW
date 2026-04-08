import React, { Fragment, useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { formatDateRange, formatNumber } from '../../../shared/utils/formatters';
import { getApprovalList, APPROVAL_CATEGORY, APPROVAL_STATUS } from '../../approval/data/salesApprovalMock';
import { BASE_DISCOUNT_RATE, FACTORY_PRICE_MULTIPLIER } from '../utils/shortProjectPricing';
import ShortProjectProfitReadonlyTable from './components/ShortProjectProfitReadonlyTable';
import styles from './ShortProjectPage.module.css';

const CATEGORY_LABELS = ['S/W', 'OEM', '수전', '비데', '상품'];

const INITIAL_FILTERS = {
  dateFrom: '2026-01-01',
  dateTo: '2027-01-01',
  dealer: '',
  siteName: '',
  manager: '',
  itemCode: '',
};

const INITIAL_SORT = { key: 'deliveryDate', direction: 'desc' };

function toCategory(itemCode = '') {
  const code = String(itemCode).toUpperCase();
  if (code.includes('SW')) return 'S/W';
  if (code.includes('OEM')) return 'OEM';
  if (code.includes('SU') || code.includes('SR')) return '수전';
  if (code.includes('CC') || code.includes('BD')) return '비데';
  return '상품';
}

function toMonthText(dateText = '') {
  if (!dateText) return '-';
  const [year, month] = String(dateText).split('-');
  if (!year || !month) return dateText;
  return `${year}.${month}`;
}

function itemNameFromCode(itemCode = '') {
  const code = String(itemCode).toUpperCase();
  if (code.startsWith('CC')) return 'F/V양변기';
  if (code.startsWith('CL')) return '세면기';
  if (code.startsWith('SW')) return 'S/W';
  if (code.startsWith('OEM')) return 'OEM';
  if (code.startsWith('SU') || code.startsWith('SR')) return '수전';
  if (code.startsWith('BD')) return '비데';
  return '상품';
}

function buildProfitRows(items = []) {
  const rows = items.map((item, index) => {
    const qty = Number(item.qty) || 0;
    const costUnitPrice = Number(item.standardPrice) || 0;
    const costAmount = Math.floor(qty * costUnitPrice);

    const factoryUnitPrice = Math.floor(costUnitPrice * FACTORY_PRICE_MULTIPLIER);
    const factoryAmount = Math.floor(qty * factoryUnitPrice);

    const baseDiscountUnitPrice = Math.floor(factoryUnitPrice * (1 - BASE_DISCOUNT_RATE / 100));
    const baseDiscountAmount = Math.floor(qty * baseDiscountUnitPrice);
    const baseDiscountDiff = baseDiscountAmount - factoryAmount;
    const baseVsFactoryRate = factoryAmount ? (baseDiscountDiff / factoryAmount) * 100 : 0;

    const appliedDiscountUnitPrice = Number(item.unitPrice) || (qty ? Math.floor((Number(item.amount) || 0) / qty) : 0);
    const appliedDiscountAmount = Number(item.amount) || 0;
    const appliedDiscountDiff = appliedDiscountAmount - factoryAmount;
    const effectiveDiscountRate = factoryAmount ? (appliedDiscountDiff / factoryAmount) * 100 : 0;

    const grossProfitAmount = appliedDiscountAmount - costAmount;
    const grossProfitRate = appliedDiscountAmount ? (grossProfitAmount / appliedDiscountAmount) * 100 : 0;

    return {
      id: `${item.itemCode || 'item'}-${index}`,
      itemCode: item.itemCode || '-',
      unit: item.unit || '-',
      qty,
      costUnitPrice,
      costAmount,
      factoryUnitPrice,
      factoryAmount,
      baseDiscountUnitPrice,
      baseDiscountAmount,
      baseDiscountDiff,
      baseVsFactoryRate,
      appliedDiscountUnitPrice,
      appliedDiscountAmount,
      appliedDiscountDiff,
      effectiveDiscountRate,
      grossProfitRate,
      grossProfitAmount,
      discountRate: Number(item.discountRate) || 0,
    };
  });

  const total = rows.reduce(
    (acc, row) => ({
      costAmount: acc.costAmount + row.costAmount,
      factoryAmount: acc.factoryAmount + row.factoryAmount,
      baseDiscountAmount: acc.baseDiscountAmount + row.baseDiscountAmount,
      appliedDiscountAmount: acc.appliedDiscountAmount + row.appliedDiscountAmount,
    }),
    { costAmount: 0, factoryAmount: 0, baseDiscountAmount: 0, appliedDiscountAmount: 0 }
  );

  return { rows, total };
}

function getPieSegments(map) {
  const entries = CATEGORY_LABELS.map((label) => ({ label, value: Number(map[label] || 0) }));
  const total = entries.reduce((sum, entry) => sum + entry.value, 0);
  if (!total) {
    return { gradient: '#edf2fb', entries: entries.map((e) => ({ ...e, percent: 0 })) };
  }
  const colors = ['#2f6fd7', '#f48b3f', '#9d44d8', '#27a38b', '#6a86a8'];
  let start = 0;
  const parts = entries.map((entry, index) => {
    const percent = (entry.value / total) * 100;
    const end = start + percent;
    const part = `${colors[index]} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    start = end;
    return { ...entry, percent, color: colors[index], part };
  });
  return { gradient: `conic-gradient(${parts.map((p) => p.part).join(', ')})`, entries: parts };
}

function sortByKey(rows, sort) {
  const multiplier = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = a[sort.key];
    const bv = b[sort.key];

    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * multiplier;
    return String(av || '').localeCompare(String(bv || '')) * multiplier;
  });
}

export function ShortProjectPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState('site');
  const [chartMetric, setChartMetric] = useState('delivery');
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT);
  const [previewSite, setPreviewSite] = useState(null);
  const [expandedItemCode, setExpandedItemCode] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(true);

  const approvedSites = useMemo(() => {
    return getApprovalList()
      .filter(
        (item) =>
          item.category === APPROVAL_CATEGORY.SHORT_PROJECT &&
          item.status === APPROVAL_STATUS.APPROVED &&
          item.sourcePath === '/sales/short-project/register'
      )
      .map((item) => {
        const site = item.site || {};
        const { rows, total } = buildProfitRows(site.items || []);
        const isGovernmentProject = Boolean(site.isGovernmentProject) || String(site.specialNote || '').includes('관급');
        const deliveryAmount = total.appliedDiscountAmount;
        const profitAmount = deliveryAmount - total.costAmount;
        const grossProfitRate = deliveryAmount ? (profitAmount / deliveryAmount) * 100 : 0;
        const effectiveDiscountRate = total.factoryAmount
          ? ((deliveryAmount - total.factoryAmount) / total.factoryAmount) * 100
          : 0;

        return {
          id: item.id,
          deliveryDate: item.date || '',
          deliveryMonth: toMonthText(item.date || ''),
          drafter: item.drafter || '-',
          dealer: site.dealer || '-',
          siteName: site.siteName || '-',
          builder: site.builder || '-',
          deliveryFrom: site.deliveryFrom || '',
          deliveryTo: site.deliveryTo || '',
          isGovernmentProject,
          items: Array.isArray(site.items) ? site.items : [],
          itemCount: Array.isArray(site.items) ? site.items.length : 0,
          factoryAmount: total.factoryAmount,
          baseAmount: total.baseDiscountAmount,
          deliveryAmount,
          profitAmount,
          grossProfitRate,
          effectiveDiscountRate,
          profitRows: rows,
          profitTotal: total,
        };
      });
  }, []);

  const filteredSites = useMemo(() => {
    return approvedSites.filter((site) => {
      if (appliedFilters.dateFrom && site.deliveryDate < appliedFilters.dateFrom) return false;
      if (appliedFilters.dateTo && site.deliveryDate > appliedFilters.dateTo) return false;
      if (appliedFilters.dealer && !site.dealer.toLowerCase().includes(appliedFilters.dealer.toLowerCase())) return false;
      if (appliedFilters.siteName && !site.siteName.toLowerCase().includes(appliedFilters.siteName.toLowerCase())) return false;
      if (appliedFilters.manager && !site.drafter.toLowerCase().includes(appliedFilters.manager.toLowerCase())) return false;
      if (
        appliedFilters.itemCode &&
        !site.items.some((item) => String(item.itemCode || '').toLowerCase().includes(appliedFilters.itemCode.toLowerCase()))
      ) {
        return false;
      }
      return true;
    });
  }, [approvedSites, appliedFilters]);

  const sortedSites = useMemo(() => sortByKey(filteredSites, sortConfig), [filteredSites, sortConfig]);

  const itemRows = useMemo(() => {
    const bucket = new Map();

    sortedSites.forEach((site) => {
      site.items.forEach((item) => {
        const itemCode = String(item.itemCode || '-');
        const qty = Number(item.qty) || 0;
        const amount = Number(item.amount) || 0;
        const cost = Number(item.standardAmount) || 0;
        const profit = amount - cost;
        const unitPrice = Number(item.unitPrice) || (qty ? Math.floor(amount / qty) : 0);
        const discountRate = Number(item.discountRate) || 0;

        if (!bucket.has(itemCode)) {
          bucket.set(itemCode, {
            key: itemCode,
            itemCode,
            itemName: itemNameFromCode(itemCode),
            totalQty: 0,
            totalAmount: 0,
            totalProfit: 0,
            weightedDiscountRateSum: 0,
            qtyWeight: 0,
            sites: [],
            siteSet: new Set(),
          });
        }

        const entry = bucket.get(itemCode);
        entry.totalQty += qty;
        entry.totalAmount += amount;
        entry.totalProfit += profit;
        entry.weightedDiscountRateSum += discountRate * Math.max(qty, 1);
        entry.qtyWeight += Math.max(qty, 1);

        const siteKey = `${site.dealer}-${site.siteName}`;
        if (!entry.siteSet.has(siteKey)) {
          entry.siteSet.add(siteKey);
        }

        entry.sites.push({
          siteId: site.id,
          dealer: site.dealer,
          siteName: site.siteName,
          drafter: site.drafter,
          qty,
          unitPrice,
          amount,
          profit,
        });
      });
    });

    return Array.from(bucket.values())
      .map((entry) => ({
        ...entry,
        avgUnitPrice: entry.totalQty ? Math.floor(entry.totalAmount / entry.totalQty) : 0,
        grossProfitRate: entry.totalAmount ? (entry.totalProfit / entry.totalAmount) * 100 : 0,
        avgDiscountRate: entry.qtyWeight ? entry.weightedDiscountRateSum / entry.qtyWeight : 0,
        siteCount: entry.siteSet.size,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [sortedSites]);

  const summary = useMemo(() => {
    return filteredSites.reduce(
      (acc, site) => ({
        siteCount: acc.siteCount + 1,
        governmentCount: acc.governmentCount + (site.isGovernmentProject ? 1 : 0),
        deliveryAmount: acc.deliveryAmount + site.deliveryAmount,
        profitAmount: acc.profitAmount + site.profitAmount,
      }),
      { siteCount: 0, governmentCount: 0, deliveryAmount: 0, profitAmount: 0 }
    );
  }, [filteredSites]);

  const composition = useMemo(() => {
    const bucket = { 'S/W': 0, OEM: 0, 수전: 0, 비데: 0, 상품: 0 };
    filteredSites.forEach((site) => {
      site.items.forEach((item) => {
        const category = toCategory(item.itemCode);
        const delivery = Number(item.amount) || 0;
        const profit = delivery - (Number(item.standardAmount) || 0);
        bucket[category] += chartMetric === 'delivery' ? delivery : profit;
      });
    });
    return bucket;
  }, [filteredSites, chartMetric]);

  const pie = useMemo(() => getPieSegments(composition), [composition]);

  const runSearch = () => setAppliedFilters(filters);
  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
  };

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortMark = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <PageShell
      path={ROUTES.SHORT_PROJECT}
      title="단납 현장 내역"
      description="단납 현장 등록에서 상신 후 결재 완료된 데이터만 조회합니다."
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
              {summaryOpen ? '−' : '+'} 종합현황
            </button>

            {summaryOpen ? (
              <div className={styles.topRow}>
                <div className={styles.summaryRow}>
                  <div><span>단납 현장 수 :</span><strong>{summary.siteCount}건</strong></div>
                  <div><span>납품 금액 :</span><strong>{formatNumber(summary.deliveryAmount)}</strong></div>
                  <div><span>매출 총 이익 :</span><strong>{formatNumber(summary.profitAmount)}</strong></div>
                  <div><span>관급공사 수 :</span><strong>{summary.governmentCount}건</strong></div>
                </div>
                <div className={styles.chartPanel}>
                  <div className={styles.metricToggle}>
                    <label>
                      <input type="checkbox" checked={chartMetric === 'delivery'} onChange={() => setChartMetric('delivery')} />
                      납품금액
                    </label>
                    <label>
                      <input type="checkbox" checked={chartMetric === 'profit'} onChange={() => setChartMetric('profit')} />
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
                      <th className={styles.thCenter}><button type="button" className={styles.sortButton} onClick={() => toggleSort('deliveryMonth')}>납품일자 {sortMark('deliveryMonth')}</button></th>
                      <th><button type="button" className={styles.sortButton} onClick={() => toggleSort('siteName')}>현장명 {sortMark('siteName')}</button></th>
                      <th><button type="button" className={styles.sortButton} onClick={() => toggleSort('dealer')}>대리점명 {sortMark('dealer')}</button></th>
                      <th><button type="button" className={styles.sortButton} onClick={() => toggleSort('drafter')}>담당자 {sortMark('drafter')}</button></th>
                      <th><button type="button" className={styles.sortButton} onClick={() => toggleSort('builder')}>건설사 {sortMark('builder')}</button></th>
                      <th className={styles.thRight}><button type="button" className={styles.sortButton} onClick={() => toggleSort('deliveryAmount')}>납품금액 {sortMark('deliveryAmount')}</button></th>
                      <th className={styles.thRight}><button type="button" className={styles.sortButton} onClick={() => toggleSort('profitAmount')}>매출총이익 {sortMark('profitAmount')}</button></th>
                      <th className={styles.thRight}><button type="button" className={styles.sortButton} onClick={() => toggleSort('grossProfitRate')}>매출총이익률 {sortMark('grossProfitRate')}</button></th>
                      <th className={styles.thRight}><button type="button" className={styles.sortButton} onClick={() => toggleSort('effectiveDiscountRate')}>실질할인율 {sortMark('effectiveDiscountRate')}</button></th>
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
              <strong className={styles.previewModalTitle}>자동 계산 테이블 (읽기보기) - {previewSite.siteName}</strong>
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
