## Sales Materials UI 정리

### 경로
- 목록: `/sales/material`
- 등록: `/sales/material/new`
- 상세: `/sales/material/:id`
- 수정: `/sales/material/:id/edit`

### 주요 파일
- `src/modules/sales/data/salesMaterialMock.js`
- `src/modules/sales/pages/SalesMaterialsPage.jsx` (+ `.module.css`)
- `src/modules/sales/pages/SalesMaterialDetailPage.jsx` (+ `.module.css`)
- `src/modules/sales/pages/SalesMaterialFormPage.jsx` (+ `.module.css`)
- 라우팅: `src/router/index.jsx`

### 기능 요약
- **목록**: 필터(제목/거래처/등록자/등록일), 테이블(제목·거래처·등록자·등록일·첨부), 첨부 아이콘/개수, 행 클릭 시 상세 이동, “+ 자료 등록”.
- **상세**: 문서 카드 레이아웃, 제목·메타(거래처/등록자/등록일), HTML 내용(ReadOnly), 첨부 목록(이름/용량/다운로드 버튼), 상단 수정/삭제.
- **등록/수정**: 카드형 폼, 제목(필수)·거래처 선택·RichTextEditor 내용·다중 첨부 업로드, 취소/저장. 수정 시 기존 제목/내용/거래처 로딩(첨부는 재업로드 필요).
- **반응형**: 웹 전체폭 사용, 모바일 패딩/레이아웃 축소 및 테이블 스크롤.

### 공통 사용 컴포넌트
- `PageShell`, `Card`, `CardBody`, `Button`, `ListFilter`, `RichTextEditor`, `Input`.
- 파일 사이즈 표기는 `formatFileSize`(mock util) 사용.

### Mock 데이터
- `salesMaterialMock.js`에 목록/상세/필터 옵션 및 첨부 샘플 포함.
- 필터/상세/등록 페이지 모두 이 mock을 사용하며 API 연동 없이 동작.

### 테스트 체크리스트
- 목록에서 필터 조합 후 결과 갱신되는지.
- 제목 클릭 시 상세 이동, 첨부 버튼 클릭 시 콘솔 로그/알림 노출.
- 상세에서 수정 클릭 시 등록 폼으로 이동해 값이 채워지는지.
- 등록/수정 폼: 제목 미입력 시 경고, 첨부 추가/삭제 동작, 저장 후 목록 이동.
- 모바일 폭에서 테이블 가로 스크롤 및 카드/메타 영역 줄바꿈 정상 여부.
