/**
 * 대리점 관리 Mock (목록·관리카드 상세, API 연동 없음)
 */

/** 담당자/지역/거래상태 필터 옵션 */
export const MOCK_MANAGER_OPTIONS = [
  { value: '', label: '전체' },
  { value: '김영업', label: '김영업' },
  { value: '이팀장', label: '이팀장' },
  { value: '박대리', label: '박대리' },
  { value: '정매니저', label: '정매니저' },
];

export const MOCK_REGION_OPTIONS = [
  { value: '', label: '전체' },
  { value: '서울', label: '서울' },
  { value: '경기', label: '경기' },
  { value: '인천', label: '인천' },
  { value: '부산', label: '부산' },
  { value: '대구', label: '대구' },
  { value: '기타', label: '기타' },
];

export const MOCK_STATUS_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'active', label: '거래중' },
  { value: 'inactive', label: '거래중단' },
  { value: 'pending', label: '검토중' },
];

/** 대리점 목록 (필터용) */
export const MOCK_PARTNERS_LIST = [
  { id: '1', manager: '김영업', name: '(주)테스트대리점', region: '서울', status: 'active' },
  { id: '2', manager: '이팀장', name: '경기수원대리점', region: '경기', status: 'active' },
  { id: '3', manager: '박대리', name: '인천송도대리점', region: '인천', status: 'active' },
  { id: '4', manager: '정매니저', name: '부산해운대대리점', region: '부산', status: 'inactive' },
  { id: '5', manager: '김영업', name: '대구수성대리점', region: '대구', status: 'active' },
  { id: '6', manager: '이팀장', name: '울산대리점', region: '기타', status: 'pending' },
  { id: '7', manager: '박대리', name: '(주)강남대리점', region: '서울', status: 'active' },
  { id: '8', manager: '정매니저', name: '성남분당대리점', region: '경기', status: 'active' },
];

/** id별 관리카드 상세 (8개 섹션 전체, ERP + 담당자 입력) */
const PARTNER_DETAIL_BY_ID = {
  '1': {
    basic: {
      partnerCode: 'PRT-001',
      companyName: '(주)테스트대리점',
      bizNo: '123-45-67890',
      ceoName: '홍길동',
      address: '서울특별시 강남구 테헤란로 123',
      phone: '02-1234-5678',
      fax: '02-1234-5679',
      bizType: '도매 및 소매업',
      bizItem: '건축자재 유통',
      establishedAt: '2010-03-15',
    },
    representative: {
      name: '홍길동',
      birthDate: '1975-05-20',
      mobile: '010-1234-5678',
      email: 'hong@test.com',
      address: '서울 강남구 역삼동 456',
    },
    salesByYear: [
      { year: 2024, amount: 1250000000 },
      { year: 2023, amount: 1180000000 },
      { year: 2022, amount: 1090000000 },
      { year: 2021, amount: 980000000 },
      { year: 2020, amount: 890000000 },
    ],
    staffByYear: {
      2020: { name: '', isActive: false },
      2021: { name: '', isActive: false },
      2022: { name: '', isActive: false },
      2023: { name: '홍길동', isActive: true },
      2024: { name: '홍길동', isActive: true },
    },
    financialByYear: [
      { year: 2024, revenue: 1250000000, cost: 980000000, profit: 270000000, equity: 450000000 },
      { year: 2023, revenue: 1180000000, cost: 920000000, profit: 260000000, equity: 420000000 },
      { year: 2022, revenue: 1090000000, cost: 860000000, profit: 230000000, equity: 390000000 },
      { year: 2021, revenue: 980000000, cost: 780000000, profit: 200000000, equity: 360000000 },
      { year: 2020, revenue: 890000000, cost: 710000000, profit: 180000000, equity: 340000000 },
    ],
    partnerMemo: 'VIP 대리점. 연 2회 현장 점검 예정.',
    competitorBrands: {
      '계림요업': { isHandling: false, scale: '' },
      '이누스': { isHandling: false, scale: '' },
      '대림통상': { isHandling: false, scale: '' },
      'ASK': { isHandling: false, scale: '' },
      'R&CO': { isHandling: false, scale: '' },
      'VOVO': { isHandling: false, scale: '' },
    },
    competitorWithin3km: '반경 3km 내 당사 1곳, D대리점 1곳, E대리점 1곳.',
    historyNotes: '2022년 확장 이전. 담당자 변경 2024.01.',
  },
  '2': {
    basic: {
      partnerCode: 'PRT-002',
      companyName: '경기수원대리점',
      bizNo: '234-56-78901',
      ceoName: '김대리',
      address: '경기도 수원시 영통구 광교로 100',
      phone: '031-234-5678',
      fax: '031-234-5679',
      bizType: '도매 및 소매업',
      bizItem: '건축자재',
      establishedAt: '2012-08-01',
    },
    representative: {
      name: '김대리',
      birthDate: '1980-11-12',
      mobile: '010-2345-6789',
      email: 'kim@partner.com',
      address: '경기 수원시',
    },
    salesByYear: [
      { year: 2024, amount: 980000000 },
      { year: 2023, amount: 920000000 },
      { year: 2022, amount: 850000000 },
      { year: 2021, amount: 780000000 },
      { year: 2020, amount: 710000000 },
    ],
    staffByYear: {
      2020: { name: '정매니저', isActive: true },
      2021: { name: '정매니저', isActive: false },
      2022: { name: '이팀장', isActive: true },
      2023: { name: '이팀장', isActive: true },
      2024: { name: '이팀장', isActive: true },
    },
    financialByYear: [
      { year: 2024, revenue: 980000000, cost: 760000000, profit: 220000000, equity: 380000000 },
      { year: 2023, revenue: 920000000, cost: 720000000, profit: 200000000, equity: 350000000 },
      { year: 2022, revenue: 850000000, cost: 660000000, profit: 190000000, equity: 320000000 },
      { year: 2021, revenue: 780000000, cost: 610000000, profit: 170000000, equity: 300000000 },
      { year: 2020, revenue: 710000000, cost: 550000000, profit: 160000000, equity: 280000000 },
    ],
    partnerMemo: '',
    competitorBrands: {
      '계림요업': { isHandling: true, scale: '50' },
      '이누스': { isHandling: false, scale: '' },
      '대림통상': { isHandling: false, scale: '' },
      'ASK': { isHandling: false, scale: '' },
      'R&CO': { isHandling: false, scale: '' },
      'VOVO': { isHandling: false, scale: '' },
    },
    competitorWithin3km: '인근 당사 0곳, 경쟁 대리점 2곳.',
    historyNotes: '신규 계약 2020. 매출 꾸준히 성장.',
  },
};

const DEFAULT_DETAIL = {
  basic: {
    partnerCode: '-',
    companyName: '-',
    bizNo: '-',
    ceoName: '-',
    address: '-',
    phone: '-',
    fax: '-',
    bizType: '-',
    bizItem: '-',
    establishedAt: '-',
  },
  representative: {
    name: '-',
    birthDate: '-',
    mobile: '-',
    email: '-',
    address: '-',
  },
  salesByYear: [
    { year: 2024, amount: 0 },
    { year: 2023, amount: 0 },
    { year: 2022, amount: 0 },
    { year: 2021, amount: 0 },
    { year: 2020, amount: 0 },
  ],
  staffByYear: {
    2020: { name: '-', isActive: false },
    2021: { name: '-', isActive: false },
    2022: { name: '-', isActive: false },
    2023: { name: '-', isActive: false },
    2024: { name: '-', isActive: false },
  },
  financialByYear: [
    { year: 2024, revenue: 0, cost: 0, profit: 0, equity: 0 },
    { year: 2023, revenue: 0, cost: 0, profit: 0, equity: 0 },
    { year: 2022, revenue: 0, cost: 0, profit: 0, equity: 0 },
    { year: 2021, revenue: 0, cost: 0, profit: 0, equity: 0 },
    { year: 2020, revenue: 0, cost: 0, profit: 0, equity: 0 },
  ],
  partnerMemo: '',
  competitorBrands: {
    '계림요업': { isHandling: false, scale: '' },
    '이누스': { isHandling: false, scale: '' },
    '대림통상': { isHandling: false, scale: '' },
    'ASK': { isHandling: false, scale: '' },
    'R&CO': { isHandling: false, scale: '' },
    'VOVO': { isHandling: false, scale: '' },
  },
  competitorWithin3km: '',
  historyNotes: '',
};

/**
 * 대리점 목록 조회 (필터 적용)
 */
export function getPartnersList(filters = {}) {
  let list = [...MOCK_PARTNERS_LIST];
  if (filters.manager) {
    list = list.filter((p) => p.manager === filters.manager);
  }
  if (filters.name) {
    const q = String(filters.name).toLowerCase().trim();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (filters.region) {
    list = list.filter((p) => p.region === filters.region);
  }
  if (filters.status) {
    list = list.filter((p) => p.status === filters.status);
  }
  return list;
}

/**
 * 대리점 관리카드 상세 조회 (id)
 */
export function getPartnerById(id) {
  const row = MOCK_PARTNERS_LIST.find((p) => p.id === id);
  if (!row) return null;
  const detail = PARTNER_DETAIL_BY_ID[id] || DEFAULT_DETAIL;
  return {
    id: row.id,
    manager: row.manager,
    name: row.name,
    region: row.region,
    status: row.status,
    ...detail,
  };
}
