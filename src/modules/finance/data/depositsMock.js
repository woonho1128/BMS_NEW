/**
 * 입금내역 Mock 데이터
 * - 실제 연동 시 백엔드 API로 교체
 */

export const DEPOSITS_MOCK = [
  {
    id: 'DEP-202602-0001',
    partnerId: '1',
    depositDate: '2026-02-03',
    type: '계좌이체',
    amount: 3500000,
    memo: '2월 1차 입금',
    year: 2026,
    month: 2,
  },
  {
    id: 'DEP-202602-0002',
    partnerId: '1',
    depositDate: '2026-02-17',
    type: '현금',
    amount: 1250000,
    memo: '',
    year: 2026,
    month: 2,
  },
  {
    id: 'DEP-202601-0003',
    partnerId: '2',
    depositDate: '2026-01-08',
    type: '계좌이체',
    amount: 980000,
    memo: '1월 입금',
    year: 2026,
    month: 1,
  },
];

