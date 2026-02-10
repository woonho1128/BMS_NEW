/**
 * 손익분석 공용 목록/상세 Mock (profit 목록 = profit/new 등록 건과 동일 소스)
 * - SalesProfitAnalysisPage 목록과 동일한 MOCK_PROFIT_LIST
 * - sales/info/new 에서 선택 시 getProfitDetail(id) 로 손익에 입력된 전체 컬럼 반환
 */

/** 품목 마스터 (손익 계산용, STEP3 테이블 표시용 costPerTon/cost2029 포함) */
export const MOCK_ITEM_MASTER = {
  'SET-01': { name: 'SET 제품 A', type: 'SET', factoryPrice: 150000, cost2026: 78000, cost2027: 80000, cost2029: 84500, costPerTon: 3200000 },
  'SET-02': { name: 'SET 제품 B', type: 'SET', factoryPrice: 98000, cost2026: 52000, cost2027: 53400, cost2029: 56400, costPerTon: 2100000 },
  '단품-X': { name: '부품 X', type: '단품', factoryPrice: 28000, cost2026: 15000, cost2027: 15450, cost2029: 16400, costPerTon: 0 },
  '단품-Y': { name: '부품 Y', type: '단품', factoryPrice: 45000, cost2026: 28000, cost2027: 28840, cost2029: 29700, costPerTon: 0 },
  '단품-Z': { name: '부품 Z', type: '단품', factoryPrice: 32000, cost2026: 17000, cost2027: 17510, cost2029: 18500, costPerTon: 0 },
};

function calcDealerPrice(bidPrice, marginRateDealer) {
  const bid = Number(bidPrice) || 0;
  const rate = Number(marginRateDealer) || 0;
  if (bid <= 0) return 0;
  return Math.round(bid * (1 - rate / 100));
}

function calcSummaryFromItems(items) {
  let totalSales = 0;
  let totalCost = 0;
  (items || []).forEach((row) => {
    const master = row.itemCode ? MOCK_ITEM_MASTER[row.itemCode] : null;
    if (!master) return;
    const qty = Number(row.qty) || 1;
    const dealerPrice = calcDealerPrice(row.bidPrice, row.marginRateDealer);
    const costUnit = master.cost2027 ?? master.cost2026 ?? 0;
    totalSales += qty * dealerPrice;
    totalCost += qty * costUnit;
  });
  const grossProfit = totalSales - totalCost;
  const grossRate = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
  const operatingExpense = totalSales * 0.05;
  const operatingProfit = grossProfit - operatingExpense;
  const operatingRate = totalSales > 0 ? (operatingProfit / totalSales) * 100 : 0;
  return { totalSales, grossProfit, grossRate, operatingProfit, operatingRate };
}

/** 품목별 손익 상세 (STEP3·영업정보 상세 납품 품목 테이블용) */
export function getRowDetail(row, use2027 = true) {
  const master = row.itemCode ? MOCK_ITEM_MASTER[row.itemCode] : null;
  if (!master) return null;
  const qty = Number(row.qty) || 1;
  const bidPrice = Number(row.bidPrice) || 0;
  const marginRateDealer = Number(row.marginRateDealer) || 0;
  const dealerPrice = calcDealerPrice(row.bidPrice, row.marginRateDealer);
  const costUnit = use2027 ? (master.cost2027 ?? master.cost2026) : master.cost2026;
  const sales = qty * dealerPrice;
  const cost = qty * costUnit;
  const grossProfit = sales - cost;
  const grossRate = sales > 0 ? (grossProfit / sales) * 100 : 0;
  const grossProfitPerUnit = qty > 0 ? grossProfit / qty : 0;
  const operatingExpense = sales * 0.05;
  const operatingProfit = grossProfit - operatingExpense;
  const operatingRate = sales > 0 ? (operatingProfit / sales) * 100 : 0;
  const operatingProfitPerUnit = qty > 0 ? operatingProfit / qty : 0;
  const discountRate = master.factoryPrice > 0 ? (1 - dealerPrice / master.factoryPrice) * 100 : 0;
  const cost2029 = master.cost2029 ?? master.cost2027;
  return {
    factoryPrice: master.factoryPrice,
    costPerTon: master.costPerTon ?? 0,
    cost2026: master.cost2026,
    cost2027: master.cost2027 ?? master.cost2026,
    cost2029,
    bidPrice,
    marginRateDealer,
    dealerPrice,
    discountRate,
    grossProfitPerUnit,
    grossRate,
    grossProfit,
    operatingProfitPerUnit,
    operatingRate,
    operatingProfit,
    cost,
    sales,
    remark: row.remark ?? '',
  };
}

/** 손익 목록 20건 (profit 페이지와 동일 – profit/new 에서 등록한 손익) */
export const MOCK_PROFIT_LIST = [
  { id: '1', title: '2025년 1월 영업부 손익분석', status: 'inProgress', orderYear: '2025', deliveryYear: '2025', author: '김영업', createdAt: '2025-01-28' },
  { id: '2', title: '2024년 4분기 손익 실적', status: 'approved', orderYear: '2024', deliveryYear: '2024', author: '이팀장', createdAt: '2025-01-25' },
  { id: '3', title: 'A사 프로젝트 손익 검토', status: 'draft', orderYear: '2025', deliveryYear: '2025', author: '박대리', createdAt: '2025-01-27' },
  { id: '4', title: '2024년 12월 월별 손익', status: 'approved', orderYear: '2024', deliveryYear: '2024', author: '정매니저', createdAt: '2025-01-20' },
  { id: '5', title: 'B사 견적 대비 손익 분석', status: 'rejected', orderYear: '2025', deliveryYear: '2025', author: '최과장', createdAt: '2025-01-22' },
  { id: '6', title: '2025년 1월 상반기 예상 손익', status: 'inProgress', orderYear: '2025', deliveryYear: '2025', author: '김영업', createdAt: '2025-01-29' },
  { id: '7', title: 'C사 수주 건 손익 시뮬레이션', status: 'draft', orderYear: '2025', deliveryYear: '2025', author: '이팀장', createdAt: '2025-01-26' },
  { id: '8', title: '2024년 3분기 실적 정리', status: 'approved', orderYear: '2024', deliveryYear: '2024', author: '박대리', createdAt: '2025-01-18' },
  { id: '9', title: 'D사 견적 손익 검토', status: 'inProgress', orderYear: '2025', deliveryYear: '2025', author: '정매니저', createdAt: '2025-01-24' },
  { id: '10', title: '2024년 11월 월별 손익', status: 'approved', orderYear: '2024', deliveryYear: '2024', author: '최과장', createdAt: '2025-01-15' },
  { id: '11', title: 'E사 신규 프로젝트 제안 손익', status: 'draft', orderYear: '2025', deliveryYear: '2025', author: '김영업', createdAt: '2025-01-23' },
  { id: '12', title: '2024년 10월 손익 실적', status: 'approved', orderYear: '2024', deliveryYear: '2024', author: '이팀장', createdAt: '2025-01-12' },
  { id: '13', title: 'F사 리뉴얼 건 손익 분석', status: 'rejected', orderYear: '2025', deliveryYear: '2025', author: '박대리', createdAt: '2025-01-21' },
  { id: '14', title: '2025년 1분기 예상 손익', status: 'inProgress', orderYear: '2025', deliveryYear: '2025', author: '정매니저', createdAt: '2025-01-19' },
  { id: '15', title: 'G사 연간 계약 손익 검토', status: 'draft', orderYear: '2025', deliveryYear: '2025', author: '최과장', createdAt: '2025-01-17' },
  { id: '16', title: '2024년 9월 월별 손익', status: 'approved', orderYear: '2024', deliveryYear: '2024', author: '김영업', createdAt: '2025-01-10' },
  { id: '17', title: 'H사 투자 검토용 손익', status: 'inProgress', orderYear: '2025', deliveryYear: '2025', author: '이팀장', createdAt: '2025-01-14' },
  { id: '18', title: '2024년 2분기 실적 손익', status: 'approved', orderYear: '2024', deliveryYear: '2024', author: '박대리', createdAt: '2025-01-08' },
  { id: '19', title: 'I사 단가 재협상 손익 시뮬', status: 'draft', orderYear: '2025', deliveryYear: '2025', author: '정매니저', createdAt: '2025-01-06' },
  { id: '20', title: '2024년 1분기 손익 실적', status: 'approved', orderYear: '2024', deliveryYear: '2024', author: '최과장', createdAt: '2025-01-04' },
];

/** id별 STEP1 + 품목 상세 (profit/new 에서 입력한 값) */
const DETAIL_BY_ID = {
  '1': {
    specType: '신규',
    builder: 'A건설',
    siteName: '서울 강남 아파트 신축',
    region: '서울',
    orderType: '정식수주',
    businessType: '주택',
    salesManager: '김영업',
    partnerName: '대리점A',
    integratedProgress: '미진행',
    paidOption: '미적용',
    totalHouseholds: '500',
    appliedHouseholds: '480',
    costIncreaseRate: '2.5',
    specDate: '2025-01-15',
    expectedDeliveryDate: '2025-06-30',
    completionDate: '2026-12-31',
    originSpecNo: 'ORIG-2025-001',
    pdfFileName: null,
    commissionEnabled: true,
    commissionFee: '50000',
    remark: '1차 검토 완료.',
    items: [
      { id: '1', type: 'SET', itemCode: 'SET-01', itemName: 'SET 제품 A', orderType: '정식수주', qty: 10, bidPrice: '135000', marginRateDealer: '11', remark: '', unitItemCodes: [] },
      { id: '2', type: 'SET', itemCode: 'SET-02', itemName: 'SET 제품 B', orderType: '예약수주', qty: 5, bidPrice: '95000', marginRateDealer: '10.5', remark: '', unitItemCodes: [] },
    ],
  },
  '2': {
    specType: '신규',
    builder: 'B건설',
    siteName: '경기 수원 오피스텔',
    region: '경기',
    orderType: '정식수주',
    businessType: '오피스',
    salesManager: '이팀장',
    partnerName: '대리점B',
    integratedProgress: '진행',
    paidOption: '적용',
    totalHouseholds: '120',
    appliedHouseholds: '120',
    costIncreaseRate: '2.7',
    specDate: '2024-12-01',
    expectedDeliveryDate: '2025-04-30',
    completionDate: '2025-11-30',
    originSpecNo: 'ORIG-2024-004',
    pdfFileName: null,
    commissionEnabled: false,
    commissionFee: '',
    remark: '',
    items: [
      { id: '1', type: 'SET', itemCode: 'SET-01', itemName: 'SET 제품 A', orderType: '정식수주', qty: 8, bidPrice: '140000', marginRateDealer: '12', remark: '', unitItemCodes: [] },
    ],
  },
  '4': {
    specType: '변경',
    builder: 'D건설',
    siteName: '부산 해운대 단지',
    region: '부산',
    orderType: '정식수주',
    businessType: '주택',
    salesManager: '정매니저',
    partnerName: '대리점D',
    integratedProgress: '미진행',
    paidOption: '미적용',
    totalHouseholds: '300',
    appliedHouseholds: '300',
    costIncreaseRate: '3',
    specDate: '2024-12-10',
    expectedDeliveryDate: '2025-05-15',
    completionDate: '2026-06-30',
    originSpecNo: '',
    pdfFileName: null,
    commissionEnabled: true,
    commissionFee: '30000',
    remark: '해운대 현장 스펙 변경분 반영.',
    items: [
      { id: '1', type: 'SET', itemCode: 'SET-02', itemName: 'SET 제품 B', orderType: '정식수주', qty: 15, bidPrice: '98000', marginRateDealer: '10', remark: '', unitItemCodes: [] },
    ],
  },
  '8': {
    specType: '신규',
    builder: 'L건설',
    siteName: '부산 사상구 상가',
    region: '부산',
    orderType: '정식수주',
    businessType: '상가',
    salesManager: '박대리',
    partnerName: '대리점D',
    integratedProgress: '미진행',
    paidOption: '적용',
    totalHouseholds: '80',
    appliedHouseholds: '80',
    costIncreaseRate: '2.5',
    specDate: '2024-09-01',
    expectedDeliveryDate: '2025-03-31',
    completionDate: '2025-09-30',
    originSpecNo: 'ORIG-2024-003',
    pdfFileName: null,
    commissionEnabled: false,
    commissionFee: '',
    remark: '3분기 실적 반영.',
    items: [
      { id: '1', type: 'SET', itemCode: 'SET-01', itemName: 'SET 제품 A', orderType: '정식수주', qty: 12, bidPrice: '130000', marginRateDealer: '11.5', remark: '', unitItemCodes: [] },
      { id: '2', type: 'SET', itemCode: 'SET-02', itemName: 'SET 제품 B', orderType: '예약수주', qty: 7, bidPrice: '96000', marginRateDealer: '10.2', remark: '', unitItemCodes: [] },
    ],
  },
};

const DEFAULT_DETAIL = {
  specType: '신규',
  builder: '(주)테스트건설',
  siteName: 'A사 현장',
  region: '경기',
  orderType: '정식수주',
  businessType: '주택',
  salesManager: '김영업',
  partnerName: '(주)테스트',
  integratedProgress: '미진행',
  paidOption: '미적용',
  totalHouseholds: '',
  appliedHouseholds: '',
  costIncreaseRate: '',
  specDate: '',
  expectedDeliveryDate: '',
  completionDate: '',
  originSpecNo: '',
  pdfFileName: null,
  commissionEnabled: false,
  commissionFee: '',
  remark: '',
  items: [
    { id: '1', type: 'SET', itemCode: 'SET-01', itemName: 'SET 제품 A', orderType: '정식수주', qty: 10, bidPrice: '135000', marginRateDealer: '11', remark: '', unitItemCodes: [] },
  ],
};

/**
 * 손익 id에 해당하는 상세 반환 (목록 행 + STEP1 전체 + 품목 + 계산된 요약)
 * sales/info/new 에서 선택 시 이걸 쓰면 손익에 입력된 컬럼이 다 나온다.
 */
export function getProfitDetail(id) {
  const row = MOCK_PROFIT_LIST.find((r) => r.id === id);
  if (!row) return null;
  const detail = DETAIL_BY_ID[id] || { ...DEFAULT_DETAIL, siteName: row.title || DEFAULT_DETAIL.siteName };
  const summary = calcSummaryFromItems(detail.items);
  const specNo = `SW-SPEC-${row.orderYear}-${String(id).padStart(3, '0')}`;
  return {
    ...row,
    specNo,
    specType: detail.specType,
    builder: detail.builder,
    siteName: detail.siteName,
    region: detail.region,
    orderType: detail.orderType,
    businessType: detail.businessType,
    salesManager: detail.salesManager,
    partnerName: detail.partnerName,
    integratedProgress: detail.integratedProgress,
    paidOption: detail.paidOption,
    totalHouseholds: detail.totalHouseholds,
    appliedHouseholds: detail.appliedHouseholds,
    costIncreaseRate: detail.costIncreaseRate,
    specDate: detail.specDate,
    expectedDeliveryDate: detail.expectedDeliveryDate,
    completionDate: detail.completionDate,
    originSpecNo: detail.originSpecNo,
    pdfFileName: detail.pdfFileName,
    commissionEnabled: detail.commissionEnabled,
    commissionFee: detail.commissionFee,
    remark: detail.remark,
    items: detail.items || [],
    grossProfitRate: summary.grossRate,
    operatingProfitRate: summary.operatingRate,
    totalSales: summary.totalSales,
    grossProfit: summary.grossProfit,
    operatingProfit: summary.operatingProfit,
  };
}
