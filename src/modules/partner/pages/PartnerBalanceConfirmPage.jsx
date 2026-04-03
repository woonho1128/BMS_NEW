import React, { useMemo, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal, Table } from 'antd';
import { Download } from 'lucide-react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { useAuth } from '../../auth/hooks/useAuth';
import { formatNumber } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../router/routePaths';
import styles from './PartnerBalanceConfirmPage.module.css';

const YEAR_OPTIONS = [
  { value: '2026', label: '2026년' },
  { value: '2025', label: '2025년' },
];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: `${i + 1}월`,
}));

const CREDIT_GROUP_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'TOTAL', label: '통합' },
  { value: 'SALES', label: '세일즈부문' },
  { value: 'BATH', label: '바스플랜부문' },
];

const MAIN_ROWS = [
  {
    key: '1',
    partnerId: '1',
    code: '050005',
    clientName: '영일타일도기상사',
    ceo: '백재홍',
    creditGroup: '세일즈부문',
    salesGroup: '조동욱',
    creditLimit: 120000000,
    remainCreditLimit: 120000000,
    prevSanitary: 0,
    prevTile: 0,
    prevTotal: 0,
    shipSanitary: 0,
    shipTile: 0,
    shipTotal: 0,
    receiptSanitary: 0,
    receiptTile: 0,
    receiptTotal: 0,
    receivableSanitary: 0,
    receivableTile: 0,
    receivableTotal: 0,
    overdueSanitary: 0,
    overdueTile: 0,
    overdueTotal: 0,
    noteJa: 0,
    noteTa: 0,
    noteTotal: 0,
    salesManagerKey: 'sales-kim',
  },
  {
    key: '2',
    partnerId: '2',
    code: '050006',
    clientName: '한경사사다대리점',
    ceo: '이경훈',
    creditGroup: '세일즈부문',
    salesGroup: '권순호',
    creditLimit: 200000000,
    remainCreditLimit: 34500534,
    prevSanitary: 90588339,
    prevTile: 0,
    prevTotal: 90588339,
    shipSanitary: 63954627,
    shipTile: 10956000,
    shipTotal: 74910627,
    receiptSanitary: 0,
    receiptTile: 0,
    receiptTotal: 0,
    receivableSanitary: 15453466,
    receivableTile: 0,
    receivableTotal: 15453466,
    overdueSanitary: 90588339,
    overdueTile: 0,
    overdueTotal: 90588339,
    noteJa: 0,
    noteTa: 0,
    noteTotal: 0,
    salesManagerKey: 'sales-kim',
  },
  {
    key: '3',
    partnerId: '3',
    code: '050007',
    clientName: '디엔타일위생기상사',
    ceo: '김성길',
    creditGroup: '세일즈부문',
    salesGroup: '박세현',
    creditLimit: 115000000,
    remainCreditLimit: 25299114,
    prevSanitary: 48251533,
    prevTile: 0,
    prevTotal: 48251533,
    shipSanitary: 41449358,
    shipTile: 0,
    shipTotal: 41449358,
    receiptSanitary: 40358615,
    receiptTile: 0,
    receiptTotal: 40358615,
    receivableSanitary: 4934271,
    receivableTile: 0,
    receivableTotal: 4934271,
    overdueSanitary: 7892918,
    overdueTile: 0,
    overdueTotal: 7892918,
    noteJa: 40358615,
    noteTa: 0,
    noteTotal: 40358615,
    salesManagerKey: 'sales-lee',
  },
];

const MONTHLY_DETAIL = [
  { key: '1', ym: '202601', prevTotal: 0, shipTotal: 0, receiptTotal: 0, receivableTotal: 0, overdueTotal: 0 },
  { key: '2', ym: '202602', prevTotal: 0, shipTotal: 0, receiptTotal: 0, receivableTotal: 0, overdueTotal: 0 },
  { key: '3', ym: '202603', prevTotal: 0, shipTotal: 0, receiptTotal: 0, receivableTotal: 0, overdueTotal: 0 },
];

function fmt(v) {
  return formatNumber(v);
}

export function PartnerBalanceConfirmPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [selectedClient, setSelectedClient] = useState(null);
  const [filterValue, setFilterValue] = useState({
    year: '2026',
    month: '03',
    creditGroup: 'ALL',
    clientCode: '',
    clientName: '',
    clientLike: '',
  });

  const onChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const onReset = useCallback(() => {
    setFilterValue({ year: '2026', month: '03', creditGroup: 'ALL', clientCode: '', clientName: '', clientLike: '' });
  }, []);

  const fields = useMemo(() => [
    { id: 'year', label: '기준년월', type: 'select', options: YEAR_OPTIONS, width: 110, row: 0 },
    { id: 'month', label: '', type: 'select', options: MONTH_OPTIONS, width: 90, row: 0 },
    { id: 'creditGroup', label: '여신구분', type: 'radio', options: CREDIT_GROUP_OPTIONS, row: 1 },
    { id: 'clientCode', label: '거래처코드', type: 'text', row: 0 },
    { id: 'clientName', label: '거래처', type: 'text', wide: true, row: 0 },
    { id: 'clientLike', label: '거래처(like)', type: 'text', wide: true, row: 1 },
  ], []);

  const isAgencyRole = user?.role === 'AGENCY' || user?.role === 'PARTNER' || user?.role === 'DEALER';
  const userKey = String(user?.name || '').toLowerCase();
  const isSalesManagerAccount =
    !isAgencyRole &&
    (String(user?.position || '').includes('영업') || userKey.includes('sales') || userKey.includes('영업'));

  const rowsByAccount = useMemo(() => {
    if (isAgencyRole) {
      return MAIN_ROWS.filter((row) => row.partnerId === String(user?.partnerId || ''));
    }
    if (isSalesManagerAccount) {
      const key = userKey.trim();
      return MAIN_ROWS.filter(
        (row) =>
          String(row.salesManagerKey || '').toLowerCase().includes(key) ||
          (key.includes('sales') && row.salesManagerKey === 'sales-kim')
      );
    }
    return MAIN_ROWS;
  }, [isAgencyRole, isSalesManagerAccount, user?.partnerId, userKey]);

  const filteredRows = useMemo(
    () =>
      rowsByAccount.filter((r) => {
        if (
          filterValue.creditGroup !== 'ALL' &&
          r.creditGroup !== (filterValue.creditGroup === 'SALES' ? '세일즈부문' : '바스플랜부문')
        )
          return false;
        if (filterValue.clientCode && !r.code.includes(filterValue.clientCode)) return false;
        if (filterValue.clientName && !r.clientName.includes(filterValue.clientName)) return false;
        if (filterValue.clientLike && !r.clientName.includes(filterValue.clientLike)) return false;
        return true;
      }),
    [filterValue, rowsByAccount]
  );

  const goToCollectionTab = useCallback(
    (row, amount, itemType) => {
      const params = new URLSearchParams({
        tab: 'collection',
        customerCode: row.code,
        customerName: row.clientName,
        dateFrom: `${filterValue.year}-${filterValue.month}-01`,
        dateTo: `${filterValue.year}-${filterValue.month}-31`,
        shipAmount: String(amount || 0),
        shipType: itemType,
      });
      navigate(`${ROUTES.SALES_SUPPORT_RECEIVABLE}?${params.toString()}`);
    },
    [filterValue.month, filterValue.year, navigate]
  );

  const mainColumns = [
    {
      title: '거래처정보',
      children: [
        { title: '코드', dataIndex: 'code', width: 80, fixed: 'left' },
        {
          title: '거래처명', dataIndex: 'clientName', width: 180, fixed: 'left',
          render: (_, row) => (
            <button type="button" className={styles.clientBtn} onClick={() => setSelectedClient(row)}>{row.clientName}</button>
          ),
        },
        { title: '대표자', dataIndex: 'ceo', width: 90 },
        { title: '여신구분', dataIndex: 'creditGroup', width: 100 },
        { title: '영업그룹', dataIndex: 'salesGroup', width: 90 },
      ],
    },
    {
      title: '여신한도',
      children: [
        { title: '거래한도', dataIndex: 'creditLimit', width: 130, align: 'right', render: fmt },
        { title: '여신잔여한도', dataIndex: 'remainCreditLimit', width: 140, align: 'right', render: fmt },
      ],
    },
    {
      title: '전월 외상매출금액',
      children: [
        { title: '위생도기', dataIndex: 'prevSanitary', width: 110, align: 'right', render: fmt },
        { title: '타일', dataIndex: 'prevTile', width: 90, align: 'right', render: fmt },
        { title: '합계', dataIndex: 'prevTotal', width: 110, align: 'right', render: fmt },
      ],
    },
    {
      title: '당월 출고금액',
      children: [
        {
          title: '위생도기',
          dataIndex: 'shipSanitary',
          width: 110,
          align: 'right',
          render: (value, row) => (
            <button type="button" className={styles.amountLink} onClick={() => goToCollectionTab(row, value, 'sanitary')}>
              {fmt(value)}
            </button>
          ),
        },
        {
          title: '타일',
          dataIndex: 'shipTile',
          width: 90,
          align: 'right',
          render: (value, row) => (
            <button type="button" className={styles.amountLink} onClick={() => goToCollectionTab(row, value, 'tile')}>
              {fmt(value)}
            </button>
          ),
        },
        {
          title: '합계',
          dataIndex: 'shipTotal',
          width: 110,
          align: 'right',
          render: (value, row) => (
            <button type="button" className={styles.amountLink} onClick={() => goToCollectionTab(row, value, 'total')}>
              {fmt(value)}
            </button>
          ),
        },
      ],
    },
    {
      title: '당월 수금액',
      children: [
        { title: '위생도기', dataIndex: 'receiptSanitary', width: 110, align: 'right', render: fmt },
        { title: '타일', dataIndex: 'receiptTile', width: 90, align: 'right', render: fmt },
        { title: '합계', dataIndex: 'receiptTotal', width: 110, align: 'right', render: fmt },
      ],
    },
    {
      title: '당월 외상매출금액',
      children: [
        { title: '위생도기', dataIndex: 'receivableSanitary', width: 110, align: 'right', render: fmt },
        { title: '타일', dataIndex: 'receivableTile', width: 90, align: 'right', render: fmt },
        { title: '합계', dataIndex: 'receivableTotal', width: 110, align: 'right', render: fmt },
      ],
    },
    {
      title: '당월 연체금액',
      children: [
        { title: '위생도기', dataIndex: 'overdueSanitary', width: 110, align: 'right', render: fmt },
        { title: '타일', dataIndex: 'overdueTile', width: 90, align: 'right', render: fmt },
        { title: '합계', dataIndex: 'overdueTotal', width: 110, align: 'right', render: fmt },
      ],
    },
    {
      title: '미결제어음',
      children: [
        { title: '자수', dataIndex: 'noteJa', width: 100, align: 'right', render: fmt },
        { title: '타수', dataIndex: 'noteTa', width: 100, align: 'right', render: fmt },
        { title: '합계', dataIndex: 'noteTotal', width: 110, align: 'right', render: fmt },
      ],
    },
  ];

  const detailColumns = [
    { title: '년월', dataIndex: 'ym', width: 100, align: 'center' },
    { title: '전월 외상매출금액', dataIndex: 'prevTotal', width: 150, align: 'right', render: fmt },
    { title: '당월 출고금액', dataIndex: 'shipTotal', width: 130, align: 'right', render: fmt },
    { title: '당월 수금액', dataIndex: 'receiptTotal', width: 130, align: 'right', render: fmt },
    { title: '당월 외상매출금액', dataIndex: 'receivableTotal', width: 150, align: 'right', render: fmt },
    { title: '당월 연체금액', dataIndex: 'overdueTotal', width: 130, align: 'right', render: fmt },
  ];

  return (
    <PageShell path={pathname} className={styles.shellWide}>
      <div className={styles.page}>
        <div className={styles.logicCard}>
          <div className={styles.logicTitle}>조회 권한(목업)</div>
          <div className={styles.logicText}>
            {isAgencyRole
              ? '대리점 계정: 본인 대리점 내역만 표시됩니다.'
              : isSalesManagerAccount
                ? '영업 담당자 계정: 내가 담당 중인 거래처만 표시됩니다.'
                : '본사 계정: 전체 거래처 내역이 표시됩니다.'}
          </div>
        </div>

        <ListFilter
          fields={fields}
          value={filterValue}
          onChange={onChange}
          onReset={onReset}
          onSearch={() => {}}
          searchLabel="조회"
        />

        <div className={styles.logicCard}>
          <div className={styles.logicTitle}>계산로직</div>
          <div className={styles.logicText}>당월 외상매출금 = 전월외상 + 당월출고 - 당월수금 / 여신한도 = 거래한도 - 당월 외상매출금 - 미결제어음(자수+타수)</div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableTop}>
            <span className={styles.tableTitle}>채권채무잔액 확인서</span>
            <Button size="small" icon={<Download size={14} />} className={styles.downloadBtn}>다운로드</Button>
          </div>
          <Table
            columns={mainColumns}
            dataSource={filteredRows}
            size="small"
            pagination={{ pageSize: 15 }}
            scroll={{ x: 2800, y: 460 }}
            rowKey="key"
            className={styles.mainTable}
          />
        </div>

        <Modal
          title={selectedClient ? `거래처 상세 - ${selectedClient.clientName}` : '거래처 상세'}
          open={Boolean(selectedClient)}
          onCancel={() => setSelectedClient(null)}
          footer={null}
          width="92vw"
          style={{ maxWidth: 1500 }}
          centered
          className={styles.detailModal}
        >
          {selectedClient && (
            <div className={styles.detailTop}>
              <div>코드: {selectedClient.code}</div>
              <div>대표자: {selectedClient.ceo}</div>
              <div>영업그룹: {selectedClient.salesGroup}</div>
            </div>
          )}
          <Table
            columns={detailColumns}
            dataSource={MONTHLY_DETAIL}
            size="small"
            pagination={false}
            scroll={{ x: 900, y: 320 }}
            rowKey="key"
            className={styles.detailTable}
          />
        </Modal>
      </div>
    </PageShell>
  );
}

export default PartnerBalanceConfirmPage;
