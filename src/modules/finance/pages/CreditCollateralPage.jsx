/**
 * CreditCollateralPage — 여신/담보 조회 임시 페이지
 *
 * 연결 메뉴: 대리점 포털 > 마이 페이지 > 거래 정보 조회 (기존 경로 유지)
 * 연결 경로: /finance/credit (ROUTES.FINANCE_CREDIT)
 *
 * ※ 기능 구현 예정. 준비 완료 시 이 파일에 실제 컴포넌트를 작성하세요.
 */
import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function CreditCollateralPage() {
  return (
    <PlaceholderPage
      path={ROUTES.FINANCE_CREDIT}
      description="여신 한도·담보 현황 조회 기능이 추가될 예정입니다."
      icon="🏦"
    />
  );
}
