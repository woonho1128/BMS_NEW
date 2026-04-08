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
