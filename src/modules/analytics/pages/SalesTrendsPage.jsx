/**
 * SalesTrendsPage — 매출 동향(시장 분석) 임시 페이지
 *
 * 연결 메뉴: 인사이트 > 시장 분석 > 매출 동향
 * 연결 경로: /analytics/trends (ROUTES.ANALYTICS_TRENDS)
 *
 * ※ 기능 구현 예정. 준비 완료 시 이 파일에 실제 컴포넌트를 작성하세요.
 */
import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function SalesTrendsPage() {
  return (
    <PlaceholderPage
      path={ROUTES.ANALYTICS_TRENDS}
      description="기간별·채널별 매출 동향 차트 기능이 추가될 예정입니다."
      icon="📉"
    />
  );
}
