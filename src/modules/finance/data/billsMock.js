/**
 * 어음 조회 Mock 데이터
 * - 실제 연동 시 백엔드 API로 교체
 */

export const BILLS_MOCK = [
  {
    id: 'BILL-202602-0001',
    partnerId: '1',
    billNo: '2026-0001',
    issueDate: '2026-01-15',
    dueDate: '2026-03-15',
    amount: 12500000,
    status: '미결제',
    memo: '',
  },
  {
    id: 'BILL-202602-0002',
    partnerId: '1',
    billNo: '2026-0002',
    issueDate: '2026-01-25',
    dueDate: '2026-02-25',
    amount: 6800000,
    status: '결제완료',
    memo: '입금확인',
  },
  {
    id: 'BILL-202602-0003',
    partnerId: '2',
    billNo: '2026-0103',
    issueDate: '2026-01-10',
    dueDate: '2026-02-10',
    amount: 3400000,
    status: '미결제',
    memo: '',
  },
];

