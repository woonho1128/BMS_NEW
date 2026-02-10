/**
 * 통합 시스템 IA 단일 소스
 * - 사이드바: '영업 관리' 안에 4개 중분류(영업 활동 공통 / 프로젝트 영업 / 리테일 영업 / 영업 지원), 관리자 최하단 구분선
 * - 라우팅 기준, 페이지 타이틀 / breadcrumb
 *
 * ⚠️ 기존 경로(path)는 유지하여 라우팅 호환성 보장
 */

import {
  LayoutDashboard,
  Briefcase,
  FileCheck,
  Truck,
  Store,
  BarChart3,
  Settings,
  Shield,
  Megaphone,
} from 'lucide-react';

// 메인 영역 (최상단 '영업 활동(공통)' 텍스트 섹션 없음, 영업 관리 안에 4개 중분류로 통합)
const MAIN = [
  { id: 'dashboard', label: '대시보드', path: '/', icon: LayoutDashboard },
  {
    id: 'sales',
    label: '영업 관리',
    icon: Briefcase,
    children: [
      {
        id: 'sales-common',
        label: '영업 활동 (공통)',
        children: [
          { id: 'sales-report', label: '보고서 관리', path: '/sales/report' },
          { id: 'sales-card', label: '명함 관리', path: '/sales/card' },
          { id: 'sales-material', label: '영업 자료실', path: '/sales/material' },
        ],
      },
      {
        id: 'sales-project',
        label: '프로젝트팀 관리',
        children: [
          { id: 'sales-profit-analysis', label: '손익분석', path: '/profit' },
          { id: 'sales-info', label: '영업정보 등록/조회', path: '/sales/info' },
          { id: 'spec-status', label: 'SPEC-현황', path: '/sales/spec-status' },
        ],
      },
      {
        id: 'sales-retail',
        label: '리테일팀 관리',
        children: [
          { id: 'sales-short-project', label: '단납 프로젝트 현황', path: '/sales/short-project' },
          { id: 'analytics-partner', label: '대리점 성과 분석', path: '/analytics/partner' },
          { id: 'analytics-retail', label: '리테일 매출 분석', path: '/analytics/retail-sales' },
        ],
      },
      {
        id: 'sales-tile',
        label: '타일영업팀 관리',
        children: [
          { id: 'sales-tile-team', label: '타일영업팀 현황 (임시)', path: '/sales/tile-team' },
        ],
      },
      {
        id: 'sales-support',
        label: '영업지원팀 관리',
        children: [
          { id: 'sales-support-temp', label: '영업 지원 현황 (임시)', path: '/sales/support' },
        ],
      },
    ],
  },
  {
    id: 'logistics',
    label: '출고/납품',
    icon: Truck,
    children: [
      {
        id: 'logistics-shipment',
        label: '출고 관리',
        children: [
          { id: 'delivery-request', label: '출고요청', path: '/delivery/request' },
          { id: 'delivery-history', label: '출고내역', path: '/delivery/history' },
        ],
      },
      {
        id: 'logistics-delivery',
        label: '납품/재고',
        children: [
          { id: 'delivery-plan', label: '납품 계획 관리', path: '/delivery/plan' },
          { id: 'delivery-inventory', label: '실시간 재고현황', path: '/delivery/inventory' },
        ],
      },
    ],
  },
  { id: 'approval', label: '영업 결재', path: '/approval/sales', icon: FileCheck },
  {
    id: 'partner',
    label: '대리점 포털',
    icon: Store,
    children: [
      {
        id: 'partner-support',
        label: '대리점 지원',
        children: [
          { id: 'partner-notice', label: '공지/자료실', path: '/partner/notice', icon: Megaphone },
          { id: 'partner-order', label: '온라인 주문', path: '/partner/order' },
          { id: 'partner-catalog', label: '카탈로그', path: '/partner/catalog' },
          { id: 'partner-as', label: 'AS 접수', path: '/partner/as' },
        ],
      },
      {
        id: 'partner-mypage',
        label: '마이 페이지',
        children: [
          { id: 'partner-basic', label: '기본 정보 관리', path: '/partner/basic' },
          { id: 'partner-delivery', label: '출고 정보 조회', path: '/partner/delivery' },
          { id: 'partner-receivable', label: '거래 정보 조회', path: '/finance/receivable' },
        ],
      },
    ],
  },
  {
    id: 'insights',
    label: '인사이트',
    icon: BarChart3,
    children: [
      {
        id: 'insights-kpi',
        label: '성과 관리(KPI)',
        children: [
          { id: 'analytics-sales', label: '개인 KPI', path: '/analytics/sales' },
          { id: 'analytics-department', label: '부서별 실적', path: '/analytics/delivery-stock' },
          { id: 'analytics-plan', label: '사업계획 달성률', path: '/analytics/profit' },
        ],
      },
      {
        id: 'insights-market',
        label: '시장 분석',
        children: [
          { id: 'analytics-market', label: '시황 파악', path: '/analytics/market' },
          { id: 'analytics-trends', label: '매출 동향', path: '/analytics/trends' },
          { id: 'analytics-custom', label: '사용자 정의 리포트', path: '/analytics/custom' },
        ],
      },
    ],
  },
  {
    id: 'master',
    label: '기준 정보',
    icon: Settings,
    children: [
      {
        id: 'master-data',
        label: '마스터 데이터',
        children: [
          { id: 'master-items', label: '품목정보', path: '/master/items' },
          { id: 'master-partners', label: '대리점정보(카드)', path: '/master/partners' },
          { id: 'master-cost', label: '표준원가', path: '/master/standard-cost' },
        ],
      },
    ],
  },
];

const ADMIN = [
  {
    id: 'admin',
    label: '관리자',
    icon: Shield,
    children: [
      {
        id: 'admin-settings',
        label: '시스템 설정',
        children: [
          { id: 'admin-users', label: '사용자 관리(Drawer)', path: '/admin/users' },
          { id: 'admin-org', label: '조직 관리', path: '/admin/org' },
          { id: 'admin-permission', label: '권한 관리', path: '/admin/permission' },
          { id: 'admin-code', label: '코드 관리', path: '/admin/code' },
        ],
      },
      {
        id: 'admin-log',
        label: '운영 로그',
        children: [
          { id: 'admin-log-history', label: '접속 및 사용 이력 관리', path: '/admin/log' },
        ],
      },
    ],
  },
];

/** 사이드바 섹션: 메인 / 관리자(상단 border-t 구분) */
export const IA_SIDEBAR_SECTIONS = [
  { key: 'main', items: MAIN },
  { key: 'admin', items: ADMIN, divider: true },
];

/** 기존 호환용: 전체 트리 */
export const IA_TREE = [...MAIN, ...ADMIN];

const FLAT_ITEMS = (() => {
  const list = [];
  const traverse = (nodes) => {
    nodes.forEach((node) => {
      if (node.path) list.push(node);
      if (node.children) traverse(node.children);
    });
  };
  traverse(IA_TREE);
  return list;
})();

export const getAllRoutes = () => [...FLAT_ITEMS];

export const findIaByPath = (path) => {
  let found = null;
  const traverse = (nodes, parents = []) => {
    for (const node of nodes) {
      const currentParents = [...parents, node];
      if (node.path === path) {
        found = currentParents;
        return;
      }
      if (node.children) traverse(node.children, currentParents);
    }
  };
  traverse(IA_TREE);
  return found;
};

export function getPageTitleByPath(path) {
  const found = findIaByPath(path);
  if (found && found.length > 0) return found[found.length - 1].label;
  if (path === '/') return '대시보드';
  return '페이지';
}
