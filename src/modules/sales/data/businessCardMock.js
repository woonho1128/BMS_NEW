/**
 * 명함관리 Mock 데이터
 */

export const MOCK_MANAGER_OPTIONS = [
  { value: '', label: '전체' },
  { value: '홍길동', label: '홍길동' },
  { value: '김영희', label: '김영희' },
  { value: '박민수', label: '박민수' },
  { value: '이지은', label: '이지은' },
];

export const MOCK_DEPARTMENT_OPTIONS = [
  { value: '', label: '전체' },
  { value: '영업팀', label: '영업팀' },
  { value: '마케팅팀', label: '마케팅팀' },
  { value: '기획팀', label: '기획팀' },
  { value: '관리팀', label: '관리팀' },
  { value: '물류관리팀', label: '물류관리팀' },
  { value: '개발팀', label: '개발팀' },
  { value: '경영지원팀', label: '경영지원팀' },
];

export const MOCK_TAG_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'VIP', label: 'VIP' },
  { value: '신규', label: '신규' },
  { value: '프로젝트', label: '프로젝트' },
  { value: '여신중요', label: '여신중요' },
  { value: '재접촉필요', label: '재접촉필요' },
];

export const MOCK_TEAM_OPTIONS = [
  { value: '', label: '전체 팀' },
  { value: '리테일 1팀', label: '리테일 1팀' },
  { value: '리테일 2팀', label: '리테일 2팀' },
  { value: '프로젝트팀', label: '프로젝트팀' },
];

const MOCK_BUSINESS_CARDS = [
  {
    id: '1',
    name: '김도현',
    title: '대표이사',
    company: 'ABC건설',
    department: '경영지원팀',
    phone: '010-1234-5678',
    email: 'kim@abc.co.kr',
    address: '서울시 강남구 테헤란로 123',
    manager: '홍길동',
    team: '리테일 1팀',
    memo: 'VIP 고객. 분기별 미팅 예정.',
    tags: ['VIP', '프로젝트'],
    isFavorite: true,
    lastContactAt: '2026-04-06',
    imageFront: '/images/business-card-front-1.jpg',
    imageBack: '/images/business-card-back-1.jpg',
    registeredAt: '2026-01-15',
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
    team: '리테일 2팀',
    memo: '신규 거래처. 초기 미팅 완료.',
    tags: ['신규'],
    isFavorite: false,
    lastContactAt: '2026-04-03',
    imageFront: '/images/business-card-front-2.jpg',
    imageBack: '/images/business-card-back-2.jpg',
    registeredAt: '2026-01-20',
    registeredBy: '김영희',
  },
  {
    id: '3',
    name: '박준형',
    title: '부장',
    company: 'DEF물류',
    department: '물류관리팀',
    phone: '010-3456-7890',
    email: 'park@def.co.kr',
    address: '인천시 연수구 송도동 789',
    manager: '홍길동',
    team: '리테일 1팀',
    memo: '물류 파트너, 월간 협의 필요.',
    tags: ['재접촉필요'],
    isFavorite: false,
    lastContactAt: '2026-03-28',
    imageFront: null,
    imageBack: null,
    registeredAt: '2026-01-22',
    registeredBy: '홍길동',
  },
  {
    id: '4',
    name: '최가은',
    title: '과장',
    company: 'GHI플랫폼',
    department: '개발팀',
    phone: '010-4567-8901',
    email: 'choi@ghi.co.kr',
    address: '서울시 서초구 서초대로 321',
    manager: '박민수',
    team: '프로젝트팀',
    memo: 'IT 연동 협의 중.',
    tags: ['프로젝트'],
    isFavorite: true,
    lastContactAt: '2026-04-07',
    imageFront: '/images/business-card-front-4.jpg',
    imageBack: null,
    registeredAt: '2026-01-25',
    registeredBy: '박민수',
  },
  {
    id: '5',
    name: '정서윤',
    title: '차장',
    company: 'JKL금융',
    department: '영업팀',
    phone: '010-5678-9012',
    email: 'jung@jkl.co.kr',
    address: '서울시 중구 을지로 654',
    manager: '이지은',
    team: '리테일 2팀',
    memo: '금융 서비스 파트너.',
    tags: ['여신중요'],
    isFavorite: false,
    lastContactAt: '2026-03-31',
    imageFront: null,
    imageBack: null,
    registeredAt: '2026-01-28',
    registeredBy: '이지은',
  },
  {
    id: '6',
    name: '강보라',
    title: '대리',
    company: 'MNO유통',
    department: '영업팀',
    phone: '010-6789-0123',
    email: 'kang@mno.co.kr',
    address: '부산시 해운대구 센텀중앙로 987',
    manager: '홍길동',
    team: '리테일 1팀',
    memo: '유통망 확장 협력.',
    tags: ['VIP', '여신중요'],
    isFavorite: true,
    lastContactAt: '2026-04-05',
    imageFront: '/images/business-card-front-6.jpg',
    imageBack: '/images/business-card-back-6.jpg',
    registeredAt: '2026-01-29',
    registeredBy: '홍길동',
  },
  {
    id: '7',
    name: '임지훈',
    title: '팀장',
    company: 'PQR타일',
    department: '마케팅팀',
    phone: '010-7412-3344',
    email: 'lim@pqr.co.kr',
    address: '대전시 유성구 엑스포로 21',
    manager: '김영희',
    team: '리테일 2팀',
    memo: '카테고리 판촉 협의 필요.',
    tags: ['프로젝트', '신규'],
    isFavorite: false,
    lastContactAt: '2026-04-02',
    imageFront: null,
    imageBack: null,
    registeredAt: '2026-02-03',
    registeredBy: '김영희',
  },
  {
    id: '8',
    name: '한예린',
    title: '실장',
    company: 'STU리빙',
    department: '기획팀',
    phone: '010-8891-2233',
    email: 'han@stu.co.kr',
    address: '광주시 북구 첨단과기로 55',
    manager: '박민수',
    team: '프로젝트팀',
    memo: '중장기 협력 검토 중.',
    tags: ['VIP'],
    isFavorite: true,
    lastContactAt: '2026-04-01',
    imageFront: '/images/business-card-front-1.jpg',
    imageBack: null,
    registeredAt: '2026-02-12',
    registeredBy: '박민수',
  },
];

export function getBusinessCardsList(filter) {
  let result = [...MOCK_BUSINESS_CARDS];

  if (filter.company) {
    result = result.filter((card) => card.company.toLowerCase().includes(filter.company.toLowerCase()));
  }

  if (filter.name) {
    result = result.filter((card) => card.name.toLowerCase().includes(filter.name.toLowerCase()));
  }

  if (filter.department) {
    result = result.filter((card) => card.department === filter.department);
  }

  if (filter.manager) {
    result = result.filter((card) => card.manager === filter.manager);
  }

  if (filter.team) {
    result = result.filter((card) => card.team === filter.team);
  }

  if (filter.tag) {
    result = result.filter((card) => (card.tags || []).includes(filter.tag));
  }

  if (filter.dateFrom) {
    result = result.filter((card) => card.registeredAt >= filter.dateFrom);
  }

  if (filter.dateTo) {
    result = result.filter((card) => card.registeredAt <= filter.dateTo);
  }

  if (filter.myCardsOnly) {
    result = result.filter((card) => card.manager === '홍길동');
  }

  return result;
}

export function getBusinessCardById(id) {
  return MOCK_BUSINESS_CARDS.find((card) => card.id === id) || null;
}

export function getInitials(name) {
  if (!name) return '?';
  const chars = [...name.trim()];
  if (chars.length === 1) return chars[0];
  return `${chars[0]}${chars[chars.length - 1]}`;
}
