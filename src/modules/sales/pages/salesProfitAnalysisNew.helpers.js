import { MOCK_ITEM_MASTER } from '../data/profitAnalysisMock';

export function toNumber(value) {
  const n = Number(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function formatNumber(value) {
  return new Intl.NumberFormat('ko-KR').format(toNumber(value));
}

export function calculateRow(row) {
  const factoryPrice = toNumber(row.factoryPrice);
  const qty = toNumber(row.qty);
  const bidPrice = toNumber(row.bidPrice);
  const marginRate = toNumber(row.marginRateDealer);
  const cost2027 = toNumber(row.cost2027);

  const dealerUnitPrice = Math.round(bidPrice * (1 - marginRate / 100));
  const discountRate = factoryPrice > 0 ? ((factoryPrice - dealerUnitPrice) / factoryPrice) * 100 : 0;
  const grossUnit = dealerUnitPrice - cost2027;
  const grossRate = dealerUnitPrice > 0 ? (grossUnit / dealerUnitPrice) * 100 : 0;
  const opUnit = grossUnit - dealerUnitPrice * 0.05;
  const opRate = dealerUnitPrice > 0 ? (opUnit / dealerUnitPrice) * 100 : 0;

  return {
    ...row,
    dealerUnitPrice,
    discountRate,
    grossUnit,
    grossRate,
    opUnit,
    opRate,
    amountSales: dealerUnitPrice * qty,
    amountGross: grossUnit * qty,
    amountOp: opUnit * qty,
  };
}

export function createEmptyItem(index) {
  return {
    id: `new-${Date.now()}-${index}`,
    type: '양변기',
    setCode: '',
    itemCode: '',
    orderType: '유상옵션',
    factoryPrice: 0,
    setUnitPrice: 0,
    cost2026: 0,
    cost2027: 0,
    qty: '',
    bidPrice: '',
    marginRateDealer: '',
    dealerUnitPrice: 0,
    discountRate: 0,
    grossUnit: 0,
    grossRate: 0,
    opUnit: 0,
    opRate: 0,
    remark: '',
    amountSales: 0,
    amountGross: 0,
    amountOp: 0,
  };
}

export function createDefaultForm() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    specType: '',
    costIncreaseRate: '3',
    builder: '',
    partnerName: '',
    siteName: '',
    region: '',
    orderType: '',
    businessType: '',
    salesManager: '',
    specDate: today,
    progressStatus: '',
    expectedDeliveryDate: '',
    bidetProgress: '미진행',
    paidOption: '미적용',
    totalHouseholds: '',
    appliedHouseholds: '',
    completionDate: '',
    originSpecNo: '',
    partnerDeliveryAmount: '',
    expectedProfitRate: '',
    commissionEnabled: false,
    commissionFee: '',
    remark: '',
  };
}

export function mapDetailItems(detail) {
  if (!detail?.items?.length) return [createEmptyItem(0)];
  return detail.items.map((item, index) => {
    const master = MOCK_ITEM_MASTER[item.itemCode] || {};
    return calculateRow({
      id: item.id || `edit-${index}`,
      type: item.type || '양변기',
      setCode: item.itemCode || '',
      itemCode: item.itemCode || '',
      orderType: item.orderType || '유상옵션',
      factoryPrice: master.factoryPrice || 0,
      setUnitPrice: master.factoryPrice || 0,
      cost2026: master.cost2026 || 0,
      cost2027: master.cost2027 || 0,
      qty: item.qty || '',
      bidPrice: item.bidPrice || '',
      marginRateDealer: item.marginRateDealer || '',
      remark: item.remark || '',
    });
  });
}
