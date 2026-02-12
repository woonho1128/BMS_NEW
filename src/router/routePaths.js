/**
 * 라우트 경로 상수 (IA 메뉴 path = URL 경로)
 * - ROUTES: 전체 경로 (/, /login, /sales/info 등) → Link, Navigate, useNavigate
 * - 라우터의 자식 Route는 path만 사용 (앞의 / 제외) → Route path={ROUTES.XXX.slice(1)}
 */
export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  DASHBOARD: '/',
  DASHBOARD_ALT: '/dashboard', /* /dashboard → 대시보드 동일 */
  FORBIDDEN: '/403',

  /* 기준 정보 (마스터) */
  MASTER_ITEMS: '/master/items',
  MASTER_PARTNERS: '/master/partners',
  MASTER_PARTNERS_NEW: '/master/partners/new',
  MASTER_PARTNERS_ID: '/master/partners/:id',
  MASTER_STANDARD_COST: '/master/standard-cost',

  /* 영업 활동 / 영업 관리 */
  SALES_REPORT: '/sales/report',
  SALES_REPORT_WEEKLY_NEW: '/sales/report/weekly/new',
  SALES_REPORT_TRIP_NEW: '/sales/report/trip/new',
  SALES_REPORT_ID: '/sales/report/:id',
  SALES_CARD: '/sales/card',
  SALES_CARD_NEW: '/sales/card/new',
  SALES_CARD_ID: '/sales/card/:id',
  SALES_MATERIAL: '/sales/material',
  SALES_MATERIAL_NEW: '/sales/material/new',
  SALES_MATERIAL_ID: '/sales/material/:id',
  SALES_MATERIAL_ID_EDIT: '/sales/material/:id/edit',
  SALES_INFO: '/sales/info',
  SALES_INFO_NEW: '/sales/info/new',
  SALES_INFO_ID: '/sales/info/:id',
  SALES_SUPPORT: '/sales/support', /* 영업 지원 임시 */
  SHORT_PROJECT: '/sales/short-project', /* 단납 프로젝트 현황 (리테일) */
  TILE_TEAM: '/sales/tile-team', /* 타일영업팀 현황 (임시) */
  SPEC_STATUS: '/sales/spec-status', /* SPEC-현황 */

  /* 결재 */
  APPROVAL_SALES: '/approval/sales',
  APPROVAL_DELIVERY: '/approval/delivery',

  /* 손익/영업지원 */
  PROFIT: '/profit',
  PROFIT_NEW: '/profit/new',
  PROFIT_ID: '/profit/:id',
  PROFIT_ID_EDIT: '/profit/:id/edit',

  /* 출고/납품 */
  DELIVERY_REQUEST: '/delivery/request',
  DELIVERY_HISTORY: '/delivery/history',
  DELIVERY_PLAN: '/delivery/plan',
  DELIVERY_INVENTORY: '/delivery/inventory',



  /* 채권/여신 */
  FINANCE_PURCHASE_SALES: '/finance/purchase-sales',
  FINANCE_RECEIVABLE: '/finance/receivable',
  FINANCE_BILL: '/finance/bill',
  FINANCE_CREDIT: '/finance/credit',

  /* 대리점 포털 */
  PARTNER_NOTICE: '/partner/notice',
  PARTNER_ORDER: '/partner/order', // Deprecated but kept for compatibility/redirect if needed
  PARTNER_ORDER_PRODUCT: '/partner/order/product', // 상품 조회/발주 등록
  PARTNER_ORDER_LIST: '/partner/order/list', // 발주 내역 조회
  PARTNER_ORDER_MODIFY: '/partner/order/modify', // 반려 건 수정 재요청
  PARTNER_ORDER_DELIVERY: '/partner/order/delivery', // 출고 / 배송 조회

  PARTNER_ORDER_NEW: '/partner/order/new',
  PARTNER_ORDER_ID: '/partner/order/:orderId',
  PARTNER_CATALOG: '/partner/catalog',
  PARTNER_DELIVERY: '/partner/delivery',
  PARTNER_RECEIVABLE: '/partner/receivable',
  PARTNER_BASIC: '/partner/basic',
  PARTNER_AS: '/partner/as',

  /* 관리자 주문 관리 (재편) */
  ADMIN_ORDER_TOTAL: '/admin/order/total', // 전체 발주 조회
  ADMIN_ORDER_STATUS_FORCE: '/admin/order/status-force', // 상태 강제 변경
  ADMIN_ORDER_ERP: '/admin/order/erp', // ERP 전송 관리 / 재전송
  ADMIN_ORDER_HISTORY_LOG: '/admin/order/history-log', // 발주 이력 / 로그

  /* 인사이트/분석 */
  ANALYTICS_SALES: '/analytics/sales',
  ANALYTICS_TRENDS: '/analytics/trends', /* 매출 동향 (시장 분석) */
  ANALYTICS_PROFIT: '/analytics/profit',
  ANALYTICS_DELIVERY_STOCK: '/analytics/delivery-stock',
  ANALYTICS_PARTNER: '/analytics/partner',
  ANALYTICS_MARKET: '/analytics/market', /* 시황 파악 */
  ANALYTICS_RETAIL: '/analytics/retail-sales', /* 리테일 매출 분석 (개인 KPI와 분리) */
  ANALYTICS_CUSTOM: '/analytics/custom', /* 사용자 정의 리포트 */

  /* 리테일팀 관리 (신설) */
  SALES_RETAIL_REVIEW_LIST: '/sales/retail/review',
  SALES_RETAIL_ORDER_DETAIL: '/sales/retail/order/:id',
  SALES_RETAIL_APPROVAL: '/sales/retail/approval',

  /* 관리자 */
  ADMIN_USERS: '/admin/users',
  ADMIN_ORG: '/admin/org',
  ADMIN_PERMISSION: '/admin/permission',
  ADMIN_CODE: '/admin/code',
  ADMIN_LOG: '/admin/log',
};

/** 자식 Route용 (부모 path="/" 기준, 앞 슬래시 제외) */
export function toRelative(fullPath) {
  return fullPath.startsWith('/') ? fullPath.slice(1) : fullPath;
}
