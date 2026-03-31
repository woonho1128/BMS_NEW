import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, ConfigProvider, Typography, Segmented, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { useKpiTableData } from '../hooks/useKpiTableData';
import { createYearOptions, getCurrentYear } from '../../../shared/utils/dateOptions';
import styles from './PartnerPerformancePage.module.css';

const { Text } = Typography;

const currentYear = getCurrentYear();
const yearOptions = createYearOptions();

const baseMockRows = [
  { key: 1, category1: '바닥재', category2: '포세린', itemCode: 'FT-1001', derivCode: '-', itemName: '600x600 유광 포세린', isDeliveryPossible: false },
  { key: 2, category1: '바닥재', category2: '포세린', itemCode: 'FT-1001', derivCode: 'BR', itemName: '600x600 유광 포세린 (브라운)', isDeliveryPossible: false },
  { key: 3, category1: '벽재', category2: '타일', itemCode: 'WT-2001', derivCode: '-', itemName: '300x600 글레이즈 기본', isDeliveryPossible: true },
  { key: 4, category1: '벽재', category2: '타일', itemCode: 'WT-2001', derivCode: 'MW', itemName: '300x600 매트 화이트', isDeliveryPossible: true },
  { key: 5, category1: '위생도기', category2: '양변기', itemCode: 'TB-5050', derivCode: '-', itemName: '투피스 치마형 양변기', isDeliveryPossible: true },
  { key: 6, category1: '천연석', category2: '마감재', itemCode: 'NS-3001', derivCode: '-', itemName: '천연석 슬랩 블랙', isDeliveryPossible: true },
];

export function CategorySalesPage() {
  const { pathname } = useLocation();
  const [filterValue, setFilterValue] = useState({
    year: String(currentYear),
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
      category: 'ALL',
      keyword: '',
    });
    setViewType('TOTAL');
  }, []);

  const filterFields = useMemo(() => [
    { id: 'year', label: '조회 연도', type: 'select', options: yearOptions, width: 100, row: 0 },
    {
      id: 'category', label: '대분류', type: 'select', row: 0, width: 140,
      options: [{ value: 'ALL', label: '전체 상품' }, { value: 'TILE', label: '타일' }, { value: 'BATH', label: '욕실/자재' }, { value: 'STONE', label: '천연석' }],
    },
    {
      id: 'keyword', label: '검색어', type: 'input', row: 0, width: 200, placeholder: '품번/제품명 입력',
    },
  ], []);

  const { mockData, dynamicColumns } = useKpiTableData(baseMockRows, viewType);

  const tableColumns = useMemo(() => {
    const fixedCols = [
      { title: '제품 분류', fixed: 'left', children: [
        { title: '대분류', dataIndex: 'category1', width: 90, fixed: 'left' },
        { title: '중분류', dataIndex: 'category2', width: 90, fixed: 'left' },
      ]},
      { title: '품목 정보', fixed: 'left', children: [
        { title: '품번', dataIndex: 'itemCode', width: 100, fixed: 'left', align: 'center' },
        { title: '파생품번', dataIndex: 'derivCode', width: 80, fixed: 'left', align: 'center' },
        { title: '품목/제품명', dataIndex: 'itemName', width: 180, fixed: 'left' },
      ]}
    ];

    const viewLabel = viewType === 'TOTAL' ? '도소매+납품 (합계)' : viewType === 'RETAIL' ? '도소매' : '납품';
    const dataCols = [
      {
        title: `${viewLabel} 수량 (단위: Box/Set)`,
        children: dynamicColumns,
      }
    ];

    return [...fixedCols, ...dataCols];
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
              <span className={styles.tableTitle}>카테고리별 판매 현황</span>
            </div>
            
            <div className={styles.tableTopRight}>
              <Segmented 
                options={[
                  { label: '전체 판량', value: 'TOTAL' },
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
        
        <div className={styles.helperText}>
          <Text type="secondary">파생품번은 기성 제품 대비 커스텀/파생 스펙을 의미하며 동일 품번 하위에 그룹핑 될 수 있습니다.</Text>
        </div>
      </div>
    </PageShell>
  );
}

export default CategorySalesPage;
