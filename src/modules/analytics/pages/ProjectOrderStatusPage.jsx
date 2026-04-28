import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { createMonthOptions, createYearOptions, getCurrentYear } from '../../../shared/utils/dateOptions';
import styles from './ProjectOrderStatusPage.module.css';

const now = new Date();
const currentYear = getCurrentYear();
const currentMonth = now.getMonth() + 1;

const yearOptions = createYearOptions();
const monthOptions = createMonthOptions();
const monthKeys = [1, 2, 3, 4];

const teamOptions = [
  { value: 'project-1', label: '프로젝트1팀' },
  { value: 'project-2', label: '프로젝트2팀' },
];

function n(value) {
  return Number(value || 0);
}

function formatAmount(value) {
  return n(value).toLocaleString('ko-KR');
}

function formatRate(value) {
  return `${n(value).toFixed(1)}%`;
}

function createMonthData(plan, actual, standardCost) {
  const grossProfit = actual - standardCost;
  const achievementRate = plan > 0 ? (actual / plan) * 100 : 0;
  const grossMarginRate = actual > 0 ? (grossProfit / actual) * 100 : 0;
  return {
    plan,
    actual,
    standardCost,
    grossProfit,
    achievementRate,
    grossMarginRate,
  };
}

const teamBlocks = [
  {
    team: '프로젝트1팀',
    monthly: {
      1: createMonthData(12500, 13200, 9800),
      2: createMonthData(13800, 14100, 10600),
      3: createMonthData(14600, 15000, 11200),
      4: createMonthData(14900, 15300, 11500),
    },
  },
  {
    team: '프로젝트2팀',
    monthly: {
      1: createMonthData(11800, 11100, 8500),
      2: createMonthData(12600, 12900, 9600),
      3: createMonthData(13400, 13700, 10200),
      4: createMonthData(14100, 14500, 10800),
    },
  },
];

function buildCumulative(monthly) {
  const totals = monthKeys.reduce(
    (acc, month) => {
      const row = monthly[month];
      acc.plan += row.plan;
      acc.actual += row.actual;
      acc.standardCost += row.standardCost;
      return acc;
    },
    { plan: 0, actual: 0, standardCost: 0 }
  );

  const grossProfit = totals.actual - totals.standardCost;
  return {
    ...totals,
    grossProfit,
    achievementRate: totals.plan > 0 ? (totals.actual / totals.plan) * 100 : 0,
    grossMarginRate: totals.actual > 0 ? (grossProfit / totals.actual) * 100 : 0,
  };
}

function buildDivisionTotal(blocks) {
  const monthly = monthKeys.reduce((acc, month) => {
    const plan = blocks.reduce((sum, block) => sum + block.monthly[month].plan, 0);
    const actual = blocks.reduce((sum, block) => sum + block.monthly[month].actual, 0);
    const standardCost = blocks.reduce((sum, block) => sum + block.monthly[month].standardCost, 0);
    acc[month] = createMonthData(plan, actual, standardCost);
    return acc;
  }, {});

  return {
    team: '프로젝트부문 전체',
    monthly,
  };
}

export function ProjectOrderStatusPage() {
  const { pathname } = useLocation();
  const [filters, setFilters] = useState({
    year: String(currentYear),
    month: String(currentMonth),
    teams: teamOptions.map((team) => team.value),
  });

  const filterFields = useMemo(
    () => [
      { id: 'year', label: '기준연도', type: 'select', options: yearOptions, width: 116, row: 0 },
      { id: 'month', label: '기준월', type: 'select', options: monthOptions, width: 90, row: 0 },
      { id: 'teams', label: '팀', type: 'checkbox', options: teamOptions, row: 0 },
    ],
    []
  );

  const visibleTeamBlocks = useMemo(() => {
    const selectedTeams = Array.isArray(filters.teams) ? filters.teams : [];
    if (selectedTeams.length === 0) return [];
    return teamBlocks.filter((teamBlock) =>
      selectedTeams.includes(teamOptions.find((item) => item.label === teamBlock.team)?.value)
    );
  }, [filters.teams]);

  const allBlocks = useMemo(() => {
    return [buildDivisionTotal(visibleTeamBlocks), ...visibleTeamBlocks];
  }, [visibleTeamBlocks]);

  const summary = useMemo(() => {
    const merged = buildCumulative(
      monthKeys.reduce((acc, month) => {
        const plan = allBlocks.reduce((sum, block) => sum + block.monthly[month].plan, 0);
        const actual = allBlocks.reduce((sum, block) => sum + block.monthly[month].actual, 0);
        const standardCost = allBlocks.reduce((sum, block) => sum + block.monthly[month].standardCost, 0);
        acc[month] = createMonthData(plan, actual, standardCost);
        return acc;
      }, {})
    );
    return merged;
  }, [allBlocks]);

  const tableRows = useMemo(() => {
    return allBlocks.map((block) => ({
      id: block.team,
      team: block.team,
      type: '수주금액',
      cumulative: buildCumulative(block.monthly),
      monthly: block.monthly,
      isTotalTeam: block.team === '프로젝트부문 전체',
    }));
  }, [allBlocks]);

  return (
    <PageShell path={pathname} title="프로젝트 수주 현황" className={styles.shellWide}>
      <div className={styles.page}>
        <ListFilter
          className={styles.filterBar}
          fields={filterFields}
          value={filters}
          onChange={(id, value) => setFilters((prev) => ({ ...prev, [id]: value }))}
          onReset={() =>
            setFilters({
              year: String(currentYear),
              month: String(currentMonth),
              teams: teamOptions.map((team) => team.value),
            })
          }
          onSearch={() => {}}
        />

        <section className={styles.kpiRow}>
          <article className={styles.kpiCard}>
            <span className={styles.kpiLabel}>누계 계획</span>
            <strong className={styles.kpiValue}>{formatAmount(summary.plan)}</strong>
          </article>
          <article className={styles.kpiCard}>
            <span className={styles.kpiLabel}>누계 실적</span>
            <strong className={styles.kpiValue}>{formatAmount(summary.actual)}</strong>
          </article>
          <article className={styles.kpiCard}>
            <span className={styles.kpiLabel}>누계 달성률</span>
            <strong className={styles.kpiValueRate}>{formatRate(summary.achievementRate)}</strong>
          </article>
        </section>

        <section className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>프로젝트 수주 현황 (계획 vs 실적)</div>
            <div className={styles.tableMeta}>
              {filters.year}년 / 기준월 {filters.month}월 / 선택 팀: {visibleTeamBlocks.length}개
            </div>
            <div className={styles.tableCount}>총 {tableRows.length}행</div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th rowSpan={2}>팀</th>
                  <th rowSpan={2}>구분</th>
                  <th colSpan={4}>1~12월 누계</th>
                  {monthKeys.map((month) => (
                    <th key={`group-${month}`} colSpan={4}>
                      {month}월
                    </th>
                  ))}
                </tr>
                <tr>
                  <th>계획</th>
                  <th>실적</th>
                  <th>달성률</th>
                  <th>
                    매출총이익률
                    <br />
                    (%)
                  </th>
                  {monthKeys.map((month) => (
                    <React.Fragment key={`detail-${month}`}>
                      <th>계획</th>
                      <th>실적</th>
                      <th>달성률</th>
                      <th>
                        매출총이익률
                        <br />
                        (%)
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.id} className={row.isTotalTeam ? styles.totalRow : undefined}>
                    <th className={styles.teamCell}>{row.team}</th>
                    <td className={styles.typeCell}>{row.type}</td>
                    <td className={styles.numCell}>{formatAmount(row.cumulative.plan)}</td>
                    <td className={styles.numCell}>{formatAmount(row.cumulative.actual)}</td>
                    <td className={styles.rateCell}>{formatRate(row.cumulative.achievementRate)}</td>
                    <td className={styles.rateCell}>{formatRate(row.cumulative.grossMarginRate)}</td>
                    {monthKeys.map((month) => (
                      <React.Fragment key={`${row.id}-${month}`}>
                        <td className={styles.numCell}>{formatAmount(row.monthly[month].plan)}</td>
                        <td className={styles.numCell}>{formatAmount(row.monthly[month].actual)}</td>
                        <td className={styles.rateCell}>{formatRate(row.monthly[month].achievementRate)}</td>
                        <td className={styles.rateCell}>{formatRate(row.monthly[month].grossMarginRate)}</td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={styles.footNote}>
            매출총이익 = 대리점 공급가(실적) - 표준원가(BMS 기준), 매출총이익률(%) = 매출총이익 / 대리점 공급가 × 100
          </p>
        </section>
      </div>
    </PageShell>
  );
}

export default ProjectOrderStatusPage;
