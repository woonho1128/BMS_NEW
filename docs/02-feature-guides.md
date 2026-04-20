# 기능/운영 가이드 통합 문서

아래 내용은 기존 문서의 본문을 파일 단위로 병합한 것입니다.

---

## 원본: admin-features.md

# 관리자 기능 정리

## 개요
BMS 시스템의 관리자 기능으로, 시스템 사용자, 조직, 권한, 코드, 로그를 관리할 수 있습니다.

## 메뉴 구조
- **관리자** > 사용자관리 (`/admin/users`)
- **관리자** > 조직관리 (`/admin/org`)
- **관리자** > 권한관리 (`/admin/permission`)
- **관리자** > 코드관리 (`/admin/code`)
- **관리자** > 로그/사용내역 (`/admin/log`)

## 주요 파일

### Mock 데이터
- `src/modules/admin/data/adminMock.js`
  - 사용자 목록 (`MOCK_USERS`)
  - 조직 목록 (`MOCK_ORGS`)
  - 권한 그룹 (`MOCK_PERMISSION_GROUPS`)
  - 시스템 코드 (`MOCK_CODES`)
  - 로그 목록 (`MOCK_LOGS`)
  - 각종 조회 함수들

### 페이지 컴포넌트
- `src/modules/admin/pages/UsersAdminPage.jsx` (+ `.module.css`)
- `src/modules/admin/pages/OrgAdminPage.jsx` (+ `.module.css`)
- `src/modules/admin/pages/PermissionAdminPage.jsx` (+ `.module.css`)
- `src/modules/admin/pages/CodesAdminPage.jsx` (+ `.module.css`)
- `src/modules/admin/pages/LogsAdminPage.jsx` (+ `.module.css`)

## 기능 상세

### 1. 사용자관리 (`/admin/users`)

#### 기능
- 사용자 목록 조회 (필터: 이름, 로그인ID, 부서, 상태)
- 사용자 등록/수정/삭제
- 사용자 정보 관리 (로그인ID, 이름, 이메일, 전화번호, 부서, 직급, 권한, 상태)

#### 주요 필드
- 로그인ID, 이름, 이메일, 전화번호
- 부서 (영업팀, 물류팀, IT팀, 재무팀)
- 직급 (사원, 대리, 과장, 팀장)
- 권한 (일반, 관리자)
- 상태 (활성, 비활성)
- 최종로그인 일시

#### UI 구성
- 상단 필터 영역
- 테이블 형태 목록 (9개 컬럼)
- 인라인 폼 (등록/수정)

### 2. 조직관리 (`/admin/org`)

#### 기능
- 조직 목록 조회
- 조직 등록/수정/삭제
- 조직 구조 관리 (상위조직, 레벨, 정렬순서)

#### 주요 필드
- 조직코드, 조직명
- 상위조직 (선택사항)
- 레벨 (1~10)
- 정렬순서

#### UI 구성
- 테이블 형태 목록 (6개 컬럼)
- 인라인 폼 (등록/수정)

### 3. 권한관리 (`/admin/permission`)

#### 기능
- 권한 그룹 목록 조회
- 권한 그룹 등록/수정/삭제
- 권한 할당 관리

#### 주요 필드
- 그룹명, 설명
- 권한 목록 (체크박스)
  - `all`: 모든 권한
  - `sales:read`, `sales:write`, `sales:approve`: 영업 권한
  - `delivery:read`, `delivery:write`: 출고 권한
  - `admin:read`, `admin:write`: 관리자 권한
- 사용자 수

#### UI 구성
- 카드 그리드 형태 목록 (2열)
- 각 카드에 권한 목록 표시
- 인라인 폼 (등록/수정)

### 4. 코드관리 (`/admin/code`)

#### 기능
- 시스템 코드 목록 조회 (필터: 코드그룹, 코드명)
- 코드 등록/수정/삭제
- 코드 그룹별 그룹화 표시

#### 주요 필드
- 코드그룹 (진행상태, 거래상태 등)
- 코드, 코드명
- 정렬순서
- 사용여부

#### UI 구성
- 상단 필터 영역
- 코드 그룹별 카드 (각 카드 내부에 테이블)
- 인라인 폼 (등록/수정)

### 5. 로그/사용내역 (`/admin/log`)

#### 기능
- 시스템 사용 로그 조회 (필터: 사용자명, 작업, 일시)
- 사용자 활동 추적
- 접속 이력 확인

#### 주요 필드
- 일시
- 사용자 (로그인ID, 이름)
- 작업 (로그인, 조회, 등록, 수정, 삭제 등)
- 리소스 (페이지 경로, 리소스명)
- IP주소
- User Agent

#### UI 구성
- 상단 필터 영역
- 테이블 형태 목록 (6개 컬럼)
- 작업별 색상 구분

## 공통 컴포넌트 사용
- `PageShell`: 페이지 레이아웃
- `Card`, `CardBody`: 카드 컨테이너
- `Button`: 버튼
- `ListFilter`: 필터 영역
- 공통 스타일 변수 사용

## 반응형 디자인
- 웹: 전체 화면 사용
- 모바일: 패딩 축소, 테이블 가로 스크롤, 폼 레이아웃 변경

## Mock 데이터 구조

### 사용자
```javascript
{
  id: string,
  loginId: string,
  name: string,
  email: string,
  phone: string,
  department: string,
  position: string,
  role: 'admin' | 'user',
  status: 'active' | 'inactive',
  lastLoginAt: string,
  createdAt: string
}
```

### 조직
```javascript
{
  id: string,
  code: string,
  name: string,
  parentId: string | null,
  level: number,
  order: number
}
```

### 권한 그룹
```javascript
{
  id: string,
  name: string,
  description: string,
  permissions: string[],
  userCount: number
}
```

### 코드
```javascript
{
  id: string,
  groupCode: string,
  groupName: string,
  code: string,
  codeName: string,
  sortOrder: number,
  useYn: boolean
}
```

### 로그
```javascript
{
  id: string,
  userId: string,
  userName: string,
  action: string,
  actionName: string,
  resource?: string,
  resourceName?: string,
  ip: string,
  userAgent: string,
  createdAt: string
}
```

## 향후 개선 사항
- 실제 API 연동
- 권한 체크 및 접근 제어
- 페이징 처리 (로그 페이지)
- 엑셀 내보내기 기능
- 사용자 일괄 등록 기능
- 조직 트리 구조 시각화

---

## 원본: org-management.md

# 조직관리 페이지 정리

## 개요
조직 계층 구조를 트리 형태로 시각화하고, 선택한 조직의 정보, 조직원, 변경 이력을 관리하는 페이지입니다.

## 경로
- `/admin/org`

## 주요 파일 구조

### 페이지
- `src/modules/admin/pages/OrgAdminPage.jsx` (+ `.module.css`)

### 컴포넌트
- `src/modules/admin/components/org/OrgTree.jsx` (+ `.module.css`)
- `src/modules/admin/components/org/OrgDetailPanel.jsx` (+ `.module.css`)
- `src/modules/admin/components/org/OrgMembersList.jsx` (+ `.module.css`)
- `src/modules/admin/components/org/OrgHistoryList.jsx` (+ `.module.css`)
- `src/modules/admin/components/org/Badge.jsx` (+ `.module.css`)
- `src/modules/admin/components/org/EmptyState.jsx` (+ `.module.css`)

### 데이터
- `src/modules/admin/data/adminMock.js`
  - `MOCK_ORGS`: 조직 목록
  - `MOCK_MEMBERS_BY_ORG`: 조직별 조직원
  - `MOCK_ORG_HISTORY_BY_ORG`: 조직별 변경 이력

## 기능 상세

### 1. 좌측 조직 트리 (OrgTree)

#### UI 구성
- 트리 헤더: "조직 구조" 타이틀, 조직 개수 표시
- 검색 입력: 조직 코드/명 검색
- 트리 노드:
  - 확장/축소 아이콘 (자식이 있는 경우)
  - 조직코드 (monospace)
  - 조직명
  - LEVEL 배지
  - 조직원 수 (있는 경우)
  - 메뉴 버튼 (hover 시 표시, 점 3개)

#### 기능
- 노드 클릭: 조직 선택 및 우측 패널 표시
- 확장/축소: 하위 조직 표시/숨김
- 검색: 코드/명으로 필터링
- 우클릭 메뉴: 하위 조직 추가 / 조직 수정 / 삭제
- 선택 강조: 선택된 노드는 좌측 컬러 바 + 배경 강조

#### UX 규칙
- 트리 노드에 수정/삭제 버튼 상시 노출 금지
- hover 시 메뉴 버튼 표시
- 우클릭 메뉴 제공

### 2. 우측 상세 패널 (OrgDetailPanel)

#### 탭 구조
1. **조직 정보 탭**
   - 상단 요약 카드:
     - 조직명 (큰 제목)
     - Breadcrumb (상위 > 현재)
     - LEVEL 배지
     - 조직원 수
   - 폼 카드:
     - 조직코드 (ReadOnly 또는 입력)
     - 조직명
     - 상위조직 선택
     - 정렬순서
     - 사용여부
   - 액션 버튼:
     - 하위 조직 추가 (Secondary)
     - 수정 (Primary, 수정 모드 전환)
     - 삭제 (Danger, 확인 모달)

2. **조직원 탭**
   - 안내 문구: "조직원 추가/이동/비활성화는 사용자관리에서 수행합니다."
   - 검색 입력: 조직원 검색
   - 조직원 리스트:
     - 카드형 리스트
     - 아바타 (이니셜)
     - 이름, 직급/직무, 이메일
     - 상태 배지 (재직/비활성)
     - 클릭 시 사용자 상세로 이동 (mock)

3. **변경 이력 탭**
   - 변경 이력 리스트:
     - 날짜/시간
     - 대상 사용자
     - 변경 내용 (이전 조직 → 이후 조직)
     - 변경자 (수행자)
   - 빈 상태 표시

### 3. 조직 추가/수정

#### 추가 모드
- 상단 [+ 조직 추가] 버튼: 루트 레벨 추가
- 하위 조직 추가: 선택된 조직 기준으로 하위 추가
  - 상위조직 자동 설정
  - 레벨 자동 계산 (상위 레벨 + 1)

#### 수정 모드
- 조직 정보 탭에서 "수정" 버튼 클릭
- 폼 필드 활성화
- 저장/취소 버튼 표시

### 4. 반응형 디자인

#### 데스크톱 (1024px 이상)
- 좌우 분할 레이아웃 (38% / 62%)
- 좌측 트리 sticky 고정

#### 모바일 (1024px 이하)
- 세로 배치 (트리 → 상세 패널)
- 상세 패널: BottomSheet 형태로 표시
- 오버레이 + 닫기 버튼 제공

## 디자인 시스템

### 컬러
- Background: #F6F8FC
- Card: #FFFFFF
- Border: #E5E7EB
- Text: #111827
- Subtext: #6B7280
- Primary: #2563EB
- Hover: rgba(37, 99, 235, 0.06)
- Selected: rgba(37, 99, 235, 0.10)

### 타이포그래피
- Page Title: 20px, font-weight 700
- Section Title: 14~15px, font-weight 600
- Body: 14px, font-weight 400
- Meta/Hint: 12px, color #6B7280

### 컴포넌트
- 카드: radius 14px, shadow subtle
- 입력/버튼 높이: 36~40px
- 트리 노드 높이: 40px

## Mock 데이터 구조

### 조직 (MOCK_ORGS)
```javascript
{
  id: string,
  code: string,
  name: string,
  parentId: string | null,
  level: number,
  order: number,
  isActive: boolean
}
```

### 조직원 (MOCK_MEMBERS_BY_ORG)
```javascript
{
  id: string,
  name: string,
  title: string,
  email: string,
  status: 'active' | 'inactive'
}
```

### 변경 이력 (MOCK_ORG_HISTORY_BY_ORG)
```javascript
{
  id: string,
  at: string, // 'YYYY-MM-DD HH:mm:ss'
  targetUserName: string,
  fromOrgName: string,
  toOrgName: string,
  actorName: string
}
```

## 주요 기능 흐름

1. **초기 진입**: 첫 번째 루트 조직 자동 선택
2. **조직 선택**: 트리 노드 클릭 → 우측 패널 갱신
3. **조직 추가**: 상단 버튼 또는 하위 조직 추가 → 폼 표시
4. **조직 수정**: 수정 버튼 클릭 → 폼 활성화 → 저장
5. **조직 삭제**: 삭제 버튼 클릭 → 확인 모달 → 삭제 (하위 조직 존재 시 경고)

## 제약 사항 (요구사항 반영)

- ✅ 트리 노드에 수정/삭제 버튼 상시 노출 금지
- ✅ 조직원 등록/추가/삭제 기능 금지 (조회만)
- ✅ 사용자 권한(Role) 편집 기능 금지

## 향후 개선 사항

- 실제 API 연동
- 드래그 앤 드롭으로 조직 순서 변경
- 조직 이동 기능
- 조직원 일괄 이동 기능
- 변경 이력 상세 보기

---

## 원본: sales-materials.md

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

---

## 원본: network-access.md

# 네트워크 접속 설정 가이드

## 현재 설정 상태

`vite.config.js`에서 `server.host: true`로 설정되어 있어, **로컬 네트워크(LAN) 내에서만** 접속 가능합니다.

## 접속 방법

### 1. 로컬 네트워크 접속 (현재 가능)
- 같은 WiFi/이더넷에 연결된 기기에서 접속 가능
- 접속 주소: `http://<내IP>:5173`
- 내 IP 확인: `ipconfig` (Windows) 또는 `ifconfig` (Mac/Linux)

### 2. 공인 IP 접속 (추가 설정 필요)

공인 IP로 접속하려면 다음 설정이 필요합니다:

#### A. 라우터 포트 포워딩 설정
1. 라우터 관리 페이지 접속 (보통 `192.168.0.1` 또는 `192.168.1.1`)
2. 포트 포워딩 설정 메뉴로 이동
3. 다음 설정 추가:
   - 외부 포트: `5173`
   - 내부 IP: 개발 PC의 로컬 IP (예: `192.168.0.100`)
   - 내부 포트: `5173`
   - 프로토콜: TCP

#### B. Windows 방화벽 설정
1. Windows 보안 → 방화벽 및 네트워크 보호
2. 고급 설정 → 인바운드 규칙 → 새 규칙
3. 포트 → TCP → 특정 로컬 포트: `5173` → 연결 허용

#### C. 공인 IP 확인
- 접속 주소: `http://<공인IP>:5173`
- 공인 IP 확인: https://www.whatismyip.com/ 또는 `curl ifconfig.me`

## 보안 주의사항

⚠️ **개발 서버를 공인 IP로 노출하는 것은 보안상 위험합니다!**

- 개발 서버는 인증/보안 기능이 없을 수 있습니다
- 프로덕션 빌드가 아닌 개발 모드는 성능/안정성 문제가 있을 수 있습니다
- 공개 인터넷에 노출 시 악의적인 접근 위험이 있습니다

## 권장 대안

### 1. VPN 사용
- 회사 VPN 또는 개인 VPN 서버 구축
- VPN을 통해 안전하게 접속

### 2. 터널링 서비스 사용 (개발/테스트용)
- **ngrok**: `ngrok http 5173` (무료/유료)
- **Cloudflare Tunnel**: 무료
- **localtunnel**: `npx localtunnel --port 5173` (무료)

### 3. 프로덕션 빌드 배포
- `npm run build` → 빌드 생성
- 웹 서버(Nginx, Apache 등)에 배포
- HTTPS 인증서 적용
- 방화벽/보안 그룹 설정

## 현재 설정 (vite.config.js)

```javascript
server: {
  host: true, // 0.0.0.0 바인딩 (로컬 네트워크 접속 가능)
  port: 5173,
  strictPort: true,
}
```

이 설정으로는 **로컬 네트워크 내에서만** 접속 가능합니다.


