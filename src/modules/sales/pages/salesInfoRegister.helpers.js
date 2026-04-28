import { MOCK_PROFIT_LIST, getProfitDetail, getRowDetail } from '../data/profitAnalysisMock';

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('ko-KR').format(Number(value) || 0);
}

export function createDefaultForm() {
  return {
    specType: '',
    swSpecNo: '',
    builder: '',
    partnerName: '',
    siteName: '',
    region: '',
    orderType: '',
    businessType: '',
    salesManager: '',
    specDate: today(),
    progressStatus: '',
    expectedDeliveryDate: '',
    bidetProgress: '미진행',
    paidOption: '미적용',
    totalHouseholds: '',
    appliedHouseholds: '',
    completionDate: '',
    originSpecNo: '',
    remark: '',
    deliveryManager: '',
  };
}

export function filterProfitList(keyword) {
  const q = String(keyword || '').trim().toLowerCase();
  if (!q) return MOCK_PROFIT_LIST;
  return MOCK_PROFIT_LIST.filter((row) => {
    const detail = getProfitDetail(row.id);
    const haystack = [row.title, row.author, row.orderYear, row.deliveryYear, detail?.specNo, detail?.builder, detail?.siteName]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function mapProfitRows(selectedProfit) {
  if (!selectedProfit) return [];
  return (selectedProfit.items || [])
    .map((row) => ({ row, detail: getRowDetail(row, true) }))
    .filter((it) => Boolean(it.detail));
}

export function summarizeProfitRows(profitRows) {
  return profitRows.reduce(
    (acc, item) => {
      const qty = Number(item.row.qty) || 0;
      acc.qty += qty;
      acc.sales += item.detail.sales || 0;
      acc.gross += item.detail.grossProfit || 0;
      acc.op += item.detail.operatingProfit || 0;
      return acc;
    },
    { qty: 0, sales: 0, gross: 0, op: 0 }
  );
}

export function patchFormWithProfitDetail(prev, detail) {
  return {
    ...prev,
    specType: detail.specType || '',
    swSpecNo: detail.specNo || '',
    builder: detail.builder || '',
    partnerName: detail.partnerName || '',
    siteName: detail.siteName || '',
    region: detail.region || '',
    orderType: detail.orderType || '',
    businessType: detail.businessType || '',
    salesManager: detail.salesManager || '',
    specDate: detail.specDate || prev.specDate,
    progressStatus: detail.integratedProgress || '',
    expectedDeliveryDate: detail.expectedDeliveryDate || '',
    bidetProgress: detail.integratedProgress || '',
    paidOption: detail.paidOption || '',
    totalHouseholds: detail.totalHouseholds || '',
    appliedHouseholds: detail.appliedHouseholds || '',
    completionDate: detail.completionDate || '',
    originSpecNo: detail.originSpecNo || '',
    remark: detail.remark || '',
  };
}
