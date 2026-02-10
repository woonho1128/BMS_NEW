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
