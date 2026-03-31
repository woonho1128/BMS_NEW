export const COMMON_CODE_GROUP = {
  COMPETITOR_BRAND: 'COMPETITOR_BRAND',
};

export const COMMON_CODES = [
  {
    id: 'cc-001',
    groupCode: COMMON_CODE_GROUP.COMPETITOR_BRAND,
    code: 'COMP_BRAND_01',
    codeName: '계림산업',
    sortOrder: 1,
    useYn: true,
  },
  {
    id: 'cc-002',
    groupCode: COMMON_CODE_GROUP.COMPETITOR_BRAND,
    code: 'COMP_BRAND_02',
    codeName: '이누스',
    sortOrder: 2,
    useYn: true,
  },
  {
    id: 'cc-003',
    groupCode: COMMON_CODE_GROUP.COMPETITOR_BRAND,
    code: 'COMP_BRAND_03',
    codeName: '대림통상',
    sortOrder: 3,
    useYn: true,
  },
  {
    id: 'cc-004',
    groupCode: COMMON_CODE_GROUP.COMPETITOR_BRAND,
    code: 'COMP_BRAND_04',
    codeName: 'ASK',
    sortOrder: 4,
    useYn: true,
  },
  {
    id: 'cc-005',
    groupCode: COMMON_CODE_GROUP.COMPETITOR_BRAND,
    code: 'COMP_BRAND_05',
    codeName: 'R&CO',
    sortOrder: 5,
    useYn: true,
  },
  {
    id: 'cc-006',
    groupCode: COMMON_CODE_GROUP.COMPETITOR_BRAND,
    code: 'COMP_BRAND_06',
    codeName: 'VOVO',
    sortOrder: 6,
    useYn: true,
  },
];

export function getCommonCodesByGroup(groupCode, options = {}) {
  const { useYnOnly = true } = options;
  let rows = COMMON_CODES.filter((row) => row.groupCode === groupCode);
  if (useYnOnly) rows = rows.filter((row) => row.useYn);
  return rows.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

