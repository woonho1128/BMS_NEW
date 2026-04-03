import React, { useState, useMemo, useCallback } from 'react';
import { Table, Tabs, Tag } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { usePagination } from '../../../shared/hooks/usePagination';
import { Pagination } from '../../../shared/components/Pagination/Pagination';
import { formatNumber } from '../../../shared/utils/formatters';
import styles from './DiscountPromotionPage.module.css';

// 숫자 콤마 헬퍼
const formatNum = (num) => formatNumber(num);

// ─────────────────────────────────────────────────────────────
// 1. 단가표 관리
// ─────────────────────────────────────────────────────────────
const PRICE_TABLE_COLUMNS = [
  { title: '매출구간', dataIndex: 'bracket', width: 160 },
  { title: '최소금액', dataIndex: 'minAmount', width: 150, align: 'right', render: formatNum },
  { title: '최대금액', dataIndex: 'maxAmount', width: 150, align: 'right', render: formatNum },
  { title: '할인율(%)', dataIndex: 'discountRate', width: 110, align: 'right', render: (v) => `${v}%` },
  { title: '비고', dataIndex: 'remarks', ellipsis: true },
];

const PRICE_TABLE_DATA = [
  { key: 1, bracket: '1,000백만원 초과', minAmount: 1000000000, maxAmount: 9999999999, discountRate: 21.42, remarks: '' },
  { key: 2, bracket: '700백만원', minAmount: 700000000, maxAmount: 1000000000, discountRate: 21.0, remarks: '' },
  { key: 3, bracket: '500백만원', minAmount: 500000000, maxAmount: 700000000, discountRate: 20.58, remarks: '' },
  { key: 4, bracket: '300백만원', minAmount: 300000000, maxAmount: 500000000, discountRate: 20.16, remarks: '' },
  { key: 5, bracket: '100백만원', minAmount: 100000000, maxAmount: 300000000, discountRate: 19.74, remarks: '' },
];

// ─────────────────────────────────────────────────────────────
// 2. 프로모션 관리
// ─────────────────────────────────────────────────────────────
const PROMOTION_COLUMNS = [
  { title: '구분', dataIndex: 'type', width: 130 },
  { title: '품목코드', dataIndex: 'itemCode', width: 110, align: 'center' },
  { title: '품목명', dataIndex: 'itemName', width: 210, ellipsis: true },
  { title: '계정', dataIndex: 'account', width: 80, align: 'center' },
  {
    title: '할인율(%)',
    dataIndex: 'discountRate',
    width: 100,
    align: 'right',
    render: (v) => <strong style={{ color: '#d9534f' }}>{v}%</strong>,
  },
  { title: '적용기간 (FR ~ TO)', dataIndex: 'period', width: 230, align: 'center' },
  {
    title: '사용여부',
    dataIndex: 'isActive',
    width: 90,
    align: 'center',
    render: (v) => <Tag color={v ? 'success' : 'error'}>{v ? 'YES' : 'NO'}</Tag>,
  },
  { title: '비고 (문서번호 등)', dataIndex: 'remarks', ellipsis: true },
];

const PROMOTION_DATA = [
  { key: 1, type: 'A (프로모션)', itemCode: 'CAH301G', itemName: '대변기세척밸브', account: '상품', discountRate: 25.93, period: '2025-12-24 ~ 2026-01-16', isActive: true, remarks: '12.22변경/523-2025-006645' },
  { key: 2, type: 'A (프로모션)', itemCode: 'CAH301V', itemName: '대변기세척밸브', account: '상품', discountRate: 22.2, period: '2024-10-17 ~ 2024-11-15', isActive: false, remarks: '523-2024-010505' },
  { key: 3, type: 'A (프로모션)', itemCode: 'CAH304V', itemName: '감지식세척밸브(대소)', account: '상품', discountRate: 24.99, period: '2024-10-17 ~ 2024-11-15', isActive: false, remarks: '523-2024-010505' },
  { key: 4, type: 'B (특가)', itemCode: 'FT-1001', itemName: '600각 라임스톤', account: '제품', discountRate: 18.5, period: '2026-01-01 ~ 2026-03-31', isActive: true, remarks: '1분기 특가' },
  { key: 5, type: 'B (특가)', itemCode: 'WT-2001', itemName: '300×600 네추럴그레이', account: '제품', discountRate: 17.0, period: '2026-02-01 ~ 2026-02-28', isActive: false, remarks: '재고소진' },
];

// ─────────────────────────────────────────────────────────────
// 3. 거래처별 할인율
// ─────────────────────────────────────────────────────────────
const CLIENT_DISCOUNT_COLUMNS = [
  { title: '대리점', dataIndex: 'dealerName', width: 200 },
  { title: '담당자', dataIndex: 'managerName', width: 90, align: 'center' },
  { title: '3개월 평균', dataIndex: 'avg3Month', width: 120, align: 'right', render: formatNum },
  { title: '전월', dataIndex: 'prevMonth', width: 120, align: 'right', render: formatNum },
  { title: '2개월전', dataIndex: 'twoMonthsAgo', width: 120, align: 'right', render: formatNum },
  { title: '3개월전', dataIndex: 'threeMonthsAgo', width: 120, align: 'right', render: formatNum },
  { title: '현재 할인율', dataIndex: 'currentDiscountRate', width: 110, align: 'right', render: (v) => `${v.toFixed(2)}%` },
  { title: '다음 매출 구간까지 남은 금액', dataIndex: 'remainingToNextTier', width: 180, align: 'right', render: formatNum },
  { title: '다음 매출구간 할인율', dataIndex: 'nextTierDiscountRate', width: 130, align: 'right', render: (v) => `${v.toFixed(2)}%` },
];

const CLIENT_DISCOUNT_DATA = Array.from({ length: 84 }, (_, idx) => {
  const n = idx + 1;
  const prevMonth = 5200000 + n * 315000;
  const twoMonthsAgo = 4700000 + n * 280000;
  const threeMonthsAgo = 4300000 + n * 265000;
  const avg3Month = Math.floor((prevMonth + twoMonthsAgo + threeMonthsAgo) / 3);
  const currentDiscountRate = Number((16 + (n % 8) * 0.43).toFixed(2));
  const nextTierDiscountRate = Number((currentDiscountRate + 0.5).toFixed(2));
  return {
    key: String(n),
    queryMonth: n % 2 === 0 ? '2026-04' : '2026-03',
    dealerCode: `05${String(1000 + n).slice(-4)}`,
    dealerName: ['한자회사 대림타일', '대원타일위생기사사', '디에스대성하우징(주)', '건영상사', '정웅도기타일상사'][idx % 5],
    managerCode: ['G848', 'D039', 'G999', 'G814', 'G846'][idx % 5],
    managerName: ['권순호', '박세현', '조동욱', '이해규', '유승신'][idx % 5],
    avg3Month,
    prevMonth,
    twoMonthsAgo,
    threeMonthsAgo,
    currentDiscountRate,
    remainingToNextTier: 1500000 + (idx % 9) * 920000,
    nextTierDiscountRate,
  };
});

export function DiscountPromotionPage() {
  const [activeTab, setActiveTab] = useState('1');
  const [filterValue, setFilterValue] = useState({
    version: 'V02',
    itemSearch: '',
    dateFrom: '',
    dateTo: '',
    isActive: '',
    clientSearch: '',
    discountYear: '2026',
    discountMonth: '04',
    discountDealer: '',
    discountManager: '',
  });

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue({
      version: 'V02',
      itemSearch: '',
      dateFrom: '',
      dateTo: '',
      isActive: '',
      clientSearch: '',
      discountYear: '2026',
      discountMonth: '04',
      discountDealer: '',
      discountManager: '',
    });
  }, []);

  const filterFields = useMemo(() => {
    switch (activeTab) {
      case '1':
        return [
          {
            id: 'version',
            label: '버전 선택',
            type: 'select',
            width: 160,
            row: 0,
            options: [
              { label: 'V02 (현재)', value: 'V02' },
              { label: 'V01 (과거)', value: 'V01' },
            ],
          },
        ];
      case '2':
        return [
          { id: 'itemSearch', label: '품목 검색', type: 'text', placeholder: '품목명 또는 코드', wide: true, row: 0 },
          { id: 'dateRange', label: '적용기간', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 },
          {
            id: 'isActive',
            label: '사용여부',
            type: 'select',
            width: 100,
            row: 0,
            options: [
              { label: '전체', value: '' },
              { label: 'YES', value: 'yes' },
              { label: 'NO', value: 'no' },
            ],
          },
        ];
      case '3':
        return [
          {
            id: 'discountYear',
            label: '조회년월',
            type: 'select',
            width: 100,
            row: 0,
            options: [
              { label: '2026년', value: '2026' },
              { label: '2025년', value: '2025' },
            ],
          },
          {
            id: 'discountMonth',
            label: '',
            type: 'select',
            width: 90,
            row: 0,
            options: Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}월`, value: String(i + 1).padStart(2, '0') })),
          },
          { id: 'discountDealer', label: '거래처', type: 'text', placeholder: '대리점 검색', wide: true, row: 0 },
          { id: 'discountManager', label: '영업그룹', type: 'text', placeholder: '담당자/코드', row: 0 },
        ];
      default:
        return [];
    }
  }, [activeTab]);

  const filteredClientDiscount = useMemo(() => {
    const month = `${filterValue.discountYear}-${filterValue.discountMonth}`;
    const dealerKeyword = filterValue.discountDealer.trim();
    const managerKeyword = filterValue.discountManager.trim();
    return CLIENT_DISCOUNT_DATA.filter((row) => {
      if (month && row.queryMonth !== month) return false;
      if (
        dealerKeyword &&
        !row.dealerName.includes(dealerKeyword) &&
        !row.dealerCode.includes(dealerKeyword)
      ) {
        return false;
      }
      if (
        managerKeyword &&
        !row.managerName.includes(managerKeyword) &&
        !row.managerCode.includes(managerKeyword)
      ) {
        return false;
      }
      return true;
    });
  }, [filterValue.discountDealer, filterValue.discountManager, filterValue.discountMonth, filterValue.discountYear]);

  const clientPagination = usePagination(filteredClientDiscount, { initialPageSize: 10 });
  const {
    currentPage: clientCurrentPage,
    pageSize: clientPageSize,
    totalCount: clientTotalCount,
    pagedData: pagedClientDiscount,
    setPage: setClientPage,
    setPageSize: setClientPageSize,
  } = clientPagination;

  const tabItems = [
    {
      key: '1',
      label: '단가표 관리',
      children: (
        <Table columns={PRICE_TABLE_COLUMNS} dataSource={PRICE_TABLE_DATA} bordered size="small" pagination={false} className={styles.gridTable} />
      ),
    },
    {
      key: '2',
      label: '프로모션 관리',
      children: (
        <Table columns={PROMOTION_COLUMNS} dataSource={PROMOTION_DATA} bordered size="small" pagination={{ pageSize: 10 }} scroll={{ x: 'max-content' }} className={styles.gridTable} />
      ),
    },
    {
      key: '3',
      label: '거래처별 할인율',
      children: (
        <div className={styles.tabTableSection}>
          <Table
            columns={CLIENT_DISCOUNT_COLUMNS}
            dataSource={pagedClientDiscount}
            bordered
            size="small"
            pagination={false}
            scroll={{ x: 'max-content' }}
            className={styles.gridTable}
          />
          <Pagination
            className={styles.pagination}
            totalCount={clientTotalCount}
            currentPage={clientCurrentPage}
            pageSize={clientPageSize}
            onPageChange={setClientPage}
            onPageSizeChange={setClientPageSize}
          />
        </div>
      ),
    },
  ];

  return (
    <PageShell path="/sales/support/discount-promotion" className={styles.shellWide}>
      <div className={styles.page}>
        <ListFilter
          fields={filterFields}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearch={() => {}}
          searchLabel="조회"
        />

        <div className={styles.tabsWrap}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              handleReset();
            }}
            items={tabItems}
            type="card"
            className={styles.tabs}
          />
        </div>
      </div>
    </PageShell>
  );
}

export default DiscountPromotionPage;
