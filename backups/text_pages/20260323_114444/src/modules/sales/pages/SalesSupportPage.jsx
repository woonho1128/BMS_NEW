import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function SalesSupportPage() {
  return (
    <PlaceholderPage
      path={ROUTES.SALES_SUPPORT}
      description="영업 지원 현황 기능이 추가될 예정입니다."
      icon="🧩"
    />
  );
}
