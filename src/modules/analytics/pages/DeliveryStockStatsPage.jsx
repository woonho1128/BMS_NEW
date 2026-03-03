/**
 * DeliveryStockStatsPage — 부서별 실적(출고/재고 통계) 임시 페이지
 *
 * 연결 메뉴: 인사이트 > 성과 관리(KPI) > 부서별 실적
 * 연결 경로: /analytics/delivery-stock (ROUTES.ANALYTICS_DELIVERY_STOCK)
 *
 * ※ 기능 구현 예정. 준비 완료 시 이 파일에 실제 컴포넌트를 작성하세요.
 */
import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function DeliveryStockStatsPage() {
  return (
    <PlaceholderPage
      path={ROUTES.ANALYTICS_DELIVERY_STOCK}
      description="부서별 출고·재고 실적 통계 기능이 추가될 예정입니다."
      icon="📦"
    />
  );
}
