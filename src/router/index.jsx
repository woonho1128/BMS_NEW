/**
 * =============================================================================
 * router/index.jsx — 라우터 설정 (전체 페이지 경로 ↔ 컴포넌트 매핑)
 * =============================================================================
 *
 * 구조:
 *   1. 라이브러리·레이아웃 import
 *   2. 모듈별 페이지 컴포넌트 import (기준정보 / 영업 / 결재 / 출고납품 / 재무 / 대리점 / 인사이트 / 관리자)
 *   3. 라우트 가드 컴포넌트 (ProtectedRoute, PublicOnlyRoute)
 *   4. Router 컴포넌트: BrowserRouter > Routes 선언
 *
 * 라우트 가드:
 *   - ProtectedRoute: 비로그인 시 /login 으로 리다이렉트
 *   - PublicOnlyRoute: 로그인 상태에서 /login 접근 시 홈으로 리다이렉트
 *   - Guard (권한): PERMISSIONS 상수 기반 — 현재 영업결재·납품결재에 적용
 *
 * 페이지 경로 상수는 router/routePaths.js 에서 관리합니다.
 * IA 메뉴 구조는 shared/constants/ia.js 에서 관리합니다.
 * =============================================================================
 */

// ── 라이브러리
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/hooks/useAuth';
import { ROUTES, toRelative } from './routePaths';

// ── 레이아웃
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// ── 인증
import { LoginPage } from '../modules/auth/pages/LoginPage';

// ── 대시보드
import { DashboardHome } from '../modules/dashboard/pages/DashboardHome';

// ── 기준 정보 (마스터)
import { ItemsPage } from '../modules/master/pages/items/ItemsPage';
import { PartnersPage } from '../modules/master/pages/PartnersPage';
import { PartnerCardPage } from '../modules/master/pages/PartnerCardPage';
import { StandardCostPage } from '../modules/master/pages/standard-cost/StandardCostPage';

// ── 영업 관리 — 프로젝트팀 (손익분석)
import { SalesProfitAnalysisPage } from '../modules/sales/pages/SalesProfitAnalysisPage';
import { SalesProfitAnalysisNewPage } from '../modules/sales/pages/SalesProfitAnalysisNewPage';
import { SalesProfitAnalysisDetailPage } from '../modules/sales/pages/SalesProfitAnalysisDetailPage';
import { SalesInfoPage } from '../modules/sales/pages/SalesInfoPage';
import { SalesInfoDetailPage } from '../modules/sales/pages/SalesInfoDetailPage';
import { SalesInfoRegisterPage } from '../modules/sales/pages/SalesInfoRegisterPage';
import { SpecStatusDiscountPage } from '../modules/sales/pages/SpecStatusDiscountPage';

// ── 영업 관리 — 공통 (보고서 / 명함 / 자료실)
import { SalesReportsPage } from '../modules/sales/pages/SalesReportsPage';
import { WeeklyReportFormPage } from '../modules/sales/pages/WeeklyReportFormPage';
import { TripReportFormPage } from '../modules/sales/pages/TripReportFormPage';
import { ReportDetailPage } from '../modules/sales/pages/ReportDetailPage';
import { BusinessCardPage } from '../modules/sales/pages/BusinessCardPage';
import { BusinessCardFormPage } from '../modules/sales/pages/BusinessCardFormPage';
import { SalesMaterialsPage } from '../modules/sales/pages/SalesMaterialsPage';
import { SalesMaterialDetailPage } from '../modules/sales/pages/SalesMaterialDetailPage';
import { SalesMaterialFormPage } from '../modules/sales/pages/SalesMaterialFormPage';

// ── 영업 관리 — 리테일팀
import { ShortProjectPage } from '../modules/sales/pages/ShortProjectPage';
import {
  RetailOrderReviewPage,
  RetailOrderDetailPage,
  RetailOrderApprovalPage,
} from '../modules/sales/pages/RetailOrderComponents';

// ── 영업 관리 — 타일영업팀·영업지원팀 (임시)
import { TileTeamPage } from '../modules/sales/pages/TileTeamPage';
import { SalesSupportPage } from '../modules/sales/pages/SalesSupportPage';
import { SupportReceivablePage } from '../modules/finance/pages/SupportReceivablePage';
import { DiscountPromotionPage } from '../modules/sales/pages/DiscountPromotionPage';

// ── 영업 결재
import { SalesApprovalPage } from '../modules/approval/pages/SalesApprovalPage';
import { DeliveryApprovalPage } from '../modules/approval/pages/DeliveryApprovalPage';

// ── 출고 / 납품
import { DeliveryRequestPage } from '../modules/delivery/pages/DeliveryRequestPage';
import { DeliveryHistoryPage } from '../modules/delivery/pages/DeliveryHistoryPage';
import { DeliveryPlanPage } from '../modules/delivery/pages/DeliveryPlanPage';
import { InventoryPage } from '../modules/delivery/pages/InventoryPage';

// ── 재무 (채권·여신·어음·매입매출)
import { PurchaseSalesPage } from '../modules/finance/pages/PurchaseSalesPage';
import { ReceivablesPage } from '../modules/finance/pages/ReceivablesPage';
import { BillsDepositsPage } from '../modules/finance/pages/BillsDepositsPage';
import { CreditCollateralPage } from '../modules/finance/pages/CreditCollateralPage';

// ── 대리점 포털
import { PartnerNoticePage } from '../modules/partner/pages/PartnerNoticePage';
import { PartnerCatalogPage } from '../modules/partner/pages/PartnerCatalogPage';
import { PartnerDeliveryPage } from '../modules/partner/pages/PartnerDeliveryPage';
import { PartnerBasicInfoPage } from '../modules/partner/pages/PartnerBasicInfoPage';
import { PartnerOrderPage } from '../modules/partner/pages/PartnerOrderPage';
import { PartnerAsRedirect } from '../modules/partner/pages/PartnerAsRedirect';
import { PartnerProductOrderPage } from '../modules/partner/pages/PartnerProductOrderPage';
import { PartnerOrderListPage } from '../modules/partner/pages/PartnerOrderListPage';
import { PartnerCartPage } from '../modules/partner/pages/PartnerCartPage';
import { PartnerOrderDetailPage } from '../modules/partner/pages/PartnerOrderDetailPage';
import { PartnerOrderDeliveryPage } from '../modules/partner/pages/order-delivery/PartnerOrderDeliveryPage';
import { PartnerOrderModificationPage } from '../modules/partner/pages/PartnerOrderComponents';

// ── 인사이트 / 분석
import { SalesPerformancePage } from '../modules/analytics/pages/SalesPerformancePage';
import { ProfitLossPage } from '../modules/analytics/pages/ProfitLossPage';
import { DeliveryStockStatsPage } from '../modules/analytics/pages/DeliveryStockStatsPage';
import { PartnerPerformancePage } from '../modules/analytics/pages/PartnerPerformancePage';
import { SalesTrendsPage } from '../modules/analytics/pages/SalesTrendsPage';
import { MarketOverviewPage } from '../modules/analytics/pages/MarketOverviewPage';
import { CustomReportPage } from '../modules/analytics/pages/CustomReportPage';
import { PlaceholderPage } from '../shared/components/PlaceholderPage/PlaceholderPage';

// ── 관리자 — 시스템 설정
import { UsersAdminPage } from '../modules/admin/pages/UsersAdminPage';
import { OrgAdminPage } from '../modules/admin/pages/OrgAdminPage';
import { PermissionAdminPage } from '../modules/admin/pages/PermissionAdminPage';
import { CodesAdminPage } from '../modules/admin/pages/CodesAdminPage';
import { LogsAdminPage } from '../modules/admin/pages/LogsAdminPage';

// ── 관리자 — 온라인 주문 관리
import {
  AdminTotalOrderPage,
  AdminStatusChangePage,
  AdminErpPage,
  AdminOrderLogPage,
} from '../modules/admin/pages/AdminOrderComponents';

// ── 공통 (에러 페이지 / 접근제어 가드)
import { NotFound } from '../shared/pages/NotFound';
import { NoAccess } from '../shared/pages/NoAccess';
import { Guard } from '../shared/components/Guard';
import { PERMISSIONS } from '../shared/constants/permissions';

// ─────────────────────────────────────────────
// 라우트 가드 컴포넌트
// ─────────────────────────────────────────────

/**
 * ProtectedRoute — 로그인된 사용자만 자식 렌더
 * 비인증 상태에서 접근 시 /login 으로 리다이렉트합니다.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
}

/**
 * PublicOnlyRoute — 비로그인 사용자만 자식 렌더 (로그인 페이지용)
 * 이미 로그인된 상태에서 /login 접근 시 홈으로 리다이렉트합니다.
 */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return children;
}

// ─────────────────────────────────────────────
// 라우터 진입점
// ─────────────────────────────────────────────

/**
 * Router — 애플리케이션 전체 라우트 트리
 *
 * 최상위 구조:
 *   /403           → 권한 없음 (NoAccess)
 *   /login         → 로그인 (PublicOnlyRoute > AuthLayout)
 *   /              → 앱 레이아웃 (ProtectedRoute > AppLayout)
 *     index        → 대시보드
 *     ...          → 각 기능 페이지
 *     *            → 404 (NotFound)
 */
export function Router() {
  return (
    <BrowserRouter basename="/BMS_NEW">
      <Routes>
        {/* 권한 없음 */}
        <Route path={ROUTES.FORBIDDEN} element={<NoAccess />} />

        {/* 로그인 — 비인증 전용 */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicOnlyRoute>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </PublicOnlyRoute>
          }
        />

        {/* 앱 전체 — 인증 필수 */}
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* ── 대시보드 ── */}
          <Route index element={<DashboardHome />} />
          <Route path={toRelative(ROUTES.DASHBOARD_ALT)} element={<DashboardHome />} />

          {/* ── 기준 정보 (마스터) ── */}
          <Route path={toRelative(ROUTES.MASTER_ITEMS)} element={<ItemsPage />} />
          <Route path={toRelative(ROUTES.MASTER_PARTNERS)} element={<PartnersPage />} />
          <Route path={toRelative(ROUTES.MASTER_PARTNERS_NEW)} element={<PartnerCardPage />} />
          <Route path={toRelative(ROUTES.MASTER_PARTNERS_ID)} element={<PartnerCardPage />} />
          <Route path={toRelative(ROUTES.MASTER_STANDARD_COST)} element={<StandardCostPage />} />

          {/* ── 영업 관리 — 프로젝트팀 (손익분석 / 영업정보 / SPEC현황) ── */}
          <Route path={toRelative(ROUTES.PROFIT)} element={<SalesProfitAnalysisPage />} />
          <Route path={toRelative(ROUTES.PROFIT_NEW)} element={<SalesProfitAnalysisNewPage />} />
          <Route path={toRelative(ROUTES.PROFIT_ID_EDIT)} element={<SalesProfitAnalysisNewPage />} />
          <Route path={toRelative(ROUTES.PROFIT_ID)} element={<SalesProfitAnalysisDetailPage />} />
          <Route path={toRelative(ROUTES.SALES_INFO)} element={<SalesInfoPage />} />
          <Route path={toRelative(ROUTES.SALES_INFO_NEW)} element={<SalesInfoRegisterPage />} />
          <Route path={toRelative(ROUTES.SALES_INFO_ID)} element={<SalesInfoDetailPage />} />
          <Route path={toRelative(ROUTES.SPEC_STATUS)} element={<SpecStatusDiscountPage />} />

          {/* ── 영업 관리 — 공통 (보고서 / 명함 / 자료실) ── */}
          <Route path={toRelative(ROUTES.SALES_REPORT)} element={<SalesReportsPage />} />
          <Route path={toRelative(ROUTES.SALES_REPORT_WEEKLY_NEW)} element={<WeeklyReportFormPage />} />
          <Route path={toRelative(ROUTES.SALES_REPORT_TRIP_NEW)} element={<TripReportFormPage />} />
          <Route path={toRelative(ROUTES.SALES_REPORT_ID)} element={<ReportDetailPage />} />
          <Route path={toRelative(ROUTES.SALES_CARD)} element={<BusinessCardPage />} />
          <Route path={toRelative(ROUTES.SALES_CARD_NEW)} element={<BusinessCardFormPage />} />
          <Route path={toRelative(ROUTES.SALES_CARD_ID)} element={<BusinessCardFormPage />} />
          <Route path={toRelative(ROUTES.SALES_MATERIAL)} element={<SalesMaterialsPage />} />
          <Route path={toRelative(ROUTES.SALES_MATERIAL_NEW)} element={<SalesMaterialFormPage />} />
          <Route path={toRelative(ROUTES.SALES_MATERIAL_ID_EDIT)} element={<SalesMaterialFormPage />} />
          <Route path={toRelative(ROUTES.SALES_MATERIAL_ID)} element={<SalesMaterialDetailPage />} />

          {/* ── 영업 관리 — 리테일팀 ── */}
          <Route path={toRelative(ROUTES.SHORT_PROJECT)} element={<ShortProjectPage />} />
          <Route path={toRelative(ROUTES.SALES_RETAIL_REVIEW_LIST)} element={<RetailOrderReviewPage />} />
          <Route path={toRelative(ROUTES.SALES_RETAIL_ORDER_DETAIL)} element={<RetailOrderDetailPage />} />
          <Route path={toRelative(ROUTES.SALES_RETAIL_APPROVAL)} element={<RetailOrderApprovalPage />} />

          {/* ── 영업 관리 — 타일영업팀·영업지원팀 (임시) ── */}
          <Route path={toRelative(ROUTES.TILE_TEAM)} element={<TileTeamPage />} />
          <Route path={toRelative(ROUTES.SALES_SUPPORT)} element={<SalesSupportPage />} />
          <Route path={toRelative(ROUTES.SALES_SUPPORT_RECEIVABLE)} element={<SupportReceivablePage />} />
          <Route path={toRelative(ROUTES.SALES_SUPPORT_DISCOUNT_PROMOTION)} element={<DiscountPromotionPage />} />

          {/* ── 영업 결재 (권한 가드 적용) ── */}
          <Route
            path={toRelative(ROUTES.APPROVAL_SALES)}
            element={
              <Guard permission={PERMISSIONS.APPROVAL} fallback={<Navigate to={ROUTES.FORBIDDEN} replace />}>
                <SalesApprovalPage />
              </Guard>
            }
          />
          <Route
            path={toRelative(ROUTES.APPROVAL_DELIVERY)}
            element={
              <Guard permission={PERMISSIONS.APPROVAL} fallback={<Navigate to={ROUTES.FORBIDDEN} replace />}>
                <DeliveryApprovalPage />
              </Guard>
            }
          />

          {/* ── 출고 / 납품 ── */}
          <Route path={toRelative(ROUTES.DELIVERY_REQUEST)} element={<DeliveryRequestPage />} />
          <Route path={toRelative(ROUTES.DELIVERY_HISTORY)} element={<DeliveryHistoryPage />} />
          <Route path={toRelative(ROUTES.DELIVERY_PLAN)} element={<DeliveryPlanPage />} />
          <Route path={toRelative(ROUTES.DELIVERY_INVENTORY)} element={<InventoryPage />} />

          {/* ── 재무 (채권·수금·여신·매입매출) ── */}
          <Route path={toRelative(ROUTES.FINANCE_PURCHASE_SALES)} element={<PurchaseSalesPage />} />
          <Route path={toRelative(ROUTES.FINANCE_RECEIVABLE)} element={<ReceivablesPage />} />
          <Route path={toRelative(ROUTES.FINANCE_BILL)} element={<BillsDepositsPage />} />
          <Route path={toRelative(ROUTES.FINANCE_CREDIT)} element={<CreditCollateralPage />} />

          {/* ── 대리점 포털 ── */}
          <Route path={toRelative(ROUTES.PARTNER_NOTICE)} element={<PartnerNoticePage />} />
          <Route path={toRelative(ROUTES.PARTNER_CATALOG)} element={<PartnerCatalogPage />} />
          <Route path={toRelative(ROUTES.PARTNER_ORDER)} element={<PartnerOrderPage />} />
          <Route path={toRelative(ROUTES.PARTNER_ORDER_PRODUCT)} element={<PartnerProductOrderPage />} />
          <Route path={toRelative(ROUTES.PARTNER_ORDER_LIST)} element={<PartnerOrderListPage />} />
          <Route path={toRelative(ROUTES.PARTNER_ORDER_MODIFY)} element={<PartnerOrderModificationPage />} />
          <Route path={toRelative(ROUTES.PARTNER_ORDER_DELIVERY)} element={<PartnerOrderDeliveryPage />} />
          <Route path={toRelative(ROUTES.PARTNER_ORDER_CART)} element={<PartnerCartPage />} />
          <Route path={toRelative(ROUTES.PARTNER_ORDER_DETAIL)} element={<PartnerOrderDetailPage />} />
          <Route path={toRelative(ROUTES.PARTNER_DELIVERY)} element={<PartnerDeliveryPage />} />
          {/* 하위 호환: /partner/receivable → 거래 정보 조회 페이지로 리다이렉트 */}
          <Route
            path={toRelative(ROUTES.PARTNER_RECEIVABLE)}
            element={<Navigate to={ROUTES.FINANCE_RECEIVABLE} replace />}
          />
          <Route path={toRelative(ROUTES.PARTNER_BASIC)} element={<PartnerBasicInfoPage />} />
          <Route path={toRelative(ROUTES.PARTNER_AS)} element={<PartnerAsRedirect />} />

          {/* ── 인사이트 — 성과 관리(KPI) ── */}
          {/* 개인 KPI: 임시 페이지 / 리테일 매출 분석은 SalesPerformancePage 공유 */}
          <Route path={toRelative(ROUTES.ANALYTICS_SALES)} element={<PlaceholderPage path={ROUTES.ANALYTICS_SALES} description="개인 KPI 기능 구현 예정입니다." icon="📊" />} />
          <Route path={toRelative(ROUTES.ANALYTICS_RETAIL)} element={<SalesPerformancePage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_PROFIT)} element={<ProfitLossPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_DELIVERY_STOCK)} element={<DeliveryStockStatsPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_PARTNER)} element={<PartnerPerformancePage />} />

          {/* ── 인사이트 — 시장 분석 ── */}
          <Route path={toRelative(ROUTES.ANALYTICS_TRENDS)} element={<SalesTrendsPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_MARKET)} element={<MarketOverviewPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_CUSTOM)} element={<CustomReportPage />} />

          {/* ── 관리자 — 시스템 설정 ── */}
          <Route path={toRelative(ROUTES.ADMIN_USERS)} element={<UsersAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_ORG)} element={<OrgAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_PERMISSION)} element={<PermissionAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_CODE)} element={<CodesAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_LOG)} element={<LogsAdminPage />} />

          {/* ── 관리자 — 온라인 주문 관리 ── */}
          <Route path={toRelative(ROUTES.ADMIN_ORDER_TOTAL)} element={<AdminTotalOrderPage />} />
          <Route path={toRelative(ROUTES.ADMIN_ORDER_STATUS_FORCE)} element={<AdminStatusChangePage />} />
          <Route path={toRelative(ROUTES.ADMIN_ORDER_ERP)} element={<AdminErpPage />} />
          <Route path={toRelative(ROUTES.ADMIN_ORDER_HISTORY_LOG)} element={<AdminOrderLogPage />} />

          {/* 404 — 매칭되지 않는 모든 경로 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
