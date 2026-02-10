import React, { useMemo, useState } from 'react';
import './App.css';

import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';

import { SiteManagementPage } from './pages/SiteManagementPage';
import { ItemManagementPage } from './pages/ItemManagementPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

import { AddSiteModal } from './components/modals/AddSiteModal';
import { AddItemModal } from './components/modals/AddItemModal';
import { DeliveryInputModal } from './components/modals/DeliveryInputModal';
import { StatusChangeModal } from './components/modals/StatusChangeModal';
import { DetailModal } from './components/modals/DetailModal';

const MANAGERS = ['홍길동', '김영희', '이순신', '강감찬'];

const STATUS = {
  PLANNED: '예정',
  IN_PROGRESS: '진행중',
  DONE: '완료',
  DELAYED: '지연',
};

const STATUS_LIST = [STATUS.PLANNED, STATUS.IN_PROGRESS, STATUS.DONE, STATUS.DELAYED];

const STATUS_META = {
  [STATUS.PLANNED]: { color: '#3498db', icon: '⏳' },
  [STATUS.IN_PROGRESS]: { color: '#f39c12', icon: '🔄' },
  [STATUS.DONE]: { color: '#27ae60', icon: '✅' },
  [STATUS.DELAYED]: { color: '#e74c3c', icon: '⚠️' },
};

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatDateTime(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  const hh = pad2(date.getHours());
  const mi = pad2(date.getMinutes());
  const ss = pad2(date.getSeconds());
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}:${ss}`;
}

function newId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

function compareIsoDate(a, b) {
  if (!a || !b) return 0;
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function diffDaysIso(a, b) {
  if (!a || !b) return 0;
  const ta = Date.parse(`${a}T00:00:00`);
  const tb = Date.parse(`${b}T00:00:00`);
  if (!Number.isFinite(ta) || !Number.isFinite(tb)) return 0;
  return Math.round((ta - tb) / (1000 * 60 * 60 * 24));
}

function todayIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/* ═══════════════════════════════════════════
   샘플 데이터 (5개 현장 + 12개 품목)
   ═══════════════════════════════════════════ */
const SAMPLE_SITES = [
  {
    id: 'site_s1',
    siteName: '강남 오피스텔 신축',
    plannedDeliveryDate: '2026-03-15',
    manager: '홍길동',
    siteStatus: STATUS.IN_PROGRESS,
    createdAt: '2026.01.10 09:00:00',
    updatedAt: '2026.02.03 14:22:10',
    items: ['item_a1', 'item_a2', 'item_a3'],
    siteHistory: [
      { action: '상태 변경', previousStatus: '예정', newStatus: '진행중', reason: '자재 발주 시작', changedBy: '홍길동', changedAt: '2026.02.03 14:22:10' },
      { action: '현장 생성', previousStatus: null, newStatus: '예정', reason: '초기 생성', changedBy: '홍길동', changedAt: '2026.01.10 09:00:00' },
    ],
  },
  {
    id: 'site_s2',
    siteName: '판교 데이터센터 증축',
    plannedDeliveryDate: '2026-02-28',
    manager: '김영희',
    siteStatus: STATUS.DELAYED,
    createdAt: '2026.01.05 10:30:00',
    updatedAt: '2026.02.05 16:00:00',
    items: ['item_b1', 'item_b2'],
    siteHistory: [
      { action: '상태 변경', previousStatus: '진행중', newStatus: '지연', reason: '자재 수급 지연 (해외 운송)', changedBy: '김영희', changedAt: '2026.02.05 16:00:00' },
      { action: '상태 변경', previousStatus: '예정', newStatus: '진행중', reason: '공사 착수', changedBy: '김영희', changedAt: '2026.01.20 11:00:00' },
      { action: '현장 생성', previousStatus: null, newStatus: '예정', reason: '초기 생성', changedBy: '김영희', changedAt: '2026.01.05 10:30:00' },
    ],
  },
  {
    id: 'site_s3',
    siteName: '수원 물류센터 리모델링',
    plannedDeliveryDate: '2026-02-10',
    manager: '이순신',
    siteStatus: STATUS.DONE,
    createdAt: '2025.12.15 08:00:00',
    updatedAt: '2026.02.06 09:30:00',
    items: ['item_c1', 'item_c2'],
    siteHistory: [
      { action: '상태 변경', previousStatus: '진행중', newStatus: '완료', reason: '모든 품목 납품 완료', changedBy: '이순신', changedAt: '2026.02.06 09:30:00' },
      { action: '상태 변경', previousStatus: '예정', newStatus: '진행중', reason: '납품 시작', changedBy: '이순신', changedAt: '2026.01.08 13:00:00' },
      { action: '현장 생성', previousStatus: null, newStatus: '예정', reason: '초기 생성', changedBy: '이순신', changedAt: '2025.12.15 08:00:00' },
    ],
  },
  {
    id: 'site_s4',
    siteName: '인천 공항 터미널 배관',
    plannedDeliveryDate: '2026-04-20',
    manager: '강감찬',
    siteStatus: STATUS.PLANNED,
    createdAt: '2026.02.01 11:00:00',
    updatedAt: '2026.02.01 11:00:00',
    items: ['item_d1', 'item_d2', 'item_d3'],
    siteHistory: [
      { action: '현장 생성', previousStatus: null, newStatus: '예정', reason: '초기 생성', changedBy: '강감찬', changedAt: '2026.02.01 11:00:00' },
    ],
  },
  {
    id: 'site_s5',
    siteName: '세종시 관사 신축 2단계',
    plannedDeliveryDate: '2026-03-30',
    manager: '홍길동',
    siteStatus: STATUS.IN_PROGRESS,
    createdAt: '2026.01.22 14:00:00',
    updatedAt: '2026.02.04 10:15:00',
    items: ['item_e1', 'item_e2'],
    siteHistory: [
      { action: '상태 변경', previousStatus: '예정', newStatus: '진행중', reason: '1차 납품 시작', changedBy: '홍길동', changedAt: '2026.02.04 10:15:00' },
      { action: '현장 생성', previousStatus: null, newStatus: '예정', reason: '초기 생성', changedBy: '홍길동', changedAt: '2026.01.22 14:00:00' },
    ],
  },
];

const SAMPLE_ITEMS = [
  /* ── 강남 오피스텔 (site_s1) ── */
  {
    id: 'item_a1', siteId: 'site_s1', itemName: 'PVC 파이프 (100mm)', quantity: 500,
    deliveredQuantity: 200, plannedDeliveryDate: '2026-03-15', actualDeliveryDate: '2026-02-02',
    itemStatus: STATUS.IN_PROGRESS, createdAt: '2026.01.10 09:10:00', updatedAt: '2026.02.02 15:00:00',
    itemHistory: [
      { action: '부분 납품', previousDeliveredQuantity: 0, newDeliveredQuantity: 200, actualDeliveryDate: '2026-02-02', changedBy: '홍길동', changedAt: '2026.02.02 15:00:00' },
      { action: '상태 변경', previousStatus: '예정', newStatus: '진행중', reason: '1차 납품', changedBy: '홍길동', changedAt: '2026.02.02 14:50:00' },
      { action: '품목 생성', changedBy: '홍길동', changedAt: '2026.01.10 09:10:00' },
    ],
  },
  {
    id: 'item_a2', siteId: 'site_s1', itemName: '동 배관 (50mm)', quantity: 300,
    deliveredQuantity: 0, plannedDeliveryDate: '2026-03-10', actualDeliveryDate: null,
    itemStatus: STATUS.PLANNED, createdAt: '2026.01.10 09:15:00', updatedAt: '2026.01.10 09:15:00',
    itemHistory: [
      { action: '품목 생성', changedBy: '홍길동', changedAt: '2026.01.10 09:15:00' },
    ],
  },
  {
    id: 'item_a3', siteId: 'site_s1', itemName: '밸브 (볼밸브 40A)', quantity: 120,
    deliveredQuantity: 50, plannedDeliveryDate: '2026-03-12', actualDeliveryDate: '2026-02-01',
    itemStatus: STATUS.IN_PROGRESS, createdAt: '2026.01.12 10:00:00', updatedAt: '2026.02.01 11:30:00',
    itemHistory: [
      { action: '부분 납품', previousDeliveredQuantity: 0, newDeliveredQuantity: 50, actualDeliveryDate: '2026-02-01', changedBy: '홍길동', changedAt: '2026.02.01 11:30:00' },
      { action: '품목 생성', changedBy: '홍길동', changedAt: '2026.01.12 10:00:00' },
    ],
  },
  /* ── 판교 데이터센터 (site_s2) ── */
  {
    id: 'item_b1', siteId: 'site_s2', itemName: '스테인리스 강관 (150mm)', quantity: 800,
    deliveredQuantity: 250, plannedDeliveryDate: '2026-02-20', actualDeliveryDate: '2026-01-25',
    itemStatus: STATUS.DELAYED, createdAt: '2026.01.05 10:40:00', updatedAt: '2026.02.05 16:10:00',
    itemHistory: [
      { action: '상태 변경', previousStatus: '진행중', newStatus: '지연', reason: '해외 운송 지연 (ETA 3주 추가)', changedBy: '김영희', changedAt: '2026.02.05 16:10:00' },
      { action: '부분 납품', previousDeliveredQuantity: 0, newDeliveredQuantity: 250, actualDeliveryDate: '2026-01-25', changedBy: '김영희', changedAt: '2026.01.25 14:00:00' },
      { action: '상태 변경', previousStatus: '예정', newStatus: '진행중', reason: '1차 입고', changedBy: '김영희', changedAt: '2026.01.25 13:50:00' },
      { action: '품목 생성', changedBy: '김영희', changedAt: '2026.01.05 10:40:00' },
    ],
  },
  {
    id: 'item_b2', siteId: 'site_s2', itemName: '냉매 배관 (R410A)', quantity: 400,
    deliveredQuantity: 0, plannedDeliveryDate: '2026-02-25', actualDeliveryDate: null,
    itemStatus: STATUS.DELAYED, createdAt: '2026.01.05 10:45:00', updatedAt: '2026.02.05 16:15:00',
    itemHistory: [
      { action: '상태 변경', previousStatus: '예정', newStatus: '지연', reason: '선적 일정 지연', changedBy: '김영희', changedAt: '2026.02.05 16:15:00' },
      { action: '품목 생성', changedBy: '김영희', changedAt: '2026.01.05 10:45:00' },
    ],
  },
  /* ── 수원 물류센터 (site_s3) — 완료 ── */
  {
    id: 'item_c1', siteId: 'site_s3', itemName: '소방 배관 (65mm)', quantity: 350,
    deliveredQuantity: 350, plannedDeliveryDate: '2026-02-08', actualDeliveryDate: '2026-02-05',
    itemStatus: STATUS.DONE, createdAt: '2025.12.15 08:10:00', updatedAt: '2026.02.05 17:00:00',
    itemHistory: [
      { action: '상태 변경', previousStatus: '진행중', newStatus: '완료', reason: '전량 납품 완료', changedBy: '이순신', changedAt: '2026.02.05 17:00:00' },
      { action: '부분 납품', previousDeliveredQuantity: 200, newDeliveredQuantity: 350, actualDeliveryDate: '2026-02-05', changedBy: '이순신', changedAt: '2026.02.05 16:50:00' },
      { action: '부분 납품', previousDeliveredQuantity: 0, newDeliveredQuantity: 200, actualDeliveryDate: '2026-01-20', changedBy: '이순신', changedAt: '2026.01.20 10:00:00' },
      { action: '상태 변경', previousStatus: '예정', newStatus: '진행중', reason: '납품 시작', changedBy: '이순신', changedAt: '2026.01.20 09:50:00' },
      { action: '품목 생성', changedBy: '이순신', changedAt: '2025.12.15 08:10:00' },
    ],
  },
  {
    id: 'item_c2', siteId: 'site_s3', itemName: '스프링클러 헤드', quantity: 200,
    deliveredQuantity: 200, plannedDeliveryDate: '2026-02-10', actualDeliveryDate: '2026-02-06',
    itemStatus: STATUS.DONE, createdAt: '2025.12.15 08:15:00', updatedAt: '2026.02.06 09:20:00',
    itemHistory: [
      { action: '상태 변경', previousStatus: '진행중', newStatus: '완료', reason: '전량 납품', changedBy: '이순신', changedAt: '2026.02.06 09:20:00' },
      { action: '부분 납품', previousDeliveredQuantity: 0, newDeliveredQuantity: 200, actualDeliveryDate: '2026-02-06', changedBy: '이순신', changedAt: '2026.02.06 09:10:00' },
      { action: '상태 변경', previousStatus: '예정', newStatus: '진행중', reason: '납품 시작', changedBy: '이순신', changedAt: '2026.02.06 09:00:00' },
      { action: '품목 생성', changedBy: '이순신', changedAt: '2025.12.15 08:15:00' },
    ],
  },
  /* ── 인천 공항 (site_s4) — 예정 ── */
  {
    id: 'item_d1', siteId: 'site_s4', itemName: '에어컨 냉매 배관 세트', quantity: 600,
    deliveredQuantity: 0, plannedDeliveryDate: '2026-04-10', actualDeliveryDate: null,
    itemStatus: STATUS.PLANNED, createdAt: '2026.02.01 11:10:00', updatedAt: '2026.02.01 11:10:00',
    itemHistory: [
      { action: '품목 생성', changedBy: '강감찬', changedAt: '2026.02.01 11:10:00' },
    ],
  },
  {
    id: 'item_d2', siteId: 'site_s4', itemName: '보온재 (25mm)', quantity: 1000,
    deliveredQuantity: 0, plannedDeliveryDate: '2026-04-15', actualDeliveryDate: null,
    itemStatus: STATUS.PLANNED, createdAt: '2026.02.01 11:15:00', updatedAt: '2026.02.01 11:15:00',
    itemHistory: [
      { action: '품목 생성', changedBy: '강감찬', changedAt: '2026.02.01 11:15:00' },
    ],
  },
  {
    id: 'item_d3', siteId: 'site_s4', itemName: '플랜지 (100A FF)', quantity: 80,
    deliveredQuantity: 0, plannedDeliveryDate: '2026-04-18', actualDeliveryDate: null,
    itemStatus: STATUS.PLANNED, createdAt: '2026.02.01 11:20:00', updatedAt: '2026.02.01 11:20:00',
    itemHistory: [
      { action: '품목 생성', changedBy: '강감찬', changedAt: '2026.02.01 11:20:00' },
    ],
  },
  /* ── 세종시 관사 (site_s5) ── */
  {
    id: 'item_e1', siteId: 'site_s5', itemName: '온수 배관 (32mm)', quantity: 450,
    deliveredQuantity: 150, plannedDeliveryDate: '2026-03-20', actualDeliveryDate: '2026-02-04',
    itemStatus: STATUS.IN_PROGRESS, createdAt: '2026.01.22 14:10:00', updatedAt: '2026.02.04 10:30:00',
    itemHistory: [
      { action: '부분 납품', previousDeliveredQuantity: 0, newDeliveredQuantity: 150, actualDeliveryDate: '2026-02-04', changedBy: '홍길동', changedAt: '2026.02.04 10:30:00' },
      { action: '상태 변경', previousStatus: '예정', newStatus: '진행중', reason: '1차 납품', changedBy: '홍길동', changedAt: '2026.02.04 10:20:00' },
      { action: '품목 생성', changedBy: '홍길동', changedAt: '2026.01.22 14:10:00' },
    ],
  },
  {
    id: 'item_e2', siteId: 'site_s5', itemName: '난방 분배기 (8구)', quantity: 30,
    deliveredQuantity: 0, plannedDeliveryDate: '2026-03-25', actualDeliveryDate: null,
    itemStatus: STATUS.PLANNED, createdAt: '2026.01.22 14:15:00', updatedAt: '2026.01.22 14:15:00',
    itemHistory: [
      { action: '품목 생성', changedBy: '홍길동', changedAt: '2026.01.22 14:15:00' },
    ],
  },
];

/**
 * delivery/plan 내부에서만 사용하는 "납품 계획 관리 앱"
 */
export default function App({ currentUserName = '홍길동', user }) {
  const [sites, setSites] = useState(SAMPLE_SITES);
  const [items, setItems] = useState(SAMPLE_ITEMS);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [activeTab, setActiveTab] = useState('site'); // site | item | history | settings

  // 설정: 수정 가능 기간 (from/to). 비어있으면 제한 없음.
  const [editWindow, setEditWindow] = useState({ from: '', to: '' });
  // 설정: 날짜 변경 가능 인원(이름 목록). 비어있으면 "관리자만" 날짜 변경 가능.
  const [dateEditors, setDateEditors] = useState([]);
  // 설정: 사용자 역할(옵션) 활성화 목록 (UI용)
  const [enabledRoles, setEnabledRoles] = useState(['admin']);
  // 설정: 시스템 설정 토글 (UI/UX용)
  const [systemSettings, setSystemSettings] = useState({
    autoSave: true,
    historyLogging: true,
    notifications: true,
  });

  // 삭제되어도 History 탭에 남기기 위한 아카이브
  const [archivedHistoryEvents, setArchivedHistoryEvents] = useState([]);

  // Modal states
  const [addSiteOpen, setAddSiteOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [deliveryInputOpen, setDeliveryInputOpen] = useState(false);
  const [statusModal, setStatusModal] = useState({ open: false, type: null, id: null });
  const [detailModal, setDetailModal] = useState({ open: false, type: null, id: null });

  const selectedSite = useMemo(
    () => sites.find((s) => s.id === selectedSiteId) || null,
    [sites, selectedSiteId]
  );

  const getItemsBySite = (siteId) => items.filter((it) => it.siteId === siteId);

  const canManageSettings = useMemo(() => {
    const role = user?.role;
    const position = String(user?.position || '');
    const perms = Array.isArray(user?.permissions) ? user.permissions : [];
    const roleOk = ['HEADQUARTERS', 'MANAGER', 'ADMIN', 'SYSTEM_ADMIN', 'SUPER_ADMIN'].includes(role);
    const permOk =
      perms.includes('MANAGE_DELIVERY') ||
      perms.includes('APPROVAL') ||
      perms.includes('ADMIN') ||
      perms.includes('SYSTEM_ADMIN') ||
      perms.includes('SUPER_ADMIN');
    const positionOk = position.includes('관리자');
    return roleOk || permOk || positionOk;
  }, [user]);

  const canEditDates = useMemo(() => {
    if (canManageSettings) return true;
    if (!dateEditors || dateEditors.length === 0) return false;
    return dateEditors.includes(currentUserName);
  }, [canManageSettings, dateEditors, currentUserName]);

  const isEditAllowedNow = useMemo(() => {
    const now = todayIso();
    const from = editWindow.from || '';
    const to = editWindow.to || '';
    if (!from && !to) return true;
    if (from && now < from) return false;
    if (to && now > to) return false;
    return true;
  }, [editWindow.from, editWindow.to]);

  const editLockedMessage = useMemo(() => {
    if (isEditAllowedNow) return '';
    const from = editWindow.from ? ` ${editWindow.from}` : '';
    const to = editWindow.to ? ` ~ ${editWindow.to}` : '';
    return `현재는 수정 가능 기간이 아닙니다.${from || to ? ` (허용 기간:${from}${to})` : ''}`;
  }, [isEditAllowedNow, editWindow.from, editWindow.to]);

  // ---- Business functions ----
  const addSite = ({ siteName, plannedDeliveryDate, manager }) => {
    if (!isEditAllowedNow) { window.alert(editLockedMessage || '현재는 수정할 수 없습니다.'); return; }
    const now = formatDateTime();
    const siteId = newId('site');
    const site = {
      id: siteId, siteName, plannedDeliveryDate, manager,
      siteStatus: STATUS.PLANNED, createdAt: now, updatedAt: now, items: [],
      siteHistory: [{ action: '현장 생성', previousStatus: null, newStatus: STATUS.PLANNED, reason: '초기 생성', changedBy: currentUserName, changedAt: now }],
    };
    setSites((prev) => [site, ...prev]);
    setSelectedSiteId(siteId);
    setActiveTab('item');
  };

  const addItemToSite = (siteId, { itemName, quantity, plannedDeliveryDate }) => {
    if (!isEditAllowedNow) { window.alert(editLockedMessage || '현재는 수정할 수 없습니다.'); return; }
    const site = sites.find((s) => s.id === siteId);
    if (!site) return;
    const now = formatDateTime();
    const itemId = newId('item');
    const planned = plannedDeliveryDate || site.plannedDeliveryDate;
    const item = {
      id: itemId, siteId, itemName, quantity, deliveredQuantity: 0,
      plannedDeliveryDate: planned, actualDeliveryDate: null,
      itemStatus: STATUS.PLANNED, createdAt: now, updatedAt: now,
      itemHistory: [{ action: '품목 생성', changedBy: currentUserName, changedAt: now }],
    };
    setItems((prev) => [item, ...prev]);
    setSites((prev) => prev.map((s) => s.id === siteId ? { ...s, items: [...s.items, itemId], updatedAt: now } : s));
  };

  const updateItemDelivery = (itemId, deliveredQty, actualDate) => {
    if (!isEditAllowedNow) { window.alert(editLockedMessage || '현재는 수정할 수 없습니다.'); return; }
    const now = formatDateTime();
    setItems((prev) => prev.map((it) => {
      if (it.id !== itemId) return it;
      const remaining = it.quantity - it.deliveredQuantity;
      const qty = Number(deliveredQty);
      if (!Number.isFinite(qty) || qty <= 0 || qty > remaining) return it;
      const nextDelivered = it.deliveredQuantity + qty;
      return {
        ...it, deliveredQuantity: nextDelivered, actualDeliveryDate: actualDate, updatedAt: now,
        itemHistory: [{ action: '부분 납품', previousDeliveredQuantity: it.deliveredQuantity, newDeliveredQuantity: nextDelivered, actualDeliveryDate: actualDate, changedBy: currentUserName, changedAt: now }, ...it.itemHistory],
      };
    }));
  };

  const changeItemStatus = (itemId, newStatus, reason) => {
    if (!isEditAllowedNow) { window.alert(editLockedMessage || '현재는 수정할 수 없습니다.'); return; }
    const now = formatDateTime();
    setItems((prev) => prev.map((it) => {
      if (it.id !== itemId || it.itemStatus === newStatus) return it;
      return {
        ...it, itemStatus: newStatus, updatedAt: now,
        itemHistory: [{ action: '상태 변경', previousStatus: it.itemStatus, newStatus, reason, changedBy: currentUserName, changedAt: now }, ...it.itemHistory],
      };
    }));
  };

  const changeSiteStatus = (siteId, newStatus, reason) => {
    if (!isEditAllowedNow) { window.alert(editLockedMessage || '현재는 수정할 수 없습니다.'); return; }
    const now = formatDateTime();
    setSites((prev) => prev.map((s) => {
      if (s.id !== siteId || s.siteStatus === newStatus) return s;
      return {
        ...s, siteStatus: newStatus, updatedAt: now,
        siteHistory: [{ action: '상태 변경', previousStatus: s.siteStatus, newStatus, reason, changedBy: currentUserName, changedAt: now }, ...s.siteHistory],
      };
    }));
  };

  const deleteItem = (itemId) => {
    if (!isEditAllowedNow) { window.alert(editLockedMessage || '현재는 수정할 수 없습니다.'); return; }
    const target = items.find((x) => x.id === itemId);
    if (!target) return;
    setArchivedHistoryEvents((prev) => {
      const site = sites.find((s) => s.id === target.siteId);
      const siteName = site?.siteName ?? '(삭제된 현장)';
      const events = (target.itemHistory || []).map((h, idx) => ({ id: `arch_item_${itemId}_${idx}`, type: 'item', siteId: target.siteId, siteName, itemId, itemName: target.itemName, ...h }));
      return [...events, ...prev];
    });
    setItems((prev) => prev.filter((x) => x.id !== itemId));
    setSites((prev) => prev.map((s) => s.id === target.siteId ? { ...s, items: s.items.filter((id) => id !== itemId) } : s));
  };

  const deleteSite = (siteId) => {
    if (!isEditAllowedNow) { window.alert(editLockedMessage || '현재는 수정할 수 없습니다.'); return; }
    const site = sites.find((s) => s.id === siteId);
    if (!site) return;
    setArchivedHistoryEvents((prev) => {
      const siteEvents = (site.siteHistory || []).map((h, idx) => ({ id: `arch_site_${siteId}_${idx}`, type: 'site', siteId, siteName: site.siteName, ...h }));
      const siteItems = items.filter((it) => it.siteId === siteId);
      const itemEvents = siteItems.flatMap((it) => (it.itemHistory || []).map((h, idx) => ({ id: `arch_item_${it.id}_${idx}`, type: 'item', siteId, siteName: site.siteName, itemId: it.id, itemName: it.itemName, ...h })));
      return [...siteEvents, ...itemEvents, ...prev];
    });
    setSites((prev) => prev.filter((s) => s.id !== siteId));
    setItems((prev) => prev.filter((it) => it.siteId !== siteId));
    setSelectedSiteId((cur) => (cur === siteId ? null : cur));
  };

  const getHistoryEvents = (filter = {}) => {
    const { siteId, type, changedBy } = filter;
    const types = Array.isArray(type) ? type : type ? [type] : null;
    const siteMap = new Map(sites.map((s) => [s.id, s.siteName]));
    const siteEvents = sites.flatMap((s) => (s.siteHistory || []).map((h, idx) => ({ id: `site_${s.id}_${idx}_${h.changedAt}`, type: 'site', siteId: s.id, siteName: s.siteName, ...h })));
    const itemEvents = items.flatMap((it) => {
      const sName = siteMap.get(it.siteId) || '(삭제된 현장)';
      return (it.itemHistory || []).map((h, idx) => ({ id: `item_${it.id}_${idx}_${h.changedAt}`, type: 'item', siteId: it.siteId, siteName: sName, itemId: it.id, itemName: it.itemName, ...h }));
    });
    const all = [...archivedHistoryEvents, ...siteEvents, ...itemEvents];
    const filtered = all.filter((e) => {
      if (siteId && e.siteId !== siteId) return false;
      if (types && !types.includes(e.type)) return false;
      if (changedBy && e.changedBy !== changedBy) return false;
      return true;
    });
    const toTs = (s) => {
      if (!s) return 0;
      const m = /^(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(s);
      if (!m) return 0;
      const [, y, mo, d, h, mi, se] = m;
      return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(se)).getTime();
    };
    filtered.sort((a, b) => toTs(b.changedAt) - toTs(a.changedAt));
    return filtered;
  };

  // ---- UI computed ----
  const historyEvents = useMemo(() => getHistoryEvents(), [sites, items, archivedHistoryEvents]);
  const changedByOptions = useMemo(() => {
    const set = new Set();
    historyEvents.forEach((e) => set.add(e.changedBy));
    return Array.from(set).filter(Boolean);
  }, [historyEvents]);

  // ---- Handlers for modals ----
  const openSiteDetail = (siteId) => setDetailModal({ open: true, type: 'site', id: siteId });
  const openItemDetail = (itemId) => setDetailModal({ open: true, type: 'item', id: itemId });
  const openSiteStatus = (siteId) => setStatusModal({ open: true, type: 'site', id: siteId });
  const openItemStatus = (itemId) => setStatusModal({ open: true, type: 'item', id: itemId });

  const [deliveryItemId, setDeliveryItemId] = useState(null);
  const deliveryItem = useMemo(() => items.find((x) => x.id === deliveryItemId) || null, [items, deliveryItemId]);
  const deliveryItemSite = useMemo(() => (deliveryItem ? sites.find((s) => s.id === deliveryItem.siteId) || null : null), [deliveryItem, sites]);

  const statusTargetSite = useMemo(() => {
    if (statusModal.type === 'site') return sites.find((s) => s.id === statusModal.id) || null;
    if (statusModal.type === 'item') { const it = items.find((i) => i.id === statusModal.id); return it ? sites.find((s) => s.id === it.siteId) || null : null; }
    return null;
  }, [statusModal, sites, items]);

  const statusTargetItem = useMemo(() => {
    if (statusModal.type !== 'item') return null;
    return items.find((i) => i.id === statusModal.id) || null;
  }, [statusModal, items]);

  const detailTargetSite = useMemo(() => {
    if (detailModal.type === 'site') return sites.find((s) => s.id === detailModal.id) || null;
    if (detailModal.type === 'item') { const it = items.find((i) => i.id === detailModal.id); return it ? sites.find((s) => s.id === it.siteId) || null : null; }
    return null;
  }, [detailModal, sites, items]);

  const detailTargetItem = useMemo(() => {
    if (detailModal.type !== 'item') return null;
    return items.find((i) => i.id === detailModal.id) || null;
  }, [detailModal, items]);

  const openDeliveryModal = (itemId) => {
    if (!isEditAllowedNow) { window.alert(editLockedMessage || '현재는 수정할 수 없습니다.'); return; }
    setDeliveryItemId(itemId);
    setDeliveryInputOpen(true);
  };

  // Render
  return (
    <div className="dpmApp">
      <Header title="📦 납품 계획 관리 시스템" userName={currentUserName} />
      <div className="dpmMain">
        <TabNavigation activeTab={activeTab} onChange={setActiveTab} />

        {!isEditAllowedNow && (
          <div className="dpmLockBanner" role="status">🔒 {editLockedMessage}</div>
        )}

        {activeTab === 'site' ? (
          <SiteManagementPage
            sites={sites} statusMeta={STATUS_META}
            onCreateSite={isEditAllowedNow ? () => setAddSiteOpen(true) : null}
            onSelectSite={(siteId) => { setSelectedSiteId(siteId); setActiveTab('item'); }}
            onViewSite={openSiteDetail} onChangeStatus={openSiteStatus} onDeleteSite={deleteSite}
          />
        ) : activeTab === 'item' ? (
          <ItemManagementPage
            sites={sites} items={items} selectedSiteId={selectedSiteId}
            onSelectSite={setSelectedSiteId}
            onAddItem={isEditAllowedNow ? () => setAddItemOpen(true) : null}
            onViewItem={openItemDetail} onDeliveryInput={openDeliveryModal}
            onChangeItemStatus={openItemStatus} onDeleteItem={deleteItem}
            statusMeta={STATUS_META} compareIsoDate={compareIsoDate} diffDaysIso={diffDaysIso}
          />
        ) : activeTab === 'history' ? (
          <HistoryPage sites={sites} changedByOptions={changedByOptions} getHistoryEvents={getHistoryEvents} />
        ) : (
          <SettingsPage
            canManage={canManageSettings} editWindow={editWindow}
            onSave={(next) => setEditWindow(next)}
            dateEditors={dateEditors}
            editorOptions={Array.from(new Set([currentUserName, ...MANAGERS])).filter(Boolean)}
            onSaveDateEditors={(next) => setDateEditors(next)}
            enabledRoles={enabledRoles} onSaveEnabledRoles={(next) => setEnabledRoles(next)}
            systemSettings={systemSettings} onSaveSystemSettings={(next) => setSystemSettings(next)}
          />
        )}
      </div>

      {/* Modals */}
      <AddSiteModal open={addSiteOpen} managers={MANAGERS} canEditDates={canEditDates}
        onClose={() => setAddSiteOpen(false)}
        onCreate={(data) => { addSite(data); setAddSiteOpen(false); }}
      />
      <AddItemModal open={addItemOpen} site={selectedSite} canEditDates={canEditDates}
        onClose={() => setAddItemOpen(false)}
        onAdd={(data) => { if (!selectedSiteId) return; addItemToSite(selectedSiteId, data); setAddItemOpen(false); }}
      />
      <DeliveryInputModal open={deliveryInputOpen} item={deliveryItem} site={deliveryItemSite}
        canEditDates={canEditDates} onClose={() => setDeliveryInputOpen(false)}
        onSave={({ deliveredQty, actualDate }) => { if (!deliveryItem) return; updateItemDelivery(deliveryItem.id, deliveredQty, actualDate); setDeliveryInputOpen(false); }}
        compareIsoDate={compareIsoDate}
      />
      <StatusChangeModal open={statusModal.open} type={statusModal.type}
        site={statusTargetSite} item={statusTargetItem}
        statusList={STATUS_LIST} statusMeta={STATUS_META}
        onClose={() => setStatusModal({ open: false, type: null, id: null })}
        onSave={({ newStatus, reason }) => {
          if (statusModal.type === 'site') changeSiteStatus(statusModal.id, newStatus, reason);
          if (statusModal.type === 'item') changeItemStatus(statusModal.id, newStatus, reason);
          setStatusModal({ open: false, type: null, id: null });
        }}
      />
      <DetailModal open={detailModal.open} type={detailModal.type}
        site={detailTargetSite} item={detailTargetItem}
        itemsBySite={detailModal.type === 'site' && detailModal.id ? getItemsBySite(detailModal.id) : []}
        statusMeta={STATUS_META} compareIsoDate={compareIsoDate} diffDaysIso={diffDaysIso}
        onClose={() => setDetailModal({ open: false, type: null, id: null })}
      />
    </div>
  );
}
