import React, { useState, useRef, useCallback } from 'react';
import { DashboardKPI } from '../components/DashboardKPI/DashboardKPI';
import { SalesStatus } from '../components/SalesStatus/SalesStatus';
import { DeliveryStatus } from '../components/DeliveryStatus/DeliveryStatus';
import { FinanceStatus } from '../components/FinanceStatus/FinanceStatus';
import { NoticeSummary } from '../components/NoticeSummary/NoticeSummary';
import { ApprovalTodo } from '../components/ApprovalTodo/ApprovalTodo';
import { WidgetWrapper } from '../components/WidgetWrapper/WidgetWrapper';
import { WidgetCatalog } from '../components/WidgetCatalog/WidgetCatalog';
import { useAuth } from '../../auth/hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../../../shared/constants/permissions';
import styles from './DashboardPage.module.css';

// ─── 위젯 레지스트리 ───────────────────────────────────────────
const WIDGET_REGISTRY = [
  {
    id: 'kpi',
    label: 'KPI 요약',
    description: '진행중 영업, 출고대기, 미수금 현황',
    icon: '📊',
    defaultSize: 'full',
    component: DashboardKPI,
  },
  {
    id: 'sales',
    label: '영업현황',
    description: '영업 단계별 현황 목록',
    icon: '💼',
    defaultSize: 'half',
    component: SalesStatus,
  },
  {
    id: 'delivery',
    label: '출고현황',
    description: '출고 요청 및 처리 현황',
    icon: '🚛',
    defaultSize: 'half',
    component: DeliveryStatus,
  },
  {
    id: 'finance',
    label: '재무현황',
    description: '채권·매입매출 요약',
    icon: '💰',
    defaultSize: 'half',
    component: FinanceStatus,
  },
  {
    id: 'approval',
    label: '결재대기',
    description: '내 결재박스 (권한 필요)',
    icon: '✅',
    defaultSize: 'half',
    component: ApprovalTodo,
    permission: PERMISSIONS.APPROVAL,
  },
  {
    id: 'notice',
    label: '공지사항',
    description: '최신 공지 및 자료 요약',
    icon: '📢',
    defaultSize: 'full',
    component: NoticeSummary,
  },
];

// ─── 기본 레이아웃 ──────────────────────────────────────────────
const DEFAULT_LAYOUT = [
  { id: 'kpi', size: 'full' },
  { id: 'sales', size: 'half' },
  { id: 'delivery', size: 'half' },
  { id: 'finance', size: 'half' },
  { id: 'approval', size: 'half' },
  { id: 'notice', size: 'full' },
];

const STORAGE_KEY = 'bms_dashboard_layout';

function loadLayout() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_LAYOUT;
    const parsed = JSON.parse(saved);
    // 저장된 id가 레지스트리에 있는 항목만 복원
    return parsed.filter((item) => WIDGET_REGISTRY.some((w) => w.id === item.id));
  } catch {
    return DEFAULT_LAYOUT;
  }
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────
export function DashboardHome() {
  const { user } = useAuth();

  // 현재 화면 레이아웃 (편집 중에도 즉시 반영)
  const [layout, setLayout] = useState(loadLayout);
  // 편집 시작 시 저장해둔 스냅샷 (취소 시 복원용)
  const snapshotRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);

  // DnD 상태
  const draggedIdRef = useRef(null);
  const [dragOverId, setDragOverId] = useState(null);

  // ── 편집 모드 진입/종료 ──────────────────────────────
  const enterEdit = () => {
    snapshotRef.current = JSON.parse(JSON.stringify(layout));
    setIsEditing(true);
  };

  const saveEdit = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    setIsEditing(false);
    setShowCatalog(false);
    snapshotRef.current = null;
  };

  const cancelEdit = () => {
    if (snapshotRef.current) setLayout(snapshotRef.current);
    setIsEditing(false);
    setShowCatalog(false);
    snapshotRef.current = null;
  };

  const resetLayout = () => {
    setLayout(DEFAULT_LAYOUT);
    localStorage.removeItem(STORAGE_KEY);
    setIsEditing(false);
    setShowCatalog(false);
  };

  // ── 위젯 추가/제거/크기 변경 ─────────────────────────
  const handleAdd = useCallback((widgetId) => {
    const reg = WIDGET_REGISTRY.find((w) => w.id === widgetId);
    if (!reg) return;
    setLayout((prev) => [...prev, { id: widgetId, size: reg.defaultSize }]);
  }, []);

  const handleRemove = useCallback((widgetId) => {
    setLayout((prev) => prev.filter((w) => w.id !== widgetId));
  }, []);

  const handleResize = useCallback((widgetId) => {
    setLayout((prev) =>
      prev.map((w) =>
        w.id === widgetId ? { ...w, size: w.size === 'half' ? 'full' : 'half' } : w
      )
    );
  }, []);

  // ── Drag-and-Drop ─────────────────────────────────────
  const handleDragStart = useCallback((widgetId) => {
    draggedIdRef.current = widgetId;
  }, []);

  const handleDragOver = useCallback((e, targetId) => {
    e.preventDefault();
    if (draggedIdRef.current !== targetId) setDragOverId(targetId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback((e, targetId) => {
    e.preventDefault();
    const fromId = draggedIdRef.current;
    if (!fromId || fromId === targetId) {
      setDragOverId(null);
      return;
    }
    setLayout((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((w) => w.id === fromId);
      const toIdx = next.findIndex((w) => w.id === targetId);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const [removed] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, removed);
      return next;
    });
    draggedIdRef.current = null;
    setDragOverId(null);
  }, []);

  // ── 렌더 ─────────────────────────────────────────────

  // 카탈로그에 보여줄 위젯 = 레지스트리에 있지만 현재 레이아웃에 없는 것
  const activeIds = new Set(layout.map((w) => w.id));
  const availableWidgets = WIDGET_REGISTRY.filter(
    (w) =>
      !activeIds.has(w.id) &&
      (!w.permission || hasPermission(user, w.permission))
  );

  return (
    <div className={styles.dashboard}>
      {/* ── 툴바 ── */}
      <div className={styles.toolbar}>
        {isEditing ? (
          <>
            <button
              type="button"
              className={styles.catalogBtn}
              onClick={() => setShowCatalog((v) => !v)}
            >
              + 위젯 추가
            </button>
            <div className={styles.editActions}>
              <button type="button" className={styles.resetBtn} onClick={resetLayout}>
                초기화
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
            ⚙ 위젯 설정
          </button>
        )}
      </div>

      {/* ── 편집 안내 배너 ── */}
      {isEditing && (
        <div className={styles.editBanner}>
          ✦ 편집 모드 — 위젯을 드래그해 순서를 바꾸고, ½ / ⬛ 버튼으로 크기를 변경하거나 ✕ 로 제거하세요.
        </div>
      )}

      {/* ── 위젯 그리드 ── */}
      <div className={styles.widgetGrid}>
        {layout.map((item) => {
          const reg = WIDGET_REGISTRY.find((w) => w.id === item.id);
          if (!reg) return null;

          // 권한 체크
          if (reg.permission && !hasPermission(user, reg.permission)) return null;

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
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
            >
              <Component />
            </WidgetWrapper>
          );
        })}

        {/* 위젯이 하나도 없을 때 */}
        {layout.length === 0 && (
          <div className={styles.emptyState}>
            <p>대시보드에 위젯이 없습니다.</p>
            <button type="button" className={styles.catalogBtn} onClick={() => setShowCatalog(true)}>
              + 위젯 추가하기
            </button>
          </div>
        )}
      </div>

      {/* ── 위젯 카탈로그 패널 ── */}
      <WidgetCatalog
        isOpen={showCatalog}
        availableWidgets={availableWidgets}
        onAdd={(id) => { handleAdd(id); }}
        onClose={() => setShowCatalog(false)}
      />
    </div>
  );
}
