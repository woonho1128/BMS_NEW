export const ITEM_COLUMNS = [
  { key: 'itemCode', label: '품번' },
  { key: 'periodLabel', label: '프로모션 기간' },
  { key: 'promoType', label: '프로모션유형' },
  { key: 'targetQty', label: '목표수량', align: 'right' },
  { key: 'soldQty', label: '판매수량', align: 'right' },
  { key: 'achieveRate', label: '달성률', align: 'right' },
  { key: 'basePrice', label: '기본할인가', align: 'right' },
  { key: 'promoPrice', label: '프로모션가', align: 'right' },
  { key: 'discountRate', label: '할인율', align: 'right' },
  { key: 'amount', label: '금액', align: 'right' },
  { key: 'grossProfit', label: '매출총이익', align: 'right' },
  { key: 'grossMargin', label: '매출률', align: 'right' },
];
export const ROUND_COLUMNS = [
  { key: 'roundName', label: '회차명' }, { key: 'status', label: '상태' }, { key: 'periodLabel', label: '기간' },
  { key: 'itemCount', label: '품목수', align: 'right' }, { key: 'totalQty', label: '총수량', align: 'right' },
  { key: 'totalSales', label: '총매출', align: 'right' }, { key: 'totalProfit', label: '총이익', align: 'right' },
  { key: 'profitRate', label: '이익률', align: 'right' },
];
export const ROUND_DETAIL_COLUMNS = [
  { key: 'itemCode', label: '품목명' }, { key: 'targetQty', label: '목표수량', align: 'right' },
  { key: 'soldQty', label: '판매수량', align: 'right' }, { key: 'costPrice', label: '원가', align: 'right' },
  { key: 'basePrice', label: '기본판매가', align: 'right' }, { key: 'promoPrice', label: '프로모션가', align: 'right' },
  { key: 'salesAmount', label: '판매금액', align: 'right' }, { key: 'grossProfit', label: '매출총이익', align: 'right' },
  { key: 'profitRate', label: '이익률', align: 'right' },
];
export const DEALER_COLUMNS = [
  { key: 'dealerName', label: '대리점' }, { key: 'totalSales', label: '전체 매출', align: 'right' },
  { key: 'promoSales', label: '프로모션 매출', align: 'right' }, { key: 'promoShare', label: '프로모션 비중(%)', align: 'right' },
  { key: 'promoProfit', label: '프로모션 이익', align: 'right' }, { key: 'profitRate', label: '이익률', align: 'right' },
];
export const DEALER_DETAIL_COLUMNS = [
  { key: 'itemCode', label: '품목명' }, { key: 'qty', label: '수량', align: 'right' },
  { key: 'sales', label: '매출', align: 'right' }, { key: 'salesShare', label: '판매비중', align: 'right' },
  { key: 'profitRate', label: '이익률', align: 'right' },
];
export const ITEM_ROWS = [
  { id: 'i-1', itemCode: 'DST-660', periodFrom: '2025-01-01', periodTo: '2025-02-01', periodLabel: '2025.01.01~2025.02.01', promoType: '장기재고', targetQty: '300', soldQty: '300', achieveRate: '100%', basePrice: '289,500', promoPrice: '250,000', discountRate: '14%', amount: '75,000,000', grossProfit: '30,000,000', grossMargin: '40%' },
  { id: 'i-2', itemCode: 'DST-660', periodFrom: '2025-04-01', periodTo: '2025-05-01', periodLabel: '2025.04.01~2025.05.01', promoType: '신제품', targetQty: '300', soldQty: '300', achieveRate: '100%', basePrice: '289,500', promoPrice: '250,000', discountRate: '14%', amount: '75,000,000', grossProfit: '30,000,000', grossMargin: '40%' },
  { id: 'i-3', itemCode: 'DL-B2213', periodFrom: '2026-01-10', periodTo: '2026-02-12', periodLabel: '2026.01.10~2026.02.12', promoType: '재고전환', targetQty: '180', soldQty: '148', achieveRate: '82%', basePrice: '164,000', promoPrice: '142,000', discountRate: '13%', amount: '21,016,000', grossProfit: '8,010,000', grossMargin: '38%' },
];
export const ROUND_ROWS = [
  { id: 'r-1', roundName: '2026 4월 프로모션', status: '진행중', periodFrom: '2026-04-21', periodTo: '2026-05-09', periodLabel: '04.21~05.09', itemCount: '9', totalQty: '1,200', totalSales: '₩120,000,000', totalProfit: '₩20,000,000', profitRate: '16.7%', details: [{ id: 'r-1-d1', itemCode: 'DST-660', targetQty: '120', soldQty: '120', costPrice: '₩300,000', basePrice: '₩360,000', promoPrice: '₩300,000', salesAmount: '₩36,000,000', grossProfit: '₩6,000,000', profitRate: '16.7%' }, { id: 'r-1-d2', itemCode: 'DST-670', targetQty: '120', soldQty: '120', costPrice: '₩300,000', basePrice: '₩360,000', promoPrice: '₩300,000', salesAmount: '₩36,000,000', grossProfit: '₩6,000,000', profitRate: '16.7%' }] },
  { id: 'r-2', roundName: '2026 2월 프로모션', status: '종료', periodFrom: '2026-02-01', periodTo: '2026-02-28', periodLabel: '02.01~02.28', itemCount: '7', totalQty: '840', totalSales: '₩82,000,000', totalProfit: '₩13,000,000', profitRate: '15.9%', details: [{ id: 'r-2-d1', itemCode: 'DL-B2213', targetQty: '180', soldQty: '148', costPrice: '₩120,000', basePrice: '₩164,000', promoPrice: '₩142,000', salesAmount: '₩21,016,000', grossProfit: '₩8,010,000', profitRate: '38.1%' }] },
];
export const DEALER_ROWS = [
  { id: 'd-1', dealerName: 'A대리점', totalSales: '₩300,000,000', promoSales: '₩90,000,000', promoShare: '30%', promoProfit: '₩12,000,000', profitRate: '13.3%', details: [{ id: 'd-1-i1', itemCode: 'DST-660', qty: '300', sales: '₩40,000,000', salesShare: '44%', profitRate: '16.7%' }, { id: 'd-1-i2', itemCode: 'DL-B2213', qty: '200', sales: '₩20,000,000', salesShare: '22%', profitRate: '9.1%' }] },
  { id: 'd-2', dealerName: 'B대리점', totalSales: '₩200,000,000', promoSales: '₩20,000,000', promoShare: '10%', promoProfit: '₩2,000,000', profitRate: '10.0%', details: [{ id: 'd-2-i1', itemCode: 'DST-670', qty: '120', sales: '₩18,000,000', salesShare: '36%', profitRate: '12.2%' }, { id: 'd-2-i2', itemCode: 'CL-1300', qty: '88', sales: '₩11,000,000', salesShare: '22%', profitRate: '8.4%' }] },
];
export const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
const contains = (source, keyword) => String(source ?? '').toLowerCase().includes(String(keyword ?? '').toLowerCase());
export function applyColumnFilters(rows, filters) {
  return rows.filter((row) => Object.entries(filters).every(([key, value]) => !value || contains(row[key], value)));
}
