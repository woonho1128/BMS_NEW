/**
 * MarketOverviewPage — 시황 파악(시장 분석) 임시 페이지
 *
 * 연결 메뉴: 인사이트 > 시장 분석 > 시황 파악
 * 연결 경로: /analytics/market (ROUTES.ANALYTICS_MARKET)
 *
 * ※ 기능 구현 예정. 준비 완료 시 이 파일에 실제 컴포넌트를 작성하세요.
 */
import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function MarketOverviewPage() {
  return (
    <PlaceholderPage
      path={ROUTES.ANALYTICS_MARKET}
      description="경쟁사·시장 동향 지표 파악 기능이 추가될 예정입니다."
      icon="🌐"
    />
  );
}
