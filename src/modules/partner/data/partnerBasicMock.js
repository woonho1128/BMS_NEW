/**
 * 대리점 기본 정보 Mock
 * - 실제 연동 시 파트너 기본정보/이력 API로 교체
 */

export const PARTNER_BASIC_MOCK = {
  name: '이규*',
  code: '111203',
  status: '정상', // 정상 | 거래중단 등
  basic: {
    bizNo: '123-45-67890',
    ceoName: '이규*',
    bizType: '도매 및 소매업',
    bizItem: '건축자재 유통',
  },
  contact: {
    phone: '02-1234-5678',
    mobile: '010-1234-5678',
    fax: '02-1234-5679',
    email: 'partner@example.com',
  },
  etc: {
    address: '서울특별시 강남구 테헤란로 123, 10층',
    startedAt: '2018-04-01',
  },
  history: [
    { id: 'h1', date: '2026-01-10', type: '계약', note: '거래 시작' },
    { id: 'h2', date: '2026-01-18', type: '정보변경', note: '담당자 변경' },
    { id: 'h3', date: '2026-02-01', type: '정산', note: '월 정산 완료' },
    { id: 'h4', date: '2026-02-03', type: '공지', note: '정책 안내 확인' },
    { id: 'h5', date: '2026-02-04', type: '정보변경', note: '주소 변경' },
  ],
};

