/**
 * TileTeamPage — 타일영업팀 현황 임시 페이지
 *
 * 연결 메뉴: 영업 관리 > 타일영업팀 관리 > 타일영업팀 현황 (임시)
 * 연결 경로: /sales/tile-team (ROUTES.TILE_TEAM)
 *
 * ※ 기능 구현 예정. 준비 완료 시 이 파일에 실제 컴포넌트를 작성하세요.
 */
import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function TileTeamPage() {
  return (
    <PlaceholderPage
      path={ROUTES.TILE_TEAM}
      description="타일영업팀 전담 현황 및 실적 기능이 추가될 예정입니다."
      icon="🏗️"
    />
  );
}
