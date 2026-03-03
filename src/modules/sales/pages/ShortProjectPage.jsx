/**
 * ShortProjectPage — 단납 프로젝트 현황 임시 페이지
 *
 * 연결 메뉴: 영업 관리 > 리테일팀 관리 > 단납 프로젝트 현황
 * 연결 경로: /sales/short-project (ROUTES.SHORT_PROJECT)
 *
 * ※ 기능 구현 예정. 준비 완료 시 이 파일에 실제 컴포넌트를 작성하세요.
 */
import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

export function ShortProjectPage() {
  return (
    <PlaceholderPage
      path={ROUTES.SHORT_PROJECT}
      description="리테일 영업용 단납 프로젝트 현황·목록 기능이 추가될 예정입니다."
      icon="⚡"
    />
  );
}
