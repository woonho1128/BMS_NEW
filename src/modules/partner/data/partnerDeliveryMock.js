/**
 * 대리점 출고정보 Mock
 * - 실제 연동 시 백엔드 API로 교체
 */

export const PARTNER_SHIPMENTS_MOCK = [
  {
    id: 'SHP-2026-0201',
    partnerId: '1',
    date: '2026-02-03',
    factory: '서울공장',
    shipType: '직송',
    status: '출고완료',
    docNo: 'DO-202602-0001',
    item: '바닥재 A',
    qty: 120,
  },
  {
    id: 'SHP-2026-0202',
    partnerId: '1',
    date: '2026-02-10',
    factory: '부산공장',
    shipType: '택배',
    status: '출고대기',
    docNo: 'DO-202602-0002',
    item: '타일 B',
    qty: 45,
  },
  {
    id: 'SHP-2026-0101',
    partnerId: '1',
    date: '2026-01-18',
    factory: '서울공장',
    shipType: '직송',
    status: '출고완료',
    docNo: 'DO-202601-0008',
    item: '벽지 C',
    qty: 30,
  },
  {
    id: 'SHP-2026-0103',
    partnerId: '2',
    date: '2026-01-08',
    factory: '대구공장',
    shipType: '직송',
    status: '출고완료',
    docNo: 'DO-202601-0103',
    item: '타일 B',
    qty: 64,
  },
  {
    id: 'SHP-2026-0205',
    partnerId: '2',
    date: '2026-02-21',
    factory: '대구공장',
    shipType: '택배',
    status: '출고완료',
    docNo: 'DO-202602-0110',
    item: '바닥재 A',
    qty: 90,
  },
];

