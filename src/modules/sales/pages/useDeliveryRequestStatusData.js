import { useCallback, useMemo, useState } from 'react';

export const STATUS_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'PICKING', label: 'PICKING' },
  { value: 'APPROVAL', label: '상신중' },
  { value: 'REQUESTED', label: '출고대기' },
  { value: 'REJECTED', label: '결재반려' },
  { value: 'DONE', label: '출고완료' },
];

export const STATUS_COLORS = {
  PICKING: '#e85b93',
  APPROVAL: '#7a7a7a',
  REQUESTED: '#27b4f1',
  REJECTED: '#18b7a3',
  DONE: '#6f7ccf',
};

export const SHIPPING_TYPE_OPTIONS = [
  { value: '', label: '전체' },
  { value: '건설사직납', label: '건설사직납' },
  { value: '도소매출고', label: '도소매출고' },
  { value: '납품출고', label: '납품출고' },
  { value: '거래처납', label: '거래처납' },
  { value: '직납', label: '직납' },
];

export const FACTORY_OPTIONS = [
  { value: '', label: '전체' },
  { value: '안양SW공장', label: '안양SW공장' },
  { value: '창원SW공장', label: '창원SW공장' },
  { value: '안산수전공장', label: '안산수전공장' },
  { value: '강원타일공장', label: '강원타일공장' },
];

export const SALES_GROUP_OPTIONS = [
  { value: '', label: '전체' },
  { value: '김주오', label: '김주오' },
  { value: '박준혁', label: '박준혁' },
  { value: '이명호', label: '이명호' },
  { value: '김진원', label: '김진원' },
];

const INITIAL_FILTER = {
  dateFrom: '2026-03-01',
  dateTo: '2026-03-26',
  shippingType: '',
  status: 'ALL',
  customerCode: '',
  customerName: '',
  factory: '',
  salesGroup: '',
};

const MOCK_ROWS = [
  {
    key: '1',
    deliveryNo: 'DN202603010004',
    status: 'APPROVAL',
    customerCode: '200347',
    customerName: '디엘이앤씨 주식회사(구 대림산업)',
    factory: '안양SW공장',
    requestDate: '2026-03-01',
    amount: 390000,
    vat: 39000,
    salesGroup: '김주오',
    transportMethod: '납품출고',
    shippingType: '건설사직납',
    destination: '경남 사천시 동금동 151-5번지',
    inputUser: '김주오',
    modifiedBy: '김주오',
    modifiedAt: '2026-03-24',
    approvedBy: '-',
    signedBy: '-',
  },
  {
    key: '2',
    deliveryNo: 'DN202603010005',
    status: 'PICKING',
    customerCode: '200347',
    customerName: '디엘이앤씨 주식회사(구 대림산업)',
    factory: '안산수전공장',
    requestDate: '2026-03-03',
    amount: 66170,
    vat: 6617,
    salesGroup: '김주오',
    transportMethod: '납품출고',
    shippingType: '건설사직납',
    destination: '경남 사천시 동금동 151-5번지',
    inputUser: '김주오',
    modifiedBy: '김주오',
    modifiedAt: '2026-03-24',
    approvedBy: '-',
    signedBy: '-',
  },
  {
    key: '3',
    deliveryNo: 'DN202603010006',
    status: 'REQUESTED',
    customerCode: '308359',
    customerName: '유아름다운욕실나라',
    factory: '강원타일공장',
    requestDate: '2026-03-07',
    amount: 0,
    vat: 0,
    salesGroup: '이명호',
    transportMethod: '도소매출고',
    shippingType: '거래처납',
    destination: '세종특별자치시 새롬플라자',
    inputUser: '이명호',
    modifiedBy: '이명호',
    modifiedAt: '2026-02-27',
    approvedBy: '-',
    signedBy: '-',
  },
  {
    key: '4',
    deliveryNo: 'DN202603010011',
    status: 'REJECTED',
    customerCode: '113605',
    customerName: '여여세라믹(주)',
    factory: '강원타일공장',
    requestDate: '2026-03-16',
    amount: 2430000,
    vat: 243000,
    salesGroup: '김진원',
    transportMethod: '도소매출고',
    shippingType: '직납',
    destination: '김해',
    inputUser: '김진원',
    modifiedBy: '김진원',
    modifiedAt: '2026-03-03',
    approvedBy: '박준혁',
    signedBy: '-',
  },
  {
    key: '5',
    deliveryNo: 'DN202603010016',
    status: 'DONE',
    customerCode: '200347',
    customerName: '디엘이앤씨 주식회사(구 대림산업)',
    factory: '안산수전공장',
    requestDate: '2026-03-24',
    amount: 67186760,
    vat: 6718676,
    salesGroup: '박준혁',
    transportMethod: '납품출고',
    shippingType: '건설사직납',
    destination: '인천광역시 서구 원당동 1026-1',
    inputUser: '박준혁',
    modifiedBy: '박준혁',
    modifiedAt: '2026-03-04',
    approvedBy: '김주오',
    signedBy: '김주오',
  },
];

const DETAIL_ROWS_BY_DELIVERY = {
  DN202603010004: [
    { key: '1', no: 1, refName: '안산수전공장', itemCode: 'SAH-G4441ZZC', itemName: '발코니수전(냉수)', spec: '이지쿡/2구', qty: 310, unitPrice: 15000, amount: 4650000, vat: 465000, vatName: '일반세금계산서', note: '' },
    { key: '2', no: 2, refName: '안산수전공장', itemCode: 'SAH-G4443ZZH', itemName: '발코니수전(온수)', spec: '이지쿡/1구', qty: 310, unitPrice: 8000, amount: 2480000, vat: 248000, vatName: '일반세금계산서', note: '' },
  ],
  DN202603010005: [
    { key: '1', no: 1, refName: '창원SW공장', itemCode: 'FAH-K1417CR1NDW', itemName: '주방수전', spec: 'DL&CO용', qty: 72, unitPrice: 45000, amount: 3240000, vat: 324000, vatName: '일반세금계산서', note: '현장 납품' },
  ],
};

function makeDateList(from, to) {
  const [fromY, fromM, fromD] = String(from).split('-').map(Number);
  const [toY, toM, toD] = String(to).split('-').map(Number);
  const start = new Date(fromY, (fromM || 1) - 1, fromD || 1);
  const end = new Date(toY, (toM || 1) - 1, toD || 1);
  const out = [];
  const cursor = new Date(start);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return out;
  }

  while (cursor <= end) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, '0');
    const d = String(cursor.getDate()).padStart(2, '0');
    out.push(`${y}-${m}-${d}`);
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

export function useDeliveryRequestStatusData() {
  const [selectedDeliveryNo, setSelectedDeliveryNo] = useState(null);
  const [filterValue, setFilterValue] = useState(INITIAL_FILTER);

  const onChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const onReset = useCallback(() => {
    setFilterValue(INITIAL_FILTER);
  }, []);

  const fields = useMemo(
    () => [
      { id: 'dateRange', label: '출고예정일', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 },
      { id: 'shippingType', label: '출하형태', type: 'select', options: SHIPPING_TYPE_OPTIONS, row: 0, width: 130 },
      { id: 'factory', label: '공장', type: 'select', options: FACTORY_OPTIONS, row: 0, width: 140 },
      { id: 'salesGroup', label: '영업그룹', type: 'select', options: SALES_GROUP_OPTIONS, row: 0, width: 120 },
      { id: 'customerCode', label: '거래처코드', type: 'text', row: 1, width: 120 },
      { id: 'customerName', label: '거래처', type: 'text', row: 1, width: 220 },
      { id: 'status', label: '출하상태', type: 'radio', options: STATUS_OPTIONS, row: 1 },
    ],
    []
  );

  const filteredRows = useMemo(() => {
    return MOCK_ROWS.filter((row) => {
      if (filterValue.dateFrom && row.requestDate < filterValue.dateFrom) return false;
      if (filterValue.dateTo && row.requestDate > filterValue.dateTo) return false;
      if (filterValue.shippingType && row.shippingType !== filterValue.shippingType) return false;
      if (filterValue.status !== 'ALL' && row.status !== filterValue.status) return false;
      if (filterValue.customerCode && !row.customerCode.includes(filterValue.customerCode)) return false;
      if (filterValue.customerName && !row.customerName.includes(filterValue.customerName)) return false;
      if (filterValue.factory && row.factory !== filterValue.factory) return false;
      if (filterValue.salesGroup && row.salesGroup !== filterValue.salesGroup) return false;
      return true;
    });
  }, [filterValue]);

  const chartBars = useMemo(() => {
    const days = makeDateList(filterValue.dateFrom, filterValue.dateTo);
    return days.map((day) => {
      const rows = filteredRows.filter((r) => r.requestDate === day);
      const total = rows.length || 1;
      const values = {
        PICKING: rows.filter((r) => r.status === 'PICKING').length,
        APPROVAL: rows.filter((r) => r.status === 'APPROVAL').length,
        REQUESTED: rows.filter((r) => r.status === 'REQUESTED').length,
        REJECTED: rows.filter((r) => r.status === 'REJECTED').length,
        DONE: rows.filter((r) => r.status === 'DONE').length,
      };
      return {
        day,
        segments: Object.entries(values).map(([status, count]) => ({
          status,
          percent: (count / total) * 100,
        })),
      };
    });
  }, [filterValue.dateFrom, filterValue.dateTo, filteredRows]);

  const detailRows = selectedDeliveryNo ? DETAIL_ROWS_BY_DELIVERY[selectedDeliveryNo] || [] : [];

  return {
    selectedDeliveryNo,
    setSelectedDeliveryNo,
    filterValue,
    onChange,
    onReset,
    fields,
    filteredRows,
    chartBars,
    detailRows,
  };
}
