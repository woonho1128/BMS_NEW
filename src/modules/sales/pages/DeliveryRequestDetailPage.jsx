import React, { useMemo, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Table } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { formatNumber } from '../../../shared/utils/formatters';
import styles from './DeliveryRequestDetailPage.module.css';

const SHIP_RESULT_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: '출고', label: '출고' },
  { value: '미출', label: '미출' },
];

const ORG_OPTIONS = [
  { value: '', label: '전체' },
  { value: '리테일팀', label: '리테일팀' },
  { value: '프로젝트팀', label: '프로젝트팀' },
];

const FACTORY_OPTIONS = [
  { value: '', label: '전체' },
  { value: '창원타일공장', label: '창원타일공장' },
  { value: '창원SW공장', label: '창원SW공장' },
  { value: '안산수전공장', label: '안산수전공장' },
];

const ROWS = [
  {
    key: '1',
    shipmentNo: 'DN202603310003',
    shippingType: '도소매출고',
    requestDate: '2026-03-17',
    arrivalDate: '2026-03-17',
    factory: '창원타일공장',
    customerCode: '113113',
    customerName: '주식회사 한국세라믹',
    shipResult: '출고',
    destination: '김포',
    destinationPhone: '010-6329-3357',
    destinationManager: '박성진 차장',
    carInfo: '거래차량',
    transportFee: '당사부담',
    qty: 920,
    vat: 244000,
    amount: 2440000,
  },
  {
    key: '2',
    shipmentNo: 'DN202603300028',
    shippingType: '(무상)모델하우스 샘플출고',
    requestDate: '2026-03-26',
    arrivalDate: '1900-01-01',
    factory: '안산수전공장',
    customerCode: '051794',
    customerName: '대림바스(주) 서울사무소',
    shipResult: '미출',
    destination: '서울시 영등포구 버드나루로 84, 제일빌딩 5F',
    destinationPhone: '010-6329-3357',
    destinationManager: '박성진 차장',
    carInfo: '택배(당사부담)',
    transportFee: '당사부담',
    qty: 120,
    vat: 120000,
    amount: 1200000,
  },
  {
    key: '3',
    shipmentNo: 'DN202603300027',
    shippingType: '(무상)모델하우스 샘플출고',
    requestDate: '2026-03-26',
    arrivalDate: '2026-03-26',
    factory: '제천SW공장',
    customerCode: '051794',
    customerName: '대림바스(주) 서울사무소',
    shipResult: '출고',
    destination: '서울시 영등포구 버드나루로 84',
    destinationPhone: '010-6329-3357',
    destinationManager: '박성진 차장',
    carInfo: '파렛트박배(당사부담)',
    transportFee: '당사부담',
    qty: 340,
    vat: 340000,
    amount: 3400000,
  },
  {
    key: '4',
    shipmentNo: 'DN202603300021',
    shippingType: '납품출고',
    requestDate: '2026-03-25',
    arrivalDate: '2026-03-25',
    factory: '안산수전공장',
    customerCode: '199220',
    customerName: '디엔건설 주식회사(구 대림건설)',
    shipResult: '출고',
    destination: '인천광역시 서구 마전동 280-5',
    destinationPhone: '010-7423-2646',
    destinationManager: '김재현 대리님(검단에코)',
    carInfo: '운수차량',
    transportFee: '당사부담',
    qty: 650,
    vat: 520000,
    amount: 5200000,
  },
];

const DETAIL_BY_NO = {
  DN202603310003: [
    { key: '1', no: 1, itemCode: 'SAH-G4441ZZC', itemName: '발코니수전(냉수)', spec: '이지쿡/2구', qty: 310, unitPrice: 15000, amount: 4650000, vat: 465000, note: '' },
    { key: '2', no: 2, itemCode: 'SAH-G4443ZZH', itemName: '발코니수전(온수)', spec: '이지쿡/1구', qty: 310, unitPrice: 8000, amount: 2480000, vat: 248000, note: '' },
  ],
  DN202603300028: [
    { key: '1', no: 1, itemCode: 'FAH-K1417CR1NDW', itemName: '주방수전', spec: 'DL&CO용', qty: 72, unitPrice: 45000, amount: 3240000, vat: 324000, note: '모델하우스' },
  ],
};

function fmt(v) {
  return formatNumber(Number(v || 0));
}

export function DeliveryRequestDetailPage() {
  const { pathname } = useLocation();
  const [selectedNo, setSelectedNo] = useState(null);
  const [filterValue, setFilterValue] = useState({
    shipResult: 'ALL',
    dateFrom: '2026-03-01',
    dateTo: '2026-03-26',
    salesOrg: '',
    factory: '',
    customerCode: '',
    customerName: '',
  });

  const onChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const onReset = useCallback(() => {
    setFilterValue({
      shipResult: 'ALL',
      dateFrom: '2026-03-01',
      dateTo: '2026-03-26',
      salesOrg: '',
      factory: '',
      customerCode: '',
      customerName: '',
    });
  }, []);

  const fields = useMemo(
    () => [
      { id: 'shipResult', label: '출고여부', type: 'radio', options: SHIP_RESULT_OPTIONS, row: 0 },
      { id: 'dateRange', label: '출고예정일', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 },
      { id: 'salesOrg', label: '영업조직', type: 'select', options: ORG_OPTIONS, row: 0, width: 130 },
      { id: 'factory', label: '공장', type: 'select', options: FACTORY_OPTIONS, row: 0, width: 140 },
      { id: 'customerCode', label: '거래처코드', type: 'text', row: 1, width: 120 },
      { id: 'customerName', label: '거래처', type: 'text', row: 1, width: 240 },
    ],
    []
  );

  const filtered = useMemo(() => {
    return ROWS.filter((r) => {
      if (filterValue.shipResult !== 'ALL' && r.shipResult !== filterValue.shipResult) return false;
      if (filterValue.dateFrom && r.requestDate < filterValue.dateFrom) return false;
      if (filterValue.dateTo && r.requestDate > filterValue.dateTo) return false;
      if (filterValue.factory && r.factory !== filterValue.factory) return false;
      if (filterValue.customerCode && !r.customerCode.includes(filterValue.customerCode)) return false;
      if (filterValue.customerName && !r.customerName.includes(filterValue.customerName)) return false;
      return true;
    });
  }, [filterValue]);

  const summary = useMemo(() => {
    return filtered.reduce(
      (acc, r) => {
        acc.qty += r.qty;
        acc.vat += r.vat;
        acc.amount += r.amount;
        return acc;
      },
      { qty: 0, vat: 0, amount: 0 }
    );
  }, [filtered]);

  const columns = [
    {
      title: '출하번호',
      dataIndex: 'shipmentNo',
      width: 150,
      fixed: 'left',
      render: (value) => (
        <button type="button" className={styles.shipNoButton} onClick={() => setSelectedNo(value)}>
          {value}
        </button>
      ),
    },
    { title: '출하형태', dataIndex: 'shippingType', width: 170 },
    { title: '출고예정일', dataIndex: 'requestDate', width: 110 },
    { title: '도착예정일', dataIndex: 'arrivalDate', width: 110 },
    { title: '공장', dataIndex: 'factory', width: 120 },
    { title: '거래처', dataIndex: 'customerCode', width: 90 },
    { title: '거래처명', dataIndex: 'customerName', width: 220 },
    { title: '출고여부', dataIndex: 'shipResult', width: 90 },
    { title: '도착지장소', dataIndex: 'destination', width: 280 },
    { title: '도착지전화번호', dataIndex: 'destinationPhone', width: 140 },
    { title: '도착지담당자', dataIndex: 'destinationManager', width: 150 },
    { title: '차량정보', dataIndex: 'carInfo', width: 120 },
    { title: '운임내역', dataIndex: 'transportFee', width: 100 },
  ];

  const detailColumns = [
    { title: 'No.', dataIndex: 'no', width: 60, align: 'center' },
    { title: '품목코드', dataIndex: 'itemCode', width: 140 },
    { title: '품목명', dataIndex: 'itemName', width: 160 },
    { title: '스펙', dataIndex: 'spec', width: 220 },
    { title: '수량', dataIndex: 'qty', width: 90, align: 'right', render: fmt },
    { title: '단가', dataIndex: 'unitPrice', width: 90, align: 'right', render: fmt },
    { title: '금액', dataIndex: 'amount', width: 110, align: 'right', render: fmt },
    { title: '부가세', dataIndex: 'vat', width: 100, align: 'right', render: fmt },
    { title: '비고', dataIndex: 'note', width: 180 },
  ];

  const detailRows = selectedNo ? DETAIL_BY_NO[selectedNo] || [] : [];

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

        <div className={styles.summaryBand}>
          [전체합계] 수량 {fmt(summary.qty)} / 부가세 {fmt(summary.vat)} / 금액 {fmt(summary.amount)}
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableTop}>
            <span className={styles.tableTitle}>출하 요청 상세내역</span>
            <span className={styles.tableCount}>총 {filtered.length}건</span>
          </div>
          <Table
            columns={columns}
            dataSource={filtered}
            size="small"
            pagination={{ pageSize: 15 }}
            scroll={{ x: 2100, y: 420 }}
            className={`${styles.mainTable} ${styles.desktopTable}`}
            rowKey="key"
          />
          <div className={styles.mobileList}>
            {filtered.length === 0 ? (
              <div className={styles.mobileEmpty}>조회 결과가 없습니다.</div>
            ) : (
              filtered.map((row) => (
                <article
                  key={`mobile-${row.key}`}
                  className={styles.mobileCard}
                  onClick={() => setSelectedNo(row.shipmentNo)}
                >
                  <div className={styles.mobileHead}>
                    <button
                      type="button"
                      className={styles.shipNoButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNo(row.shipmentNo);
                      }}
                    >
                      {row.shipmentNo}
                    </button>
                    <span className={styles.mobileShipResult}>{row.shipResult}</span>
                  </div>
                  <div className={styles.mobileCustomer}>{row.customerName}</div>
                  <div className={styles.mobileMetaGrid}>
                    <div className={styles.mobileMetaItem}>
                      <span>출하형태</span>
                      <strong>{row.shippingType}</strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>공장</span>
                      <strong>{row.factory}</strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>출고예정일</span>
                      <strong>{row.requestDate}</strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>도착예정일</span>
                      <strong>{row.arrivalDate}</strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>금액</span>
                      <strong>{fmt(row.amount)}</strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>부가세</span>
                      <strong>{fmt(row.vat)}</strong>
                    </div>
                  </div>
                  <div className={styles.mobileDestination}>{row.destination}</div>
                </article>
              ))
            )}
          </div>
        </div>

        <Modal
          title={selectedNo ? `출하번호 상세 - ${selectedNo}` : '출하번호 상세'}
          open={Boolean(selectedNo)}
          onCancel={() => setSelectedNo(null)}
          footer={null}
          width="92vw"
          style={{ maxWidth: 1500 }}
          centered
          className={styles.detailModal}
        >
          <Table
            columns={detailColumns}
            dataSource={detailRows}
            size="small"
            pagination={false}
            scroll={{ x: 1200, y: 380 }}
            className={styles.detailTable}
            locale={{ emptyText: '상세 데이터가 없습니다.' }}
            rowKey="key"
          />
        </Modal>
      </div>
    </PageShell>
  );
}

export default DeliveryRequestDetailPage;
