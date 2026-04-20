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
          { id: 'sales-material', label: '영업 자료', path: '/sales/material' },
          { id: 'sales-delivery-request-status', label: '출고 요청 진행 현황', path: '/sales/delivery-request-status' },
          { id: 'sales-delivery-request-detail', label: '출하 요청 상세내역 조회', path: '/sales/delivery-request-detail' },
          { id: 'sales-delivery-approval', label: '출고 확인', path: '/sales/delivery-approval' },
        ],
      },
      {
        id: 'sales-project',
        label: '프로젝트부문',
        children: [
          { id: 'sales-profit-analysis', label: '손익분석', path: '/profit' },
          { id: 'sales-info', label: '영업정보 등록/조회', path: '/sales/info' },
          { id: 'spec-status', label: 'SPEC-현황', path: '/sales/spec-status' },
        ],
      },
      {
        id: 'sales-retail',
        label: '리테일부문',
        children: [
          {
            id: 'sales-short-project',
            label: '단납 프로젝트 현황',
            children: [
              { id: 'sales-short-project-register', label: '단납 현장 등록', path: '/sales/short-project/register' },
              { id: 'sales-short-project-list', label: '단납 현장 내역', path: '/sales/short-project' },
            ],
          },
          { id: 'sales-support-receivable', label: '수신채권금 관리', path: '/sales/support/receivable' },
          { id: 'sales-support-discount', label: '판매단가 관리', path: '/sales/support/discount-promotion' },
        ],
      },
    ],
  },
  {
    id: 'logistics',
    label: '재고/납품',
    icon: Truck,
    children: [
      {
        id: 'logistics-delivery',
        label: '납품 관리',
        children: [
          { id: 'delivery-plan', label: '납품 계획 관리', path: '/delivery/plan' },
        ],
      },
      {
        id: 'logistics-inventory',
        label: '재고 관리',
        children: [
          { id: 'delivery-inventory', label: '재고 현황 상세조회', path: '/delivery/inventory' },
          { id: 'delivery-demand', label: '수요 예측', path: '/delivery/demand-forecast' },
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
      { id: 'partner-basic', label: '기본 정보 관리', path: '/partner/basic' },
      {
        id: 'partner-support',
        label: '대리점 지원',
        children: [
          { id: 'partner-notice', label: '공지/자료실', path: '/partner/notice', icon: Megaphone },
          { id: 'partner-as', label: 'AS 접수', path: '/partner/as' },
          { id: 'partner-catalog', label: '카탈로그', path: '/partner/catalog' },
        ],
      },
      {
        id: 'partner-delivery-status',
        label: '출고/배송조회',
        children: [
          { id: 'partner-delivery', label: '출고 상세 및 현황', path: '/partner/delivery' },
          { id: 'partner-dispatch', label: '배차 현황', path: '/partner/dispatch' },
        ],
      },
      {
        id: 'partner-receivable-status',
        label: '채권조회',
        children: [
          { id: 'partner-receivable', label: '채권채무조회', path: '/finance/receivable' },
          { id: 'partner-balance-confirm', label: '채권채무요약확인서', path: '/partner/balance-confirm' },
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
        id: 'insights-project',
        label: '프로젝트부문',
        children: [
          { id: 'analytics-project-performance', label: '프로젝트 실적 요약', path: '/analytics/project-performance' },
          { id: 'analytics-yearly-delivery-forecast', label: '연도별 납품예정 현황', path: '/analytics/yearly-delivery-forecast' },
          { id: 'analytics-custom', label: '연도 별 채널 비중', path: '/analytics/custom' },
        ],
      },
      {
        id: 'insights-retail',
        label: '리테일부문',
        children: [
          {
            id: 'insights-kpi',
            label: '성과 관리(KPI)',
            children: [
              { id: 'analytics-retail', label: '리테일별 매출 현황', path: '/analytics/retail-sales' },
              { id: 'analytics-partner', label: '대리점별 매출 현황', path: '/analytics/partner' },
              { id: 'analytics-personal-sales', label: '개인별 매출 현황', path: '/analytics/personal-sales' },
              { id: 'analytics-category-sales', label: '카테고리별 판매 현황', path: '/analytics/category-sales' },
              { id: 'analytics-monthly-plan-meeting', label: '월간 계획 회의 관리', path: '/analytics/monthly-plan-meeting' },
            ],
          },
          {
            id: 'insights-market',
            label: '시장 분석',
            children: [
              { id: 'analytics-market', label: '시장파악', path: '/analytics/market' },
              { id: 'analytics-data-collection', label: '자료수집', path: '/analytics/data-collection' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'master',
    label: '기초 정보',
    icon: Settings,
    children: [
      {
        id: 'master-data',
        label: '마스터 데이터',
        children: [
          { id: 'master-partners', label: '대리점정보(카드)', path: '/master/partners' },
          { id: 'master-cost', label: '표준원가', path: '/master/standard-cost' },
          { id: 'master-performance-plan', label: '성과 계획 관리', path: '/master/performance-plan' },
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

export const IA_SIDEBAR_SECTIONS = [
  { key: 'main', items: MAIN },
  { key: 'admin', items: ADMIN, divider: true },
];

const IA_TREE = [...MAIN, ...ADMIN];

const findIaByPath = (path) => {
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
