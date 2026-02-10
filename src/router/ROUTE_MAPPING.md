# 라우트 ↔ 메뉴(IA) 매핑

로그인부터 메인 메뉴까지 모든 화면이 라우터와 IA(사이드바 메뉴) path로 연결되어 있습니다.

## 인증 흐름

| 경로 | 화면 | 비고 |
|------|------|------|
| `/login` | LoginPage | 미로그인 시 접근, 로그인 후 `/` 로 이동 |
| `/` | AppLayout + DashboardHome | 로그인 필요 (ProtectedRoute) |
| `/403` | NoAccess | 권한 없음 |

## 메뉴(IA) path → 라우트 → 컴포넌트

### 대시보드
| 메뉴명 | path | 컴포넌트 |
|--------|------|----------|
| 대시보드 | `/` | DashboardHome |

### 영업 관리 (4개 중분류)

**① 영업 활동 (공통)**  
| 메뉴명 | path | 컴포넌트 |
|--------|------|----------|
| 주간보고 / 출장보고 | `/sales/report` | SalesReportsPage |
| 명함 관리 | `/sales/card` | BusinessCardPage |
| 영업 자료실 | `/sales/material` | SalesMaterialsPage |

**② 프로젝트 영업**  
| 메뉴명 | path | 컴포넌트 |
|--------|------|----------|
| 영업정보 등록/조회 | `/sales/info` | SalesInfoPage |
| 수주 관리 | `/sales/info` | SalesInfoPage |
| 프로젝트 결재 | `/approval/sales` | SalesApprovalPage |

**③ 리테일 영업**  
| 메뉴명 | path | 컴포넌트 |
|--------|------|----------|
| 대리점 성과 분석 | `/analytics/partner` | PartnerPerformancePage |
| 리테일 매출 분석 | `/analytics/sales` | SalesPerformancePage |

**④ 영업 지원**  
| 메뉴명 | path | 컴포넌트 |
|--------|------|----------|
| 손익분석 / 단납 프로젝트 현황 | `/profit` | SalesProfitAnalysisPage |

### 출고/납품
| 메뉴명 | path | 컴포넌트 |
|--------|------|----------|
| 출고요청 | `/delivery/request` | DeliveryRequestPage |
| 출고내역 | `/delivery/history` | DeliveryHistoryPage |
| 납품계획 | `/delivery/plan` | DeliveryPlanPage |
| 실시간 재고현황 | `/delivery/inventory` | InventoryPage |

### 채권/여신
| 메뉴명 | path | 컴포넌트 |
|--------|------|----------|
| 매입/매출 조회 | `/finance/purchase-sales` | PurchaseSalesPage |
| 채권/미수금 | `/finance/receivable` | ReceivablesPage |
| 어음/입금 관리 | `/finance/bill` | BillsDepositsPage |
| 여신 및 담보 조회 | `/finance/credit` | CreditCollateralPage |

### 통합 결재
| 메뉴명 | path | 컴포넌트 |
|--------|------|----------|
| 결재 요청/진행/완료함 | `/approval/sales` | SalesApprovalPage |
| 출고 승인 대기 | `/approval/delivery` | DeliveryApprovalPage |

### 대리점 포털
| 메뉴명 | path | 컴포넌트 |
|--------|------|----------|
| 공지/자료실 | `/partner/notice` | PartnerNoticePage |
| 카탈로그 | `/partner/catalog` | PartnerCatalogPage |
| AS 접수 | `/partner/as` | PartnerAsPage |
| 출고/채권 정보 조회 | `/partner/delivery` | PartnerDeliveryPage |
| 거래 정보 조회 | `/finance/receivable` | ReceivablesPage |
| 기본 정보 관리 | `/partner/basic` | PartnerBasicInfoPage |

> 참고: 기존 `/partner/receivable` 경로는 호환을 위해 `/finance/receivable`로 리다이렉트됩니다.

### 인사이트
| 메뉴명 | path | 컴포넌트 |
|--------|------|----------|
| 개인 KPI | `/analytics/sales` | SalesPerformancePage |
| 리테일 매출 분석 | `/analytics/retail-sales` | SalesPerformancePage |
| 부서별 실적 | `/analytics/delivery-stock` | DeliveryStockStatsPage |
| 사업계획 달성률 | `/analytics/profit` | ProfitLossPage |
| 시황 파악 / 매출 동향 / 사용자 정의 리포트 | `/analytics/custom` 등 | CustomReportPage, SalesPerformancePage |

### 기준 정보
| 메뉴명 | path | 컴포넌트 |
|--------|------|----------|
| 품목정보 | `/master/items` | ItemsPage |
| 대리점정보(카드) | `/master/partners` | PartnersPage |
| 표준원가 | `/master/standard-cost` | StandardCostPage |

### 관리자
| 메뉴명 | path | 컴포넌트 |
|--------|------|----------|
| 사용자 관리 | `/admin/users` | UsersAdminPage |
| 조직 관리 | `/admin/org` | OrgAdminPage |
| 권한 관리 | `/admin/permission` | PermissionAdminPage |
| 코드 관리 | `/admin/code` | CodesAdminPage |
| 접속 및 사용 이력 관리 | `/admin/log` | LogsAdminPage |

---

경로 상수는 `src/router/routePaths.js`의 `ROUTES`에 정의되어 있으며, IA는 `src/shared/constants/ia.js`의 `path`와 동일한 값을 사용합니다.
