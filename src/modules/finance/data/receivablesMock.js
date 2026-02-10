/**
 * 채권/채무 현황 Mock 데이터
 * - 실제 연동 시 백엔드 API 응답으로 대체
 */

/** @typedef {{ partnerId: string; year: number; month: number; carryOver: number; rows: any[] }} ReceivablesMockEntry */

/**
 * 기준연월 데이터 1건(월별)
 * 컬럼:
 *  - 기준연월, 거래한도, 여신한도, 전월 외상매출금, 당월 판매금액, 당월 입금금액, 당월 외상매출금, 미결제어음
 */
export const RECEIVABLES_MOCK = [
  {
    partnerId: '1',
    year: 2026,
    month: 2,
    carryOver: 23500000,
    rows: [
      {
        baseYm: '2026-02',
        tradeLimit: 150000000,
        prevReceivable: 23500000,
        salesThisMonth: 42000000,
        depositThisMonth: 31000000,
        unpaidBill: 12000000,
      },
    ],
  },
  {
    partnerId: '2',
    year: 2026,
    month: 2,
    carryOver: 8000000,
    rows: [
      {
        baseYm: '2026-02',
        tradeLimit: 90000000,
        prevReceivable: 8000000,
        salesThisMonth: 28000000,
        depositThisMonth: 25000000,
        unpaidBill: 3500000,
      },
    ],
  },
  // 일부 케이스는 "데이터 없음" 확인용
  { partnerId: '3', year: 2026, month: 2, carryOver: 0, rows: [] },
];

