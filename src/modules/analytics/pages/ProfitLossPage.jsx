/**
 * ProfitLossPage — 사업계획 달성률(손익 분석) 임시 페이지
 *
 * 연결 메뉴: 인사이트 > 성과 관리(KPI) > 사업계획 달성률
 * 연결 경로: /analytics/profit (ROUTES.ANALYTICS_PROFIT)
 *
 * ※ 기능 구현 예정. 준비 완료 시 이 파일에 실제 컴포넌트를 작성하세요.
 */
import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function ProfitLossPage() {
  return (
    <PlaceholderPage
      path={ROUTES.ANALYTICS_PROFIT}
      description="사업계획 대비 실적 달성률·손익 분석 기능이 추가될 예정입니다."
      icon="📈"
    />
  );
}
