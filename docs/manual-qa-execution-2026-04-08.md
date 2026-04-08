# 수동 QA 실행 리포트 (2026-04-08)

## 실행 범위
- `/sales/material`
- `/master/performance-plan`
- `/delivery/plan`
- `/delivery/demand-forecast`
- `/partner/notice`
- `/profit/*`

## 자동 검증 결과
- `npm run smoke:pages` : 통과
- `npm run lint` : 통과
- `npm run build` : 통과
- `npm run check:encoding` : 통과 (`364 files scanned`)

## 코드 기반 사전 점검 결과
- `sales/material`
  - 툴바 정렬, 검색창/등록 버튼 배치 보정 완료
  - 다운로드 버튼 세로 표시 방지(`writing-mode`, `nowrap`) 적용
- `master/performance-plan`
  - 상단 액션/필터/테이블 간격 및 기준선 정렬 보정 완료
  - 월 입력 폭/테이블 최소폭 보정 완료
- `delivery/demand-forecast`
  - 한글 깨짐 복구 완료
  - 예측수량 변경 시 사유 활성화 로직 정상 유지 확인
  - 수정 이력 모달/저장 메시지 정상화
- `delivery/plan` (스펙 추가/취소)
  - 한글 깨짐 복구 완료
  - 선택/반영/복원 플로우 문구 및 동작 정상화
- `profit/*`
  - 라우터 경로(`/profit/:id`, `/profit/:id/edit`) 및 목록-상세 이동 코드 연결 확인

## 수동 화면 확인 상태
- 현재 리포트는 코드/정적 검증 기준 결과입니다.
- 브라우저에서 실제 화면 픽셀 확인은 운영자 수동 확인이 필요합니다.
- 권장 우선 확인:
  1. `/sales/material` 첨부 버튼 가독성
  2. `/master/performance-plan` 테이블 가로 스크롤 및 버튼 정렬
  3. `/delivery/plan` 탭 전환 시 UI 유지 여부

## 결론
- 배포 차단 이슈 없음
- UI 미세 확인(수동 화면 확인)만 완료하면 마감 가능
