/**
 * PartnerPerformancePage — 대리점 성과 분석 임시 페이지
 *
 * 연결 메뉴: 영업 관리 > 리테일팀 관리 > 대리점 성과 분석
 * 연결 경로: /analytics/partner (ROUTES.ANALYTICS_PARTNER)
 *
 * ※ 기능 구현 예정. 준비 완료 시 이 파일에 실제 컴포넌트를 작성하세요.
 */
import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function PartnerPerformancePage() {
  return (
    <PlaceholderPage
      path={ROUTES.ANALYTICS_PARTNER}
      description="대리점별 매출·달성률·순위 분석 기능이 추가될 예정입니다."
      icon="🏪"
    />
  );
}
