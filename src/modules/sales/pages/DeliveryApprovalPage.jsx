import React, { useMemo, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Table } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { formatNumber } from '../../../shared/utils/formatters';
import styles from './DeliveryApprovalPage.module.css';

const FACTORY_OPTIONS = [
  { value: '', label: '전체' },
  { value: '안산수전공장', label: '안산수전공장' },
  { value: '창원SW공장', label: '창원SW공장' },
  { value: '창원타일공장', label: '창원타일공장' },
];

const SHIPPING_TYPE_OPTIONS = [
  { value: '', label: '전체' },
  { value: '도소매출고', label: '도소매출고' },
  { value: '납품출고', label: '납품출고' },
  { value: '(무상)모델하우스 샘플출고', label: '(무상)모델하우스 샘플출고' },
];

const SALES_ORG_OPTIONS = [
  { value: '', label: '전체' },
  { value: '리테일1팀', label: '리테일1팀' },
  { value: '프로젝트팀', label: '프로젝트팀' },
];

const PRICE_KIND_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'PAID', label: '유상' },
  { value: 'FREE', label: '무상' },
];

const INITIAL_ROWS = [
  {
    key: '1',
    shipNo: 'DN202606020001',
    customerCode: '051888',
    customerName: '(주)하나도기타일',
    factory: '안산수전공장',
    shipDate: '2026-06-02',
    amount: 262100,
    vat: 26210,
    salesLimit: 262100,
    dcRate: 0,
    remainLimit: 111852758,
    salesGroup: '이승현-S',
    shippingType: '도소매출고',
    destination: '성남시 분당구 서판교로 29 힘래플에버 918동 704호',
    inputUser: '이승현2',
    remark: '',
    shipResult: '미출',
    priceKind: 'PAID',
  },
  {
    key: '2',
    shipNo: 'DN202606020011',
    customerCode: '199220',
    customerName: '디엔건설 주식회사(구 대림건설)',
    factory: '창원SW공장',
    shipDate: '2026-06-05',
    amount: 1890000,
    vat: 189000,
    salesLimit: 1890000,
    dcRate: 1.5,
    remainLimit: 80922011,
    salesGroup: '김재현-P',
    shippingType: '납품출고',
    destination: '인천광역시 서구 마전동 280-5',
    inputUser: '김재현',
    remark: '현장 선출고 요청',
    shipResult: '미출',
    priceKind: 'PAID',
  },
  {
    key: '3',
    shipNo: 'DN202606020021',
    customerCode: '052273',
    customerName: '대림바스(주) 창원공장',
    factory: '창원SW공장',
    shipDate: '2026-06-10',
    amount: 0,
    vat: 0,
    salesLimit: 0,
    dcRate: 0,
    remainLimit: 0,
    salesGroup: '박준혁-S',
    shippingType: '(무상)모델하우스 샘플출고',
    destination: 'OEM 제품 품질시험 및 입고검사 후 불량제품 기타출고 건',
    inputUser: '박준혁',
    remark: '',
    shipResult: '미출',
    priceKind: 'FREE',
  },
];

const DETAIL_BY_SHIPNO = {
  DN202606020001: [
    { key: '1', no: 1, itemCode: 'SAH-G4441ZZC', itemName: '발코니수전(냉수)', spec: '이지쿡/2구', qty: 310, unitPrice: 15000, amount: 4650000, vat: 465000, note: '' },
    { key: '2', no: 2, itemCode: 'SAH-G4443ZZH', itemName: '발코니수전(온수)', spec: '이지쿡/1구', qty: 310, unitPrice: 8000, amount: 2480000, vat: 248000, note: '' },
  ],
};

function fmt(n) {
  return formatNumber(n);
}

export function DeliveryApprovalPage() {
  const { pathname } = useLocation();
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedShipNo, setSelectedShipNo] = useState(null);
  const [filterValue, setFilterValue] = useState({
    dateFrom: '2026-03-01',
    dateTo: '2026-06-30',
    customerCode: '',
    customerName: '',
    salesOrg: '리테일1팀',
    factory: '',
    shippingType: '',
    salesGroupCode: '',
    salesGroupName: '',
    priceKind: 'ALL',
  });

  const onChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const onReset = useCallback(() => {
    setFilterValue({
      dateFrom: '2026-03-01',
      dateTo: '2026-06-30',
      customerCode: '',
      customerName: '',
      salesOrg: '리테일1팀',
      factory: '',
      shippingType: '',
      salesGroupCode: '',
      salesGroupName: '',
      priceKind: 'ALL',
    });
  }, []);

  const fields = useMemo(
    () => [
      { id: 'dateRange', label: '출고예정일', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 },
      { id: 'factory', label: '공장', type: 'select', options: FACTORY_OPTIONS, row: 0, width: 140 },
      { id: 'salesOrg', label: '영업조직', type: 'select', options: SALES_ORG_OPTIONS, row: 0, width: 130 },
      { id: 'shippingType', label: '출하형태', type: 'select', options: SHIPPING_TYPE_OPTIONS, row: 0, width: 180 },
      { id: 'priceKind', label: '유/무상 구분', type: 'radio', options: PRICE_KIND_OPTIONS, row: 0 },
      { id: 'customerCode', label: '거래처코드', type: 'text', row: 1, width: 120 },
      { id: 'customerName', label: '거래처', type: 'text', row: 1, width: 220 },
      { id: 'salesGroupCode', label: '영업그룹코드', type: 'text', row: 1, width: 120 },
      { id: 'salesGroupName', label: '영업그룹명', type: 'text', row: 1, width: 160 },
    ],
    []
  );

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (filterValue.dateFrom && r.shipDate < filterValue.dateFrom) return false;
      if (filterValue.dateTo && r.shipDate > filterValue.dateTo) return false;
      if (filterValue.factory && r.factory !== filterValue.factory) return false;
      if (filterValue.shippingType && r.shippingType !== filterValue.shippingType) return false;
      if (filterValue.customerCode && !r.customerCode.includes(filterValue.customerCode)) return false;
      if (filterValue.customerName && !r.customerName.includes(filterValue.customerName)) return false;
      if (filterValue.priceKind !== 'ALL' && r.priceKind !== filterValue.priceKind) return false;
      return true;
    });
  }, [rows, filterValue]);

  const processSelected = useCallback((nextResult) => {
    if (selectedRowKeys.length === 0) return;
    setRows((prev) => prev.map((r) => (selectedRowKeys.includes(r.key) ? { ...r, shipResult: nextResult } : r)));
    setSelectedRowKeys([]);
  }, [selectedRowKeys]);

  const confirmProcess = useCallback((nextResult) => {
    if (selectedRowKeys.length === 0) {
      Modal.warning({
        title: '선택 필요',
        content: '처리할 출고 건을 먼저 선택해주세요.',
        okText: '확인',
      });
      return;
    }

    const actionLabel = nextResult === '출고' ? '일괄 처리' : '일괄 취소';
    Modal.confirm({
      title: `출고대기 ${actionLabel}`,
      content: `선택한 ${selectedRowKeys.length}건을 "${nextResult}" 상태로 변경하시겠습니까?`,
      okText: '확인',
      cancelText: '취소',
      onOk: () => processSelected(nextResult),
    });
  }, [processSelected, selectedRowKeys.length]);

  const columns = [
    {
      title: '출고번호',
      dataIndex: 'shipNo',
      width: 150,
      fixed: 'left',
      render: (value) => (
        <button type="button" className={styles.shipNoButton} onClick={() => setSelectedShipNo(value)}>
          {value}
        </button>
      ),
    },
    { title: '거래처코드', dataIndex: 'customerCode', width: 100 },
    { title: '거래처명', dataIndex: 'customerName', width: 210 },
    { title: '공장명', dataIndex: 'factory', width: 120 },
    { title: '출고예정일', dataIndex: 'shipDate', width: 110 },
    { title: '금액', dataIndex: 'amount', width: 90, align: 'right', render: fmt },
    { title: '부가세', dataIndex: 'vat', width: 90, align: 'right', render: fmt },
    { title: '판매단가합', dataIndex: 'salesLimit', width: 100, align: 'right', render: fmt },
    { title: 'DC율', dataIndex: 'dcRate', width: 70, align: 'right', render: (v) => Number(v).toFixed(2) },
    { title: '여신잔여한도', dataIndex: 'remainLimit', width: 130, align: 'right', render: fmt },
    { title: '영업그룹', dataIndex: 'salesGroup', width: 100 },
    { title: '출하형태', dataIndex: 'shippingType', width: 160 },
    { title: '도착지', dataIndex: 'destination', width: 300 },
    { title: '입력자', dataIndex: 'inputUser', width: 90 },
    { title: '비고', dataIndex: 'remark', width: 160 },
    { title: '출고여부', dataIndex: 'shipResult', width: 90 },
  ];

  const detailColumns = [
    { title: 'No.', dataIndex: 'no', width: 60, align: 'center' },
    { title: '품목코드', dataIndex: 'itemCode', width: 140 },
    { title: '품목명', dataIndex: 'itemName', width: 160 },
    { title: '스펙', dataIndex: 'spec', width: 220 },
    { title: '수량', dataIndex: 'qty', width: 90, align: 'right', render: fmt },
    { title: '단가', dataIndex: 'unitPrice', width: 100, align: 'right', render: fmt },
    { title: '금액', dataIndex: 'amount', width: 110, align: 'right', render: fmt },
    { title: '부가세', dataIndex: 'vat', width: 100, align: 'right', render: fmt },
    { title: '비고', dataIndex: 'note', width: 180 },
  ];

  const detailRows = selectedShipNo ? DETAIL_BY_SHIPNO[selectedShipNo] || [] : [];

  return (
    <PageShell path={pathname} className={styles.shellWide}>
      <div className={styles.page}>
        <div className={styles.pageHint}>팀장 &gt; 출고대기 일괄승인</div>

        <ListFilter
          className={styles.toolbar}
          fields={fields}
          value={filterValue}
          onChange={onChange}
          onReset={onReset}
          onSearch={() => {}}
          searchLabel="조회"
        />

        <div className={styles.actionRow}>
          <button type="button" className={styles.processBtn} onClick={() => confirmProcess('출고')}>
            출고대기(일괄)처리
          </button>
          <button type="button" className={styles.cancelBtn} onClick={() => confirmProcess('미출')}>
            출고대기(일괄)취소
          </button>
        </div>

        <div className={styles.tableCard}>
          <Table
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            columns={columns}
            dataSource={filteredRows}
            size="small"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 2300, y: 360 }}
            className={styles.approvalTable}
            rowKey="key"
          />
        </div>

        <Modal
          title={selectedShipNo ? `출하번호 상세 - ${selectedShipNo}` : '출하번호 상세'}
          open={Boolean(selectedShipNo)}
          onCancel={() => setSelectedShipNo(null)}
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
            locale={{ emptyText: '데이터가 존재하지 않습니다.' }}
            rowKey="key"
          />
        </Modal>
      </div>
    </PageShell>
  );
}

export default DeliveryApprovalPage;
