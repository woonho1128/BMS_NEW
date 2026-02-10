/**
 * 담보 조회 Mock 데이터
 * - 실제 연동 시 백엔드 API로 교체
 */

export const COLLATERAL_MOCK = [
  {
    id: 'COL-2026-0001',
    partnerId: '1',
    year: 2026,
    collateralName: '부동산 담보(강남)',
    companySetAmount: 30000000,
    creditLimit: 85000000,
    appraisedValue: 120000000,
    status: '정상',
  },
  {
    id: 'COL-2026-0002',
    partnerId: '1',
    year: 2026,
    collateralName: '보증보험',
    companySetAmount: 8000000,
    creditLimit: 15000000,
    appraisedValue: 20000000,
    status: '해지',
  },
  {
    id: 'COL-2025-0103',
    partnerId: '2',
    year: 2025,
    collateralName: '예금 담보',
    companySetAmount: 5000000,
    creditLimit: 9000000,
    appraisedValue: 10000000,
    status: '정상',
  },
];

