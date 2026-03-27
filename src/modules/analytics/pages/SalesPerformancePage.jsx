import { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, ConfigProvider, Typography } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import styles from './SalesPerformancePage.module.css';

const { Text } = Typography;

const formatNumber = (num) => new Intl.NumberFormat('ko-KR').format(num || 0);

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) => {
  const y = String(currentYear - i);
  return { value: y, label: `${y}년` };
});

const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const m = String(i + 1).padStart(2, '0');
  return { value: m, label: `${i + 1}월` };
});

function buildMonthData(startYear, startMonth, endYear, endMonth, seed = 1) {
  const result = {};
  let y = parseInt(startYear, 10);
  let m = parseInt(startMonth, 10);
  const ey = parseInt(endYear, 10);
  const em = parseInt(endMonth, 10);

  let idx = 0;
  while (y < ey || (y === ey && m <= em)) {
    const mm = String(m).padStart(2, '0');
    const key = `${y}${mm}`;
    const sales = Math.max(1000000, 12000000 + seed * 2300000 + idx * 1700000);
    const cost = Math.floor(sales * 0.72);
    result[`${key}_sales`] = sales;
    result[`${key}_cost`] = cost;
    result[`${key}_profit`] = sales - cost;
    idx += 1;
    m += 1;
    if (m > 12) {
      y += 1;
      m = 1;
    }
  }

  return result;
}

function sumBySuffix(row, suffix) {
  return Object.entries(row)
    .filter(([key]) => key.endsWith(suffix) && /^\d{6}_/.test(key))
    .reduce((acc, [, val]) => acc + (Number(val) || 0), 0);
}

export function SalesPerformancePage() {
  const { pathname } = useLocation();
  const [filterValue, setFilterValue] = useState({
    startYear: String(currentYear),
    startMonth: '09',
    endYear: String(currentYear),
    endMonth: '11',
    outputType: 'client',
    searchCategory: 'transactionType',
    salesGroup: 'S112',
    itemGroup: '',
  });

  const searchCategoryOptions = useMemo(() => {
    switch (filterValue.outputType) {
      case 'item':
        return [{ label: '품목별', value: 'item' }];
      case 'org':
        return [
          { label: '영업사원', value: 'manager' },
          { label: '영업조직', value: 'org' },
        ];
      case 'client':
        return [
          { label: '거래유형', value: 'transactionType' },
          { label: '품목계정', value: 'itemAccount' },
        ];
      default:
        return [];
    }
  }, [filterValue.outputType]);

  const groupColumns = useMemo(() => {
    const key = `${filterValue.outputType}__${filterValue.searchCategory}`;
    switch (key) {
      case 'item__item':
        return [
          { title: '대분류', dataIndex: 'category1', width: 110, fixed: 'left' },
          { title: '중분류', dataIndex: 'category2', width: 110, fixed: 'left' },
          { title: '품목코드', dataIndex: 'itemCode', width: 120, fixed: 'left' },
          { title: '품목명', dataIndex: 'itemName', width: 180, fixed: 'left' },
        ];
      case 'org__manager':
        return [
          { title: '영업조직', dataIndex: 'orgName', width: 140, fixed: 'left' },
          { title: '영업사원', dataIndex: 'managerName', width: 120, fixed: 'left' },
        ];
      case 'org__org':
        return [{ title: '영업조직', dataIndex: 'orgName', width: 160, fixed: 'left' }];
      case 'client__transactionType':
        return [
          { title: '거래처', dataIndex: 'clientName', width: 180, fixed: 'left' },
          { title: '거래유형', dataIndex: 'transactionType', width: 120, fixed: 'left' },
        ];
      case 'client__itemAccount':
        return [
          { title: '거래처', dataIndex: 'clientName', width: 180, fixed: 'left' },
          { title: '품목구분', dataIndex: 'itemAccount', width: 120, fixed: 'left' },
        ];
      default:
        return [{ title: '거래처', dataIndex: 'clientName', width: 180, fixed: 'left' }];
    }
  }, [filterValue.outputType, filterValue.searchCategory]);

  useEffect(() => {
    setFilterValue((prev) => ({ ...prev, searchCategory: searchCategoryOptions[0]?.value ?? '' }));
  }, [filterValue.outputType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue({
      startYear: String(currentYear),
      startMonth: '09',
      endYear: String(currentYear),
      endMonth: '11',
      outputType: 'client',
      searchCategory: 'transactionType',
      salesGroup: 'S112',
      itemGroup: '',
    });
  }, []);

  const filterFields = useMemo(() => [
    { id: 'startYear', label: '조회 시작', type: 'select', options: yearOptions, width: 90, row: 0 },
    { id: 'startMonth', label: '', type: 'select', options: monthOptions, width: 72, row: 0 },
    { id: 'endYear', label: '~ 종료', type: 'select', options: yearOptions, width: 90, row: 0 },
    { id: 'endMonth', label: '', type: 'select', options: monthOptions, width: 72, row: 0 },
    {
      id: 'outputType', label: '출력물', type: 'radio', row: 0,
      options: [
        { value: 'item', label: '품목별' },
        { value: 'org', label: '조직별' },
        { value: 'client', label: '거래처별' },
      ],
    },
    {
      id: 'salesGroup', label: '영업그룹', type: 'select', row: 1, width: 180,
      options: [{ label: 'S112 | 리테일팀', value: 'S112' }],
    },
    {
      id: 'searchCategory', label: '조회구분', type: 'select', row: 1, width: 130,
      options: searchCategoryOptions,
    },
    {
      id: 'itemGroup', label: '품목그룹', type: 'select', row: 1, width: 130,
      options: [{ label: '전체', value: '' }],
    },
  ], [searchCategoryOptions]);

  const tableColumns = useMemo(() => {
    const columns = [{
      title: '구분',
      fixed: 'left',
      children: [
        { title: 'No.', dataIndex: 'key', width: 60, align: 'center', fixed: 'left' },
        ...groupColumns,
      ],
    }];

    const sy = parseInt(filterValue.startYear, 10);
    const sm = parseInt(filterValue.startMonth, 10);
    const ey = parseInt(filterValue.endYear, 10);
    const em = parseInt(filterValue.endMonth, 10);

    let y = sy;
    let m = sm;
    while (y < ey || (y === ey && m <= em)) {
      const mm = String(m).padStart(2, '0');
      const keyPrefix = `${y}${mm}`;
      columns.push({
        title: `${m}월`,
        children: [
          { title: '매출', dataIndex: `${keyPrefix}_sales`, width: 120, align: 'right', render: formatNumber },
          { title: '원가', dataIndex: `${keyPrefix}_cost`, width: 120, align: 'right', render: formatNumber },
          {
            title: '이익',
            dataIndex: `${keyPrefix}_profit`,
            width: 120,
            align: 'right',
            render: (val) => <span style={{ color: val < 0 ? '#d43030' : 'inherit' }}>{formatNumber(val)}</span>,
          },
        ],
      });
      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
    }

    columns.push({
      title: '합계',
      children: [
        { title: '매출', dataIndex: 'total_sales', width: 130, align: 'right', render: formatNumber, className: 'total-col' },
        { title: '원가', dataIndex: 'total_cost', width: 130, align: 'right', render: formatNumber, className: 'total-col' },
        { title: '이익', dataIndex: 'total_profit', width: 130, align: 'right', render: formatNumber, className: 'total-col' },
      ],
    });

    return columns;
  }, [filterValue.startYear, filterValue.startMonth, filterValue.endYear, filterValue.endMonth, groupColumns]);

  const baseRows = useMemo(() => [
    { key: 1, clientName: '가온인테리어', transactionType: '매출', itemAccount: '바닥재', orgName: '리테일팀', managerName: '김민수', category1: '바닥재', category2: '포세린', itemCode: 'FT-1001', itemName: '600x600 포세린' },
    { key: 2, clientName: '대성세라믹', transactionType: '매출', itemAccount: '위생도기', orgName: '리테일팀', managerName: '이서현', category1: '벽재', category2: '타일', itemCode: 'WT-2001', itemName: '300x600 글레이즈' },
    { key: 3, clientName: '현대종합건설', transactionType: '반품', itemAccount: '타일', orgName: '프로젝트팀', managerName: '박지훈', category1: '천연석', category2: '마감재', itemCode: 'NS-3001', itemName: '천연석 슬랩' },
  ], []);

  const mockData = useMemo(() => {
    return baseRows.map((row, idx) => {
      const monthData = buildMonthData(
        filterValue.startYear,
        filterValue.startMonth,
        filterValue.endYear,
        filterValue.endMonth,
        idx + 1,
      );
      const merged = { ...row, ...monthData };
      return {
        ...merged,
        total_sales: sumBySuffix(merged, '_sales'),
        total_cost: sumBySuffix(merged, '_cost'),
        total_profit: sumBySuffix(merged, '_profit'),
      };
    });
  }, [baseRows, filterValue.startYear, filterValue.startMonth, filterValue.endYear, filterValue.endMonth]);

  return (
    <PageShell path={pathname} className={styles.shellWide}>
      <div className={styles.page}>
        <ListFilter
          className={styles.filterBar}
          fields={filterFields}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearch={() => {}}
          searchLabel="조회"
        />

        <div className={styles.tableStage}>
          <div className={styles.tableTop}>
            <div className={styles.tableTopLeft}>
              <span className={styles.tableTitle}>리테일 매출 분석 결과</span>
              <span className={styles.tableMeta}>
                조회기간: {filterValue.startYear}.{filterValue.startMonth} ~ {filterValue.endYear}.{filterValue.endMonth}
              </span>
            </div>
            <span className={styles.tableCount}>총 {mockData.length}건</span>
          </div>
          <ConfigProvider theme={{ components: { Table: { headerBg: '#f5f8ff', headerColor: '#344256' } } }}>
            <Table
              columns={tableColumns}
              dataSource={mockData}
              bordered
              size="small"
              pagination={false}
              scroll={{ x: 'max-content', y: 620 }}
              rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
              className={styles.performanceTable}
            />
          </ConfigProvider>
        </div>

        <div className={styles.helperText}>
          <Text type="secondary">품목별 조회 시 속도가 느릴 수 있습니다.</Text>
        </div>
      </div>
    </PageShell>
  );
}

export default SalesPerformancePage;
