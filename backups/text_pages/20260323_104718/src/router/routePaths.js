/**
 * =============================================================================
 * router/routePaths.js — 전체 라우트 경로 상수 (단일 소스)
 * =============================================================================
 *
 * 사용 규칙:
 *   - NavLink/navigate/Link 등 경로 참조는 반드시 이 파일의 ROUTES 상수를 사용합니다.
 *   - <Route path> 에 사용할 때는 toRelative() 로 앞의 '/' 를 제거합니다.
 *     예) <Route path={toRelative(ROUTES.SALES_INFO)} element={<SalesInfoPage />} />
 *
 * 메뉴 구조(IA)는 shared/constants/ia.js 에서 관리합니다.
 * =============================================================================
 */
export const ROUTES = {
  /* ── 공통 ── */
  LOGIN: '/login',
  HOME: '/',
  DASHBOARD: '/',
  DASHBOARD_ALT: '/dashboard',     /* /dashboard → 대시보드와 동일 (호환용) */
  FORBIDDEN: '/403',

  /* ── 기준 정보 (마스터) ── */
  MASTER_ITEMS: '/master/items',
  MASTER_PARTNERS: '/master/partners',
  MASTER_PARTNERS_NEW: '/master/partners/new',
  MASTER_PARTNERS_ID: '/master/partners/:id',
  MASTER_STANDARD_COST: '/master/standard-cost',

  /* ── 영업 관리 — 공통 (보고서 / 명함 / 자료실) ── */
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

  /* ── 영업 관리 — 프로젝트팀 (손익분석 / 영업정보 / SPEC현황) ── */
  SALES_INFO: '/sales/info',
  SALES_INFO_NEW: '/sales/info/new',
  SALES_INFO_ID: '/sales/info/:id',
  PROFIT: '/profit',
  PROFIT_NEW: '/profit/new',
  PROFIT_ID: '/profit/:id',
  PROFIT_ID_EDIT: '/profit/:id/edit',
  SPEC_STATUS: '/sales/spec-status',

  /* ── 영업 관리 — 리테일팀 ── */
  SHORT_PROJECT: '/sales/short-project',              /* 단납 프로젝트 현황 */
  SALES_RETAIL_REVIEW_LIST: '/sales/retail/review',   /* 발주 검수 리스트 */
  SALES_RETAIL_ORDER_DETAIL: '/sales/retail/order/:id',
  SALES_RETAIL_APPROVAL: '/sales/retail/approval',    /* 발주 결재 (승인/반려/보류) */

  /* ── 영업 관리 — 타일영업팀 (임시) ── */
  TILE_TEAM: '/sales/tile-team',

  /* ── 영업 관리 — 영업지원팀 ── */
  SALES_SUPPORT: '/sales/support',                                  /* 영업 지원 현황 (임시) */
  SALES_SUPPORT_RECEIVABLE: '/sales/support/receivable',            /* 채권 및 여신관리 (임시) */
  SALES_SUPPORT_DISCOUNT_PROMOTION: '/sales/support/discount-promotion', /* 판매단가 관리 */

  /* ── 영업 결재 ── */
  APPROVAL_SALES: '/approval/sales',
  APPROVAL_DELIVERY: '/approval/delivery',

  /* ── 출고 / 납품 ── */
  DELIVERY_REQUEST: '/delivery/request',
  DELIVERY_HISTORY: '/delivery/history',
  DELIVERY_PLAN: '/delivery/plan',
  DELIVERY_INVENTORY: '/delivery/inventory',

  /* ── 재무 (채권·수금·여신·매입매출) ── */
  FINANCE_PURCHASE_SALES: '/finance/purchase-sales',  /* 매입/매출 조회 */
  FINANCE_RECEIVABLE: '/finance/receivable',           /* 거래 정보 조회 (대리점 마이페이지) */
  FINANCE_BILL: '/finance/bill',                       /* 어음 및 수금관리 */
  FINANCE_CREDIT: '/finance/credit',                   /* 여신/담보 조회 */

  /* ── 대리점 포털 ── */
  PARTNER_NOTICE: '/partner/notice',
  PARTNER_ORDER: '/partner/order',                     /* Deprecated — 호환 유지용 */
  PARTNER_ORDER_PRODUCT: '/partner/order/product',     /* 상품 조회 / 발주 등록 */
  PARTNER_ORDER_LIST: '/partner/order/list',           /* 발주 내역 조회 */
  PARTNER_ORDER_MODIFY: '/partner/order/modify',       /* 반려 건 수정 재요청 */
  PARTNER_ORDER_DELIVERY: '/partner/order/delivery',   /* 출고 / 배송 조회 */
  PARTNER_ORDER_CART: '/partner/order/cart',           /* 장바구니 */
  PARTNER_ORDER_DETAIL: '/partner/order/detail/:orderId', /* 발주 상세 */
  PARTNER_ORDER_NEW: '/partner/order/new',
  PARTNER_ORDER_ID: '/partner/order/:orderId',
  PARTNER_CATALOG: '/partner/catalog',
  PARTNER_DELIVERY: '/partner/delivery',
  PARTNER_RECEIVABLE: '/partner/receivable',           /* 하위 호환 → /finance/receivable 리다이렉트 */
  PARTNER_BASIC: '/partner/basic',
  PARTNER_AS: '/partner/as',

  /* ── 인사이트 — 성과 관리(KPI) ── */
  ANALYTICS_SALES: '/analytics/sales',                 /* 개인 KPI */
  ANALYTICS_RETAIL: '/analytics/retail-sales',         /* 리테일 매출 분석 */
  ANALYTICS_PROFIT: '/analytics/profit',               /* 사업계획 달성률 */
  ANALYTICS_DELIVERY_STOCK: '/analytics/delivery-stock', /* 부서별 실적 */
  ANALYTICS_PARTNER: '/analytics/partner',             /* 대리점 성과 분석 */

  /* ── 인사이트 — 시장 분석 ── */
  ANALYTICS_TRENDS: '/analytics/trends',               /* 매출 동향 */
  ANALYTICS_MARKET: '/analytics/market',               /* 시황 파악 */
  ANALYTICS_CUSTOM: '/analytics/custom',               /* 사용자 정의 리포트 */

  /* ── 관리자 — 시스템 설정 ── */
  ADMIN_USERS: '/admin/users',
  ADMIN_ORG: '/admin/org',
  ADMIN_PERMISSION: '/admin/permission',
  ADMIN_CODE: '/admin/code',
  ADMIN_LOG: '/admin/log',

  /* ── 관리자 — 온라인 주문 관리 ── */
  ADMIN_ORDER_TOTAL: '/admin/order/total',             /* 전체 발주 조회 */
  ADMIN_ORDER_STATUS_FORCE: '/admin/order/status-force', /* 상태 강제 변경 */
  ADMIN_ORDER_ERP: '/admin/order/erp',                 /* ERP 전송 관리 / 재전송 */
  ADMIN_ORDER_HISTORY_LOG: '/admin/order/history-log', /* 발주 이력 / 로그 */
};

/**
 * toRelative — 절대 경로(/ 시작)를 React Router <Route path> 용 상대 경로로 변환
 * 예) '/sales/info' → 'sales/info'
 * @param {string} fullPath
 * @returns {string}
 */
export function toRelative(fullPath) {
  return fullPath.startsWith('/') ? fullPath.slice(1) : fullPath;
}
