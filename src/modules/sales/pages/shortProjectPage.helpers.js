import { BASE_DISCOUNT_RATE, FACTORY_PRICE_MULTIPLIER } from '../utils/shortProjectPricing';
export { BASE_DISCOUNT_RATE };

export const CATEGORY_LABELS = ['S/W', 'OEM', '수전', '비데', '상품'];

export const INITIAL_FILTERS = {
  dateFrom: '2026-01-01',
  dateTo: '2027-01-01',
  dealer: '',
  siteName: '',
  manager: '',
  itemCode: '',
};

export const INITIAL_SORT = { key: 'deliveryDate', direction: 'desc' };

export function toCategory(itemCode = '') {
  const code = String(itemCode).toUpperCase();
  if (code.includes('SW')) return 'S/W';
  if (code.includes('OEM')) return 'OEM';
  if (code.includes('SU') || code.includes('SR')) return '수전';
  if (code.includes('CC') || code.includes('BD')) return '비데';
  return '상품';
}

export function toMonthText(dateText = '') {
  if (!dateText) return '-';
  const [year, month] = String(dateText).split('-');
  if (!year || !month) return dateText;
  return `${year}.${month}`;
}

export function itemNameFromCode(itemCode = '') {
  const code = String(itemCode).toUpperCase();
  if (code.startsWith('CC')) return 'F/V양변기';
  if (code.startsWith('CL')) return '세면기';
  if (code.startsWith('SW')) return 'S/W';
  if (code.startsWith('OEM')) return 'OEM';
  if (code.startsWith('SU') || code.startsWith('SR')) return '수전';
  if (code.startsWith('BD')) return '비데';
  return '상품';
}

export function buildProfitRows(items = []) {
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

export function getPieSegments(map) {
  const entries = CATEGORY_LABELS.map((label) => ({ label, value: Number(map[label] || 0) }));
  const total = entries.reduce((sum, entry) => sum + entry.value, 0);
  if (!total) return { gradient: '#edf2fb', entries: entries.map((e) => ({ ...e, percent: 0 })) };
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

export function sortByKey(rows, sort) {
  const multiplier = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = a[sort.key];
    const bv = b[sort.key];
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * multiplier;
    return String(av || '').localeCompare(String(bv || '')) * multiplier;
  });
}
