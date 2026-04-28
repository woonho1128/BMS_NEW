const MOCK_PARTNERS = [
  {
    id: 'P1001',
    name: '건설도기특상',
    manager: '김민수',
    region: '서울',
    status: 'active',
    division: 'project',
  },
  {
    id: 'P1002',
    name: '프라임 유통',
    manager: '이서준',
    region: '경기',
    status: 'active',
    division: 'retail',
  },
  {
    id: 'P1003',
    name: '한빛상사',
    manager: '박지훈',
    region: '인천',
    status: 'pending',
    division: 'project',
  },
  {
    id: 'P1004',
    name: '동남세라믹',
    manager: '최도윤',
    region: '부산',
    status: 'inactive',
    division: 'retail',
  },
  {
    id: 'P1005',
    name: '영진하우징',
    manager: '정하늘',
    region: '대전',
    status: 'active',
    division: 'project',
  },
];

const SALES_YEARS = ['2023', '2024', '2025', '2026'];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildSalesByYear(seed) {
  return SALES_YEARS.map((year, idx) => ({
    year,
    total: seed + idx * 40,
    bidet: Math.round((seed + idx * 40) * 0.45),
    kitchen: Math.round((seed + idx * 40) * 0.3),
    bath: Math.round((seed + idx * 40) * 0.25),
  }));
}

function buildStaffByYear(primaryManager) {
  return SALES_YEARS.map((year, idx) => ({
    year,
    manager: idx < 2 ? primaryManager : `${primaryManager}(겸)`,
    salesRep: ['김지연', '이민호', '박수진', '정유진'][idx],
  }));
}

function buildFinancialByYear(seed) {
  return SALES_YEARS.map((year, idx) => ({
    year,
    receivable: (seed + idx * 18) * 1000000,
    collateral: (seed * 0.35 + idx * 5) * 1000000,
    bill: (seed * 0.2 + idx * 3) * 1000000,
  }));
}

function buildDetail(base) {
  const isRetail = base.division === 'retail';

  return {
    id: base.id,
    name: base.name,
    manager: base.manager,
    region: base.region,
    status: base.status,
    division: base.division,
    businessCardLinked: true,
    basic: {
      partnerCode: base.id,
      companyName: base.name,
      bizNo: `120-81-${base.id.slice(-4)}`,
      ceoName: isRetail ? '김소연' : '이정우',
      address: `${base.region}시 테스트로 123`,
      phone: '02-1234-5678',
      fax: '02-1234-5679',
      bizType: isRetail ? '도소매' : '건설/특판',
      bizItem: isRetail ? '위생도기, 수전' : '프로젝트 납품',
      establishedAt: '2018-01-15',
    },
    representative: {
      name: isRetail ? '오리테일' : '강프로젝트',
      birthDate: '1982-06-15',
      mobile: '010-2222-3333',
      email: 'owner@sample.com',
      address: `${base.region}시 대표자 주소 45`,
      memo: '기존 명함 검색 연동 대상',
    },
    salesByYear: buildSalesByYear(isRetail ? 360 : 480),
    staffByYear: buildStaffByYear(base.manager),
    financialByYear: buildFinancialByYear(isRetail ? 42 : 56),
    partnerMemo: isRetail ? '리테일 부문 메모 예시' : '프로젝트 부문 메모 예시',
    partnerTraits: ['TRUST', 'FAST'],
    partnerTraitRatios: {
      TRUST: 55,
      FAST: 45,
    },
    competitorBrands: [
      { id: `${base.id}-brand-1`, name: 'A사', isHandling: true, scale: '중' },
      { id: `${base.id}-brand-2`, name: 'B사', isHandling: false, scale: '소' },
    ],
    mapCenter: { lat: 37.5665, lng: 126.978, radiusKm: 3 },
    nearbyPoints: [
      { id: `${base.id}-near-1`, name: '지점A', lat: 37.56, lng: 126.97 },
      { id: `${base.id}-near-2`, name: '지점B', lat: 37.57, lng: 126.99 },
    ],
    historyNotes: isRetail
      ? '에이전트 이력 및 특이사항 - 리테일'
      : '에이전트 이력 및 특이사항 - 프로젝트',
    staffMembers: [
      {
        id: `${base.id}-staff-1`,
        name: base.manager,
        mobile: '010-1111-2222',
        email: 'manager@sample.com',
        emailLocal: 'manager',
        emailDomainType: 'sample.com',
        emailDomainDirect: 'sample.com',
        memo: '주담당',
      },
    ],
  };
}

const MOCK_PARTNER_DETAILS = Object.fromEntries(
  MOCK_PARTNERS.map((partner) => [partner.id, buildDetail(partner)])
);

const MOCK_PARTNER_EDIT_HISTORIES = Object.fromEntries(
  MOCK_PARTNERS.map((partner) => [
    partner.id,
    [
      {
        id: `${partner.id}-h2`,
        changedAt: '2026-04-11 14:20',
        changedBy: '관리자',
        reason: '담당자 변경',
        changes: [
          { field: '담당자', before: '홍길동', after: partner.manager },
          { field: '거래상태', before: '거래요청', after: '거래중' },
        ],
      },
      {
        id: `${partner.id}-h1`,
        changedAt: '2026-03-03 10:00',
        changedBy: '시스템',
        reason: '최초 등록',
        changes: [
          { field: '상호', before: '-', after: partner.name },
          { field: '지역', before: '-', after: partner.region },
        ],
      },
    ],
  ])
);

export const MOCK_PARTNERS_LIST = MOCK_PARTNERS;

export const MOCK_DIVISION_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'project', label: '프로젝트 부문' },
  { value: 'retail', label: '리테일 부문' },
];

export const MOCK_MANAGER_OPTIONS = [
  { value: '', label: '전체' },
  ...Array.from(new Set(MOCK_PARTNERS.map((row) => row.manager))).map((manager) => ({
    value: manager,
    label: manager,
  })),
];

export const MOCK_REGION_OPTIONS = [
  { value: '', label: '전체' },
  ...Array.from(new Set(MOCK_PARTNERS.map((row) => row.region))).map((region) => ({
    value: region,
    label: region,
  })),
];

export const MOCK_STATUS_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'active', label: '거래중' },
  { value: 'inactive', label: '거래중단' },
  { value: 'pending', label: '거래요청' },
];

export function getPartnersList(filters = {}) {
  const keyword = String(filters.name || '').trim().toLowerCase();

  return MOCK_PARTNERS.filter((row) => {
    if (filters.division && row.division !== filters.division) return false;
    if (filters.manager && row.manager !== filters.manager) return false;
    if (filters.region && row.region !== filters.region) return false;
    if (filters.status && row.status !== filters.status) return false;
    if (keyword && !row.name.toLowerCase().includes(keyword)) return false;
    return true;
  }).map((row) => clone(row));
}

export function getPartnerById(id) {
  const detail = MOCK_PARTNER_DETAILS[id];
  return detail ? clone(detail) : null;
}

export function getPartnerEditHistoryById(id) {
  return clone(MOCK_PARTNER_EDIT_HISTORIES[id] || []);
}
