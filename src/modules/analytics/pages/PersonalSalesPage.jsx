import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, ConfigProvider, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { usePersonalSalesData } from '../hooks/usePersonalSalesData';
import { createYearOptions, getCurrentYear } from '../../../shared/utils/dateOptions';
import styles from './PersonalSalesPage.module.css';

const currentYear = getCurrentYear();
const yearOptions = createYearOptions();

export function PersonalSalesPage() {
  const { pathname } = useLocation();
  const [filterValue, setFilterValue] = useState({
    year: String(currentYear),
    category: 'ALL',
    team: 'ALL',
    keyword: '',
  });

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue({
      year: String(currentYear),
      category: 'ALL',
      team: 'ALL',
      keyword: '',
    });
  }, []);

  const filterFields = useMemo(() => [
    { id: 'year', label: '조회 연도', type: 'select', options: yearOptions, width: 100, row: 0 },
    {
      id: 'category', label: '카테고리', type: 'select', row: 0, width: 140,
      options: [{ value: 'ALL', label: '전체 상품' }, { value: 'TILE', label: '타일' }, { value: 'BATH', label: '욕실/자재' }],
    },
    {
      id: 'team', label: '영업팀', type: 'select', row: 0, width: 160,
      options: [{ value: 'ALL', label: '전체 팀' }, { value: 'R1', label: '리테일1팀' }, { value: 'R2', label: '리테일2팀' }, { value: 'P1', label: '특판1팀' }],
    },
    {
      id: 'keyword', label: '검색어', type: 'input', row: 0, width: 200, placeholder: '사원명 입력',
    },
  ], []);

  const { mockData, dynamicColumns } = usePersonalSalesData();

  const tableColumns = useMemo(() => {
    const fixedCols = [
      {
        title: '조직명',
        dataIndex: 'orgName',
        width: 100,
        fixed: 'left',
        onCell: (record) => ({ rowSpan: record.rowSpanTeam }),
      },
      {
        title: '팀명',
        dataIndex: 'teamName',
        width: 100,
        fixed: 'left',
        onCell: (record) => ({ rowSpan: record.rowSpanTeam }),
        render: (text) => <b>{text}</b>
      },
      {
        title: '담당자',
        dataIndex: 'managerName',
        width: 100,
        fixed: 'left',
        align: 'center',
        onCell: (record) => ({ rowSpan: record.rowSpanManager }),
        render: (text, record) => (
            <div>
              <div style={{ fontWeight: record.isTotal ? 'bold' : 'normal' }}>{text}</div>
              {record.position && <div style={{ fontSize: 11, color: '#888' }}>{record.position}</div>}
            </div>
        )
      },
      {
        title: '구 분',
        dataIndex: 'rowType',
        width: 100,
        fixed: 'left',
        align: 'center',
        onCell: () => {
            // Apply a slight background color for specific rows if needed, but styling is better handled in CSS `rowClassName`
            return {};
        },
        render: (text, record) => <span style={{ fontWeight: record.isSubTotal ? 600 : 400 }}>{text}</span>
      }
    ];

    return [...fixedCols, ...dynamicColumns];
  }, [dynamicColumns]);

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
              <span className={styles.tableTitle}>개인별 현황 (계획 vs 실적)</span>
            </div>
            <div className={styles.tableTopRight}>
              <Button icon={<DownloadOutlined />}>엑셀</Button>
            </div>
          </div>

          <ConfigProvider theme={{ components: { Table: { headerBg: '#f5f8ff', headerColor: '#344256', cellPaddingBlock: 6 } } }}>
            <Table
              columns={tableColumns}
              dataSource={mockData}
              bordered
              size="small"
              pagination={false}
              scroll={{ x: 'max-content', y: 620 }}
              rowClassName={(record) => {
                if (record.isTotal && record.isSubTotal) return 'table-row-total-sub'; // 합계 계
                if (record.isTotal) return 'table-row-total'; // 합계 일반
                if (record.isSubTotal) return 'table-row-sub'; // 일반 계
                return 'table-row-light';
              }}
              className={styles.performanceTable}
            />
          </ConfigProvider>
        </div>
      </div>
    </PageShell>
  );
}

export default PersonalSalesPage;
