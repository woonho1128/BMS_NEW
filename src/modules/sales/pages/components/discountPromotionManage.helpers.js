export const createRow = (overrides = {}) => ({
  id: `promo-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  division: '장기재고',
  itemType: '',
  setCode: '',
  componentCode: '',
  erpCode: '',
  stockQty: 0,
  stockAmount: 0,
  reserveAmount: 0,
  estimatedSales: 0,
  salePrice: 0,
  costPrice: 0,
  margin: 0,
  targetQty: 0,
  promoPrice: 0,
  discountRate: 0,
  promoSales: 0,
  promoMargin: 0,
  promoMarginRate: 0,
  salesContribution: 0,
  promoContribution: 0,
  contributionGap: 0,
  remark: '',
  rowType: 'normal',
  ...overrides,
});

const BASE_PROMOTION_ROWS = [
  {
    division: '장기재고',
    itemType: '일체형(국산)',
    setCode: 'DST-650',
    componentCode: 'CC-650',
    erpCode: 'CCS650LZWHW',
    stockQty: 349,
    stockAmount: 112,
    reserveAmount: 0,
    estimatedSales: 0,
    salePrice: 320717,
    costPrice: 476540,
    margin: 33,
    targetQty: 349,
    promoPrice: 330000,
    discountRate: 31,
    promoSales: 166,
    promoMargin: 115,
    promoMarginRate: 3,
    salesContribution: 54,
    promoContribution: 3,
    contributionGap: -51,
    remark: '일체형 하부도기 포함, 세트출고',
  },
  {
    division: '일반',
    itemType: '세면기(국산)',
    setCode: 'CL-1200',
    componentCode: 'DST-650D',
    erpCode: 'CLA1200ZWHW',
    stockQty: 30,
    stockAmount: 3,
    reserveAmount: 0,
    estimatedSales: 0,
    salePrice: 85435,
    costPrice: 109990,
    margin: 22,
    targetQty: 30,
    promoPrice: 40000,
    discountRate: 64,
    promoSales: 3,
    promoMargin: 1,
    promoMarginRate: -114,
    salesContribution: 1,
    promoContribution: -1,
    contributionGap: -2,
    remark: '장기재고 소진',
  },
  {
    division: '일반',
    itemType: '양변기(OEM)',
    setCode: 'CL-1300',
    componentCode: 'TFT-650L',
    erpCode: 'CLA1300ZWHW',
    stockQty: 313,
    stockAmount: 40,
    reserveAmount: 0,
    estimatedSales: 0,
    salePrice: 128086,
    costPrice: 192490,
    margin: 33,
    targetQty: 313,
    promoPrice: 40000,
    discountRate: 79,
    promoSales: 60,
    promoMargin: 13,
    promoMarginRate: -220,
    salesContribution: 20,
    promoContribution: -28,
    contributionGap: -48,
    remark: '장기재고 소진',
  },
];

export const DEFAULT_PROMOTION_ROWS = Array.from({ length: 40 }, (_, index) => {
  const base = BASE_PROMOTION_ROWS[index % BASE_PROMOTION_ROWS.length];
  const suffix = String(index + 1).padStart(2, '0');
  return createRow({
    ...base,
    setCode: `${base.setCode}-${suffix}`,
    componentCode: `${base.componentCode}-${suffix}`,
    erpCode: `${base.erpCode}-${suffix}`,
  });
});

export const DEFAULT_PROMOTION_LABEL = '2026년 1월~2월 프로모션';

export const metricFields = [
  { key: 'stockQty', colClass: 'colStock' },
  { key: 'stockAmount', colClass: 'colStock' },
  { key: 'reserveAmount', colClass: 'colStock' },
  { key: 'estimatedSales', colClass: 'colStock' },
  { key: 'salePrice', colClass: 'colNormal' },
  { key: 'costPrice', colClass: 'colNormal' },
  { key: 'margin', colClass: 'colNormal' },
  { key: 'targetQty', colClass: 'colPromo' },
  { key: 'promoPrice', colClass: 'colPromo' },
  { key: 'discountRate', colClass: 'colPromo' },
  { key: 'promoSales', colClass: 'colPromo' },
  { key: 'promoMargin', colClass: 'colPromo' },
  { key: 'promoMarginRate', colClass: 'colPromo' },
  { key: 'salesContribution', colClass: 'colProfit' },
  { key: 'promoContribution', colClass: 'colProfit' },
  { key: 'contributionGap', colClass: 'colProfit' },
];

export const formatNumber = (value) => {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return '0';
  return num.toLocaleString();
};

export function cloneRows(rows = []) {
  return rows.map((row) => ({ ...row }));
}
