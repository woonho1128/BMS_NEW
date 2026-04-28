import { MONTH_KEYS, PLAN_STATUS } from '../data/performancePlanMock';

export const DIVISION_ITEMS = [
  { key: 'RETAIL', label: '리테일부문' },
  { key: 'PROJECT', label: '프로젝트부문' },
];

export const DIVISION_LABEL = { RETAIL: '리테일부문', PROJECT: '프로젝트부문' };

export const MANAGEMENT_TABS = [
  { key: 'TEAM', label: '팀 계획' },
  { key: 'PERSONAL', label: '개인 계획' },
];

export const EMPTY_FILTERS = {
  year: '2026',
  orgId: '',
  ownerId: '',
  status: '',
  keyword: '',
};

export function cloneRows(rows) {
  return rows.map((row) => ({
    ...row,
    monthly: { ...row.monthly },
    history: Array.isArray(row.history) ? row.history.map((h) => ({ ...h, changes: [...(h.changes || [])] })) : [],
  }));
}

export function getDivisionKey(row) {
  return String(row.orgId || '').startsWith('R') ? 'RETAIL' : 'PROJECT';
}

export function splitRowsByDivision(rows) {
  const retail = [];
  const project = [];
  rows.forEach((row) => {
    if (getDivisionKey(row) === 'RETAIL') retail.push(row);
    else project.push(row);
  });
  return { RETAIL: retail, PROJECT: project };
}

export function nextVersionName(versions = []) {
  const max = versions.reduce((acc, item) => {
    const matched = String(item.name || '').match(/^V(\d+)$/i);
    if (!matched) return acc;
    return Math.max(acc, Number(matched[1]));
  }, 0);
  return `V${String(max + 1).padStart(2, '0')}`;
}

export function applyUploadMock(rows = [], year, division) {
  return rows.map((row, index) => {
    if (String(row.year) !== String(year)) return row;
    if (getDivisionKey(row) !== division) return row;
    const factor = 1 + (((index % 5) + 1) * 0.01);
    const monthly = MONTH_KEYS.reduce((acc, key) => {
      acc[key] = Math.round(Number(row.monthly[key] || 0) * factor);
      return acc;
    }, {});
    const history = Array.isArray(row.history) ? [...row.history] : [];
    history.unshift({
      id: `${row.id}-u-${Date.now()}`,
      changedAt: '2026-04-08 10:30',
      changedBy: '관리자',
      summary: '업로드 반영',
      changes: [
        { field: '버전', before: '-', after: '업로드 반영 버전' },
        { field: '월별 계획', before: '기존 값', after: '업로드 값 반영' },
      ],
    });
    return {
      ...row,
      monthly,
      status: PLAN_STATUS.DRAFT,
      note: '업로드 반영',
      updatedAt: '2026-04-08 10:30',
      updatedBy: '관리자',
      history,
    };
  });
}

export function createInitialVersionsByDivision(initialRowsByDivision) {
  return {
    RETAIL: [
      {
        id: 'retail-ver-1',
        name: 'V01',
        createdAt: '2026-04-01 09:00',
        createdBy: '관리자',
        reason: '리테일부문 초기 버전',
        rows: cloneRows(initialRowsByDivision.RETAIL),
      },
    ],
    PROJECT: [
      {
        id: 'project-ver-1',
        name: 'V01',
        createdAt: '2026-04-01 09:00',
        createdBy: '관리자',
        reason: '프로젝트부문 초기 버전',
        rows: cloneRows(initialRowsByDivision.PROJECT),
      },
    ],
  };
}

export function createInitialRowsByDivision(initialRowsByDivision) {
  return {
    RETAIL: cloneRows(initialRowsByDivision.RETAIL),
    PROJECT: cloneRows(initialRowsByDivision.PROJECT),
  };
}
