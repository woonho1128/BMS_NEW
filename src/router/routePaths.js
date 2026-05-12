/**
 * App route path constants.
 * Keep route keys stable and only update values when IA changes.
 */
export const ROUTES = {
  
  LOGIN: '/login',
  HOME: '/',
  DASHBOARD: '/',
  DASHBOARD_ALT: '/dashboard',     
  FORBIDDEN: '/403',

  MASTER_ITEMS: '/master/items',
  MASTER_PARTNERS: '/master/partners',
  MASTER_PARTNERS_NEW: '/master/partners/new',
  MASTER_PARTNERS_ID: '/master/partners/:id',
  MASTER_STANDARD_COST: '/master/standard-cost',
  MASTER_PERFORMANCE_PLAN: '/master/performance-plan',

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

  SALES_DELIVERY_REQUEST_STATUS: '/sales/delivery-request-status',
  SALES_DELIVERY_REQUEST_DETAIL: '/sales/delivery-request-detail',
  SALES_DELIVERY_APPROVAL: '/sales/delivery-approval',

  SALES_INFO: '/sales/info',
  SALES_INFO_NEW: '/sales/info/new',
  SALES_INFO_ID: '/sales/info/:id',
  PROFIT: '/profit',
  PROFIT_NEW: '/profit/new',
  PROFIT_ID: '/profit/:id',
  PROFIT_ID_EDIT: '/profit/:id/edit',
  SPEC_STATUS: '/sales/spec-status',
  SALES_COMBINATION_DAILY_LOG: '/sales/combination-daily-log',

  SHORT_PROJECT: '/sales/short-project',              
  SHORT_PROJECT_REGISTER: '/sales/short-project/register',

  TILE_TEAM: '/sales/tile-team',

  SALES_SUPPORT: '/sales/support',                                  
  SALES_SUPPORT_RECEIVABLE: '/sales/support/receivable',            
  SALES_SUPPORT_DISCOUNT_PROMOTION: '/sales/support/discount-promotion', 
  SALES_PROMOTION_REGISTER: '/sales/promotion/register',
  SALES_PROMOTION_HISTORY: '/sales/promotion/history',

  APPROVAL_SALES: '/approval/sales',
  APPROVAL_SALES_ID: '/approval/sales/:id',
  APPROVAL_DELIVERY: '/approval/delivery',

  DELIVERY_REQUEST: '/delivery/request',
  DELIVERY_HISTORY: '/delivery/history',
  DELIVERY_PLAN: '/delivery/plan',
  DELIVERY_INVENTORY: '/delivery/inventory',
  DELIVERY_DEMAND: '/delivery/demand-forecast', 

  FINANCE_PURCHASE_SALES: '/finance/purchase-sales',  
  FINANCE_RECEIVABLE: '/finance/receivable',           
  FINANCE_BILL: '/finance/bill',                       
  FINANCE_CREDIT: '/finance/credit',                   

  PARTNER_NOTICE: '/partner/notice',
  PARTNER_AS: '/partner/as',
  PARTNER_CATALOG: '/partner/catalog',                 
  PARTNER_DELIVERY: '/partner/delivery',               
  PARTNER_DISPATCH: '/partner/dispatch',               
  PARTNER_BASIC: '/partner/basic',                     
  PARTNER_RECEIVABLE: '/partner/receivable',           
  PARTNER_BALANCE_CONFIRM: '/partner/balance-confirm', 

  ANALYTICS_RETAIL: '/analytics/retail-sales',         
  ANALYTICS_PARTNER: '/analytics/partner',             
  ANALYTICS_PERSONAL_SALES: '/analytics/personal-sales', 
  ANALYTICS_CATEGORY_SALES: '/analytics/category-sales', 
  ANALYTICS_MONTHLY_PLAN_MEETING: '/analytics/monthly-plan-meeting', 

  ANALYTICS_MARKET: '/analytics/market',               
  ANALYTICS_DATA_COLLECTION: '/analytics/data-collection', 
  ANALYTICS_DATA_PRICE: '/analytics/data-collection/price', 
  ANALYTICS_DATA_CATALOG: '/analytics/data-collection/catalog', 
  ANALYTICS_DATA_PROMO: '/analytics/data-collection/promo', 
  ANALYTICS_CUSTOM: '/analytics/custom',               
  ANALYTICS_PROJECT_PERFORMANCE: '/analytics/project-performance',
  ANALYTICS_PROJECT_ORDER_STATUS: '/analytics/project-order-status',
  ANALYTICS_PROJECT_PERSONAL_SALES: '/analytics/project-personal-sales',
  ANALYTICS_PROJECT_MONTHLY_PLAN_MEETING: '/analytics/project-monthly-plan-meeting',
  ANALYTICS_YEARLY_DELIVERY_FORECAST: '/analytics/yearly-delivery-forecast',

  ADMIN_USERS: '/admin/users',
  ADMIN_ORG: '/admin/org',
  ADMIN_PERMISSION: '/admin/permission',
  ADMIN_CODE: '/admin/code',
  ADMIN_LOG: '/admin/log',
};

export function toRelative(fullPath) {
  return fullPath.startsWith('/') ? fullPath.slice(1) : fullPath;
}

