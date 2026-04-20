import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/hooks/useAuth';
import { ROUTES, toRelative } from './routePaths';
import { NotFound } from '../shared/pages/NotFound';
import { NoAccess } from '../shared/pages/NoAccess';
import { Guard } from '../shared/components/Guard/Guard';
import { PERMISSIONS } from '../shared/constants/permissions';

const lazyNamed = (importer, exportName) =>
  lazy(() => importer().then((module) => ({ default: module[exportName] })));

const AppLayout = lazyNamed(() => import('../layouts/AppLayout'), 'AppLayout');
const AuthLayout = lazyNamed(() => import('../layouts/AuthLayout'), 'AuthLayout');
const LoginPage = lazyNamed(() => import('../modules/auth/pages/LoginPage'), 'LoginPage');
const DashboardHome = lazyNamed(() => import('../modules/dashboard/pages/DashboardHome'), 'DashboardHome');


const ItemsPage = lazyNamed(() => import('../modules/master/pages/items/ItemsPage'), 'ItemsPage');
const PartnersPage = lazyNamed(() => import('../modules/master/pages/PartnersPage'), 'PartnersPage');
const PartnerCardPage = lazyNamed(() => import('../modules/master/pages/PartnerCardPage'), 'PartnerCardPage');
const PartnerRegisterPage = lazyNamed(() => import('../modules/master/pages/PartnerRegisterPage'), 'PartnerRegisterPage');
const StandardCostPage = lazyNamed(() => import('../modules/master/pages/standard-cost/StandardCostPage'), 'StandardCostPage');
const PerformancePlanPage = lazyNamed(() => import('../modules/master/pages/PerformancePlanPage'), 'PerformancePlanPage');

const SalesProfitAnalysisPage = lazyNamed(() => import('../modules/sales/pages/SalesProfitAnalysisPage'), 'SalesProfitAnalysisPage');
const SalesProfitAnalysisNewPage = lazyNamed(() => import('../modules/sales/pages/SalesProfitAnalysisNewPage'), 'SalesProfitAnalysisNewPage');
const SalesProfitAnalysisDetailPage = lazyNamed(
  () => import('../modules/sales/pages/SalesProfitAnalysisDetailPage'),
  'SalesProfitAnalysisDetailPage'
);
const SalesInfoPage = lazyNamed(() => import('../modules/sales/pages/SalesInfoPage'), 'SalesInfoPage');
const SalesInfoDetailPage = lazyNamed(() => import('../modules/sales/pages/SalesInfoDetailPage'), 'SalesInfoDetailPage');
const SalesInfoRegisterPage = lazyNamed(() => import('../modules/sales/pages/SalesInfoRegisterPage'), 'SalesInfoRegisterPage');
const SpecStatusDiscountPage = lazyNamed(() => import('../modules/sales/pages/SpecStatusDiscountPage'), 'SpecStatusDiscountPage');

const SalesReportsPage = lazyNamed(() => import('../modules/sales/pages/SalesReportsPage'), 'SalesReportsPage');
const WeeklyReportFormPage = lazyNamed(() => import('../modules/sales/pages/WeeklyReportFormPage'), 'WeeklyReportFormPage');
const TripReportFormPage = lazyNamed(() => import('../modules/sales/pages/TripReportFormPage'), 'TripReportFormPage');
const ReportDetailPage = lazyNamed(() => import('../modules/sales/pages/ReportDetailPage'), 'ReportDetailPage');
const BusinessCardPage = lazyNamed(() => import('../modules/sales/pages/BusinessCardPage'), 'BusinessCardPage');
const BusinessCardFormPage = lazyNamed(() => import('../modules/sales/pages/BusinessCardFormPage'), 'BusinessCardFormPage');
const SalesMaterialsPage = lazyNamed(() => import('../modules/sales/pages/SalesMaterialsPage'), 'SalesMaterialsPage');
const SalesMaterialDetailPage = lazyNamed(
  () => import('../modules/sales/pages/SalesMaterialDetailPage'),
  'SalesMaterialDetailPage'
);
const SalesMaterialFormPage = lazyNamed(() => import('../modules/sales/pages/SalesMaterialFormPage'), 'SalesMaterialFormPage');
const DeliveryRequestStatusPage = lazyNamed(
  () => import('../modules/sales/pages/DeliveryRequestStatusPage'),
  'DeliveryRequestStatusPage'
);
const DeliveryRequestDetailPage = lazyNamed(
  () => import('../modules/sales/pages/DeliveryRequestDetailPage'),
  'DeliveryRequestDetailPage'
);
const SalesDeliveryApprovalPage = lazyNamed(
  () => import('../modules/sales/pages/DeliveryApprovalPage'),
  'DeliveryApprovalPage'
);
const ShortProjectPage = lazyNamed(() => import('../modules/sales/pages/ShortProjectPage'), 'ShortProjectPage');
const ShortProjectRegisterPage = lazyNamed(
  () => import('../modules/sales/pages/ShortProjectRegisterPage'),
  'ShortProjectRegisterPage'
);
const TileTeamPage = lazyNamed(() => import('../modules/sales/pages/TileTeamPage'), 'TileTeamPage');
const SalesSupportPage = lazyNamed(() => import('../modules/sales/pages/SalesSupportPage'), 'SalesSupportPage');

const SalesApprovalPage = lazyNamed(() => import('../modules/approval/pages/SalesApprovalPage'), 'SalesApprovalPage');
const SalesApprovalDetailPage = lazyNamed(() => import('../modules/approval/pages/SalesApprovalDetailPage'), 'SalesApprovalDetailPage');
const DeliveryApprovalPage = lazyNamed(() => import('../modules/approval/pages/DeliveryApprovalPage'), 'DeliveryApprovalPage');

const DeliveryRequestPage = lazyNamed(() => import('../modules/delivery/pages/DeliveryRequestPage'), 'DeliveryRequestPage');
const DeliveryHistoryPage = lazyNamed(() => import('../modules/delivery/pages/DeliveryHistoryPage'), 'DeliveryHistoryPage');
const InventoryPage = lazyNamed(() => import('../modules/delivery/pages/InventoryPage'), 'InventoryPage');
const DemandForecastPage = lazyNamed(() => import('../modules/delivery/pages/DemandForecastPage'), 'DemandForecastPage');

const PurchaseSalesPage = lazyNamed(() => import('../modules/finance/pages/PurchaseSalesPage'), 'PurchaseSalesPage');
const ReceivablesPage = lazyNamed(() => import('../modules/finance/pages/ReceivablesPage'), 'ReceivablesPage');
const BillsDepositsPage = lazyNamed(() => import('../modules/finance/pages/BillsDepositsPage'), 'BillsDepositsPage');
const CreditCollateralPage = lazyNamed(() => import('../modules/finance/pages/CreditCollateralPage'), 'CreditCollateralPage');

const PartnerNoticePage = lazyNamed(() => import('../modules/partner/pages/PartnerNoticePage'), 'PartnerNoticePage');
const PartnerCatalogPage = lazyNamed(() => import('../modules/partner/pages/PartnerCatalogPage'), 'PartnerCatalogPage');
const PartnerDeliveryPage = lazyNamed(() => import('../modules/partner/pages/PartnerDeliveryPage'), 'PartnerDeliveryPage');
const PartnerBasicInfoPage = lazyNamed(() => import('../modules/partner/pages/PartnerBasicInfoPage'), 'PartnerBasicInfoPage');
const PartnerBalanceConfirmPage = lazyNamed(() => import('../modules/partner/pages/PartnerBalanceConfirmPage'), 'PartnerBalanceConfirmPage');
const PartnerOrderDeliveryPage = lazyNamed(
  () => import('../modules/partner/pages/order-delivery/PartnerOrderDeliveryPage'),
  'PartnerOrderDeliveryPage'
);
const PartnerAsRedirect = lazyNamed(() => import('../modules/partner/pages/PartnerAsRedirect'), 'PartnerAsRedirect');

const UsersAdminPage = lazyNamed(() => import('../modules/admin/pages/UsersAdminPage'), 'UsersAdminPage');
const OrgAdminPage = lazyNamed(() => import('../modules/admin/pages/OrgAdminPage'), 'OrgAdminPage');
const PermissionAdminPage = lazyNamed(() => import('../modules/admin/pages/PermissionAdminPage'), 'PermissionAdminPage');
const CodesAdminPage = lazyNamed(() => import('../modules/admin/pages/CodesAdminPage'), 'CodesAdminPage');
const LogsAdminPage = lazyNamed(() => import('../modules/admin/pages/LogsAdminPage'), 'LogsAdminPage');

const DeliveryPlanPage = lazy(() =>
  import('../modules/delivery/pages/DeliveryPlanPage').then((module) => ({ default: module.DeliveryPlanPage }))
);
const SupportReceivablePage = lazy(() =>
  import('../modules/finance/pages/SupportReceivablePage').then((module) => ({ default: module.SupportReceivablePage }))
);
const DiscountPromotionPage = lazy(() =>
  import('../modules/sales/pages/DiscountPromotionPage').then((module) => ({ default: module.DiscountPromotionPage }))
);
const SalesPerformancePage = lazy(() =>
  import('../modules/analytics/pages/SalesPerformancePage').then((module) => ({ default: module.SalesPerformancePage }))
);
const PartnerPerformancePage = lazy(() =>
  import('../modules/analytics/pages/PartnerPerformancePage').then((module) => ({ default: module.PartnerPerformancePage }))
);
const MarketOverviewPage = lazy(() =>
  import('../modules/analytics/pages/MarketOverviewPage').then((module) => ({ default: module.MarketOverviewPage }))
);
const DataCollectionPage = lazy(() =>
  import('../modules/analytics/pages/DataCollectionPage').then((module) => ({ default: module.DataCollectionPage }))
);
const CustomReportPage = lazy(() =>
  import('../modules/analytics/pages/CustomReportPage').then((module) => ({ default: module.CustomReportPage }))
);
const ProjectPerformancePage = lazy(() =>
  import('../modules/analytics/pages/ProjectPerformancePage').then((module) => ({ default: module.ProjectPerformancePage }))
);
const YearlyDeliveryForecastPage = lazy(() =>
  import('../modules/analytics/pages/YearlyDeliveryForecastPage').then((module) => ({
    default: module.YearlyDeliveryForecastPage,
  }))
);
const PersonalSalesPage = lazy(() =>
  import('../modules/analytics/pages/PersonalSalesPage').then((module) => ({ default: module.PersonalSalesPage }))
);
const CategorySalesPage = lazy(() =>
  import('../modules/analytics/pages/CategorySalesPage').then((module) => ({ default: module.CategorySalesPage }))
);
const MonthlyPlanMeetingPage = lazy(() =>
  import('../modules/analytics/pages/MonthlyPlanMeetingPage').then((module) => ({ default: module.MonthlyPlanMeetingPage }))
);

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

export function Router() {
  return (
    <BrowserRouter basename="/BMS_NEW">
      <Suspense fallback={<div style={{ padding: '20px' }}>로딩 중...</div>}>
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
          <Route path={toRelative(ROUTES.MASTER_PARTNERS_NEW)} element={<PartnerRegisterPage />} />
          <Route path={toRelative(ROUTES.MASTER_PARTNERS_ID)} element={<PartnerCardPage />} />
          <Route path={toRelative(ROUTES.MASTER_STANDARD_COST)} element={<StandardCostPage />} />
          <Route path={toRelative(ROUTES.MASTER_PERFORMANCE_PLAN)} element={<PerformancePlanPage />} />
          <Route path={toRelative(ROUTES.PROFIT)} element={<SalesProfitAnalysisPage />} />
          <Route path={toRelative(ROUTES.PROFIT_NEW)} element={<SalesProfitAnalysisNewPage />} />
          <Route path={toRelative(ROUTES.PROFIT_ID_EDIT)} element={<SalesProfitAnalysisNewPage />} />
          <Route path={toRelative(ROUTES.PROFIT_ID)} element={<SalesProfitAnalysisDetailPage />} />
          <Route path={toRelative(ROUTES.SALES_INFO)} element={<SalesInfoPage />} />
          <Route path={toRelative(ROUTES.SALES_INFO_NEW)} element={<SalesInfoRegisterPage />} />
          <Route path={toRelative(ROUTES.SALES_INFO_ID)} element={<SalesInfoDetailPage />} />
          <Route path={toRelative(ROUTES.SPEC_STATUS)} element={<SpecStatusDiscountPage />} />
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
          <Route path={toRelative(ROUTES.SALES_DELIVERY_REQUEST_STATUS)} element={<DeliveryRequestStatusPage />} />
          <Route path={toRelative(ROUTES.SALES_DELIVERY_REQUEST_DETAIL)} element={<DeliveryRequestDetailPage />} />
          <Route path={toRelative(ROUTES.SALES_DELIVERY_APPROVAL)} element={<SalesDeliveryApprovalPage />} />
          <Route path={toRelative(ROUTES.SHORT_PROJECT)} element={<ShortProjectPage />} />
          <Route path={toRelative(ROUTES.SHORT_PROJECT_REGISTER)} element={<ShortProjectRegisterPage />} />
          <Route path={toRelative(ROUTES.TILE_TEAM)} element={<TileTeamPage />} />
          <Route path={toRelative(ROUTES.SALES_SUPPORT)} element={<SalesSupportPage />} />
          <Route path={toRelative(ROUTES.SALES_SUPPORT_RECEIVABLE)} element={<SupportReceivablePage />} />
          <Route path={toRelative(ROUTES.SALES_SUPPORT_DISCOUNT_PROMOTION)} element={<DiscountPromotionPage />} />
          <Route
            path={toRelative(ROUTES.APPROVAL_SALES)}
            element={
              <Guard permission={PERMISSIONS.APPROVAL} fallback={<Navigate to={ROUTES.FORBIDDEN} replace />}>
                <SalesApprovalPage />
              </Guard>
            }
          />
          <Route
            path={toRelative(ROUTES.APPROVAL_SALES_ID)}
            element={
              <Guard permission={PERMISSIONS.APPROVAL} fallback={<Navigate to={ROUTES.FORBIDDEN} replace />}>
                <SalesApprovalDetailPage />
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
          <Route
            path={toRelative(ROUTES.DELIVERY_PLAN)}
            element={(
              <Suspense fallback={<div style={{ padding: '20px' }}>로딩 중...</div>}>
                <DeliveryPlanPage />
              </Suspense>
            )}
          />
          <Route path={toRelative(ROUTES.DELIVERY_INVENTORY)} element={<InventoryPage />} />
          <Route path={toRelative(ROUTES.DELIVERY_DEMAND)} element={<DemandForecastPage />} />
          <Route path={toRelative(ROUTES.FINANCE_PURCHASE_SALES)} element={<PurchaseSalesPage />} />
          <Route path={toRelative(ROUTES.FINANCE_RECEIVABLE)} element={<ReceivablesPage />} />
          <Route path={toRelative(ROUTES.FINANCE_BILL)} element={<BillsDepositsPage />} />
          <Route path={toRelative(ROUTES.FINANCE_CREDIT)} element={<CreditCollateralPage />} />
          <Route path={toRelative(ROUTES.PARTNER_NOTICE)} element={<PartnerNoticePage />} />
          <Route path={toRelative(ROUTES.PARTNER_AS)} element={<PartnerAsRedirect />} />
          <Route path={toRelative(ROUTES.PARTNER_CATALOG)} element={<PartnerCatalogPage />} />
          <Route path={toRelative(ROUTES.PARTNER_DELIVERY)} element={<PartnerDeliveryPage />} />
          <Route path={toRelative(ROUTES.PARTNER_DISPATCH)} element={<PartnerOrderDeliveryPage />} />
          <Route
            path={toRelative(ROUTES.PARTNER_RECEIVABLE)}
            element={<Navigate to={ROUTES.FINANCE_RECEIVABLE} replace />}
          />
          <Route path={toRelative(ROUTES.PARTNER_BASIC)} element={<PartnerBasicInfoPage />} />
          <Route path={toRelative(ROUTES.PARTNER_BALANCE_CONFIRM)} element={<PartnerBalanceConfirmPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_RETAIL)} element={<SalesPerformancePage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_PARTNER)} element={<PartnerPerformancePage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_PERSONAL_SALES)} element={<PersonalSalesPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_CATEGORY_SALES)} element={<CategorySalesPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_MONTHLY_PLAN_MEETING)} element={<MonthlyPlanMeetingPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_MARKET)} element={<MarketOverviewPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_DATA_COLLECTION)} element={<DataCollectionPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_DATA_PRICE)} element={<Navigate to={ROUTES.ANALYTICS_DATA_COLLECTION} replace />} />
          <Route path={toRelative(ROUTES.ANALYTICS_DATA_CATALOG)} element={<Navigate to={ROUTES.ANALYTICS_DATA_COLLECTION} replace />} />
          <Route path={toRelative(ROUTES.ANALYTICS_DATA_PROMO)} element={<Navigate to={ROUTES.ANALYTICS_DATA_COLLECTION} replace />} />
          <Route path={toRelative(ROUTES.ANALYTICS_CUSTOM)} element={<CustomReportPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_PROJECT_PERFORMANCE)} element={<ProjectPerformancePage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_YEARLY_DELIVERY_FORECAST)} element={<YearlyDeliveryForecastPage />} />
          <Route path={toRelative(ROUTES.ADMIN_USERS)} element={<UsersAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_ORG)} element={<OrgAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_PERMISSION)} element={<PermissionAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_CODE)} element={<CodesAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_LOG)} element={<LogsAdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}




