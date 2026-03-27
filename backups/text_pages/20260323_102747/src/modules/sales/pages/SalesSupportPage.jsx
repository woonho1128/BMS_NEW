/**
 * SalesSupportPage — 영업 지원 현황 임시 페이지
 *
 * 연결 메뉴: 영업 관리 > 영업지원팀 관리 > 영업 지원 현황 (임시)
 * 연결 경로: /sales/support (ROUTES.SALES_SUPPORT)
 *
 * ※ 기능 구현 예정. 준비 완료 시 이 파일에 실제 컴포넌트를 작성하세요.
 */
import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function SalesSupportPage() {
  return (
    <PlaceholderPage
      path={ROUTES.SALES_SUPPORT}
      description="영업 지원 현황 기능이 추가될 예정입니다."
      icon="🤝"
    />
  );
}
