import { useMemo, useState } from 'react';
import { getApprovalList, APPROVAL_CATEGORY, APPROVAL_STATUS } from '../../approval/data/salesApprovalMock';
import {
  buildProfitRows,
  getPieSegments,
  INITIAL_FILTERS,
  INITIAL_SORT,
  itemNameFromCode,
  sortByKey,
  toCategory,
  toMonthText,
} from './shortProjectPage.helpers';

export function useShortProjectData() {
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
    const bucket = { 'S/W': 0, OEM: 0, 세전: 0, 비데: 0, 상품: 0 };
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
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return {
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
  };
}
