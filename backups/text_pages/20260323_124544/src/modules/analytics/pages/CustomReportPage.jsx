/**
 * CustomReportPage — 사용자 정의 리포트 임시 페이지
 *
 * 연결 메뉴: 인사이트 > 시장 분석 > 사용자 정의 리포트
 * 연결 경로: /analytics/custom (ROUTES.ANALYTICS_CUSTOM)
 *
 * ※ 기능 구현 예정. 준비 완료 시 이 파일에 실제 컴포넌트를 작성하세요.
 */
import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function CustomReportPage() {
  return (
    <PlaceholderPage
      path={ROUTES.ANALYTICS_CUSTOM}
      description="지표·기간·그룹을 직접 조합해 리포트를 생성하는 기능이 추가될 예정입니다."
      icon="📋"
    />
  );
}
