/**
 * PurchaseSalesPage — 매입/매출 조회 임시 페이지
 *
 * 연결 경로: /finance/purchase-sales (ROUTES.FINANCE_PURCHASE_SALES)
 *
 * ※ 기능 구현 예정. 준비 완료 시 이 파일에 실제 컴포넌트를 작성하세요.
 */
import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function PurchaseSalesPage() {
  return (
    <PlaceholderPage
      path={ROUTES.FINANCE_PURCHASE_SALES}
      description="매입·매출 내역 조회 및 정산 기능이 추가될 예정입니다."
      icon="💹"
    />
  );
}
