/**
 * 출고등록 Mock (출하번호·기본정보·품목, API 연동 없음)
 */

/** 출하번호 목록 (Select 옵션) */
export const MOCK_SHIPMENT_OPTIONS = [
  { value: '', label: '출하번호 선택' },
  { value: 'SH-2025-001', label: 'SH-2025-001' },
  { value: 'SH-2025-002', label: 'SH-2025-002' },
  { value: 'SH-2025-003', label: 'SH-2025-003' },
  { value: 'SH-2025-004', label: 'SH-2025-004' },
  { value: 'SH-2025-005', label: 'SH-2025-005' },
];

/** 출하번호별 출고 기본정보 (ReadOnly) */
const BASIC_INFO_BY_SHIPMENT = {
  'SH-2025-001': {
    customer: '(주)테스트건설',
    deliveryTo: '서울 강남 A현장',
    expectedDate: '2025-02-15',
    outboundType: '정상출고',
    paymentMethod: '월말정산',
    supplyAmount: 12500000,
    vat: 1250000,
    total: 13750000,
  },
  'SH-2025-002': {
    customer: 'B건설(주)',
    deliveryTo: '경기 수원 B현장',
    expectedDate: '2025-02-18',
    outboundType: '정상출고',
    paymentMethod: '어음',
    supplyAmount: 8300000,
    vat: 830000,
    total: 9130000,
  },
  'SH-2025-003': {
    customer: 'C산업',
    deliveryTo: '인천 송도 C현장',
    expectedDate: '2025-02-20',
    outboundType: '교환출고',
    paymentMethod: '현금',
    supplyAmount: 4200000,
    vat: 420000,
    total: 4620000,
  },
  'SH-2025-004': {
    customer: '(주)대리점D',
    deliveryTo: '부산 해운대 D창고',
    expectedDate: '2025-02-22',
    outboundType: '정상출고',
    paymentMethod: '카드',
    supplyAmount: 15600000,
    vat: 1560000,
    total: 17160000,
  },
  'SH-2025-005': {
    customer: 'E주택',
    deliveryTo: '대전 유성 E현장',
    expectedDate: '2025-02-25',
    outboundType: '정상출고',
    paymentMethod: '월말정산',
    supplyAmount: 9800000,
    vat: 980000,
    total: 10780000,
  },
};

/** 출하번호별 기본 품목 (선택 시 품목 영역에 채울 수 있는 데이터) */
const DEFAULT_ITEMS_BY_SHIPMENT = {
  'SH-2025-001': [
    { id: 'i1', warehouse: 'WH01', itemCode: 'SET-01', itemName: 'SET 제품 A', spec: '300×400', stock: 120, unit: 'SET', outQty: 10, unitPrice: 135000, discountRate: 5, vatIncluded: 'Y', vatType: 'TAX' },
    { id: 'i2', warehouse: 'WH01', itemCode: 'SET-02', itemName: 'SET 제품 B', spec: '250×350', stock: 80, unit: 'SET', outQty: 5, unitPrice: 95000, discountRate: 3, vatIncluded: 'Y', vatType: 'TAX' },
  ],
  'SH-2025-002': [
    { id: 'i1', warehouse: 'WH01', itemCode: 'SET-01', itemName: 'SET 제품 A', spec: '300×400', stock: 120, unit: 'SET', outQty: 8, unitPrice: 140000, discountRate: 0, vatIncluded: 'Y', vatType: 'TAX' },
  ],
  'SH-2025-003': [
    { id: 'i1', warehouse: 'WH02', itemCode: '단품-X', itemName: '부품 X', spec: '-', stock: 500, unit: 'EA', outQty: 100, unitPrice: 28000, discountRate: 2, vatIncluded: 'Y', vatType: 'TAX' },
  ],
  'SH-2025-004': [],
  'SH-2025-005': [
    { id: 'i1', warehouse: 'WH01', itemCode: 'SET-02', itemName: 'SET 제품 B', spec: '250×350', stock: 80, unit: 'SET', outQty: 12, unitPrice: 98000, discountRate: 4, vatIncluded: 'Y', vatType: 'TAX' },
  ],
};

/** 창고 목록 (품목 추가 시 선택) */
export const MOCK_WAREHOUSE_OPTIONS = [
  { value: 'WH01', label: '본사창고' },
  { value: 'WH02', label: '경기물류센터' },
  { value: 'WH03', label: '부산창고' },
  { value: 'WH04', label: '대구가동창고' },
];

/** 단위 목록 */
export const MOCK_UNIT_OPTIONS = [
  { value: 'EA', label: 'EA' },
  { value: 'SET', label: 'SET' },
  { value: 'BOX', label: 'BOX' },
  { value: 'M', label: 'M' },
  { value: 'KG', label: 'KG' },
];

/** 부가세포함구분 */
export const MOCK_VAT_INCLUDED_OPTIONS = [
  { value: 'Y', label: '포함' },
  { value: 'N', label: '미포함' },
];

/** 부가세유형 */
export const MOCK_VAT_TYPE_OPTIONS = [
  { value: 'TAX', label: '과세' },
  { value: 'ZERO', label: '영세' },
  { value: 'FREE', label: '면세' },
];

/** 품목 추가 시 선택 가능한 품목 마스터 */
export const MOCK_ITEM_OPTIONS = [
  { itemCode: 'SET-01', itemName: 'SET 제품 A', spec: '300×400', unitPrice: 135000 },
  { itemCode: 'SET-02', itemName: 'SET 제품 B', spec: '250×350', unitPrice: 95000 },
  { itemCode: '단품-X', itemName: '부품 X', spec: '-', unitPrice: 28000 },
  { itemCode: '단품-Y', itemName: '부품 Y', spec: '-', unitPrice: 45000 },
  { itemCode: '단품-Z', itemName: '부품 Z', spec: '-', unitPrice: 32000 },
];

/** 품번별 현재고 (Mock) */
const STOCK_BY_ITEM = {
  'SET-01': 120,
  'SET-02': 80,
  '단품-X': 500,
  '단품-Y': 320,
  '단품-Z': 180,
};

/**
 * 출하번호로 출고 기본정보 조회
 * @param {string} shipmentId
 * @returns {object | null}
 */
export function getBasicInfoByShipmentId(shipmentId) {
  if (!shipmentId) return null;
  return BASIC_INFO_BY_SHIPMENT[shipmentId] ?? null;
}

/**
 * 출하번호로 기본 품목 목록 반환 (id 부여된 복사본)
 * @param {string} shipmentId
 * @returns {Array<{ id: string; itemCode: string; itemName: string; spec: string; stock: number; outQty: number; unitPrice: number; discountRate: number }>}
 */
export function getDefaultItemsByShipmentId(shipmentId) {
  const list = DEFAULT_ITEMS_BY_SHIPMENT[shipmentId];
  if (!list || list.length === 0) return [];
  return list.map((row, idx) => ({
    ...row,
    id: row.id || `item-${shipmentId}-${idx}-${Date.now()}`,
  }));
}

/**
 * 품번으로 현재고 조회
 * @param {string} itemCode
 * @returns {number}
 */
export function getStockByItemCode(itemCode) {
  return STOCK_BY_ITEM[itemCode] ?? 0;
}

/**
 * 품목 마스터에서 품번으로 한 건 조회
 * @param {string} itemCode
 */
export function getItemOptionByCode(itemCode) {
  return MOCK_ITEM_OPTIONS.find((o) => o.itemCode === itemCode) ?? null;
}
