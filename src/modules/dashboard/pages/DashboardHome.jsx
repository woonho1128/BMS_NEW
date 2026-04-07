import React, { useMemo, useRef, useState } from 'react';
import { DashboardKPI } from '../components/DashboardKPI/DashboardKPI';
import { SalesStatus } from '../components/SalesStatus/SalesStatus';
import { DeliveryStatus } from '../components/DeliveryStatus/DeliveryStatus';
import { FinanceStatus } from '../components/FinanceStatus/FinanceStatus';
import { NoticeSummary } from '../components/NoticeSummary/NoticeSummary';
import { ApprovalTodo } from '../components/ApprovalTodo/ApprovalTodo';
import { ProjectCoreStatus } from '../components/ProjectCoreStatus/ProjectCoreStatus';
import { WidgetWrapper } from '../components/WidgetWrapper/WidgetWrapper';
import { WidgetCatalog } from '../components/WidgetCatalog/WidgetCatalog';
import { useAuth } from '../../auth/hooks/useAuth';
import styles from './DashboardPage.module.css';

const ROLE_TABS = [
  { key: 'TEAM_MEMBER', label: '팀원' },
  { key: 'TEAM_LEADER', label: '팀장' },
  { key: 'EXECUTIVE', label: '임원' },
  { key: 'DEALER', label: '대리점' },
];

const SCOPE_TABS = {
  TEAM_MEMBER: [
    { key: 'PROJECT_MENU', label: '프로젝트 부문', desc: '손익/영업정보/SPEC 현황 조회 결과를 요약' },
    { key: 'RETAIL_MENU', label: '리테일 부문(영업/성과)', desc: '단납/여신수금/KPI 조회 결과를 요약' },
  ],
  TEAM_LEADER: [
    { key: 'PROJECT_MENU', label: '프로젝트 부문', desc: '손익/영업정보/SPEC 현황 조회 결과를 요약' },
    { key: 'RETAIL_MENU', label: '리테일 부문(영업/성과)', desc: '단납/여신수금/KPI 조회 결과를 요약' },
  ],
  EXECUTIVE: [
    { key: 'PROJECT_MENU', label: '프로젝트 부문', desc: '손익/영업정보/SPEC 현황 조회 결과를 요약' },
    { key: 'RETAIL_MENU', label: '리테일 부문(영업/성과)', desc: '단납/여신수금/KPI 조회 결과를 요약' },
  ],
  DEALER: [{ key: 'DEALER_PORTAL', label: '대리점 포털', desc: '대리점 포털 조회 결과를 핵심 수치로 요약' }],
};

const WIDGET_REGISTRY = [
  { id: 'notice', label: '공지 요약', description: '공지/자료 조회 결과 요약', icon: 'N', defaultSize: 'full', component: NoticeSummary },
  { id: 'kpi', label: 'KPI 요약', description: '성과/영업 핵심 수치 요약', icon: 'KPI', defaultSize: 'full', component: DashboardKPI },
  { id: 'sales', label: '영업 현황', description: '영업 화면 조회 결과 요약', icon: 'SALE', defaultSize: 'half', component: SalesStatus },
  { id: 'delivery', label: '출고/납품 현황', description: '출고/납품 조회 결과 요약', icon: 'DEL', defaultSize: 'half', component: DeliveryStatus },
  { id: 'finance', label: '재무/정산 현황', description: '채권/정산 조회 결과 요약', icon: 'FIN', defaultSize: 'half', component: FinanceStatus },
  { id: 'projectCore', label: '프로젝트 핵심 현황', description: '손익/영업정보/SPEC 조회 요약', icon: 'PRJ', defaultSize: 'full', component: ProjectCoreStatus },
  { id: 'approval', label: '결재 대기', description: '결재 대기 건수 요약', icon: 'APV', defaultSize: 'half', component: ApprovalTodo },
];

const ROLE_SCOPE_DEFAULT_LAYOUTS = {
  TEAM_MEMBER: {
    PROJECT_MENU: [
      { id: 'projectCore', size: 'full' },
      { id: 'notice', size: 'full' },
    ],
    RETAIL_MENU: [
      { id: 'kpi', size: 'full' },
      { id: 'notice', size: 'full' },
    ],
  },
  TEAM_LEADER: {
    PROJECT_MENU: [
      { id: 'projectCore', size: 'full' },
      { id: 'approval', size: 'half' },
      { id: 'notice', size: 'full' },
    ],
    RETAIL_MENU: [
      { id: 'kpi', size: 'full' },
      { id: 'approval', size: 'half' },
      { id: 'notice', size: 'full' },
    ],
  },
  EXECUTIVE: {
    PROJECT_MENU: [
      { id: 'projectCore', size: 'full' },
      { id: 'approval', size: 'half' },
      { id: 'notice', size: 'full' },
    ],
    RETAIL_MENU: [
      { id: 'kpi', size: 'full' },
      { id: 'approval', size: 'half' },
      { id: 'notice', size: 'full' },
    ],
  },
  DEALER: {
    DEALER_PORTAL: [
      { id: 'notice', size: 'full' },
      { id: 'sales', size: 'half' },
      { id: 'delivery', size: 'half' },
      { id: 'finance', size: 'half' },
    ],
  },
};

const STORAGE_KEY = 'bms_dashboard_role_scope_layouts_v5';

const inferInitialRole = (user) => {
  if (user?.role === 'AGENCY' || user?.role === 'PARTNER' || user?.role === 'DEALER') return 'DEALER';
  if (String(user?.position || '').includes('임원')) return 'EXECUTIVE';
  if (String(user?.position || '').includes('팀장')) return 'TEAM_LEADER';
  return 'TEAM_MEMBER';
};

const getDefaultLayout = (role, scope) => (ROLE_SCOPE_DEFAULT_LAYOUTS[role] || {})[scope] || [];

const isWidgetAllowedForRoleScope = (role, scope, widgetId) =>
  getDefaultLayout(role, scope).some((item) => item.id === widgetId);

const sanitizeRoleScopeLayout = (role, scope, rawLayout) => {
  const idsInRegistry = new Set(WIDGET_REGISTRY.map((widget) => widget.id));
  const fallback = getDefaultLayout(role, scope);
  if (!Array.isArray(rawLayout)) return fallback;

  const seen = new Set();
  const normalized = rawLayout
    .filter((item) => item && typeof item.id === 'string')
    .filter((item) => idsInRegistry.has(item.id))
    .filter((item) => isWidgetAllowedForRoleScope(role, scope, item.id))
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .map((item) => ({ id: item.id, size: item.size === 'full' ? 'full' : 'half' }));

  return normalized.length > 0 ? normalized : fallback;
};

const createDefaultLayouts = () => {
  return Object.fromEntries(
    Object.entries(ROLE_SCOPE_DEFAULT_LAYOUTS).map(([role, scopes]) => [
      role,
      Object.fromEntries(Object.entries(scopes).map(([scope, layout]) => [scope, layout])),
    ])
  );
};

const loadRoleScopeLayouts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createDefaultLayouts();

    const parsed = JSON.parse(saved);
    const next = createDefaultLayouts();

    Object.keys(ROLE_SCOPE_DEFAULT_LAYOUTS).forEach((role) => {
      Object.keys(ROLE_SCOPE_DEFAULT_LAYOUTS[role]).forEach((scope) => {
        next[role][scope] = sanitizeRoleScopeLayout(role, scope, parsed?.[role]?.[scope]);
      });
    });

    return next;
  } catch {
    return createDefaultLayouts();
  }
};

export function DashboardHome() {
  const { user } = useAuth();
  const initialRole = inferInitialRole(user);
  const [activeRole, setActiveRole] = useState(initialRole);
  const [activeScopeByRole, setActiveScopeByRole] = useState(() => {
    const base = Object.fromEntries(ROLE_TABS.map((tab) => [tab.key, SCOPE_TABS[tab.key][0]?.key || '']));
    base[initialRole] = SCOPE_TABS[initialRole][0]?.key || '';
    return base;
  });
  const [layoutsByRoleScope, setLayoutsByRoleScope] = useState(loadRoleScopeLayouts);
  const [isEditing, setIsEditing] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);

  const snapshotRef = useRef(null);
  const draggedIdRef = useRef(null);
  const [dragOverId, setDragOverId] = useState(null);

  const currentScope = activeScopeByRole[activeRole] || SCOPE_TABS[activeRole][0].key;
  const currentLayout = layoutsByRoleScope?.[activeRole]?.[currentScope] || getDefaultLayout(activeRole, currentScope);

  const roleMeta = useMemo(() => ROLE_TABS.find((role) => role.key === activeRole) || ROLE_TABS[0], [activeRole]);
  const scopeMeta = useMemo(
    () => (SCOPE_TABS[activeRole] || []).find((scope) => scope.key === currentScope) || (SCOPE_TABS[activeRole] || [])[0],
    [activeRole, currentScope]
  );

  const setCurrentLayout = (updater) => {
    setLayoutsByRoleScope((prev) => {
      const current = prev?.[activeRole]?.[currentScope] || getDefaultLayout(activeRole, currentScope);
      const nextLayout = typeof updater === 'function' ? updater(current) : updater;
      return {
        ...prev,
        [activeRole]: {
          ...(prev?.[activeRole] || {}),
          [currentScope]: sanitizeRoleScopeLayout(activeRole, currentScope, nextLayout),
        },
      };
    });
  };

  const enterEdit = () => {
    snapshotRef.current = JSON.parse(JSON.stringify(layoutsByRoleScope));
    setIsEditing(true);
  };

  const saveEdit = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layoutsByRoleScope));
    setIsEditing(false);
    setShowCatalog(false);
    snapshotRef.current = null;
  };

  const cancelEdit = () => {
    if (snapshotRef.current) setLayoutsByRoleScope(snapshotRef.current);
    setIsEditing(false);
    setShowCatalog(false);
    snapshotRef.current = null;
  };

  const resetCurrentScopeLayout = () => {
    setLayoutsByRoleScope((prev) => ({
      ...prev,
      [activeRole]: {
        ...(prev?.[activeRole] || {}),
        [currentScope]: getDefaultLayout(activeRole, currentScope),
      },
    }));
  };

  const resetAllLayouts = () => {
    setLayoutsByRoleScope(createDefaultLayouts());
    localStorage.removeItem(STORAGE_KEY);
    setIsEditing(false);
    setShowCatalog(false);
  };

  const handleAdd = (widgetId) => {
    if (!isWidgetAllowedForRoleScope(activeRole, currentScope, widgetId)) return;
    setCurrentLayout((prev) => {
      if (prev.some((widget) => widget.id === widgetId)) return prev;
      const reg = WIDGET_REGISTRY.find((widget) => widget.id === widgetId);
      if (!reg) return prev;
      return [...prev, { id: widgetId, size: reg.defaultSize }];
    });
  };

  const handleRemove = (widgetId) => {
    setCurrentLayout((prev) => prev.filter((widget) => widget.id !== widgetId));
  };

  const handleResize = (widgetId) => {
    setCurrentLayout((prev) =>
      prev.map((widget) =>
        widget.id === widgetId ? { ...widget, size: widget.size === 'half' ? 'full' : 'half' } : widget
      )
    );
  };

  const handleDrop = (event, targetId) => {
    event.preventDefault();
    const fromId = draggedIdRef.current;
    if (!fromId || fromId === targetId) {
      setDragOverId(null);
      return;
    }

    setCurrentLayout((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((widget) => widget.id === fromId);
      const toIdx = next.findIndex((widget) => widget.id === targetId);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const [removed] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, removed);
      return next;
    });

    draggedIdRef.current = null;
    setDragOverId(null);
  };

  const activeIds = new Set(currentLayout.map((widget) => widget.id));
  const availableWidgets = WIDGET_REGISTRY.filter(
    (widget) => !activeIds.has(widget.id) && isWidgetAllowedForRoleScope(activeRole, currentScope, widget.id)
  );

  return (
    <div className={styles.dashboard}>
      <div className={styles.roleTabs} role="tablist" aria-label="역할별 대시보드">
        {ROLE_TABS.map((role) => (
          <button
            key={role.key}
            type="button"
            role="tab"
            aria-selected={activeRole === role.key}
            className={activeRole === role.key ? styles.roleTabActive : styles.roleTab}
            onClick={() => {
              setActiveRole(role.key);
              setShowCatalog(false);
            }}
          >
            {role.label}
          </button>
        ))}
      </div>

      <div className={styles.scopeTabs} role="tablist" aria-label="부문별 대시보드">
        {(SCOPE_TABS[activeRole] || []).map((scope) => (
          <button
            key={scope.key}
            type="button"
            role="tab"
            aria-selected={currentScope === scope.key}
            className={currentScope === scope.key ? styles.scopeTabActive : styles.scopeTab}
            onClick={() => {
              setActiveScopeByRole((prev) => ({ ...prev, [activeRole]: scope.key }));
              setShowCatalog(false);
            }}
          >
            {scope.label}
          </button>
        ))}
      </div>

      <div className={styles.roleSummary}>
        <p className={styles.roleTitle}>{roleMeta.label} / {scopeMeta?.label}</p>
        <p className={styles.roleDesc}>{scopeMeta?.desc}</p>
      </div>

      <div className={styles.toolbar}>
        {isEditing ? (
          <>
            <button type="button" className={styles.catalogBtn} onClick={() => setShowCatalog((value) => !value)}>
              + 위젯 추가
            </button>
            <div className={styles.editActions}>
              <button type="button" className={styles.resetBtn} onClick={resetCurrentScopeLayout}>
                현재 탭 초기화
              </button>
              <button type="button" className={styles.resetBtn} onClick={resetAllLayouts}>
                전체 초기화
              </button>
              <button type="button" className={styles.cancelBtn} onClick={cancelEdit}>
                취소
              </button>
              <button type="button" className={styles.saveBtn} onClick={saveEdit}>
                저장
              </button>
            </div>
          </>
        ) : (
          <button type="button" className={styles.editBtn} onClick={enterEdit}>
            위젯 설정
          </button>
        )}
      </div>

      {isEditing && (
        <div className={styles.editBanner}>
          각 화면에서 조회되는 데이터를 대시보드 카드로 요약해 보여줍니다. 팀원은 상신 진행 상태, 팀장/임원은 결재 대기 건 중심으로 확인합니다.
        </div>
      )}

      <div className={styles.widgetGrid}>
        {currentLayout.map((item) => {
          const reg = WIDGET_REGISTRY.find((widget) => widget.id === item.id);
          if (!reg) return null;
          const Component = reg.component;

          return (
            <WidgetWrapper
              key={item.id}
              id={item.id}
              size={item.size}
              isEditing={isEditing}
              isDragOver={dragOverId === item.id}
              isDragging={draggedIdRef.current === item.id}
              onResize={() => handleResize(item.id)}
              onRemove={() => handleRemove(item.id)}
              onDragStart={() => {
                draggedIdRef.current = item.id;
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (draggedIdRef.current !== item.id) setDragOverId(item.id);
              }}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(event) => handleDrop(event, item.id)}
            >
              <Component role={activeRole} scope={currentScope} />
            </WidgetWrapper>
          );
        })}

        {currentLayout.length === 0 && (
          <div className={styles.emptyState}>
            <p>이 역할/부문에 배치된 위젯이 없습니다.</p>
            <button type="button" className={styles.catalogBtn} onClick={() => setShowCatalog(true)}>
              + 위젯 추가
            </button>
          </div>
        )}
      </div>

      <WidgetCatalog
        isOpen={showCatalog}
        availableWidgets={availableWidgets}
        onAdd={handleAdd}
        onClose={() => setShowCatalog(false)}
      />
    </div>
  );
}
