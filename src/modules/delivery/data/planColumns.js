/**
 * 납품 계획 테이블 공통 컬럼 정의
 * - PlanTable, DetailModal, 기타 납품계획 화면에서 동일하게 사용한다.
 */
export const PLAN_COLUMNS = [
  { key: 'company', label: '건설사', width: 100, align: 'center' },
  { key: 'site', label: '현장명', width: 220, isLink: true },
  { key: 'agency', label: '대리점', width: 95, align: 'center' },
  { key: 'deliveryDate', label: '납품예정', width: 88, align: 'center' },
  { key: 'item1', label: '품번', width: 90, align: 'center' },
  { key: 'qty', label: '수량', width: 78, align: 'right' },
  { key: 'agencyPrice', label: '대리점가', width: 95, align: 'right' },
  { key: 'totalWeightTon', label: '총중량(TON)', width: 92, align: 'right' },
  { key: 'amount', label: '금액', width: 100, align: 'right' },
  { key: 'spec', label: '특수사양', width: 98 },
  { key: 'manager', label: '담당자', width: 84, align: 'center' },
  { key: 'item2', label: '품목', width: 86, align: 'center' },
  { key: 'specManager', label: 'SPEC담당', width: 92, align: 'center' },
];
