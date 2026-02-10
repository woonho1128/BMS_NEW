## 개발 로그 (요약)

이 문서는 `workspace_BMS`에서 UI/UX 및 라우팅/공통 컴포넌트 개선 작업 내역을 기록합니다.

## 1) 전역 레이아웃
- **사이드바 고정 디폴트**: `src/layouts/AppLayout.jsx`에서 사이드바 `pinned` 기본값을 `true`로 변경.
- 모바일에서 pinned 상태일 때 오버레이가 화면을 막지 않도록 오버레이 조건 보정.

## 2) `finance/receivable` → "거래 정보 조회" (탭 통합)
파일: `src/modules/finance/pages/ReceivablesPage.jsx`

- **탭 구성**: 채권 / 어음 / 담보 / 입금
- **권한 분기**
  - 대리점 권한(AGENCY/PARTNER/DEALER): 대리점 고정 + 자동조회
  - 본사 권한: 대리점/조건 선택 후 조회 버튼으로 조회
- **채권 탭**: 기존 요구 컬럼 그리드 + 금액 우측정렬/콤마 + 빈 데이터 메시지 + 다운로드/인쇄
- **어음 탭**: 공통 `ListFilter` 기반 필터(라디오+기간+대리점) + 요약 카드(총건수/총금액) + 테이블 + 다운로드
- **담보 탭**: 공통 `ListFilter` 기반 Search Panel + 그리드 상단 다운로드 + 상태 배지 + 금액 우측정렬
- **입금 탭**: 공통 `ListFilter` 기반 Search Bar(년/월/대리점) + 합계 상단 표시 + 금액 강조

관련 Mock/API:
- `src/modules/finance/api/*.api.js`
- `src/modules/finance/data/*Mock.js`

## 3) 공통 필터 확장
파일: `src/shared/components/ListFilter/ListFilter.jsx`

- **radio 타입 추가**: 설정기준(발행일/만기일 등) 라디오 그룹 렌더링 지원
- **showReset 옵션**: 초기화 버튼 표시/숨김 제어
- **--listfilter-gap CSS 변수**: 페이지별 간격 커스터마이징 지원

## 4) `partner/basic` (대리점 기본 정보)
파일: `src/modules/partner/pages/PartnerBasicInfoPage.jsx`

- 프로필 헤더(대리점명/코드/상태 배지)
- 3컬럼 Description List(기본정보/연락처/기타)
- 이력 테이블 카드 + 현대적 페이지네이션

Mock:
- `src/modules/partner/data/partnerBasicMock.js`

## 5) `partner/delivery` (탭 통합)
파일: `src/modules/partner/pages/PartnerDeliveryPage.jsx`

- 탭: 월별 내역 / 출고 현황
- 공통 `ListFilter` 기반 필터(라디오/기간 포함)
- 테이블 헤더 톤 통일 + 빈 데이터 메시지 중앙 표시
- 엑셀/인쇄 버튼을 테이블 우측 상단으로 배치
- 월별 내역 컬럼: 출고 년월/대리점명/출고형태/부가세형태/금액/부가세/합계
- 출고 현황 컬럼: 영업그룹/공장구분/출고형태/수량/금액(원)

Mock/API:
- `src/modules/partner/api/partnerDelivery.api.js`
- `src/modules/partner/data/partnerDeliveryMock.js`

## 6) 공통 유틸 추가(중복 제거)
- `src/shared/utils/formatters.js`: 숫자/금액 포맷(천단위 콤마)
- `src/shared/utils/csv.js`: CSV 다운로드(BOM 포함, 한글 깨짐 완화)

## 7) 미사용(placeholder) 소스 정리
- `/partner/receivable`(기존 placeholder)은 실제 사용 경로가 `/finance/receivable`로 통합되어 있어,
  라우터에서 **리다이렉트 처리**로 호환성만 유지하고 placeholder 페이지 소스는 삭제했습니다.
  - 라우터: `src/router/index.jsx`
  - 삭제: `src/modules/partner/pages/PartnerReceivablesPage.jsx`

## 참고
- 본 저장소는 repo-wide lint에서 기존부터 존재하는 unused/import 관련 에러가 다수 존재하며,
  이번 작업은 **수정한 파일 범위에서** 린트/런타임 에러가 없도록 정리했습니다.

