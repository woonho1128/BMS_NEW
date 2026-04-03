/**
 * =============================================================================
 * shared/constants/ia.js — IA(Information Architecture) 단일 소스
 * =============================================================================
 *
 * 이 파일은 사이드바 메뉴 구조의 단일 정의 파일입니다.
 * 사이드바 렌더링, 라우팅 호환성, 페이지 타이틀/breadcrumb 을 모두 관리합니다.
 *
 * 구조:
 *   MAIN  - 대시보드 + 영업관리(공통/프로젝트팀/리테일팀/타일팀/영업지원팀) + 출고납품 + 영업결재 + 대리점포털 + 인사이트 + 기준정보
 *   ADMIN - 관리자 (시스템 설정 / 온라인 주문 관리 / 운영 로그) — 사이드바 하단 구분선으로 분리
 *
 * 계층 구조 규칙:
 *   Depth 0 (대분류): icon + label + children
 *   Depth 1 (중분류): label + children  (아이콘 없음)
 *   Depth 2 (소분류): label + path      (실제 페이지 링크)
 *
 * ⚠️ 기존 경로(path)는 라우팅 호환성을 위해 변경 금지.
 *    경로 상수는 router/routePaths.js 에서 관리합니다.
 * =============================================================================
 */

import {
  LayoutDashboard, /* 대시보드 */
  Briefcase,       /* 영업 관리 */
  FileCheck,       /* 영업 결재 */
  Truck,           /* 출고/납품 */
  Store,           /* 대리점 포털 */
  BarChart3,       /* 인사이트 */
  Settings,        /* 기준 정보 */
  Shield,          /* 관리자 */
  Megaphone,       /* 공지/자료실 */
} from 'lucide-react';

// ─────────────────────────────────────────────
// MAIN 섹션 — 일반 사용자 메뉴
// ─────────────────────────────────────────────
const MAIN = [
  /* ── 대시보드 ── */
  { id: 'dashboard', label: '대시보드', path: '/', icon: LayoutDashboard },

  /* ── 영업 관리 ── */
  {
    id: 'sales',
    label: '영업 관리',
    icon: Briefcase,
    children: [
      /* 영업 활동 (공통) — 보고서·명함·자료실 */
      {
        id: 'sales-common',
        label: '영업 활동 (공통)',
        children: [
          { id: 'sales-report', label: '보고서 관리', path: '/sales/report' },
          { id: 'sales-card', label: '명함 관리', path: '/sales/card' },
          { id: 'sales-material', label: '영업 자료실', path: '/sales/material' },
          { id: 'sales-delivery-request-status', label: '출고 요청 진행 현황', path: '/sales/delivery-request-status' },
          { id: 'sales-delivery-request-detail', label: '출하 요청 상세내역 조회', path: '/sales/delivery-request-detail' },
          { id: 'sales-delivery-approval', label: '출고 승인', path: '/sales/delivery-approval' },
        ],
      },
      /* 프로젝트팀 관리 — 손익분석·영업정보·SPEC 현황 */
      {
        id: 'sales-project',
        label: '프로젝트부문',
        children: [
          { id: 'sales-profit-analysis', label: '손익분석', path: '/profit' },
          { id: 'sales-info', label: '영업정보 등록/조회', path: '/sales/info' },
          { id: 'spec-status', label: 'SPEC-현황', path: '/sales/spec-status' },
        ],
      },
      /* 리테일팀 관리 — 단납 프로젝트·대리점 성과·매출 분석·발주 검수/결재 */
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
          { id: 'sales-support-receivable', label: '여신,수금 관리', path: '/sales/support/receivable' },
          { id: 'sales-support-discount', label: '판매단가 관리', path: '/sales/support/discount-promotion' },
// { id: 'sales-retail-review', label: '발주 검수 리스트', path: '/sales/retail/review' },
        ],
      },
    ],
  },

  /* ── 재고 / 납품 ── */
  {
    id: 'logistics',
    label: '재고/납품',
    icon: Truck,
    children: [
      /* 출고 관리 (임시 비활성화) */
      // {
      //   id: 'logistics-shipment',
      //   label: '출고 관리',
      //   children: [
      //     { id: 'delivery-request', label: '출고요청', path: '/delivery/request' },
      //     { id: 'delivery-history', label: '출고내역', path: '/delivery/history' },
      //   ],
      // },
      /* 납품 관리 */
      {
        id: 'logistics-delivery',
        label: '납품 관리',
        children: [
          { id: 'delivery-plan', label: '납품 계획 관리', path: '/delivery/plan' },
        ],
      },
      /* 재고 관리 */
      {
        id: 'logistics-inventory',
        label: '재고관리',
        children: [
          { id: 'delivery-inventory', label: '재고 현황 상세조회', path: '/delivery/inventory' },
          { id: 'delivery-demand', label: '수요예측', path: '/delivery/demand-forecast' },
        ],
      },
    ],
  },

  /* ── 영업 결재 ── */
  { id: 'approval', label: '영업 결재', path: '/approval/sales', icon: FileCheck },

  /* ── 대리점 포털 ── */
  {
    id: 'partner',
    label: '대리점 포털',
    icon: Store,
    children: [
      /* 대리점 지원 — 공지/카탈로그/AS */
      {
        id: 'partner-support',
        label: '대리점 지원',
        children: [
          { id: 'partner-notice', label: '공지/자료실', path: '/partner/notice', icon: Megaphone },
          { id: 'partner-as', label: 'AS 접수', path: '/partner/as' },
          { id: 'partner-catalog', label: '카탈로그', path: '/partner/catalog' },
        ],
      },
      /* 온라인 주문 — 대기 중(비활성화) */
      // {
      //   id: 'partner-order-group',
      //   label: '온라인 주문',
      //   children: [
      //     { id: 'partner-order-product', label: '상품 조회/발주 등록', path: '/partner/order/product' },
      //     { id: 'partner-order-list', label: '발주 내역 조회', path: '/partner/order/list' },
      //     { id: 'partner-order-delivery', label: '출고 / 배송 조회', path: '/partner/order/delivery' },
      //   ],
      // },
      /* 출고/배송조회 */
      {
        id: 'partner-delivery-status',
        label: '출고/배송조회',
        children: [
          { id: 'partner-delivery', label: '출고 상세 및 현황', path: '/partner/delivery' },
          { id: 'partner-dispatch', label: '배차 현황', path: '/partner/dispatch' },
        ],
      },
      /* 채권조회 */
      {
        id: 'partner-receivable-status',
        label: '채권조회',
        children: [
          { id: 'partner-basic', label: '기본 정보 관리', path: '/partner/basic' },
          { id: 'partner-receivable', label: '채권채무조회', path: '/finance/receivable' },
          { id: 'partner-balance-confirm', label: '채권채무잔액확인서', path: '/partner/balance-confirm' },
        ],
      },
    ],
  },

  /* ── 인사이트 ── */
  {
    id: 'insights',
    label: '인사이트',
    icon: BarChart3,
    children: [
      /* 성과 관리(KPI) */
      {
        id: 'insights-kpi',
        label: '성과 관리(KPI)',
        children: [
          { id: 'analytics-retail', label: '리테일팀 매출 현황', path: '/analytics/retail-sales' },
          { id: 'analytics-partner', label: '대리점별 매출 현황', path: '/analytics/partner' },
          { id: 'analytics-personal-sales', label: '개인별 매출 현황', path: '/analytics/personal-sales' },
          { id: 'analytics-category-sales', label: '카테고리별 판매 현황', path: '/analytics/category-sales' },
        ],
      },
      /* 시장 분석 */
      {
        id: 'insights-market',
        label: '시장 분석',
        children: [
          { id: 'analytics-market', label: '시황파악', path: '/analytics/market' },
          { id: 'analytics-data-collection', label: '자료수집', path: '/analytics/data-collection' },
        ],
      },
    ],
  },

  /* ── 기준 정보 (마스터) ── */
  {
    id: 'master',
    label: '기준 정보',
    icon: Settings,
    children: [
      {
        id: 'master-data',
        label: '마스터 데이터',
        children: [
          // { id: 'master-items', label: '품목정보', path: '/master/items' },
          { id: 'master-partners', label: '대리점정보(카드)', path: '/master/partners' },
          { id: 'master-cost', label: '표준원가', path: '/master/standard-cost' },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────
// ADMIN 섹션 — 관리자 전용 (사이드바 하단 구분선)
// ─────────────────────────────────────────────
const ADMIN = [
  {
    id: 'admin',
    label: '관리자',
    icon: Shield,
    children: [
      /* 시스템 설정 */
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
      /* 온라인 주문 관리 — 대기 중(비활성화) */
      // {
      //   id: 'admin-order',
      //   label: '온라인 주문 관리',
      //   children: [
      //     { id: 'admin-order-total', label: '전체 발주 조회', path: '/admin/order/total' },
      //     { id: 'admin-order-status-force', label: '상태 강제 변경', path: '/admin/order/status-force' },
      //     { id: 'admin-order-erp', label: 'ERP 전송 관리 / 재전송', path: '/admin/order/erp' },
      //     { id: 'admin-order-history-log', label: '발주 이력 / 로그', path: '/admin/order/history-log' },
      //   ],
      // },
      /* 운영 로그 */
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

// ─────────────────────────────────────────────
// 사이드바 섹션 배열 (Sidebar 컴포넌트에서 사용)
// ─────────────────────────────────────────────

/**
 * IA_SIDEBAR_SECTIONS — Sidebar 컴포넌트가 소비하는 최종 섹션 배열
 * divider: true → 섹션 상단에 구분선 렌더
 */
export const IA_SIDEBAR_SECTIONS = [
  { key: 'main', items: MAIN },
  { key: 'admin', items: ADMIN, divider: true },
];

// ─────────────────────────────────────────────
// 유틸리티
// ─────────────────────────────────────────────

/** IA 전체 트리 (MAIN + ADMIN 병합) — 경로 탐색 등 내부 유틸 용도 */
export const IA_TREE = [...MAIN, ...ADMIN];

/**
 * FLAT_ITEMS — path 를 가진 모든 노드의 flat 배열 (즉시 실행으로 1회만 생성)
 * getAllRoutes() 를 통해 외부에서 접근합니다.
 */
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

/** getAllRoutes — path를 가진 모든 IA 노드 목록 반환 */
export const getAllRoutes = () => [...FLAT_ITEMS];

/**
 * findIaByPath — 주어진 경로와 일치하는 노드까지의 조상 배열 반환
 * @param {string} path - 검색할 경로
 * @returns {Array|null} 조상 노드 배열 (마지막이 해당 노드), 없으면 null
 */
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

/**
 * getPageTitleByPath — 경로로 페이지 타이틀을 조회합니다 (PageShell 에서 사용)
 * @param {string} path - 조회할 경로
 * @returns {string} 페이지 타이틀
 */
export function getPageTitleByPath(path) {
  const found = findIaByPath(path);
  if (found && found.length > 0) return found[found.length - 1].label;
  if (path === '/') return '대시보드';
  return '페이지';
}
