import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function SalesTrendsPage() {
  return (
    <PlaceholderPage
      path={ROUTES.ANALYTICS_TRENDS}
      description="기간별/거래처별 매출 추이 차트 기능이 추가될 예정입니다."
      icon="📈"
    />
  );
}
