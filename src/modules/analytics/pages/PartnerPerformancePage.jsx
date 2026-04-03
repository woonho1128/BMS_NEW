import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, ConfigProvider, Segmented, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { useKpiTableData } from '../hooks/useKpiTableData';
import { createYearOptions, getCurrentYear } from '../../../shared/utils/dateOptions';
import styles from './PartnerPerformancePage.module.css';

const currentYear = getCurrentYear();
const yearOptions = createYearOptions();

const baseMockRows = [
  { key: 1, orgName: '리테일1팀', managerName: '김민수', clientCode: '092895', clientName: '한샘대리점', isDeliveryPossible: false },
  { key: 2, orgName: '리테일1팀', managerName: '김민수', clientCode: '092777', clientName: '대원타일', isDeliveryPossible: false },
  { key: 3, orgName: '리테일2팀', managerName: '박진우', clientCode: '206951', clientName: '주원타일', isDeliveryPossible: true },
  { key: 4, orgName: '리테일2팀', managerName: '박진우', clientCode: '091635', clientName: '그린위생기', isDeliveryPossible: true },
  { key: 5, orgName: '리테일2팀', managerName: '김민수', clientCode: '198874', clientName: '영우세라믹', isDeliveryPossible: true },
  { key: 6, orgName: '리테일3팀', managerName: '박진우', clientCode: '102617', clientName: '동인생활기', isDeliveryPossible: true },
  { key: 7, orgName: '리테일3팀', managerName: '김민수', clientCode: '196901', clientName: '백제도기', isDeliveryPossible: false },
  { key: 8, orgName: '영업지원팀', managerName: '조동현', clientCode: '123855', clientName: '서양세라믹', isDeliveryPossible: true },
];

const SALES_PLAN_MOCK = {
  1: 1280,
  2: 980,
  3: 1430,
  4: 870,
  5: 1110,
  6: 760,
  7: 620,
  8: 1540,
};

export function PartnerPerformancePage() {
  const { pathname } = useLocation();
  const [filterValue, setFilterValue] = useState({
    year: String(currentYear),
    region: 'ALL',
    category: 'ALL',
    keyword: '',
  });
  const [viewType, setViewType] = useState('TOTAL');

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue({
      year: String(currentYear),
      region: 'ALL',
      category: 'ALL',
      keyword: '',
    });
    setViewType('TOTAL');
  }, []);

  const filterFields = useMemo(
    () => [
      { id: 'year', label: '조회 연도', type: 'select', options: yearOptions, width: 100, row: 0 },
      {
        id: 'region',
        label: '지역 구분',
        type: 'select',
        row: 0,
        width: 140,
        options: [
          { value: 'ALL', label: '전체' },
          { value: 'SEOUL', label: '서울/수도권' },
          { value: 'LOCAL', label: '지방' },
        ],
      },
      {
        id: 'category',
        label: '카테고리',
        type: 'select',
        row: 0,
        width: 140,
        options: [
          { value: 'ALL', label: '전체 상품' },
          { value: 'TILE', label: '타일' },
          { value: 'BATH', label: '욕실/자재' },
        ],
      },
      {
        id: 'keyword',
        label: '검색어',
        type: 'input',
        row: 0,
        width: 220,
        placeholder: '거래처코드 또는 거래처명 입력',
      },
    ],
    []
  );

  const rowsWithSalesPlan = useMemo(
    () => baseMockRows.map((row) => ({ ...row, salesPlan: SALES_PLAN_MOCK[row.key] ?? 0 })),
    []
  );

  const { mockData, dynamicColumns } = useKpiTableData(rowsWithSalesPlan, viewType);

  const tableColumns = useMemo(() => {
    const fixedCols = [
      {
        title: '조직/담당',
        fixed: 'left',
        children: [
          { title: '영업조직', dataIndex: 'orgName', width: 110, fixed: 'left' },
          { title: '영업담당', dataIndex: 'managerName', width: 90, fixed: 'left' },
        ],
      },
      {
        title: '거래처정보',
        fixed: 'left',
        children: [
          { title: '거래처코드', dataIndex: 'clientCode', width: 110, fixed: 'left', align: 'center' },
          { title: '거래처명', dataIndex: 'clientName', width: 180, fixed: 'left' },
          {
            title: '매출계획',
            dataIndex: 'salesPlan',
            width: 120,
            fixed: 'left',
            align: 'right',
            render: (value) => Number(value || 0).toLocaleString('ko-KR'),
          },
        ],
      },
    ];

    const viewLabel = viewType === 'TOTAL' ? '도소매+납품(합계)' : viewType === 'RETAIL' ? '도소매' : '납품';

    return [
      ...fixedCols,
      {
        title: `${viewLabel} (단위: 백만원)`,
        children: dynamicColumns,
      },
    ];
  }, [dynamicColumns, viewType]);

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
              <span className={styles.tableTitle}>대리점별 매출 현황</span>
              <span className={styles.tableMeta}>기준 연도: {filterValue.year}년</span>
            </div>

            <div className={styles.tableTopRight}>
              <Segmented
                options={[
                  { label: '전체(합계)', value: 'TOTAL' },
                  { label: '도소매', value: 'RETAIL' },
                  { label: '납품', value: 'DELIVERY' },
                ]}
                value={viewType}
                onChange={setViewType}
              />
              <span className={styles.tableCount}>총 {mockData.length}건</span>
              <Button icon={<DownloadOutlined />}>엑셀</Button>
            </div>
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
      </div>
    </PageShell>
  );
}

export default PartnerPerformancePage;

