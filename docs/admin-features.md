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
