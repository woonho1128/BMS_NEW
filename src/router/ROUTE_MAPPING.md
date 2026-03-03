# 라우트 ↔ 메뉴(IA) 매핑

> 최종 업데이트: 2026-02-27  
> 경로 상수: `src/router/routePaths.js` (ROUTES)  
> IA 메뉴 구조: `src/shared/constants/ia.js`

---

## 인증 흐름

| 경로 | 화면 | 비고 |
|------|------|------|
| `/login` | LoginPage | 비인증 전용 (PublicOnlyRoute) |
| `/` | DashboardHome | 로그인 필요 (ProtectedRoute) |
| `/403` | NoAccess | 권한 없음 |

---

## 영업 관리

### 영업 활동 (공통)
| 메뉴명 | 경로 | 컴포넌트 | 상태 |
|--------|------|----------|------|
| 보고서 관리 | `/sales/report` | SalesReportsPage | 구현 |
| 명함 관리 | `/sales/card` | BusinessCardPage | 구현 |
| 영업 자료실 | `/sales/material` | SalesMaterialsPage | 구현 |

### 프로젝트부문
| 메뉴명 | 경로 | 컴포넌트 | 상태 |
|--------|------|----------|------|
| 손익분석 | `/profit` | SalesProfitAnalysisPage | 구현 |
| 영업정보 등록/조회 | `/sales/info` | SalesInfoPage | 구현 |
| SPEC-현황 | `/sales/spec-status` | SpecStatusDiscountPage | 구현 |

### 리테일부문
| 메뉴명 | 경로 | 컴포넌트 | 상태 |
|--------|------|----------|------|
| 단납 프로젝트 현황 | `/sales/short-project` | ShortProjectPage | **임시** |
| 대리점 성과 분석 | `/analytics/partner` | PartnerPerformancePage | **임시** |
| 리테일 매출 분석 | `/analytics/retail-sales` | SalesPerformancePage | 구현(더미) |
| 발주 검수 리스트 | `/sales/retail/review` | RetailOrderReviewPage | **임시** |
| 발주 결재 | `/sales/retail/approval` | RetailOrderApprovalPage | **임시** |

### 타일영업팀 관리
| 메뉴명 | 경로 | 컴포넌트 | 상태 |
|--------|------|----------|------|
| 타일영업팀 현황 | `/sales/tile-team` | TileTeamPage | **임시** |

### 영업지원팀 관리
| 메뉴명 | 경로 | 컴포넌트 | 상태 |
|--------|------|----------|------|
| 영업 지원 현황 | `/sales/support` | SalesSupportPage | **임시** |
| 채권 및 여신관리 | `/sales/support/receivable` | SupportReceivablePage | 구현(더미) |
| 어음 및 수금관리 | `/finance/bill` | BillsDepositsPage | 구현(더미) |
| 판매단가 관리 | `/sales/support/discount-promotion` | DiscountPromotionPage | 구현 |

---

## 출고/납품

| 메뉴명 | 경로 | 컴포넌트 | 상태 |
|--------|------|----------|------|
| 출고요청 | `/delivery/request` | DeliveryRequestPage | 구현 |
| 출고내역 | `/delivery/history` | DeliveryHistoryPage | 구현 |
| 납품 계획 관리 | `/delivery/plan` | DeliveryPlanPage | 구현 |
| 실시간 재고현황 | `/delivery/inventory` | InventoryPage | 구현 |

---

## 영업 결재

| 메뉴명 | 경로 | 컴포넌트 | 비고 |
|--------|------|----------|------|
| 영업 결재 | `/approval/sales` | SalesApprovalPage | Guard(APPROVAL 권한) |
| 출고 결재 | `/approval/delivery` | DeliveryApprovalPage | Guard(APPROVAL 권한) |

---

## 재무

| 메뉴명 | 경로 | 컴포넌트 | 상태 |
|--------|------|----------|------|
| 매입/매출 조회 | `/finance/purchase-sales` | PurchaseSalesPage | **임시** |
| 거래 정보 조회 | `/finance/receivable` | ReceivablesPage | 구현(Mock API) |
| 어음 및 수금관리 | `/finance/bill` | BillsDepositsPage | 구현(더미) |
| 여신/담보 조회 | `/finance/credit` | CreditCollateralPage | **임시** |

---

## 대리점 포털

| 메뉴명 | 경로 | 컴포넌트 | 상태 |
|--------|------|----------|------|
| 공지/자료실 | `/partner/notice` | PartnerNoticePage | 구현 |
| 카탈로그 | `/partner/catalog` | PartnerCatalogPage | 구현 |
| AS 접수 | `/partner/as` | PartnerAsRedirect | 구현 |
| 상품 조회/발주 등록 | `/partner/order/product` | PartnerProductOrderPage | 구현 |
| 발주 내역 조회 | `/partner/order/list` | PartnerOrderListPage | 구현 |
| 출고/배송 조회 | `/partner/order/delivery` | PartnerOrderDeliveryPage | 구현 |
| 기본 정보 관리 | `/partner/basic` | PartnerBasicInfoPage | 구현 |
| 출고 정보 조회 | `/partner/delivery` | PartnerDeliveryPage | 구현 |
| 거래 정보 조회 | `/finance/receivable` | ReceivablesPage | 구현(리다이렉트) |

> `/partner/receivable` → `/finance/receivable` 리다이렉트 (하위 호환)

---

## 인사이트

### 성과 관리(KPI)
| 메뉴명 | 경로 | 컴포넌트 | 상태 |
|--------|------|----------|------|
| 개인 KPI | `/analytics/sales` | PlaceholderPage | **임시** |
| 부서별 실적 | `/analytics/delivery-stock` | DeliveryStockStatsPage | **임시** |
| 사업계획 달성률 | `/analytics/profit` | ProfitLossPage | **임시** |

### 시장 분석
| 메뉴명 | 경로 | 컴포넌트 | 상태 |
|--------|------|----------|------|
| 시황 파악 | `/analytics/market` | MarketOverviewPage | **임시** |
| 매출 동향 | `/analytics/trends` | SalesTrendsPage | **임시** |
| 사용자 정의 리포트 | `/analytics/custom` | CustomReportPage | **임시** |

> `SalesPerformancePage`는 `/analytics/sales`(개인KPI)·`/analytics/retail-sales`(리테일 매출 분석) 두 경로 공유.  
> `useLocation()`으로 `PageShell path`에 현재 pathname을 전달해 타이틀 자동 분기.

---

## 기준 정보

| 메뉴명 | 경로 | 컴포넌트 | 상태 |
|--------|------|----------|------|
| 품목정보 | `/master/items` | ItemsPage | 구현 |
| 대리점정보(카드) | `/master/partners` | PartnersPage | 구현 |
| 표준원가 | `/master/standard-cost` | StandardCostPage | 구현 |

---

## 관리자

| 메뉴명 | 경로 | 컴포넌트 | 상태 |
|--------|------|----------|------|
| 사용자 관리 | `/admin/users` | UsersAdminPage | 구현 |
| 조직 관리 | `/admin/org` | OrgAdminPage | 구현 |
| 권한 관리 | `/admin/permission` | PermissionAdminPage | 구현 |
| 코드 관리 | `/admin/code` | CodesAdminPage | 구현 |
| 접속 이력 관리 | `/admin/log` | LogsAdminPage | 구현 |
| 전체 발주 조회 | `/admin/order/total` | AdminTotalOrderPage | 구현 |
| 상태 강제 변경 | `/admin/order/status-force` | AdminStatusChangePage | 구현 |
| ERP 전송 관리 | `/admin/order/erp` | AdminErpPage | 구현 |
| 발주 이력/로그 | `/admin/order/history-log` | AdminOrderLogPage | 구현 |
