import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { createMonthOptions, createYearOptions, getCurrentYear } from '../../../shared/utils/dateOptions';
import styles from './SalesPerformancePage.module.css';

const now = new Date();
const currentYear = getCurrentYear();
const currentMonth = now.getMonth() + 1;

const yearOptions = createYearOptions();
const monthOptions = createMonthOptions();

const teamOptions = [
  { value: 'retail-1', label: '리테일1팀' },
  { value: 'retail-2', label: '리테일2팀' },
  { value: 'retail-3', label: '리테일3팀' },
  { value: 'tile-team', label: '타일영업팀' },
  { value: 'support-team', label: '영업지원팀' },
];

const typeRows = ['도소매출고', '납품출고', '계'];
const monthKeys = [1, 2, 3, 4];

function n(value) {
  return Number(value || 0);
}

function formatAmount(value) {
  return n(value).toLocaleString('ko-KR');
}

function formatRate(value) {
  return `${Math.round(n(value))}%`;
}

function baseMonth(plan, actual) {
  return {
    plan,
    actual,
    rate: plan > 0 ? (actual / plan) * 100 : 0,
  };
}

function buildTeamBlock(team, wholesale, delivery) {
  const total = monthKeys.reduce(
    (acc, month) => {
      const wp = wholesale.monthly[month].plan;
      const wa = wholesale.monthly[month].actual;
      const dp = delivery.monthly[month].plan;
      const da = delivery.monthly[month].actual;
      acc.monthly[month] = baseMonth(wp + dp, wa + da);
      acc.cumulative.plan += wp + dp;
      acc.cumulative.actual += wa + da;
      return acc;
    },
    { monthly: {}, cumulative: { plan: 0, actual: 0, rate: 0 } }
  );
  total.cumulative.rate =
    total.cumulative.plan > 0 ? (total.cumulative.actual / total.cumulative.plan) * 100 : 0;

  return {
    team,
    rows: {
      도소매출고: wholesale,
      납품출고: delivery,
      계: total,
    },
  };
}

const teamBlocks = [
  buildTeamBlock(
    '리테일1팀',
    {
      cumulative: { plan: 29040, actual: 30240, rate: 104.1 },
      monthly: { 1: baseMonth(2146, 2258), 2: baseMonth(2240, 2340), 3: baseMonth(2334, 2422), 4: baseMonth(2266, 2378) },
    },
    {
      cumulative: { plan: 17040, actual: 16440, rate: 96.5 },
      monthly: { 1: baseMonth(1152, 1114), 2: baseMonth(1240, 1190), 3: baseMonth(1328, 1266), 4: baseMonth(1272, 1234) },
    }
  ),
  buildTeamBlock(
    '리테일2팀',
    {
      cumulative: { plan: 33840, actual: 33240, rate: 98.2 },
      monthly: { 1: baseMonth(2546, 2508), 2: baseMonth(2640, 2590), 3: baseMonth(2734, 2672), 4: baseMonth(2666, 2628) },
    },
    {
      cumulative: { plan: 20640, actual: 21840, rate: 105.8 },
      monthly: { 1: baseMonth(1452, 1564), 2: baseMonth(1540, 1640), 3: baseMonth(1628, 1716), 4: baseMonth(1572, 1684) },
    }
  ),
  buildTeamBlock(
    '리테일3팀',
    {
      cumulative: { plan: 31440, actual: 32640, rate: 103.8 },
      monthly: { 1: baseMonth(2346, 2458), 2: baseMonth(2440, 2540), 3: baseMonth(2534, 2622), 4: baseMonth(2466, 2578) },
    },
    {
      cumulative: { plan: 18240, actual: 15840, rate: 86.8 },
      monthly: { 1: baseMonth(1252, 1064), 2: baseMonth(1340, 1140), 3: baseMonth(1428, 1216), 4: baseMonth(1372, 1182) },
    }
  ),
  buildTeamBlock(
    '타일영업팀',
    {
      cumulative: { plan: 14860, actual: 15120, rate: 101.7 },
      monthly: { 1: baseMonth(1110, 1142), 2: baseMonth(1180, 1216), 3: baseMonth(1250, 1272), 4: baseMonth(1180, 1208) },
    },
    {
      cumulative: { plan: 10920, actual: 11340, rate: 103.8 },
      monthly: { 1: baseMonth(780, 812), 2: baseMonth(840, 878), 3: baseMonth(900, 928), 4: baseMonth(860, 894) },
    }
  ),
  buildTeamBlock(
    '영업지원팀',
    {
      cumulative: { plan: 2694, actual: 2682, rate: 99.6 },
      monthly: { 1: baseMonth(0, 0), 2: baseMonth(40, 40), 3: baseMonth(134, 122), 4: baseMonth(66, 78) },
    },
    {
      cumulative: { plan: 25440, actual: 27840, rate: 109.4 },
      monthly: { 1: baseMonth(1852, 2064), 2: baseMonth(1940, 2140), 3: baseMonth(2028, 2216), 4: baseMonth(1972, 2184) },
    }
  ),
];

function buildDivisionTotal(blocks) {
  const initLine = {
    cumulative: { plan: 0, actual: 0, rate: 0 },
    monthly: monthKeys.reduce((acc, month) => ({ ...acc, [month]: baseMonth(0, 0) }), {}),
  };
  const map = {
    도소매출고: { ...initLine, monthly: { ...initLine.monthly } },
    납품출고: { ...initLine, monthly: { ...initLine.monthly } },
    계: { ...initLine, monthly: { ...initLine.monthly } },
  };

  blocks.forEach((block) => {
    typeRows.forEach((type) => {
      map[type].cumulative.plan += block.rows[type].cumulative.plan;
      map[type].cumulative.actual += block.rows[type].cumulative.actual;
      monthKeys.forEach((month) => {
        map[type].monthly[month].plan += block.rows[type].monthly[month].plan;
        map[type].monthly[month].actual += block.rows[type].monthly[month].actual;
      });
    });
  });

  typeRows.forEach((type) => {
    const line = map[type];
    line.cumulative.rate = line.cumulative.plan > 0 ? (line.cumulative.actual / line.cumulative.plan) * 100 : 0;
    monthKeys.forEach((month) => {
      const row = line.monthly[month];
      row.rate = row.plan > 0 ? (row.actual / row.plan) * 100 : 0;
    });
  });

  return {
    team: '리테일부문(타일제외)',
    rows: map,
  };
}

export function SalesPerformancePage() {
  const { pathname } = useLocation();
  const [filters, setFilters] = useState({
    year: String(currentYear),
    month: String(currentMonth),
    teams: teamOptions.map((team) => team.value),
  });

  const filterFields = useMemo(
    () => [
      { id: 'year', label: '기준년도', type: 'select', options: yearOptions, width: 116, row: 0 },
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

  const allBlocks = useMemo(() => [buildDivisionTotal(visibleTeamBlocks), ...visibleTeamBlocks], [visibleTeamBlocks]);

  const summary = useMemo(() => {
    const target = allBlocks.reduce(
      (acc, block) => {
        acc.plan += block.rows.계.cumulative.plan;
        acc.actual += block.rows.계.cumulative.actual;
        return acc;
      },
      { plan: 0, actual: 0, rate: 0 }
    );
    target.rate = target.plan > 0 ? (target.actual / target.plan) * 100 : 0;
    return target;
  }, [allBlocks]);

  const tableRows = useMemo(() => {
    const rows = [];
    allBlocks.forEach((block) => {
      typeRows.forEach((type, idx) => {
        const line = block.rows[type];
        rows.push({
          id: `${block.team}-${type}`,
          team: block.team,
          type,
          teamRowSpan: idx === 0 ? 3 : 0,
          isTotalType: type === '계',
          cumulative: line.cumulative,
          monthly: line.monthly,
        });
      });
    });
    return rows;
  }, [allBlocks]);

  return (
    <PageShell path={pathname} title="리테일팀 매출 현황" className={styles.shellWide}>
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
            <strong className={styles.kpiValueRate}>{formatRate(summary.rate)}</strong>
          </article>
        </section>

        <section className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>팀별 계획 vs 실적</div>
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
                  <th colSpan={3}>1~12월 누계</th>
                  {monthKeys.map((month) => (
                    <th key={`group-${month}`} colSpan={3}>
                      {month}월
                    </th>
                  ))}
                </tr>
                <tr>
                  <th>계획</th>
                  <th>실적</th>
                  <th>달성률</th>
                  {monthKeys.map((month) => (
                    <React.Fragment key={`detail-${month}`}>
                      <th>계획</th>
                      <th>실적</th>
                      <th>달성률</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.id} className={row.isTotalType ? styles.totalRow : undefined}>
                    {row.teamRowSpan > 0 && (
                      <th rowSpan={row.teamRowSpan} className={styles.teamCell}>
                        {row.team}
                      </th>
                    )}
                    <td className={styles.typeCell}>{row.type}</td>
                    <td className={styles.numCell}>{formatAmount(row.cumulative.plan)}</td>
                    <td className={styles.numCell}>{formatAmount(row.cumulative.actual)}</td>
                    <td className={styles.rateCell}>{formatRate(row.cumulative.rate)}</td>
                    {monthKeys.map((month) => (
                      <React.Fragment key={`${row.id}-${month}`}>
                        <td className={styles.numCell}>{formatAmount(row.monthly[month].plan)}</td>
                        <td className={styles.numCell}>{formatAmount(row.monthly[month].actual)}</td>
                        <td className={styles.rateCell}>{formatRate(row.monthly[month].rate)}</td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={styles.footNote}>
            계획은 입력 데이터, 실적은 ERP 연동 예정이며 현재는 Mock ERP 데이터로 표시됩니다.
          </p>
        </section>
      </div>
    </PageShell>
  );
}

export default SalesPerformancePage;
