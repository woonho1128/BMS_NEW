import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/hooks/useAuth';
import { ROUTES, toRelative } from './routePaths';

import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import { LoginPage } from '../modules/auth/pages/LoginPage';
import { DashboardHome } from '../modules/dashboard/pages/DashboardHome';

import { ItemsPage } from '../modules/master/pages/ItemsPage';
import { PartnersPage } from '../modules/master/pages/PartnersPage';
import { PartnerCardPage } from '../modules/master/pages/PartnerCardPage';
import { StandardCostPage } from '../modules/master/pages/StandardCostPage';

import { SalesProfitAnalysisPage } from '../modules/sales/pages/SalesProfitAnalysisPage';
import { SalesProfitAnalysisNewPage } from '../modules/sales/pages/SalesProfitAnalysisNewPage';
import { SalesProfitAnalysisDetailPage } from '../modules/sales/pages/SalesProfitAnalysisDetailPage';
import { SalesInfoPage } from '../modules/sales/pages/SalesInfoPage';
import { SalesInfoDetailPage } from '../modules/sales/pages/SalesInfoDetailPage';
import { SalesInfoRegisterPage } from '../modules/sales/pages/SalesInfoRegisterPage';
import { SalesReportsPage } from '../modules/sales/pages/SalesReportsPage';
import { WeeklyReportFormPage } from '../modules/sales/pages/WeeklyReportFormPage';
import { TripReportFormPage } from '../modules/sales/pages/TripReportFormPage';
import { ReportDetailPage } from '../modules/sales/pages/ReportDetailPage';
import { BusinessCardPage } from '../modules/sales/pages/BusinessCardPage';
import { BusinessCardFormPage } from '../modules/sales/pages/BusinessCardFormPage';
import { SalesMaterialsPage } from '../modules/sales/pages/SalesMaterialsPage';
import { SalesMaterialDetailPage } from '../modules/sales/pages/SalesMaterialDetailPage';
import { SalesMaterialFormPage } from '../modules/sales/pages/SalesMaterialFormPage';
import { SalesSupportPage } from '../modules/sales/pages/SalesSupportPage';
import { ShortProjectPage } from '../modules/sales/pages/ShortProjectPage';
import { TileTeamPage } from '../modules/sales/pages/TileTeamPage';
import { SpecStatusDiscountPage } from '../modules/sales/pages/SpecStatusDiscountPage';

import { SalesApprovalPage } from '../modules/approval/pages/SalesApprovalPage';
import { DeliveryApprovalPage } from '../modules/approval/pages/DeliveryApprovalPage';

import { DeliveryRequestPage } from '../modules/delivery/pages/DeliveryRequestPage';
import { DeliveryHistoryPage } from '../modules/delivery/pages/DeliveryHistoryPage';
import { DeliveryPlanPage } from '../modules/delivery/pages/DeliveryPlanPage';
import { InventoryPage } from '../modules/delivery/pages/InventoryPage';



import { PurchaseSalesPage } from '../modules/finance/pages/PurchaseSalesPage';
import { ReceivablesPage } from '../modules/finance/pages/ReceivablesPage';
import { BillsDepositsPage } from '../modules/finance/pages/BillsDepositsPage';
import { CreditCollateralPage } from '../modules/finance/pages/CreditCollateralPage';

import { PartnerNoticePage } from '../modules/partner/pages/PartnerNoticePage';
import { PartnerCatalogPage } from '../modules/partner/pages/PartnerCatalogPage';
import { PartnerDeliveryPage } from '../modules/partner/pages/PartnerDeliveryPage';
import { PartnerBasicInfoPage } from '../modules/partner/pages/PartnerBasicInfoPage';
import { PartnerOrderPage } from '../modules/partner/pages/PartnerOrderPage';
import { PartnerAsRedirect } from '../modules/partner/pages/PartnerAsRedirect';

import { SalesPerformancePage } from '../modules/analytics/pages/SalesPerformancePage';
import { ProfitLossPage } from '../modules/analytics/pages/ProfitLossPage';
import { DeliveryStockStatsPage } from '../modules/analytics/pages/DeliveryStockStatsPage';
import { PartnerPerformancePage } from '../modules/analytics/pages/PartnerPerformancePage';

import { CustomReportPage } from '../modules/analytics/pages/CustomReportPage';
import { SalesTrendsPage } from '../modules/analytics/pages/SalesTrendsPage';
import { MarketOverviewPage } from '../modules/analytics/pages/MarketOverviewPage';

import {
  RetailOrderReviewPage,
  RetailOrderDetailPage,
  RetailOrderApprovalPage
} from '../modules/sales/pages/RetailOrderComponents';

import { UsersAdminPage } from '../modules/admin/pages/UsersAdminPage';
import { OrgAdminPage } from '../modules/admin/pages/OrgAdminPage';
import { PermissionAdminPage } from '../modules/admin/pages/PermissionAdminPage';
import { CodesAdminPage } from '../modules/admin/pages/CodesAdminPage';

import { LogsAdminPage } from '../modules/admin/pages/LogsAdminPage';

import { PartnerProductOrderPage } from '../modules/partner/pages/PartnerProductOrderPage';
import { PartnerOrderListPage } from '../modules/partner/pages/PartnerOrderListPage';
import {
  PartnerOrderDeliveryPage,
  PartnerOrderModificationPage,
} from '../modules/partner/pages/PartnerOrderComponents';

import {
  AdminTotalOrderPage,
  AdminStatusChangePage,
  AdminErpPage,
  AdminOrderLogPage,
} from '../modules/admin/pages/AdminOrderComponents';

import { NotFound } from '../shared/pages/NotFound';
import { NoAccess } from '../shared/pages/NoAccess';
import { Guard } from '../shared/components/Guard';
import { PERMISSIONS } from '../shared/constants/permissions';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return children;
}

/**
 * 라우트 매핑 (IA 메뉴 path ↔ 컴포넌트)
 * - 로그인(/login) → LoginPage
 * - / → DashboardHome (대시보드)
 * - 영업 활동(공통): 주간/출장보고, 명함, 영업자료실 → SalesReportsPage, BusinessCardPage, SalesMaterialsPage
 * - 영업 관리: 영업정보/수주, 결재 → SalesInfoPage, SalesApprovalPage
 * - 출고/납품, 채권/여신, 결재, 대리점 포털, 인사이트, 기준정보, 관리자 → 각 페이지 연결됨
 */
export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.FORBIDDEN} element={<NoAccess />} />
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
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path={toRelative(ROUTES.DASHBOARD_ALT)} element={<DashboardHome />} />
          <Route path={toRelative(ROUTES.MASTER_ITEMS)} element={<ItemsPage />} />
          <Route path={toRelative(ROUTES.MASTER_PARTNERS)} element={<PartnersPage />} />
          <Route path={toRelative(ROUTES.MASTER_PARTNERS_NEW)} element={<PartnerCardPage />} />
          <Route path={toRelative(ROUTES.MASTER_PARTNERS_ID)} element={<PartnerCardPage />} />
          <Route path={toRelative(ROUTES.MASTER_STANDARD_COST)} element={<StandardCostPage />} />
          <Route path={toRelative(ROUTES.PROFIT)} element={<SalesProfitAnalysisPage />} />
          <Route path={toRelative(ROUTES.PROFIT_NEW)} element={<SalesProfitAnalysisNewPage />} />
          <Route path={toRelative(ROUTES.PROFIT_ID_EDIT)} element={<SalesProfitAnalysisNewPage />} />
          <Route path={toRelative(ROUTES.PROFIT_ID)} element={<SalesProfitAnalysisDetailPage />} />
          <Route path={toRelative(ROUTES.SALES_INFO)} element={<SalesInfoPage />} />
          <Route path={toRelative(ROUTES.SALES_INFO_NEW)} element={<SalesInfoRegisterPage />} />
          <Route path={toRelative(ROUTES.SALES_INFO_ID)} element={<SalesInfoDetailPage />} />
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
          <Route path={toRelative(ROUTES.SALES_SUPPORT)} element={<SalesSupportPage />} />
          <Route path={toRelative(ROUTES.SHORT_PROJECT)} element={<ShortProjectPage />} />
          <Route path={toRelative(ROUTES.TILE_TEAM)} element={<TileTeamPage />} />
          <Route path={toRelative(ROUTES.SPEC_STATUS)} element={<SpecStatusDiscountPage />} />
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
          <Route path={toRelative(ROUTES.DELIVERY_REQUEST)} element={<DeliveryRequestPage />} />
          <Route path={toRelative(ROUTES.DELIVERY_HISTORY)} element={<DeliveryHistoryPage />} />
          <Route path={toRelative(ROUTES.DELIVERY_PLAN)} element={<DeliveryPlanPage />} />
          <Route path={toRelative(ROUTES.DELIVERY_INVENTORY)} element={<InventoryPage />} />


          <Route path={toRelative(ROUTES.FINANCE_PURCHASE_SALES)} element={<PurchaseSalesPage />} />
          <Route path={toRelative(ROUTES.FINANCE_RECEIVABLE)} element={<ReceivablesPage />} />
          <Route path={toRelative(ROUTES.FINANCE_BILL)} element={<BillsDepositsPage />} />
          <Route path={toRelative(ROUTES.FINANCE_CREDIT)} element={<CreditCollateralPage />} />
          <Route path={toRelative(ROUTES.PARTNER_NOTICE)} element={<PartnerNoticePage />} />
          <Route path={toRelative(ROUTES.PARTNER_CATALOG)} element={<PartnerCatalogPage />} />
          <Route path={toRelative(ROUTES.PARTNER_ORDER)} element={<PartnerOrderPage />} />
          <Route path={toRelative(ROUTES.PARTNER_ORDER_PRODUCT)} element={<PartnerProductOrderPage />} />
          <Route path={toRelative(ROUTES.PARTNER_ORDER_LIST)} element={<PartnerOrderListPage />} />
          <Route path={toRelative(ROUTES.PARTNER_ORDER_MODIFY)} element={<PartnerOrderModificationPage />} />
          <Route path={toRelative(ROUTES.PARTNER_ORDER_DELIVERY)} element={<PartnerOrderDeliveryPage />} />
          <Route path={toRelative(ROUTES.PARTNER_DELIVERY)} element={<PartnerDeliveryPage />} />
          {/* 기존 호환: /partner/receivable → 거래 정보 조회(/finance/receivable) */}
          <Route
            path={toRelative(ROUTES.PARTNER_RECEIVABLE)}
            element={<Navigate to={ROUTES.FINANCE_RECEIVABLE} replace />}
          />
          <Route path={toRelative(ROUTES.PARTNER_BASIC)} element={<PartnerBasicInfoPage />} />
          <Route path={toRelative(ROUTES.PARTNER_AS)} element={<PartnerAsRedirect />} />
          <Route path={toRelative(ROUTES.ANALYTICS_SALES)} element={<SalesPerformancePage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_RETAIL)} element={<SalesPerformancePage />} />

          {/* 리테일팀 관리 (신설) */}
          <Route path={toRelative(ROUTES.SALES_RETAIL_REVIEW_LIST)} element={<RetailOrderReviewPage />} />
          <Route path={toRelative(ROUTES.SALES_RETAIL_ORDER_DETAIL)} element={<RetailOrderDetailPage />} />
          <Route path={toRelative(ROUTES.SALES_RETAIL_APPROVAL)} element={<RetailOrderApprovalPage />} />

          <Route path={toRelative(ROUTES.ANALYTICS_TRENDS)} element={<SalesTrendsPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_PROFIT)} element={<ProfitLossPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_DELIVERY_STOCK)} element={<DeliveryStockStatsPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_PARTNER)} element={<PartnerPerformancePage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_MARKET)} element={<MarketOverviewPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_CUSTOM)} element={<CustomReportPage />} />
          <Route path={toRelative(ROUTES.ADMIN_USERS)} element={<UsersAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_ORG)} element={<OrgAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_PERMISSION)} element={<PermissionAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_CODE)} element={<CodesAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_LOG)} element={<LogsAdminPage />} />
          {/* 관리자 주문 관리 (신설) */}
          {/* 관리자 주문 관리 (재편) */}
          <Route path={toRelative(ROUTES.ADMIN_ORDER_TOTAL)} element={<AdminTotalOrderPage />} />
          <Route path={toRelative(ROUTES.ADMIN_ORDER_STATUS_FORCE)} element={<AdminStatusChangePage />} />
          <Route path={toRelative(ROUTES.ADMIN_ORDER_ERP)} element={<AdminErpPage />} />
          <Route path={toRelative(ROUTES.ADMIN_ORDER_HISTORY_LOG)} element={<AdminOrderLogPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
