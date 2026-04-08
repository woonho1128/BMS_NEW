# BMS 프로젝트 구조

최종 업데이트: 2026-04-07

## 기술 스택
- React + Vite
- React Router v6
- CSS Modules
- Ant Design(일부 화면)

## 디렉터리 구조
- `src/app`: 앱 엔트리/프로바이더
- `src/layouts`: 레이아웃(AppLayout/AuthLayout)
- `src/modules`: 도메인 모듈
  - `admin`, `analytics`, `approval`, `auth`, `dashboard`, `delivery`, `finance`, `master`, `partner`, `sales`
- `src/router`: 라우트 매핑/경로 상수
- `src/shared`: 공통 컴포넌트/유틸/상수

## 공통 컴포넌트
- `PageShell`: 페이지 공통 헤더/액션
- `ListFilter`: 검색/필터 영역
- `Card`, `Button`, `DataTable`, `Modal`, `Drawer`
- `Sidebar`, `Guard`, `EmptyState`

## 라우팅 규칙
- 경로 상수는 `src/router/routePaths.js`의 `ROUTES`를 사용
- 사이드메뉴/브레드크럼은 `src/shared/constants/ia.js` 기준

## 최근 주요 반영
- 대시보드 역할/부문 분리(팀원/팀장/임원/대리점)
- 리테일 대시보드 요약 카드 역할별 차등 구성
- sales/card 리멤버 스타일 개선(정렬/태그/즐겨찾기/팀 명함첩)
- 공통 알림 유틸 추가(`src/shared/utils/notify.js`)

## 품질 체크
- 기본 점검: `npm run lint`
- 빌드 점검: `npm run build`
