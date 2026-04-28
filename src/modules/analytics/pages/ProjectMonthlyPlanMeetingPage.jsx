import React, { useMemo, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Tag } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { formatNumber } from '../../../shared/utils/formatters';
import { createYearOptions, getCurrentYear } from '../../../shared/utils/dateOptions';
import { createProjectMonthlyPlanRows, MONTH_KEYS } from '../data/projectMonthlyPlanMeetingMock';
import styles from './ProjectMonthlyPlanMeetingPage.module.css';

const YEAR_OPTIONS = createYearOptions();

const QUARTER_GROUPS = [
  { label: '1분기', months: ['m1', 'm2', 'm3'] },
  { label: '2분기', months: ['m4', 'm5', 'm6'] },
  { label: '3분기', months: ['m7', 'm8', 'm9'] },
  { label: '4분기', months: ['m10', 'm11', 'm12'] },
];

export function ProjectMonthlyPlanMeetingPage() {
  const { pathname } = useLocation();
  const currentYear = String(getCurrentYear());
  const [filters, setFilters] = useState({ year: currentYear });
  const rows = useMemo(() => createProjectMonthlyPlanRows(), []);

  const handleFilterChange = useCallback((id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters({ year: currentYear });
  }, [currentYear]);

  const filterFields = useMemo(
    () => [{ id: 'year', label: '연도', type: 'select', options: YEAR_OPTIONS, width: 108, row: 0 }],
    []
  );

  const sectionTitle = `${filters.year}년 계획`;

  return (
    <PageShell
      path={pathname}
      title="월별 계획 회의 관리"
      description="프로젝트부문 월별 계획 조회 화면"
      className={styles.shellWide}
    >
      <div className={styles.page}>
        <ListFilter
          className={styles.filterBar}
          fields={filterFields}
          value={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearch={() => {}}
          searchLabel="조회"
        />

        <section className={styles.infoBar}>
          <Tag color="blue">{sectionTitle}</Tag>
          <span>조회 전용 화면이며 편집 기능은 제공하지 않습니다.</span>
        </section>

        <section className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.matrixTable}>
              <colgroup>
                {Array.from({ length: 15 }).map((_, idx) => (
                  <col key={`col-${idx + 1}`} style={{ width: `${100 / 15}%` }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th rowSpan={3}>성명</th>
                  <th rowSpan={3}>구분</th>
                  <th colSpan={13}>{sectionTitle}</th>
                </tr>
                <tr>
                  {QUARTER_GROUPS.map((q) => (
                    <th key={q.label} colSpan={3}>
                      {q.label}
                    </th>
                  ))}
                  <th rowSpan={2}>합계</th>
                </tr>
                <tr>
                  {MONTH_KEYS.map((key, index) => (
                    <th key={key}>{index + 1}월</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className={row.isTotal ? styles.totalRow : ''}>
                    <td className={styles.leftCell}>{row.name}</td>
                    <td className={styles.leftCell}>{row.type}</td>
                    {MONTH_KEYS.map((monthKey) => (
                      <td key={`${row.id}-${monthKey}`}>{formatNumber(row.plan[monthKey])}</td>
                    ))}
                    <td className={styles.totalCol}>{formatNumber(row.plan.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default ProjectMonthlyPlanMeetingPage;
