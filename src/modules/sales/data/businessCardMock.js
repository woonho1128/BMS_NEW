/**
 * 명함관리 Mock 데이터
 */

// 담당자 옵션
export const MOCK_MANAGER_OPTIONS = [
  { value: '', label: '전체' },
  { value: '홍길동', label: '홍길동' },
  { value: '김영희', label: '김영희' },
  { value: '박철수', label: '박철수' },
  { value: '이민수', label: '이민수' },
];

// 부서 옵션
export const MOCK_DEPARTMENT_OPTIONS = [
  { value: '', label: '전체' },
  { value: '영업팀', label: '영업팀' },
  { value: '마케팅팀', label: '마케팅팀' },
  { value: '기획팀', label: '기획팀' },
  { value: '관리팀', label: '관리팀' },
];

// 명함 목록 Mock 데이터
const MOCK_BUSINESS_CARDS = [
  {
    id: '1',
    name: '김대표',
    title: '대표이사',
    company: 'ABC건설',
    department: '경영지원팀',
    phone: '010-1234-5678',
    email: 'kim@abc.co.kr',
    address: '서울시 강남구 테헤란로 123',
    manager: '홍길동',
    memo: 'VIP 고객. 연 2회 미팅 예정.',
    imageFront: '/images/business-card-front-1.jpg',
    imageBack: '/images/business-card-back-1.jpg',
    registeredAt: '2025-01-15',
    registeredBy: '홍길동',
  },
  {
    id: '2',
    name: '이상무',
    title: '상무',
    company: 'XYZ제조',
    department: '영업팀',
    phone: '010-2345-6789',
    email: 'lee@xyz.co.kr',
    address: '경기도 성남시 분당구 판교로 456',
    manager: '김영희',
    memo: '신규 거래처. 초기 미팅 완료.',
    imageFront: '/images/business-card-front-2.jpg',
    imageBack: '/images/business-card-back-2.jpg',
    registeredAt: '2025-01-20',
    registeredBy: '김영희',
  },
  {
    id: '3',
    name: '박부장',
    title: '부장',
    company: 'DEF물류',
    department: '물류관리팀',
    phone: '010-3456-7890',
    email: 'park@def.co.kr',
    address: '인천시 남동구 인주대로 789',
    manager: '홍길동',
    memo: '물류 파트너. 정기 협의 필요.',
    imageFront: null,
    imageBack: null,
    registeredAt: '2025-01-22',
    registeredBy: '홍길동',
  },
  {
    id: '4',
    name: '최과장',
    title: '과장',
    company: 'GHI소프트',
    department: '개발팀',
    phone: '010-4567-8901',
    email: 'choi@ghi.co.kr',
    address: '서울시 서초구 서초대로 321',
    manager: '박철수',
    memo: 'IT 솔루션 협력사.',
    imageFront: '/images/business-card-front-4.jpg',
    imageBack: null,
    registeredAt: '2025-01-25',
    registeredBy: '박철수',
  },
  {
    id: '5',
    name: '정차장',
    title: '차장',
    company: 'JKL금융',
    department: '영업팀',
    phone: '010-5678-9012',
    email: 'jung@jkl.co.kr',
    address: '서울시 중구 을지로 654',
    manager: '이민수',
    memo: '금융 서비스 파트너.',
    imageFront: null,
    imageBack: null,
    registeredAt: '2025-01-28',
    registeredBy: '이민수',
  },
  {
    id: '6',
    name: '강대리',
    title: '대리',
    company: 'MNO유통',
    department: '영업팀',
    phone: '010-6789-0123',
    email: 'kang@mno.co.kr',
    address: '부산시 해운대구 센텀중앙로 987',
    manager: '홍길동',
    memo: '유통망 확장 협력.',
    imageFront: '/images/business-card-front-6.jpg',
    imageBack: '/images/business-card-back-6.jpg',
    registeredAt: '2025-01-29',
    registeredBy: '홍길동',
  },
];

/**
 * 명함 목록 조회 (필터 적용)
 */
export function getBusinessCardsList(filter) {
  let result = [...MOCK_BUSINESS_CARDS];

  if (filter.company) {
    result = result.filter((card) =>
      card.company.toLowerCase().includes(filter.company.toLowerCase())
    );
  }

  if (filter.name) {
    result = result.filter((card) =>
      card.name.toLowerCase().includes(filter.name.toLowerCase())
    );
  }

  if (filter.department) {
    result = result.filter((card) => card.department === filter.department);
  }

  if (filter.manager) {
    result = result.filter((card) => card.manager === filter.manager);
  }

  if (filter.dateFrom) {
    result = result.filter((card) => card.registeredAt >= filter.dateFrom);
  }

  if (filter.dateTo) {
    result = result.filter((card) => card.registeredAt <= filter.dateTo);
  }

  if (filter.myCardsOnly) {
    // 본인 담당만 필터링 (실제로는 현재 사용자 정보 필요)
    result = result.filter((card) => card.manager === '홍길동'); // 임시
  }

  return result;
}

/**
 * ID로 명함 조회
 */
export function getBusinessCardById(id) {
  return MOCK_BUSINESS_CARDS.find((card) => card.id === id) || null;
}

/**
 * 이니셜 추출 (아바타용)
 */
export function getInitials(name) {
  if (!name) return '?';
  const match = name.match(/[가-힣]/g);
  if (match && match.length > 0) {
    return match.length >= 2 ? match[0] + match[match.length - 1] : match[0];
  }
  return name.charAt(0).toUpperCase();
}
