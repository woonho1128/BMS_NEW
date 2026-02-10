/**
 * 영업자료 Mock 데이터
 */

// 등록자 옵션
export const MOCK_REGISTRANT_OPTIONS = [
  { value: '', label: '전체' },
  { value: '홍길동', label: '홍길동' },
  { value: '김영희', label: '김영희' },
  { value: '박철수', label: '박철수' },
  { value: '이민수', label: '이민수' },
];

// 거래처 옵션
export const MOCK_PARTNER_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'ABC건설', label: 'ABC건설' },
  { value: 'XYZ제조', label: 'XYZ제조' },
  { value: 'DEF물류', label: 'DEF물류' },
  { value: 'GHI소프트', label: 'GHI소프트' },
];

// 영업자료 목록 Mock 데이터
const MOCK_SALES_MATERIALS = [
  {
    id: '1',
    title: '2025년 신제품 카탈로그',
    partner: 'ABC건설',
    registrant: '홍길동',
    registeredAt: '2025-01-15',
    contentHtml: '<p>2025년 신제품 카탈로그입니다. 주요 제품의 사양과 가격 정보가 포함되어 있습니다.</p><p><strong>주요 내용:</strong></p><ul><li>신제품 A 시리즈</li><li>신제품 B 시리즈</li><li>가격표</li></ul>',
    attachments: [
      { id: 'a1', name: '2025_신제품_카탈로그.pdf', size: 2456789, url: '/files/catalog2025.pdf' },
      { id: 'a2', name: '가격표_2025.xlsx', size: 123456, url: '/files/price2025.xlsx' },
    ],
  },
  {
    id: '2',
    title: '거래처별 매출 현황 분석',
    partner: 'XYZ제조',
    registrant: '김영희',
    registeredAt: '2025-01-20',
    contentHtml: '<p>XYZ제조와의 거래 현황을 분석한 자료입니다.</p><p><strong>분석 기간:</strong> 2024년 1월 ~ 12월</p><p><strong>주요 내용:</strong></p><ul><li>월별 매출 추이</li><li>제품별 판매 현황</li><li>향후 전망</li></ul>',
    attachments: [
      { id: 'a3', name: '매출현황_XYZ제조.xlsx', size: 456789, url: '/files/sales_xyz.xlsx' },
    ],
  },
  {
    id: '3',
    title: '신규 거래처 제안서',
    partner: 'DEF물류',
    registrant: '박철수',
    registeredAt: '2025-01-22',
    contentHtml: '<p>DEF물류에 대한 신규 거래 제안서입니다.</p><p><strong>제안 내용:</strong></p><ul><li>제품 소개</li><li>가격 제안</li><li>거래 조건</li></ul>',
    attachments: [
      { id: 'a4', name: '제안서_DEF물류.pdf', size: 1234567, url: '/files/proposal_def.pdf' },
      { id: 'a5', name: '견적서_DEF물류.xlsx', size: 234567, url: '/files/quote_def.xlsx' },
    ],
  },
  {
    id: '4',
    title: '경쟁사 분석 보고서',
    partner: null,
    registrant: '이민수',
    registeredAt: '2025-01-25',
    contentHtml: '<p>주요 경쟁사에 대한 분석 보고서입니다.</p><p><strong>분석 대상:</strong></p><ul><li>경쟁사 A</li><li>경쟁사 B</li><li>경쟁사 C</li></ul><p><strong>분석 항목:</strong> 제품, 가격, 시장 점유율 등</p>',
    attachments: [
      { id: 'a6', name: '경쟁사_분석_보고서.pdf', size: 3456789, url: '/files/competitor_analysis.pdf' },
    ],
  },
  {
    id: '5',
    title: '월간 영업 실적 요약',
    partner: 'GHI소프트',
    registrant: '홍길동',
    registeredAt: '2025-01-28',
    contentHtml: '<p>2025년 1월 영업 실적 요약입니다.</p><p><strong>실적 요약:</strong></p><ul><li>매출 목표 달성률: 105%</li><li>신규 거래처: 3개</li><li>주요 성과</li></ul>',
    attachments: [
      { id: 'a7', name: '영업실적_202501.xlsx', size: 567890, url: '/files/sales_202501.xlsx' },
      { id: 'a8', name: '영업실적_차트.png', size: 234567, url: '/files/sales_chart.png' },
    ],
  },
];

/**
 * 영업자료 목록 조회 (필터 적용)
 */
export function getSalesMaterialsList(filter) {
  let result = [...MOCK_SALES_MATERIALS];

  if (filter.title) {
    result = result.filter((material) =>
      material.title.toLowerCase().includes(filter.title.toLowerCase())
    );
  }

  if (filter.partner) {
    result = result.filter((material) => material.partner === filter.partner);
  }

  if (filter.registrant) {
    result = result.filter((material) => material.registrant === filter.registrant);
  }

  if (filter.dateFrom) {
    result = result.filter((material) => material.registeredAt >= filter.dateFrom);
  }

  if (filter.dateTo) {
    result = result.filter((material) => material.registeredAt <= filter.dateTo);
  }

  return result;
}

/**
 * ID로 영업자료 조회
 */
export function getSalesMaterialById(id) {
  return MOCK_SALES_MATERIALS.find((material) => material.id === id) || null;
}

/**
 * 파일 크기 포맷팅
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
