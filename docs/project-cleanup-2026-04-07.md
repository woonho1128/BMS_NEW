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
