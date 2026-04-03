import React, { useMemo, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Table } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import styles from './DeliveryRequestStatusPage.module.css';

const STATUS_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'PICKING', label: 'PICKING' },
  { value: 'APPROVAL', label: '상신중' },
  { value: 'REQUESTED', label: '출고대기' },
  { value: 'REJECTED', label: '결재반려' },
  { value: 'DONE', label: '출고완료' },
];

const STATUS_COLORS = {
  PICKING: '#e85b93',
  APPROVAL: '#7a7a7a',
  REQUESTED: '#27b4f1',
  REJECTED: '#18b7a3',
  DONE: '#6f7ccf',
};

const SHIPPING_TYPE_OPTIONS = [
  { value: '', label: '전체' },
  { value: '건설사직납', label: '건설사직납' },
  { value: '도소매출고', label: '도소매출고' },
  { value: '납품출고', label: '납품출고' },
];

const FACTORY_OPTIONS = [
  { value: '', label: '전체' },
  { value: '창원SW공장', label: '창원SW공장' },
  { value: '안산수전공장', label: '안산수전공장' },
  { value: '강원타일공장', label: '강원타일공장' },
];

const SALES_GROUP_OPTIONS = [
  { value: '', label: '전체' },
  { value: '김주오', label: '김주오' },
  { value: '박준혁', label: '박준혁' },
  { value: '이명호', label: '이명호' },
  { value: '김진원', label: '김진원' },
];

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

function fmt(n) {
  return Number(n || 0).toLocaleString('ko-KR');
}

function makeDateList(from, to) {
  const start = new Date(from);
  const end = new Date(to);
  const out = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    out.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

export function DeliveryRequestStatusPage() {
  const { pathname } = useLocation();
  const [selectedDeliveryNo, setSelectedDeliveryNo] = useState(null);
  const [filterValue, setFilterValue] = useState({
    dateFrom: '2026-03-01',
    dateTo: '2026-03-26',
    shippingType: '',
    status: 'ALL',
    customerCode: '',
    customerName: '',
    factory: '',
    salesGroup: '',
  });

  const onChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const onReset = useCallback(() => {
    setFilterValue({
      dateFrom: '2026-03-01',
      dateTo: '2026-03-26',
      shippingType: '',
      status: 'ALL',
      customerCode: '',
      customerName: '',
      factory: '',
      salesGroup: '',
    });
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

  const columns = [
    {
      title: '출고번호',
      dataIndex: 'deliveryNo',
      width: 150,
      fixed: 'left',
      render: (value) => (
        <button type="button" className={styles.deliveryNoButton} onClick={() => setSelectedDeliveryNo(value)}>
          {value}
        </button>
      ),
    },
    { title: '진행상태', dataIndex: 'status', width: 90 },
    { title: '거래처코드', dataIndex: 'customerCode', width: 90 },
    { title: '거래처명', dataIndex: 'customerName', width: 220 },
    { title: '공장명', dataIndex: 'factory', width: 130 },
    { title: '출고예정', dataIndex: 'requestDate', width: 110 },
    { title: '금액', dataIndex: 'amount', width: 110, align: 'right', render: fmt },
    { title: '부가세', dataIndex: 'vat', width: 90, align: 'right', render: fmt },
    { title: '영업그룹', dataIndex: 'salesGroup', width: 90 },
    { title: '운송방법', dataIndex: 'transportMethod', width: 110 },
    { title: '출하형태', dataIndex: 'shippingType', width: 120 },
    { title: '도착지', dataIndex: 'destination', width: 260 },
    { title: '입력', dataIndex: 'inputUser', width: 80 },
    { title: '수정', dataIndex: 'modifiedBy', width: 80 },
    { title: '수정시간', dataIndex: 'modifiedAt', width: 110 },
    { title: '승인', dataIndex: 'approvedBy', width: 80 },
    { title: '승인서명', dataIndex: 'signedBy', width: 90 },
  ];

  const detailColumns = [
    { title: 'No.', dataIndex: 'no', width: 60, align: 'center' },
    { title: '참고명', dataIndex: 'refName', width: 120 },
    { title: '품목코드', dataIndex: 'itemCode', width: 140 },
    { title: '품목명', dataIndex: 'itemName', width: 160 },
    { title: '스펙', dataIndex: 'spec', width: 220 },
    { title: '수량', dataIndex: 'qty', width: 80, align: 'right', render: fmt },
    { title: '단가', dataIndex: 'unitPrice', width: 90, align: 'right', render: fmt },
    { title: '금액', dataIndex: 'amount', width: 110, align: 'right', render: fmt },
    { title: '부가세', dataIndex: 'vat', width: 90, align: 'right', render: fmt },
    { title: '부가세명', dataIndex: 'vatName', width: 120 },
    { title: '비고', dataIndex: 'note', width: 200 },
  ];

  const detailRows = selectedDeliveryNo ? DETAIL_ROWS_BY_DELIVERY[selectedDeliveryNo] || [] : [];

  return (
    <PageShell path={pathname} className={styles.shellWide}>
      <div className={styles.page}>
        <ListFilter
          className={styles.toolbar}
          fields={fields}
          value={filterValue}
          onChange={onChange}
          onReset={onReset}
          onSearch={() => {}}
          searchLabel="조회"
        />

        <div className={styles.chartCard}>
          <p className={styles.chartGuide}>아래 그래프는 출고예정일/출하상태 조건의 비율을 보여줍니다.</p>
          <div className={styles.chartWrap}>
            <div className={styles.chartBars}>
              {chartBars.map((bar) => (
                <div key={bar.day} className={styles.barCol}>
                  <div className={styles.barStack}>
                    {bar.segments
                      .filter((s) => s.percent > 0)
                      .map((s) => (
                        <div
                          key={s.status}
                          className={styles.barSeg}
                          style={{ height: `${s.percent}%`, background: STATUS_COLORS[s.status] }}
                          title={`${s.status} ${s.percent.toFixed(0)}%`}
                        />
                      ))}
                  </div>
                  <span className={styles.barLabel}>{bar.day.slice(5)}</span>
                </div>
              ))}
            </div>
            <div className={styles.legend}>
              {Object.entries(STATUS_COLORS).map(([key, color]) => (
                <div key={key} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: color }} />
                  <span>{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableTop}>
            <span className={styles.tableTitle}>출고 요청 목록</span>
            <span className={styles.tableCount}>총 {filteredRows.length}건</span>
          </div>
          <Table
            columns={columns}
            dataSource={filteredRows}
            size="small"
            pagination={{ pageSize: 15 }}
            scroll={{ x: 2500, y: 390 }}
            className={styles.statusTable}
            rowKey="key"
          />
        </div>

        <Modal
          title={selectedDeliveryNo ? `출고번호 상세 - ${selectedDeliveryNo}` : '출고번호 상세'}
          open={Boolean(selectedDeliveryNo)}
          onCancel={() => setSelectedDeliveryNo(null)}
          footer={null}
          width="92vw"
          centered
          style={{ maxWidth: 1500 }}
          className={styles.detailModal}
        >
          <Table
            columns={detailColumns}
            dataSource={detailRows}
            size="small"
            pagination={false}
            scroll={{ x: 1300, y: 360 }}
            className={styles.detailTable}
            locale={{ emptyText: '상세 데이터가 없습니다.' }}
            rowKey="key"
          />
        </Modal>
      </div>
    </PageShell>
  );
}

export default DeliveryRequestStatusPage;
