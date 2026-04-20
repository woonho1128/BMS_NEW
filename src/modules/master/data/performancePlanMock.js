/**
 * 성과 계획 관리 목업 데이터
 * - Master > 성과 계획 관리
 */
export const PLAN_STATUS = {
  DRAFT: 'DRAFT',
  CONFIRMED: 'CONFIRMED',
};

export const MONTH_KEYS = Array.from({ length: 12 }, (_, index) => `m${String(index + 1).padStart(2, '0')}`);

const TEAM_CONFIG = [
  {
    orgId: 'R1',
    orgName: '리테일 1팀',
    members: [
      { memberId: 'R1-01', memberName: '박진우', position: '매니저' },
      { memberId: 'R1-02', memberName: '김소림', position: '매니저' },
      { memberId: 'R1-03', memberName: '이재호', position: '주임' },
    ],
  },
  {
    orgId: 'R2',
    orgName: '리테일 2팀',
    members: [
      { memberId: 'R2-01', memberName: '최윤호', position: '매니저' },
      { memberId: 'R2-02', memberName: '서동건', position: '주임' },
    ],
  },
  {
    orgId: 'R3',
    orgName: '리테일 3팀',
    members: [
      { memberId: 'R3-01', memberName: '유득한', position: '매니저' },
      { memberId: 'R3-02', memberName: '오도현', position: '주임' },
    ],
  },
  {
    orgId: 'T1',
    orgName: '특수영업팀',
    members: [
      { memberId: 'T1-01', memberName: '공현준', position: '매니저' },
      { memberId: 'T1-02', memberName: '강유진', position: '사원' },
    ],
  },
  {
    orgId: 'S1',
    orgName: '영업지원팀',
    members: [
      { memberId: 'S1-01', memberName: '조동원', position: '매니저' },
      { memberId: 'S1-02', memberName: '정하리', position: '사원' },
    ],
  },
];

const PLAN_YEARS = [2025, 2026, 2027];

function makeMonthly(base, seed) {
  const monthly = {};
  MONTH_KEYS.forEach((key, idx) => {
    const month = idx + 1;
    const weight = 0.84 + ((seed + month * 17) % 33) / 100;
    monthly[key] = Math.round(base * weight);
  });
  return monthly;
}

export function totalOf(monthly = {}) {
  return MONTH_KEYS.reduce((sum, key) => sum + Number(monthly[key] || 0), 0);
}

function makeHistory(base, row, annualTotal) {
  return [
    {
      id: `${row.id}-h1`,
      changedAt: `${row.year}-01-10 09:22`,
      changedBy: '김지훈 부장',
      summary: '초기 계획 등록',
      changes: [
        { field: '상태', before: '-', after: '작성중' },
        { field: '연간 합계', before: '-', after: annualTotal.toLocaleString('ko-KR') },
      ],
    },
    {
      id: `${row.id}-h2`,
      changedAt: `${row.year}-03-02 14:31`,
      changedBy: '박동혁 이사',
      summary: '1분기 계획 보정',
      changes: [
        { field: '1월', before: Math.round(base * 0.95).toLocaleString('ko-KR'), after: Math.round(base * 1.02).toLocaleString('ko-KR') },
        { field: '비고', before: '-', after: '현장 접수기 일정 리스크 반영' },
      ],
    },
  ];
}

export function createPerformancePlanRows() {
  const rows = [];

  PLAN_YEARS.forEach((year) => {
    TEAM_CONFIG.forEach((team, teamIndex) => {
      const teamBase = 820 + teamIndex * 110 + (year - 2025) * 45;
      const teamMonthly = makeMonthly(teamBase, year + teamIndex);
      const teamTotal = totalOf(teamMonthly);
      const teamRow = {
        id: `TEAM-${year}-${team.orgId}`,
        planType: 'TEAM',
        year,
        orgId: team.orgId,
        orgName: team.orgName,
        ownerId: '',
        ownerName: '팀 합계',
        status: year < 2027 ? PLAN_STATUS.CONFIRMED : PLAN_STATUS.DRAFT,
        monthly: teamMonthly,
        note: year < 2027 ? '확정 배포 완료' : '작성 중',
        updatedAt: `${year}-03-15 11:20`,
        updatedBy: '관리자',
      };
      teamRow.history = makeHistory(teamBase, teamRow, teamTotal);
      rows.push(teamRow);

      team.members.forEach((member, memberIndex) => {
        const personalBase = Math.round((teamBase * (0.29 + memberIndex * 0.04)) + (memberIndex + 1) * 8);
        const personalMonthly = makeMonthly(personalBase, year + teamIndex + memberIndex + 3);
        const personalTotal = totalOf(personalMonthly);
        const personalRow = {
          id: `PERSONAL-${year}-${team.orgId}-${member.memberId}`,
          planType: 'PERSONAL',
          year,
          orgId: team.orgId,
          orgName: team.orgName,
          ownerId: member.memberId,
          ownerName: `${member.memberName} ${member.position}`,
          status: year < 2027 ? PLAN_STATUS.CONFIRMED : PLAN_STATUS.DRAFT,
          monthly: personalMonthly,
          note: memberIndex % 2 === 0 ? '중점 거래처 집중' : '',
          updatedAt: `${year}-03-18 10:05`,
          updatedBy: member.memberName,
        };
        personalRow.history = makeHistory(personalBase, personalRow, personalTotal);
        rows.push(personalRow);
      });
    });
  });

  return rows;
}

export function getPerformancePlanMeta(rows = []) {
  const yearOptions = [{ value: '', label: '전체' }, ...PLAN_YEARS.map((year) => ({ value: String(year), label: `${year}년` }))];
  const orgMap = new Map();
  const ownerMap = new Map();
  rows.forEach((row) => {
    orgMap.set(row.orgId, row.orgName);
    if (row.ownerId) ownerMap.set(row.ownerId, row.ownerName);
  });

  return {
    yearOptions,
    orgOptions: [{ value: '', label: '전체' }, ...Array.from(orgMap.entries()).map(([value, label]) => ({ value, label }))],
    ownerOptions: [{ value: '', label: '전체' }, ...Array.from(ownerMap.entries()).map(([value, label]) => ({ value, label }))],
    statusOptions: [
      { value: '', label: '전체' },
      { value: PLAN_STATUS.DRAFT, label: '작성중' },
      { value: PLAN_STATUS.CONFIRMED, label: '확정' },
    ],
  };
}

export function filterPerformancePlanRows(rows = [], filters = {}) {
  const {
    planType = 'TEAM',
    year = '',
    orgId = '',
    ownerId = '',
    status = '',
    keyword = '',
  } = filters;

  const keywordValue = String(keyword || '').trim().toLowerCase();
  return rows
    .filter((row) => (planType ? row.planType === planType : true))
    .filter((row) => (year ? String(row.year) === String(year) : true))
    .filter((row) => (orgId ? row.orgId === orgId : true))
    .filter((row) => (ownerId ? row.ownerId === ownerId : true))
    .filter((row) => (status ? row.status === status : true))
    .filter((row) => {
      if (!keywordValue) return true;
      return [row.orgName, row.ownerName, row.note, row.updatedBy]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keywordValue));
    })
    .map((row) => ({
      ...row,
      annualTotal: totalOf(row.monthly),
    }));
}

export function getPlanUploadPreviewRows() {
  return [
    { no: 1, division: 'RETAIL', orgName: '리테일 1팀', ownerName: '박진우 매니저', year: 2027, jan: 312, feb: 298, mar: 336, status: '신규' },
    { no: 2, division: 'RETAIL', orgName: '리테일 2팀', ownerName: '서동건 주임', year: 2027, jan: 264, feb: 252, mar: 277, status: '수정' },
    { no: 3, division: 'PROJECT', orgName: '특수영업팀', ownerName: '정하리 사원', year: 2027, jan: 188, feb: 201, mar: 206, status: '신규' },
    { no: 4, division: 'PROJECT', orgName: '영업지원팀', ownerName: '조동원 매니저', year: 2027, jan: 206, feb: 214, mar: 222, status: '수정' },
  ];
}

export function getPlanStatusLabel(status) {
  if (status === PLAN_STATUS.CONFIRMED) return '확정';
  return '작성중';
}

const CLIENT_PLAN_BY_YEAR = {
  2025: {
    '092895': 1260,
    '092777': 940,
    '206951': 1420,
    '091635': 910,
    '198874': 1090,
    '102617': 780,
    '196901': 640,
    '123855': 1520,
  },
  2026: {
    '092895': 1310,
    '092777': 980,
    '206951': 1470,
    '091635': 950,
    '198874': 1130,
    '102617': 820,
    '196901': 690,
    '123855': 1580,
  },
  2027: {
    '092895': 1360,
    '092777': 1020,
    '206951': 1530,
    '091635': 980,
    '198874': 1180,
    '102617': 860,
    '196901': 730,
    '123855': 1640,
  },
};

export function getPartnerSalesPlanMap(year) {
  return CLIENT_PLAN_BY_YEAR[Number(year)] || CLIENT_PLAN_BY_YEAR[2026];
}
