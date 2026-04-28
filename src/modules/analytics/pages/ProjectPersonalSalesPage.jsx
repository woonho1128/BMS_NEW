import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, ConfigProvider, Button, Modal } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { useProjectPersonalSalesData } from '../hooks/useProjectPersonalSalesData';
import { createYearOptions, getCurrentYear } from '../../../shared/utils/dateOptions';
import styles from './ProjectPersonalSalesPage.module.css';

const currentYear = getCurrentYear();
const yearOptions = createYearOptions();

function formatNumber(value) {
  return value ? new Intl.NumberFormat('ko-KR').format(value) : '-';
}

function formatRate(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

export function ProjectPersonalSalesPage() {
  const { pathname } = useLocation();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [filterValue, setFilterValue] = useState({
    year: String(currentYear),
    team: 'ALL',
    keyword: '',
  });

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue({
      year: String(currentYear),
      team: 'ALL',
      keyword: '',
    });
  }, []);

  const filterFields = useMemo(
    () => [
      { id: 'year', label: '조회 연도', type: 'select', options: yearOptions, width: 100, row: 0 },
      {
        id: 'team',
        label: '영업팀',
        type: 'select',
        row: 0,
        width: 170,
        options: [
          { value: 'ALL', label: '전체 팀' },
          { value: 'P1', label: '프로젝트1팀' },
          { value: 'P2', label: '프로젝트2팀' },
        ],
      },
      {
        id: 'keyword',
        label: '검색어',
        type: 'input',
        row: 0,
        width: 220,
        placeholder: '담당자명 입력',
      },
    ],
    []
  );

  const { rows, columns, summaryCards, periodSummaryRows } = useProjectPersonalSalesData(filterValue);

  const tableColumns = useMemo(() => {
    const fixedCols = [
      {
        title: '조직명',
        dataIndex: 'orgName',
        width: 110,
        fixed: 'left',
        onCell: (record) => ({ rowSpan: record.rowSpanTeam }),
      },
      {
        title: '팀명',
        dataIndex: 'teamName',
        width: 120,
        fixed: 'left',
        onCell: (record) => ({ rowSpan: record.rowSpanTeam }),
        render: (text) => <b>{text}</b>,
      },
      {
        title: '담당자',
        dataIndex: 'managerName',
        width: 120,
        fixed: 'left',
        align: 'center',
        render: (text, record) => (
          <div>
            <div style={{ fontWeight: record.isTotal ? 700 : 400 }}>{text}</div>
            {record.position && <div style={{ fontSize: 11, color: '#888' }}>{record.position}</div>}
          </div>
        ),
      },
      {
        title: '구분',
        dataIndex: 'rowType',
        width: 110,
        fixed: 'left',
        align: 'center',
      },
    ];
    return [...fixedCols, ...columns];
  }, [columns]);

  const summaryColumns = useMemo(
    () => [
      { title: '구간', dataIndex: 'period', width: 110 },
      { title: '계획', dataIndex: 'plan', align: 'right', render: formatNumber },
      { title: '실적', dataIndex: 'actual', align: 'right', render: formatNumber },
      { title: '달성률', dataIndex: 'achievement', align: 'right', render: formatRate },
      { title: '매출총이익', dataIndex: 'grossProfit', align: 'right', render: formatNumber },
      { title: '매출총이익률(%)', dataIndex: 'grossRate', align: 'right', render: formatRate },
    ],
    []
  );

  return (
    <PageShell path={pathname} title="프로젝트 개인 별 매출 현황" className={styles.shellWide}>
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

        <section className={styles.summaryCards}>
          {summaryCards.map((card) => (
            <article key={card.key} className={styles.summaryCard}>
              <div className={styles.summaryCardTitle}>{card.title}</div>
              <div className={styles.summaryCardMain}>
                <span>달성률</span>
                <strong>{formatRate(card.achievement)}</strong>
              </div>
              <div className={styles.summaryCardMeta}>
                <span>계획 {formatNumber(card.plan)}</span>
                <span>실적 {formatNumber(card.actual)}</span>
                <span>이익률 {formatRate(card.grossRate)}</span>
              </div>
            </article>
          ))}
        </section>

        <div className={styles.tableStage}>
          <div className={styles.tableTop}>
            <div className={styles.tableTopLeft}>
              <span className={styles.tableTitle}>프로젝트 개인 별 매출 현황 (계획 vs 실적)</span>
            </div>
            <div className={styles.tableTopRight}>
              <Button className={styles.summaryDetailButton} onClick={() => setSummaryOpen(true)}>
                기간 요약 상세
              </Button>
              <Button className={styles.excelButton} icon={<DownloadOutlined />}>
                엑셀
              </Button>
            </div>
          </div>

          <ConfigProvider
            theme={{ components: { Table: { headerBg: '#f5f8ff', headerColor: '#344256', cellPaddingBlock: 6 } } }}
          >
            <Table
              columns={tableColumns}
              dataSource={rows}
              bordered
              size="small"
              pagination={false}
              scroll={{ x: 'max-content', y: 620 }}
              rowClassName={(record) => (record.isTotal ? 'table-row-total-sub' : 'table-row-light')}
              className={styles.performanceTable}
            />
          </ConfigProvider>
        </div>

        <Modal
          open={summaryOpen}
          onCancel={() => setSummaryOpen(false)}
          footer={null}
          title="분기/반기/연간 요약"
          width={980}
        >
          <Table
            rowKey="key"
            columns={summaryColumns}
            dataSource={periodSummaryRows}
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </Modal>
      </div>
    </PageShell>
  );
}

export default ProjectPersonalSalesPage;
