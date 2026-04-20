# 프로젝트 이력 통합 문서

아래 내용은 기존 문서의 본문을 파일 단위로 병합한 것입니다.

---

## 원본: development-log.md

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

---

## 원본: project-update-2026-04-06.md

# 프로젝트 업데이트 정리 (2026-04-06)

본 문서는 2026년 4월 6일까지 반영된 주요 화면 개선/신규 기능을 요약한 기록입니다.

## 1) 마스터 > 대리점 관리

- 대리점 상세의 매출/재무 시각화 개선
  - 최근 5개년 매출 실적 꺾은선 그래프 제공
  - 그래프 항목 및 카테고리 비교 선택 UI 반영
  - 그래프 폰트/가독성 조정
- 경쟁사 취급 브랜드 입력 구조 개선
  - 공통코드 중심에서 카드(대리점) 단위 입력/수정 가능하도록 변경
- 수정 이력 기능 추가
  - 상세 수정 이력을 목록 페이지에서 확인 가능
  - 날짜 리스트 클릭 시 상세 변경 이력 확인 가능
- 최근 5개년 재무/매출 누계 관련 표시 보강

## 2) 영업 관리 > 단납 현장 등록

- 대표 품번 보기 방식 변경
  - 상세 이동 방식 제거
  - 자동 계산 테이블을 화면 내 표시/숨김 또는 팝업 표시 방식으로 변경
- 다건 조회 시 사용성 개선
  - 인라인 확장 방식에서 팝업 전환
  - 사이드바 가림 이슈를 고려한 레이아웃 보정
- 결재선 지정 후 상신 UX 확장
  - 다중 선택 상신 고려
  - 1차/2차/3차 결재자 선택
  - 상신 의견 입력
  - 현장별 탭 선택 후 상세(현장/건설사/대리점/납품예정일/자동계산표) 확인
- 첨부파일 + 특이사항 카드 통합
- 자동 계산 테이블 용어/계산식 보정
  - `할인 적용가` -> `단납 공급가(기본 할인가 기준)`
  - 단가 계산 기준 반영

## 3) 영업 결재 화면

- 단납 현장 상신 데이터가 결재 상세에서 자연스럽게 보이도록 구조 정비
- 다건 상신(체크 1~3건) 시 표시 목업 강화

## 4) 파트너 포털

- `partner/catalog` 페이지
  - 판매단가 목업(약 4,000건) 기반 카탈로그 형태 출력 연결
  - 라우팅 누락 이슈 해결(Placeholder -> 실제 페이지 매핑)
- `partner/basic` 페이지
  - 요청에 따라 일부 카드 구성 정리 후 하단 차트/내용 유지
- `partner/balance-confirm` 페이지
  - 당월 출고 금액 클릭 시 페이지 이동 대신 팝업 상세 표시

## 5) 영업 지원 > 할인/프로모션

- 거래처별 할인율 상세를 팝업 형태로 제공
- 3개월 평균/할인율 영역 스타일 카드형 개선
- 판매단가 관리 탭 신규 화면 고도화
  - 카테고리별 조회
  - 신규 등록/수정
  - 엑셀 양식 다운로드/업로드 UI
  - 대량 목업 데이터(4,000건) 기반 페이징/검색
  - 리스트/편집 패널 컴팩트 레이아웃 조정
  - 페이징 UI 단순화(화살표 중심)

## 6) 기준 정보 > 성과 계획 관리 (신규)

- 메뉴 신설
  - `기준 정보 > 마스터 데이터 > 성과 계획 관리`
- 기능
  - 팀 계획 / 개인 계획 / 엑셀 업로드 탭
  - 월별 계획 입력 및 합계 계산
  - 확정/확정해제 상태 전환
  - 변경 이력 확인
  - 부서별 합계 카드 표시
- 연동
  - 성과관리(대리점별 매출 현황)의 `매출계획` 컬럼을 계획 목업 데이터와 연결

## 7) 인사이트 > 성과 관리(KPI) > 월별 계획 회의 관리 (신규)

- 신규 메뉴/라우트 추가
- 핵심 프로세스 반영
  1. 월별 계획 관리
  2. 마감 실적 불러오기(목업 임의값 반영)
  3. 회의 차수(최대 4차) 생성 및 차수별 값 관리
- 표 구조
  - `성명`, `구분` 고정
  - 계획/실적/차수별 도소매·납품·합계
  - 마지막 `달성률` 단일 구간
- 데이터
  - 목업 10명 기준(유형: S/W, OEM, 상품, 수전, 비데, 계)
- 스타일
  - 초기 진입/차수 생성 상태를 동일한 컴팩트 스타일로 통일
  - 컬럼 폭 반복 조정(사용자 피드백 반영)

## 8) 구조 정리 (공통 모듈화)

- 월별 계획 회의 관리 목업/유틸을 페이지에서 분리
  - `src/modules/analytics/data/monthlyPlanMeetingMock.js`
- 성과 계획 목업에서 현재 미사용 불일치 계산 제거
  - 단순화 및 유지보수성 개선

## 9) 미사용 파일 정리

- 아래 파일은 라우팅/임포트 미사용으로 확인되어 삭제
  - `src/modules/sales/pages/SalesPage.jsx`
  - `src/modules/sales/pages/SalesPage.module.css`
  - `src/modules/sales/pages/TripReportDetailPage.jsx`
  - `src/modules/sales/pages/WeeklyReportDetailPage.jsx`
  - `src/modules/partner/pages/PartnerAsPage.jsx`
  - `src/modules/master/pages/standard-cost/components/ExcelUploadModal.jsx`

## 10) 참고

- 일부 파일은 기존 인코딩 이슈(터미널 한글 깨짐) 가능성이 있어, IDE에서 UTF-8 기준 확인 필요
- 본 문서는 기능 변경 중심 요약이며, 세부 구현은 해당 페이지/데이터 모듈 소스를 기준으로 확인

---

## 원본: project-update-2026-04-08.md

# 프로젝트 업데이트 요약 (2026-04-08)

## 1. 이번 반영 목적
- 최근 스타일 깨짐/한글 깨짐 이슈 복구
- `sales/material`, `master/performance-plan` UI 안정화
- 빌드 대체용 경량 검증 체계 추가

## 2. 반영 내용
- `src/modules/delivery/pages/DemandForecastPage.jsx`
  - 한글 깨짐 복구
  - 수정이력/사유 활성화 로직 유지
- `src/modules/delivery/components/spec/SpecRegistrationList.jsx`
  - 스펙 추가 탭 한글/레이블 복구
- `src/modules/delivery/components/spec/CancelledSpecList.jsx`
  - 스펙 취소 탭 한글/레이블 복구
- `src/modules/sales/pages/SalesMaterialsPage.jsx`
  - 툴바 인라인 스타일 제거, 클래스 기반으로 정리
- `src/modules/sales/pages/SalesMaterialsPage.module.css`
  - 다운로드 버튼 및 첨부 컬럼 가독성 보정
  - 모바일 툴바 대응 보강
- `src/modules/master/pages/PerformancePlanPage.module.css`
  - 상단 액션/필터/표 간격 및 정렬 보정
  - 월 입력 폭 및 테이블 최소폭 보정
- `scripts/smoke-pages.mjs`
  - 핵심 페이지 JSX 스모크 체크 스크립트 신규 추가
- `package.json`
  - `smoke:pages` 스크립트 추가

## 3. 검증 결과
- `npm run smoke:pages` 통과
- `npm run lint` 통과
- `npm run build` 통과

## 4. 사용자 영향도
- 기능 로직 변경 없음(기존 흐름 유지)
- UI/문구/가독성 개선 중심 변경
- 검증 스크립트 추가로 회귀 점검 속도 개선

## 5. 후속 권장
1. 브라우저 수동 확인으로 화면 밀도/정렬 최종 확정
2. 깨짐 이력 구간 대상으로 API 연동 전까지 스모크 체크를 배포 전 고정 실행

---

## 원본: project-cleanup-2026-04-07.md

# 프로젝트 정리 리포트 (2026-04-07)

## 1) 전체 소스 점검 결과
- 정적 점검: `npm run lint` 통과
- 빌드 점검: `npm run build` 통과
- 주요 확인 범위
  - 최근 수정된 핵심 화면 렌더/번들 오류 여부
  - 공통 유틸 import 누락/중복 구현 여부
  - 문자열/라벨 손상(한글 깨짐) 발생 가능 파일 점검

## 2) 중복 기능 공통 모듈화 반영
### 공통 유틸 확장
- 파일: `src/shared/utils/formatters.js`
- 추가된 공통 함수
  - `formatDateRange(from, to)`
  - `formatFileSize(bytes)`

### 화면 적용
- 파일: `src/modules/sales/pages/ShortProjectRegisterPage.jsx`
  - 로컬 중복 함수 제거:
    - `formatDateRange`
    - `formatNumber`
    - `formatFileSize`
  - `shared/utils/formatters` 공통 함수 사용으로 전환

- 파일: `src/modules/sales/pages/DeliveryRequestStatusPage.jsx`
  - 로컬 `fmt()` 내부 `toLocaleString` 직접 호출 제거
  - `formatNumber` 공통 함수 사용으로 전환

- 파일: `src/modules/sales/pages/DeliveryRequestDetailPage.jsx`
  - 로컬 `fmt()`를 공통 `formatNumber` 사용으로 전환

- 파일: `src/modules/sales/pages/DeliveryApprovalPage.jsx`
  - 로컬 `fmt()`를 공통 `formatNumber` 사용으로 전환

- 파일: `src/modules/sales/pages/SalesProfitAnalysisDetailPage.jsx`
  - 문자열 깨짐 복구 및 한글 라벨 정상화
  - 숫자 출력 로직을 `formatNumber` 공통 함수로 전환

## 3) 주석 및 프로젝트 정리
### 주석 보강
- 파일: `src/modules/analytics/pages/MonthlyPlanMeetingPage.jsx`
  - `계` 행 동적 합산 의도 주석 추가
  - 달성률 계산 기준(마지막 차수/실적 fallback) 주석 추가

### 불필요 산출물 정리
- `dist/` 폴더 제거 (빌드 산출물 정리)

## 후속 권장 작업 (다음 배치)
1. 숫자 포맷 중복 2차 정리
   - `toLocaleString` 직접 호출이 남아있는 페이지를 단계적으로 `shared/utils/formatters`로 통합
2. 문자열 깨짐 정밀 정리
   - 일부 파일은 인코딩 손상이 남아 있을 수 있어 라벨/설명 텍스트를 순차 교체 필요
3. 공통 상태 배지 컴포넌트화
   - 상태 라벨 + 색상 규칙을 공통 컴포넌트로 통합해 화면별 불일치 감소


