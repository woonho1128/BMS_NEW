export const VIEW_MODE = {
  LIST: 'list',
  FORM: 'form',
};

export const APPROVER_OPTIONS = [
  { id: 'apv-kim-jh', name: '김지훈 부장', dept: '영업1팀' },
  { id: 'apv-lee-sy', name: '이서윤 팀장', dept: '영업기획팀' },
  { id: 'apv-park-dh', name: '박동현 이사', dept: '영업본부' },
  { id: 'apv-choi-mh', name: '최민호 상무', dept: '관리본부' },
  { id: 'apv-jung-hr', name: '정하림 전무', dept: '본사' },
];

const MOCK_SITE_BASE = [
  {
    id: 'site-1',
    dealer: '동신건재',
    siteName: '제주 신선고 기숙사',
    builder: 'XX종건',
    isGovernmentProject: true,
    deliveryFrom: '2026-03-05',
    deliveryTo: '2026-09-30',
    notes: '관급 공사 현장, XX설비 견적요청, 동종업체 입찰',
    majorItems: [
      { code: 'CC-735', qty: 100, unit: 'SET' },
      { code: 'CL-384', qty: 100, unit: 'EA' },
    ],
    createdAt: '2026-03-01',
  },
  {
    id: 'site-2',
    dealer: '동신건재',
    siteName: '제주 미지정 현장',
    builder: '제주개발',
    isGovernmentProject: false,
    deliveryFrom: '2026-04-01',
    deliveryTo: '2026-06-20',
    notes: '모델하우스 우선 출고, 동시견적 검토 가능',
    majorItems: [{ code: 'CC-735', qty: 120, unit: 'SET' }],
    createdAt: '2026-03-18',
  },
];

export const MOCK_SITES = Array.from({ length: 20 }, (_, index) => {
  const base = MOCK_SITE_BASE[index % MOCK_SITE_BASE.length];
  const month = String((index % 12) + 1).padStart(2, '0');
  const dayFrom = String((index % 20) + 1).padStart(2, '0');
  const dayTo = String((index % 20) + 8).padStart(2, '0');
  return {
    ...base,
    id: `site-${index + 1}`,
    siteName: `${base.siteName} ${index + 1}`,
    deliveryFrom: `2026-${month}-${dayFrom}`,
    deliveryTo: `2026-${month}-${dayTo}`,
    createdAt: `2026-${month}-${String((index % 25) + 1).padStart(2, '0')}`,
  };
});

const EMPTY_ITEM = {
  id: '',
  itemCode: '',
  qty: '1',
  unit: 'EA',
  standardPrice: '0',
  discountRate: '0',
  note: '',
};

function nextItemId() {
  return `item-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function createItem(overrides = {}) {
  return {
    ...EMPTY_ITEM,
    id: nextItemId(),
    ...overrides,
  };
}

export function sanitizeNumber(value) {
  return String(value || '').replace(/[^\d.-]/g, '');
}

export function parseDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function enrichSites(filteredSites) {
  return filteredSites.map((site, index) => ({
    ...site,
    baseDiscountAmount: site.baseDiscountAmount ?? ((index + 1) * 1800000 + 5400000),
    shortDiscountAmount: site.shortDiscountAmount ?? ((index + 1) * 1450000 + 4100000),
    author: site.author ?? ['김영업', '이순희', '박준호'][index % 3],
    status: site.status ?? ['결재 진행', '임시 저장', '결재 완료'][index % 3],
  }));
}

export function summarizeSelectedSites(selectedSitesForSubmit) {
  return selectedSitesForSubmit.reduce(
    (acc, site) => ({
      count: acc.count + 1,
      baseDiscountAmount: acc.baseDiscountAmount + (Number(site.baseDiscountAmount) || 0),
      shortDiscountAmount: acc.shortDiscountAmount + (Number(site.shortDiscountAmount) || 0),
      itemCount: acc.itemCount + (site.majorItems?.length || 0),
    }),
    { count: 0, baseDiscountAmount: 0, shortDiscountAmount: 0, itemCount: 0 }
  );
}
