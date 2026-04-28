import { formatNumber } from '../../../shared/utils/formatters';

export const YEAR_OPTIONS = [
  { value: '2026', label: '2026년' },
  { value: '2025', label: '2025년' },
];

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: `${i + 1}월`,
}));

export const CREDIT_GROUP_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'TOTAL', label: '통합' },
  { value: 'SALES', label: '세일즈부문' },
  { value: 'BATH', label: '바스플랜부문' },
];

export const MAIN_ROWS = [
  { key: '1', partnerId: '1', code: '050005', clientName: '영일타일도기상사', ceo: '백재홍', creditGroup: '세일즈부문', salesGroup: '조동욱', creditLimit: 120000000, remainCreditLimit: 120000000, prevSanitary: 0, prevTile: 0, prevTotal: 0, shipSanitary: 0, shipTile: 0, shipTotal: 0, receiptSanitary: 0, receiptTile: 0, receiptTotal: 0, receivableSanitary: 0, receivableTile: 0, receivableTotal: 0, overdueSanitary: 0, overdueTile: 0, overdueTotal: 0, noteJa: 0, noteTa: 0, noteTotal: 0, salesManagerKey: 'sales-kim' },
  { key: '2', partnerId: '2', code: '050006', clientName: '한경사사다대리점', ceo: '이경훈', creditGroup: '세일즈부문', salesGroup: '권순호', creditLimit: 200000000, remainCreditLimit: 34500534, prevSanitary: 90588339, prevTile: 0, prevTotal: 90588339, shipSanitary: 63954627, shipTile: 10956000, shipTotal: 74910627, receiptSanitary: 0, receiptTile: 0, receiptTotal: 0, receivableSanitary: 15453466, receivableTile: 0, receivableTotal: 15453466, overdueSanitary: 90588339, overdueTile: 0, overdueTotal: 90588339, noteJa: 0, noteTa: 0, noteTotal: 0, salesManagerKey: 'sales-kim' },
  { key: '3', partnerId: '3', code: '050007', clientName: '디엔타일위생기상사', ceo: '김성길', creditGroup: '세일즈부문', salesGroup: '박세현', creditLimit: 115000000, remainCreditLimit: 25299114, prevSanitary: 48251533, prevTile: 0, prevTotal: 48251533, shipSanitary: 41449358, shipTile: 0, shipTotal: 41449358, receiptSanitary: 40358615, receiptTile: 0, receiptTotal: 40358615, receivableSanitary: 4934271, receivableTile: 0, receivableTotal: 4934271, overdueSanitary: 7892918, overdueTile: 0, overdueTotal: 7892918, noteJa: 40358615, noteTa: 0, noteTotal: 40358615, salesManagerKey: 'sales-lee' },
];

export const MONTHLY_DETAIL = [
  { key: '1', ym: '202601', prevTotal: 0, shipTotal: 0, receiptTotal: 0, receivableTotal: 0, overdueTotal: 0 },
  { key: '2', ym: '202602', prevTotal: 0, shipTotal: 0, receiptTotal: 0, receivableTotal: 0, overdueTotal: 0 },
  { key: '3', ym: '202603', prevTotal: 0, shipTotal: 0, receiptTotal: 0, receivableTotal: 0, overdueTotal: 0 },
];

export function fmt(v) {
  return formatNumber(v);
}

export function getReceiptFieldByType(itemType) {
  if (itemType === 'sanitary') return 'receiptSanitary';
  if (itemType === 'tile') return 'receiptTile';
  return 'receiptTotal';
}

export function getReceiptTypeLabel(itemType) {
  if (itemType === 'sanitary') return '위생도기';
  if (itemType === 'tile') return '타일';
  return '합계';
}

export function buildYearReceiptRows(row, year, selectedMonth, itemType, clickedAmount) {
  const monthFactors = [0.62, 0.68, 0.75, 0.79, 0.84, 0.9, 0.96, 1.02, 1.08, 1.12, 1.18, 1.24];
  const field = getReceiptFieldByType(itemType);
  const base = Number(row?.[field] || 0);
  const targetMonth = Number(selectedMonth) || 1;

  return MONTH_OPTIONS.map((month, index) => {
    const monthNo = Number(month.value);
    const amount = monthNo === targetMonth ? Number(clickedAmount || 0) : Math.max(0, Math.round(base * monthFactors[index]));
    return { key: `${year}-${month.value}`, ym: `${year}-${month.value}`, amount };
  });
}

export function buildMainColumns(styles, setSelectedClient, openReceiptYearModal) {
  return [
    { title: '거래처정보', children: [
      { title: '코드', dataIndex: 'code', width: 80, fixed: 'left' },
      { title: '거래처명', dataIndex: 'clientName', width: 180, fixed: 'left', render: (_, row) => (<button type="button" className={styles.clientBtn} onClick={() => setSelectedClient(row)}>{row.clientName}</button>) },
      { title: '대표자', dataIndex: 'ceo', width: 90 },
      { title: '여신구분', dataIndex: 'creditGroup', width: 100 },
      { title: '영업그룹', dataIndex: 'salesGroup', width: 90 },
    ]},
    { title: '여신한도', children: [
      { title: '거래한도', dataIndex: 'creditLimit', width: 130, align: 'right', render: fmt },
      { title: '여신잔여한도', dataIndex: 'remainCreditLimit', width: 140, align: 'right', render: fmt },
    ]},
    { title: '전월 외상매출금액', children: [
      { title: '위생도기', dataIndex: 'prevSanitary', width: 110, align: 'right', render: fmt },
      { title: '타일', dataIndex: 'prevTile', width: 90, align: 'right', render: fmt },
      { title: '합계', dataIndex: 'prevTotal', width: 110, align: 'right', render: fmt },
    ]},
    { title: '당월 출고금액', children: [
      { title: '위생도기', dataIndex: 'shipSanitary', width: 110, align: 'right', render: fmt },
      { title: '타일', dataIndex: 'shipTile', width: 90, align: 'right', render: fmt },
      { title: '합계', dataIndex: 'shipTotal', width: 110, align: 'right', render: fmt },
    ]},
    { title: '당월 수금액', children: [
      { title: '위생도기', dataIndex: 'receiptSanitary', width: 110, align: 'right', render: (v, row) => <button type="button" className={styles.amountLink} onClick={() => openReceiptYearModal(row, v, 'sanitary')}>{fmt(v)}</button> },
      { title: '타일', dataIndex: 'receiptTile', width: 90, align: 'right', render: (v, row) => <button type="button" className={styles.amountLink} onClick={() => openReceiptYearModal(row, v, 'tile')}>{fmt(v)}</button> },
      { title: '합계', dataIndex: 'receiptTotal', width: 110, align: 'right', render: (v, row) => <button type="button" className={styles.amountLink} onClick={() => openReceiptYearModal(row, v, 'total')}>{fmt(v)}</button> },
    ]},
    { title: '당월 외상매출금액', children: [
      { title: '위생도기', dataIndex: 'receivableSanitary', width: 110, align: 'right', render: fmt },
      { title: '타일', dataIndex: 'receivableTile', width: 90, align: 'right', render: fmt },
      { title: '합계', dataIndex: 'receivableTotal', width: 110, align: 'right', render: fmt },
    ]},
    { title: '당월 연체금액', children: [
      { title: '위생도기', dataIndex: 'overdueSanitary', width: 110, align: 'right', render: fmt },
      { title: '타일', dataIndex: 'overdueTile', width: 90, align: 'right', render: fmt },
      { title: '합계', dataIndex: 'overdueTotal', width: 110, align: 'right', render: fmt },
    ]},
    { title: '미결제어음', children: [
      { title: '자수', dataIndex: 'noteJa', width: 100, align: 'right', render: fmt },
      { title: '타수', dataIndex: 'noteTa', width: 100, align: 'right', render: fmt },
      { title: '합계', dataIndex: 'noteTotal', width: 110, align: 'right', render: fmt },
    ]},
  ];
}

export const DETAIL_COLUMNS = [
  { title: '년월', dataIndex: 'ym', width: 100, align: 'center' },
  { title: '전월 외상매출금액', dataIndex: 'prevTotal', width: 150, align: 'right', render: fmt },
  { title: '당월 출고금액', dataIndex: 'shipTotal', width: 130, align: 'right', render: fmt },
  { title: '당월 수금액', dataIndex: 'receiptTotal', width: 130, align: 'right', render: fmt },
  { title: '당월 외상매출금액', dataIndex: 'receivableTotal', width: 150, align: 'right', render: fmt },
  { title: '당월 연체금액', dataIndex: 'overdueTotal', width: 130, align: 'right', render: fmt },
];

export const RECEIPT_YEAR_COLUMNS = [
  { title: '년월', dataIndex: 'ym', width: 120, align: 'center' },
  { title: '수금금액', dataIndex: 'amount', width: 200, align: 'right', render: fmt },
];
