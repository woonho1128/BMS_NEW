# 통합 BMS 프론트엔드

React (Vite) + JavaScript 기반 통합 BMS 프론트엔드.  
로그인 → 홈 레이아웃 → IA 메뉴 트리 → 라우팅(placeholder)까지 동작합니다.

## 기술 스택

- React 18 + Vite
- JavaScript (TypeScript 미사용)
- React Router v6
- CSS Variables + CSS Modules
- Pretendard 폰트
- ESLint + Prettier

## 실행 방법

```bash
npm install
npm run dev
```

- 로그인: `/login` (아무 아이디/비밀번호로 Mock 로그인 가능)
- 로그인 성공 시 `/`(대시보드)로 이동
- 좌측 IA 트리 메뉴 클릭 시 해당 Placeholder 페이지로 이동
- 새로고침 시 토큰 기반 로그인 유지
- 로그아웃: 헤더 우측 "로그아웃" 버튼

## 폴더 구조

- `src/app` - 앱 진입점, AuthProvider
- `src/router` - 라우팅, routePaths
- `src/layouts` - AppLayout(헤더+사이드바+콘텐츠), AuthLayout
- `src/modules` - 도메인별 모듈 (auth, dashboard, master, sales, approval, delivery, finance, partner, analytics, admin)
- `src/shared` - api, components, constants(ia.js), hooks, styles, utils
- `src/pages` - NotFound

## IA 단일 소스

`src/shared/constants/ia.js`에 메뉴 트리가 정의되어 있으며,  
사이드바 렌더, 라우팅 경로, breadcrumb/페이지 타이틀에 재사용됩니다.  
메뉴명(한글)은 변경하지 마세요.

## 반응형

- 데스크톱: 좌측 사이드바 고정, 헤더 상단 고정
- 모바일(768px 이하): 햄버거 메뉴로 사이드바 열기/닫기, 오버레이

## 후속 단계

- 권한/데이터 연동
- API 인터셉터 (shared/api/http.js)
