# BMS 프로젝트 구조 및 기능 정의

> 최종 업데이트: 2026-02-27  
> 작성 기준: `src/` 전체 소스 점검 결과

---

## 1. 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | React + Vite |
| UI 라이브러리 | Ant Design (antd) — 일부 페이지 |
| 공통 컴포넌트 | 자체 컴포넌트 시스템 (shared/components) |
| 아이콘 | lucide-react (공통), @ant-design/icons (antd 페이지) |
| 라우팅 | React Router v6 |
| 인증 | useAuth 훅 (JWT 기반 role 분기) |
| 스타일 | CSS Modules (.module.css) |

---

## 2. 디렉터리 구조

```
src/
├── app/                    # 앱 진입점 (App.jsx, index.jsx)
├── layouts/                # 레이아웃 컴포넌트
│   ├── AppLayout/          # 전역 레이아웃 (Sidebar + 콘텐츠 영역)
│   └── AuthLayout/         # 로그인 전용 레이아웃
├── modules/                # 기능 모듈 (도메인 단위)
│   ├── admin/              # 관리자 (시스템 설정 / 온라인 주문 관리 / 운영 로그)
│   ├── analytics/          # 인사이트 (성과 KPI / 시장 분석)
│   ├── approval/           # 영업 결재 / 출고 결재
│   ├── auth/               # 인증 (Login / useAuth)
│   ├── customers/          # ⚠️ 미사용 (라우터 미연결)
│   ├── dashboard/          # 대시보드
│   ├── delivery/           # 출고/납품 (출고요청·내역·납품계획·재고현황)
│   ├── finance/            # 재무 (채권·어음·여신·매입매출)
│   ├── master/             # 기준정보 (품목·대리점·표준원가)
│   ├── partner/            # 대리점 포털
│   ├── reports/            # ⚠️ 미사용 (라우터 미연결)
│   ├── sales/              # 영업 관리 (공통·프로젝트·리테일·타일·지원)
│   └── settings/           # ⚠️ 미사용 (라우터 미연결)
├── router/
│   ├── index.jsx           # 라우터 설정 (전체 Route 트리)
│   ├── routePaths.js       # 경로 상수 (ROUTES)
│   └── ROUTE_MAPPING.md    # 메뉴 ↔ 라우트 매핑 문서
└── shared/
    ├── components/         # 공통 UI 컴포넌트 (17종)
    ├── constants/
    │   ├── ia.js           # 사이드바 IA(메뉴 구조) 단일 소스
    │   ├── mockupMenu.js   # 목업 메뉴 데이터
    │   └── permissions.js  # 권한 상수
    ├── hooks/              # 공통 훅
    ├── pages/              # 공통 페이지 (NotFound, NoAccess)
    ├── styles/             # 전역 스타일
    └── utils/              # 유틸리티 함수
```

---

## 3. 공통 컴포넌트 (shared/components)

| 컴포넌트 | 용도 |
|----------|------|
| `PageShell` | 페이지 공통 껍데기 (타이틀·breadcrumb·액션 버튼). `path` prop으로 `ia.js`에서 타이틀 자동 조회 |
| `ListFilter` | 검색 필터 UI. `fields` 배열 설정만으로 text/select/date/dateRange/radio/checkbox 렌더. 조회·초기화 버튼 내장 |
| `Button` | 공통 버튼 (variant: primary/secondary/danger/icon) |
| `Card / CardBody` | 카드 레이아웃 컴포넌트 |
| `DataTable` | 공통 테이블 래퍼 |
| `Sidebar` | 사이드바 네비게이션 (ia.js 소비) |
| `Guard` | 권한 기반 렌더 가드 (PERMISSIONS 상수 사용) |
| `PlaceholderPage` | 기능 구현 전 임시 페이지 |
| `Modal` | 공통 모달 |
| `Drawer` | 공통 드로어 |
| `EmptyState` | 빈 상태 UI |
| `Input` | 공통 입력 |
| `Select` | 공통 셀렉트 |
| `DatePicker` | 날짜 선택 |
| `RichTextEditor` | 보고서 작성용 에디터 |
| `TopRightPanel` | 우측 상단 패널 |
| `Header` | 헤더 |

---

## 4. 모듈 기능 정의

### 4-1. auth
- **LoginPage** — ID/PW 로그인. 로그인 후 `/` 리다이렉트
- **useAuth** — role(ADMIN/MANAGER/STAFF/AGENCY 등), user 정보, isAuthenticated 제공

### 4-2. dashboard
- **DashboardHome** — 메인 대시보드. 영업 현황 요약 위젯

### 4-3. sales (영업 관리)
| 파일 | 기능 | 상태 |
|------|------|------|
| `SalesReportsPage` | 주간·출장 보고서 목록/등록 | 구현 |
| `WeeklyReportFormPage` | 주간보고 작성 폼 | 구현 |
| `TripReportFormPage` | 출장보고 작성 폼 | 구현 |
| `ReportDetailPage` | 보고서 상세 | 구현 |
| `BusinessCardPage` | 명함 관리 목록 | 구현 |
| `BusinessCardFormPage` | 명함 등록/수정 | 구현 |
| `SalesMaterialsPage` | 영업 자료실 | 구현 |
| `SalesMaterialDetailPage` | 자료 상세 | 구현 |
| `SalesMaterialFormPage` | 자료 등록/수정 | 구현 |
| `SalesInfoPage` | 영업정보 등록/조회 | 구현 |
| `SalesInfoRegisterPage` | 영업정보 등록 | 구현 |
| `SalesInfoDetailPage` | 영업정보 상세 | 구현 |
| `SalesProfitAnalysisPage` | 손익분석 목록 | 구현 |
| `SalesProfitAnalysisNewPage` | 손익분석 등록/수정 | 구현 |
| `SalesProfitAnalysisDetailPage` | 손익분석 상세 | 구현 |
| `SpecStatusDiscountPage` | SPEC 현황 (할인율 포함) | 구현 |
| `ShortProjectPage` | 단납 프로젝트 현황 | **임시(PlaceholderPage)** |
| `TileTeamPage` | 타일영업팀 현황 | **임시(PlaceholderPage)** |
| `SalesSupportPage` | 영업지원 현황 | **임시(PlaceholderPage)** |
| `DiscountPromotionPage` | 판매단가 관리 | 구현 |
| `RetailOrderComponents` | 발주 검수·결재·상세 | **임시(PlaceholderPage)** |

### 4-4. finance (재무)
| 파일 | 기능 | 상태 |
|------|------|------|
| `SupportReceivablePage` | 채권 및 여신관리 (대리점별 여신 한도/연체 현황) | 구현(더미) |
| `BillsDepositsPage` | 어음 및 수금관리 (매출건별 수금현황) | 구현(더미) |
| `ReceivablesPage` | 거래 정보 조회 (채권/어음/담보/입금 탭) | 구현(Mock API) |
| `PurchaseSalesPage` | 매입/매출 조회 | **임시(PlaceholderPage)** |
| `CreditCollateralPage` | 여신/담보 조회 | **임시(PlaceholderPage)** |

> `finance/api/` — Mock API 4종 (receivables, bills, deposits, collateral)  
> `finance/data/` — Mock 데이터 4종 (receivablesMock, billsMock, depositsMock, collateralMock)

### 4-5. delivery (출고/납품)
| 파일 | 기능 | 상태 |
|------|------|------|
| `DeliveryRequestPage` | 출고 요청 | 구현 |
| `DeliveryHistoryPage` | 출고 내역 | 구현 |
| `DeliveryPlanPage` | 납품 계획 관리 | 구현 |
| `InventoryPage` | 실시간 재고현황 | 구현 |

### 4-6. approval (결재)
| 파일 | 기능 | 상태 |
|------|------|------|
| `SalesApprovalPage` | 영업 결재 (요청/진행/완료) | 구현 |
| `DeliveryApprovalPage` | 출고 결재 승인 | 구현 |

### 4-7. partner (대리점 포털)
| 파일 | 기능 |
|------|------|
| `PartnerNoticePage` | 공지/자료실 |
| `PartnerCatalogPage` | 카탈로그 조회 |
| `PartnerAsRedirect` | AS 접수 (외부 리다이렉트) |
| `PartnerBasicInfoPage` | 기본 정보 관리 |
| `PartnerDeliveryPage` | 출고/배송 조회 |
| `PartnerProductOrderPage` | 상품 조회 / 발주 등록 |
| `PartnerOrderListPage` | 발주 내역 조회 |
| `PartnerCartPage` | 장바구니 |
| `PartnerOrderDetailPage` | 발주 상세 |
| `PartnerOrderDeliveryPage` | 발주 출고/배송 조회 |
| `PartnerOrderModificationPage` | 반려 건 수정 재요청 |

### 4-8. analytics (인사이트)
| 파일 | 메뉴 | 경로 | 상태 |
|------|------|------|------|
| `SalesPerformancePage` | 개인 KPI | `/analytics/sales` | 구현(더미) |
| `SalesPerformancePage` | 리테일 매출 분석 | `/analytics/retail-sales` | 구현(더미, 공유) |
| `DeliveryStockStatsPage` | 부서별 실적 | `/analytics/delivery-stock` | **임시** |
| `ProfitLossPage` | 사업계획 달성률 | `/analytics/profit` | **임시** |
| `PartnerPerformancePage` | 대리점 성과 분석 | `/analytics/partner` | **임시** |
| `SalesTrendsPage` | 매출 동향 | `/analytics/trends` | **임시** |
| `MarketOverviewPage` | 시황 파악 | `/analytics/market` | **임시** |
| `CustomReportPage` | 사용자 정의 리포트 | `/analytics/custom` | **임시** |

> `SalesPerformancePage`는 두 경로에서 공유. `useLocation()`으로 현재 pathname을 `PageShell`에 전달해 타이틀 자동 분기.

### 4-9. master (기준 정보)
| 파일 | 기능 |
|------|------|
| `ItemsPage` | 품목 정보 조회 |
| `PartnersPage` | 대리점 정보 목록 |
| `PartnerCardPage` | 대리점 카드 상세/등록 |
| `StandardCostPage` | 표준원가 관리 |

### 4-10. admin (관리자)
| 파일 | 기능 |
|------|------|
| `UsersAdminPage` | 사용자 관리 (Drawer) |
| `OrgAdminPage` | 조직 관리 |
| `PermissionAdminPage` | 권한 관리 |
| `CodesAdminPage` | 코드 관리 |
| `LogsAdminPage` | 접속 및 사용 이력 |
| `AdminOrderComponents` | 전체 발주 조회·상태 변경·ERP 전송·발주 이력 |

---

## 5. 라우팅 규칙

- **경로 상수**: `src/router/routePaths.js`의 `ROUTES` 객체 단일 소스
- **IA(메뉴 구조)**: `src/shared/constants/ia.js` — 사이드바 렌더링 + 타이틀/breadcrumb 자동 조회
- **ProtectedRoute**: 비로그인 시 `/login` 리다이렉트
- **PublicOnlyRoute**: 로그인 상태에서 `/login` 접근 시 `/` 리다이렉트
- **Guard**: PERMISSIONS 기반 권한 가드 (현재 영업결재·납품결재 적용)
- **하위 호환**: `/partner/receivable` → `/finance/receivable` 리다이렉트

---

## 6. 필터 패턴 (ListFilter 공통 스타일)

모든 목록 페이지의 검색 필터는 `ListFilter` 컴포넌트를 사용하는 것을 원칙으로 합니다.

```jsx
// 표준 패턴
const [filterValue, setFilterValue] = useState({ /* 필드 초기값 */ });

const filterFields = useMemo(() => [
  { id: 'field1', label: '레이블', type: 'text', placeholder: '...', wide: true, row: 0 },
  { id: 'field2', label: '구분', type: 'select', options: [...], width: 140, row: 0 },
  { id: 'dateRange', label: '기간', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 },
], []);

<ListFilter
  fields={filterFields}
  value={filterValue}
  onChange={(id, value) => setFilterValue(prev => ({ ...prev, [id]: value }))}
  onReset={handleReset}
  onSearch={handleSearch}
  searchLabel="조회"
/>
```

### 지원 타입
| type | 설명 |
|------|------|
| `text` | 텍스트 입력 (wide: true → 넓게) |
| `select` | 드롭다운 선택 (options 배열) |
| `date` | 단일 날짜 (input[type=date]) |
| `dateRange` | 기간 선택 (fromKey/toKey 분리) |
| `radio` | 라디오 버튼 그룹 |
| `checkbox` | 체크박스 |

---

## 7. 임시(PlaceholderPage) 페이지 목록

아래 페이지는 향후 기능 구현 예정이며 현재 `PlaceholderPage`로 처리됩니다.

| 메뉴 | 경로 | 담당 모듈 |
|------|------|-----------|
| 단납 프로젝트 현황 | `/sales/short-project` | sales |
| 타일영업팀 현황 | `/sales/tile-team` | sales |
| 영업지원 현황 | `/sales/support` | sales |
| 발주 검수/결재 | `/sales/retail/review`, `/sales/retail/approval` | sales |
| 매입/매출 조회 | `/finance/purchase-sales` | finance |
| 여신/담보 조회 | `/finance/credit` | finance |
| 개인 KPI | `/analytics/sales` | analytics |
| 부서별 실적 | `/analytics/delivery-stock` | analytics |
| 사업계획 달성률 | `/analytics/profit` | analytics |
| 대리점 성과 분석 | `/analytics/partner` | analytics |
| 매출 동향 | `/analytics/trends` | analytics |
| 시황 파악 | `/analytics/market` | analytics |
| 사용자 정의 리포트 | `/analytics/custom` | analytics |
