import { useMemo } from 'react';

const MONTH_GROUPS = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  const key = `m_${String(month).padStart(2, '0')}`;
  return { title: `${month}월`, key, months: [key] };
});

const PERIOD_GROUPS = [
  { title: '연간', key: 'year', months: ['m_01', 'm_02', 'm_03', 'm_04', 'm_05', 'm_06', 'm_07', 'm_08', 'm_09', 'm_10', 'm_11', 'm_12'] },
  { title: '상반기', key: 'h1', months: ['m_01', 'm_02', 'm_03', 'm_04', 'm_05', 'm_06'] },
  { title: '1분기', key: 'q1', months: ['m_01', 'm_02', 'm_03'] },
  { title: '2분기', key: 'q2', months: ['m_04', 'm_05', 'm_06'] },
  { title: '3분기', key: 'q3', months: ['m_07', 'm_08', 'm_09'] },
  { title: '4분기', key: 'q4', months: ['m_10', 'm_11', 'm_12'] },
];

const MOCK_TEAMS = [
  {
    orgName: '프로젝트부문',
    teamCode: 'P1',
    teamName: '프로젝트1팀',
    members: [
      {
        name: '김현우',
        position: '매니저',
        months: {
          m_01: { plan: 620, actual: 650, stdCost: 470 }, m_02: { plan: 640, actual: 610, stdCost: 450 },
          m_03: { plan: 680, actual: 700, stdCost: 500 }, m_04: { plan: 710, actual: 740, stdCost: 530 },
          m_05: { plan: 730, actual: 760, stdCost: 550 }, m_06: { plan: 760, actual: 800, stdCost: 570 },
          m_07: { plan: 780, actual: 820, stdCost: 590 }, m_08: { plan: 790, actual: 810, stdCost: 580 },
          m_09: { plan: 810, actual: 840, stdCost: 605 }, m_10: { plan: 830, actual: 850, stdCost: 615 },
          m_11: { plan: 850, actual: 870, stdCost: 625 }, m_12: { plan: 890, actual: 910, stdCost: 650 },
        },
      },
      {
        name: '박소연',
        position: '시니어',
        months: {
          m_01: { plan: 500, actual: 480, stdCost: 360 }, m_02: { plan: 530, actual: 520, stdCost: 390 },
          m_03: { plan: 560, actual: 590, stdCost: 430 }, m_04: { plan: 580, actual: 610, stdCost: 445 },
          m_05: { plan: 600, actual: 620, stdCost: 450 }, m_06: { plan: 620, actual: 650, stdCost: 470 },
          m_07: { plan: 640, actual: 670, stdCost: 490 }, m_08: { plan: 660, actual: 690, stdCost: 505 },
          m_09: { plan: 680, actual: 710, stdCost: 520 }, m_10: { plan: 700, actual: 730, stdCost: 535 },
          m_11: { plan: 730, actual: 760, stdCost: 560 }, m_12: { plan: 760, actual: 790, stdCost: 580 },
        },
      },
    ],
  },
  {
    orgName: '프로젝트부문',
    teamCode: 'P2',
    teamName: '프로젝트2팀',
    members: [
      {
        name: '이동건',
        position: '매니저',
        months: {
          m_01: { plan: 560, actual: 520, stdCost: 390 }, m_02: { plan: 590, actual: 580, stdCost: 435 },
          m_03: { plan: 620, actual: 640, stdCost: 470 }, m_04: { plan: 650, actual: 680, stdCost: 495 },
          m_05: { plan: 690, actual: 710, stdCost: 515 }, m_06: { plan: 720, actual: 740, stdCost: 540 },
          m_07: { plan: 740, actual: 760, stdCost: 550 }, m_08: { plan: 770, actual: 790, stdCost: 575 },
          m_09: { plan: 790, actual: 820, stdCost: 600 }, m_10: { plan: 810, actual: 840, stdCost: 615 },
          m_11: { plan: 840, actual: 860, stdCost: 630 }, m_12: { plan: 870, actual: 900, stdCost: 660 },
        },
      },
      {
        name: '최지현',
        position: '매니저',
        months: {
          m_01: { plan: 470, actual: 450, stdCost: 335 }, m_02: { plan: 500, actual: 490, stdCost: 360 },
          m_03: { plan: 530, actual: 550, stdCost: 400 }, m_04: { plan: 560, actual: 580, stdCost: 425 },
          m_05: { plan: 590, actual: 610, stdCost: 445 }, m_06: { plan: 620, actual: 650, stdCost: 470 },
          m_07: { plan: 640, actual: 670, stdCost: 485 }, m_08: { plan: 670, actual: 690, stdCost: 500 },
          m_09: { plan: 700, actual: 720, stdCost: 520 }, m_10: { plan: 730, actual: 750, stdCost: 540 },
          m_11: { plan: 760, actual: 790, stdCost: 565 }, m_12: { plan: 790, actual: 820, stdCost: 585 },
        },
      },
    ],
  },
];

function formatNum(value) {
  if (!value) return '-';
  return new Intl.NumberFormat('ko-KR').format(value);
}

function formatPct(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function mergeMonths(monthRows) {
  const merged = {};
  for (let i = 1; i <= 12; i += 1) {
    const key = `m_${String(i).padStart(2, '0')}`;
    merged[key] = { plan: 0, actual: 0, stdCost: 0 };
  }
  monthRows.forEach((months) => {
    Object.keys(merged).forEach((key) => {
      merged[key].plan += Number(months[key]?.plan || 0);
      merged[key].actual += Number(months[key]?.actual || 0);
      merged[key].stdCost += Number(months[key]?.stdCost || 0);
    });
  });
  return merged;
}

function calcPeriodMetrics(months, periodMonths) {
  const plan = periodMonths.reduce((sum, key) => sum + Number(months[key]?.plan || 0), 0);
  const actual = periodMonths.reduce((sum, key) => sum + Number(months[key]?.actual || 0), 0);
  const stdCost = periodMonths.reduce((sum, key) => sum + Number(months[key]?.stdCost || 0), 0);
  const grossProfit = actual - stdCost;
  const achievement = plan > 0 ? (actual / plan) * 100 : 0;
  const grossRate = actual > 0 ? (grossProfit / actual) * 100 : 0;
  return { plan, actual, grossProfit, achievement, grossRate };
}

function toRow(key, orgName, teamName, managerName, position, rowSpanTeam, months, isTotal) {
  const metrics = {};
  MONTH_GROUPS.forEach((period) => {
    metrics[period.key] = calcPeriodMetrics(months, period.months);
  });
  return { key, orgName, teamName, managerName, position, rowType: '수주금액', rowSpanTeam, metrics, isTotal };
}

function buildColumns() {
  return MONTH_GROUPS.map((group) => ({
    title: group.title,
    children: [
      { title: '계획', dataIndex: ['metrics', group.key, 'plan'], width: 78, align: 'right', render: formatNum },
      { title: '실적', dataIndex: ['metrics', group.key, 'actual'], width: 78, align: 'right', render: formatNum },
      {
        title: '달성률',
        key: `rate_${group.key}`,
        width: 78,
        align: 'right',
        render: (_, record) => {
          const rate = Number(record.metrics[group.key]?.achievement || 0);
          return { children: formatPct(rate), props: { style: { color: rate >= 100 ? '#1f64d8' : '#3d4c64' } } };
        },
      },
      { title: '매출총이익률(%)', key: `gross_rate_${group.key}`, width: 92, align: 'right', render: (_, record) => formatPct(record.metrics[group.key]?.grossRate) },
    ],
  }));
}

function buildPeriodSummaryRows(months) {
  return PERIOD_GROUPS.map((period) => {
    const metric = calcPeriodMetrics(months, period.months);
    return {
      key: period.key,
      period: period.title,
      plan: metric.plan,
      actual: metric.actual,
      achievement: metric.achievement,
      grossProfit: metric.grossProfit,
      grossRate: metric.grossRate,
    };
  });
}

export function useProjectPersonalSalesData(filterValue) {
  const processed = useMemo(() => {
    let rowKey = 1;
    const keyword = String(filterValue.keyword || '').trim().toLowerCase();
    const team = filterValue.team;
    const result = [];
    const selectedMonthRows = [];

    MOCK_TEAMS.forEach((teamInfo) => {
      if (team !== 'ALL' && teamInfo.teamCode !== team) return;
      const filteredMembers = teamInfo.members.filter((member) => (!keyword ? true : String(member.name).toLowerCase().includes(keyword)));
      if (filteredMembers.length === 0) return;

      const teamMonths = mergeMonths(filteredMembers.map((member) => member.months));
      selectedMonthRows.push(teamMonths);
      result.push(toRow(`team-${rowKey++}`, teamInfo.orgName, teamInfo.teamName, '합계', '', filteredMembers.length + 1, teamMonths, true));
      filteredMembers.forEach((member) => {
        result.push(toRow(`member-${rowKey++}`, teamInfo.orgName, teamInfo.teamName, member.name, member.position, 0, member.months, false));
      });
    });

    const overallMonths = mergeMonths(selectedMonthRows);
    const periodSummaryRows = buildPeriodSummaryRows(overallMonths);
    const summaryMap = Object.fromEntries(periodSummaryRows.map((row) => [row.key, row]));
    const summaryCards = [
      { key: 'year', title: '연간', ...summaryMap.year },
      { key: 'h1', title: '상반기', ...summaryMap.h1 },
      { key: 'latest-quarter', title: '최근분기', ...(summaryMap.q4 || summaryMap.q3 || summaryMap.q2 || summaryMap.q1) },
    ];

    return { rows: result, summaryCards, periodSummaryRows };
  }, [filterValue.keyword, filterValue.team]);

  const columns = useMemo(() => buildColumns(), []);
  return { rows: processed.rows, columns, summaryCards: processed.summaryCards, periodSummaryRows: processed.periodSummaryRows };
}
