export const EMAIL_DOMAIN_OPTIONS = ['naver.com', 'gmail.com', 'daum.net', 'nate.com', 'hanmail.net'];
export const ADDRESS_SELECTION_OPTIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
export const SALES_CATEGORY_COLORS = ['#2563eb', '#0ea5e9', '#f59e0b', '#16a34a', '#ef4444', '#8b5cf6'];
export const DEFAULT_DIVISION = 'project';
const DEFAULT_MAP_CENTER = { lat: 37.5665, lng: 126.978, radiusKm: 3 };

export function createEmptyFinancePreview() {
  return {
    receivableRows: [],
    billRows: [],
    collateralRows: [],
  };
}

export function createInitialPartnerFormData() {
  return {
    basic: {
      partnerCode: '',
      companyName: '',
      bizNo: '',
      ceoName: '',
      address: '',
      phone: '',
      fax: '',
      bizType: '',
      bizItem: '',
      establishedAt: '',
    },
    representative: {
      name: '',
      birthDate: '',
      mobile: '',
      email: '',
      address: '',
      memo: '',
    },
    staffMembers: [createEmptyStaffMember()],
    division: DEFAULT_DIVISION,
    partnerMemo: '',
    region: '',
    partnerTraits: [],
    partnerTraitRatios: {},
    competitorBrands: [createEmptyCompetitorBrand()],
    mapCenter: { ...DEFAULT_MAP_CENTER },
    nearbyPoints: [],
    historyNotes: '',
  };
}

export function createFinancePreviewByPartnerId(partnerId, receivablesMock, billsMock, collateralMock, rowLimit = 8) {
  const receivableRows = receivablesMock
    .filter((entry) => entry.partnerId === partnerId)
    .flatMap((entry) =>
      (entry.rows || []).map((row) => ({
        baseYm: row.baseYm || `${entry.year}-${String(entry.month).padStart(2, '0')}`,
        tradeLimit: row.tradeLimit ?? 0,
        salesThisMonth: row.salesThisMonth ?? 0,
        depositThisMonth: row.depositThisMonth ?? 0,
        unpaidBill: row.unpaidBill ?? 0,
      }))
    );

  const billRows = billsMock.filter((row) => row.partnerId === partnerId).slice(0, rowLimit);
  const collateralRows = collateralMock.filter((row) => row.partnerId === partnerId).slice(0, rowLimit);
  const hasData = receivableRows.length > 0 || billRows.length > 0 || collateralRows.length > 0;

  return {
    hasData,
    preview: { receivableRows, billRows, collateralRows },
  };
}

export function createEmptyCompetitorBrand(name = '') {
  return {
    id: `competitor-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    isHandling: false,
    scale: '',
  };
}

export function normalizeCompetitorBrands(source) {
  if (Array.isArray(source)) {
    return source.map((row, index) => ({
      id: row?.id || `competitor-loaded-${index}-${Math.random().toString(36).slice(2, 6)}`,
      name: String(row?.name || row?.brandName || ''),
      isHandling: Boolean(row?.isHandling),
      scale: row?.scale != null ? String(row.scale) : '',
    }));
  }
  if (source && typeof source === 'object') {
    return Object.entries(source).map(([rowName, row], index) => ({
      id: `competitor-loaded-${index}-${Math.random().toString(36).slice(2, 6)}`,
      name: String(rowName || ''),
      isHandling: Boolean(row?.isHandling),
      scale: row?.scale != null ? String(row.scale) : '',
    }));
  }
  return [];
}

export function getDivisionLabelSet(division) {
  if (division === 'retail') {
    return {
      divisionName: '리테일 부문',
      entityName: '대리점',
      entityMemoName: '대리점 메모',
      historyEntityName: '거래처',
      infoCardTitle: '1) 대리점 정보',
      infoSearchPlaceholder: '대리점명 검색',
      memoLabel: '대리점 메모',
      memoPlaceholder: '대리점 메모 입력',
      staffCardTitle: '4) 대리점 담당 영업직원 (최근 4개년)',
      staffHint: '1번 카드에서 대리점을 선택하면 최근 4개년 담당자 이력이 표시됩니다.',
      historyCardTitle: '8) 거래처 이력 및 특이사항',
      historyPlaceholder: '거래처 이력 및 특이사항 입력',
    };
  }
  return {
    divisionName: '프로젝트 부문',
    entityName: '에이전트',
    entityMemoName: '에이전트 메모',
    historyEntityName: '에이전트',
    infoCardTitle: '1) 에이전트 정보 (업종 포함)',
    infoSearchPlaceholder: '에이전트명 검색',
    memoLabel: '에이전트 메모',
    memoPlaceholder: '에이전트 메모 입력',
    staffCardTitle: '4) 에이전트 담당 직원 (최근 4개년)',
    staffHint: '1번 카드에서 에이전트를 선택하면 최근 4개년 담당자 이력이 표시됩니다.',
    historyCardTitle: '8) 에이전트 이력 및 특이사항',
    historyPlaceholder: '에이전트 이력 및 특이사항 입력',
  };
}

export function formatHistoryTimestamp(date = new Date()) {
  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function createHistorySnapshot(formData) {
  const competitorSummary = (formData.competitorBrands || [])
    .map((row) => `${row.name || '-'}:${row.isHandling ? 'Y' : 'N'}:${row.scale || '-'}`)
    .join('|');
  const staffSummary = (formData.staffMembers || [])
    .map((row) => `${row.name || '-'}:${row.mobile || '-'}:${row.email || '-'}`)
    .join('|');

  return {
    partnerName: formData.basic?.companyName || '',
    ceoName: formData.basic?.ceoName || '',
    basicAddress: formData.basic?.address || '',
    basicPhone: formData.basic?.phone || '',
    representativeName: formData.representative?.name || '',
    representativeMobile: formData.representative?.mobile || '',
    representativeEmail: formData.representative?.email || '',
    representativeAddress: formData.representative?.address || '',
    region: formData.region || '',
    partnerMemo: formData.partnerMemo || '',
    partnerTraits: (formData.partnerTraits || []).join(','),
    competitorSummary,
    staffSummary,
    nearbyCount: String((formData.nearbyPoints || []).length),
    historyNotes: formData.historyNotes || '',
  };
}

export function buildHistoryChanges(beforeSnapshot, afterSnapshot, labelSet) {
  const fields = [
    { key: 'partnerName', label: `${labelSet.entityName}명` },
    { key: 'ceoName', label: '대표자' },
    { key: 'basicAddress', label: '기본 주소' },
    { key: 'basicPhone', label: '기본 전화번호' },
    { key: 'representativeName', label: '대표자 성명' },
    { key: 'representativeMobile', label: '대표자 휴대전화' },
    { key: 'representativeEmail', label: '대표자 이메일' },
    { key: 'representativeAddress', label: '대표자 주소' },
    { key: 'region', label: '지역' },
    { key: 'partnerMemo', label: labelSet.entityMemoName },
    { key: 'partnerTraits', label: '성격 코드' },
    { key: 'competitorSummary', label: '경쟁사 취급 브랜드' },
    { key: 'staffSummary', label: '담당 영업직원' },
    { key: 'nearbyCount', label: '반경 내 지점 수' },
    { key: 'historyNotes', label: `${labelSet.historyEntityName} 이력/특이사항` },
  ];

  return fields
    .map(({ key, label }) => ({
      field: label,
      before: String(beforeSnapshot?.[key] || '-'),
      after: String(afterSnapshot?.[key] || '-'),
    }))
    .filter((row) => row.before !== row.after);
}

export function buildInitialPartnerHistory(partnerDetail, labelSet) {
  const partnerName = partnerDetail?.name || partnerDetail?.basic?.companyName || labelSet.entityName;
  return [
    {
      id: `${partnerDetail?.id || 'new'}-history-initial`,
      changedAt: '2026-01-10 09:30',
      changedBy: '시스템',
      reason: '최초 등록',
      changes: [
        { field: `${labelSet.entityName}명`, before: '-', after: partnerName },
        { field: '등록 상태', before: '-', after: '등록 완료' },
      ],
    },
  ];
}

export function parseEmail(email) {
  const raw = String(email || '');
  if (!raw.includes('@')) return { local: '', domain: '' };
  const [local, domain] = raw.split('@');
  return { local: local || '', domain: domain || '' };
}

export function createEmptyStaffMember() {
  return {
    id: `staff-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    mobile: '',
    email: '',
    emailLocal: '',
    emailDomainType: '',
    emailDomainDirect: '',
    memo: '',
  };
}
