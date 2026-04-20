import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PanelLeftClose, PanelLeft, Pin, PinOff } from 'lucide-react';
import { useAuth } from '../../../modules/auth/hooks/useAuth';
import { classnames } from '../../utils/classnames';
import styles from './Sidebar.module.css';
import { ROUTES } from '../../../router/routePaths';
import { IA_SIDEBAR_SECTIONS } from '../../constants/ia';
import { Modal } from '../Modal/Modal';
import { notify } from '../../utils/notify';
import SidebarExpandedNav from './SidebarExpandedNav';
import SidebarCollapsedNav from './SidebarCollapsedNav';
import SidebarUserPanel from './SidebarUserPanel';
import { collectAllMenuItems, isPathActive } from './sidebar.utils';

export function Sidebar({ isOpen, pinned, onToggle, onTogglePin, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [openMap, setOpenMap] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const userMenuRef = useRef(null);

  const userKey = user?.id ? String(user.id) : 'guest';

  const loadFavorites = useCallback(() => {
    try {
      const raw = localStorage.getItem(`favorites_${userKey}`);
      const parsed = raw ? JSON.parse(raw) : [];
      setFavorites(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setFavorites([]);
    }
  }, [userKey]);

  const loadActiveTab = useCallback(() => {
    try {
      const saved = localStorage.getItem(`sidebar_tab_${userKey}`);
      if (saved === 'all' || saved === 'favorites') {
        setActiveTab(saved);
      }
    } catch (e) {
      // ignore
    }
  }, [userKey]);

  useEffect(() => {
    loadFavorites();
    loadActiveTab();
  }, [loadFavorites, loadActiveTab]);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.userId && String(e.detail.userId) !== userKey) return;
      loadFavorites();
    };
    const storageHandler = (e) => {
      if (e.key === `favorites_${userKey}`) loadFavorites();
    };
    window.addEventListener('favorites-updated', handler);
    window.addEventListener('storage', storageHandler);
    return () => {
      window.removeEventListener('favorites-updated', handler);
      window.removeEventListener('storage', storageHandler);
    };
  }, [loadFavorites, userKey]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem(`sidebar_tab_${userKey}`, tab);
    } catch (e) {
      // ignore
    }
  }, [userKey]);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const goDashboard = () => {
    navigate(ROUTES.HOME);
    if (typeof onClose === 'function') onClose();
  };

  useEffect(() => {
    if (!userMenuOpen) return;
    const onDocMouseDown = (e) => {
      const el = userMenuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [userMenuOpen]);

  const openChangePassword = () => {
    setUserMenuOpen(false);
    setPwError('');
    setPwForm({ current: '', next: '', confirm: '' });
    setPwModalOpen(true);
  };

  const submitChangePassword = (e) => {
    e.preventDefault();
    if (!pwForm.next || pwForm.next.length < 4) {
      setPwError('??鍮꾨?踰덊샇瑜?4???댁긽 ?낅젰?섏꽭??');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('??鍮꾨?踰덊샇 ?뺤씤???쇱튂?섏? ?딆뒿?덈떎.');
      return;
    }
    // Mock 泥섎━
    setPwModalOpen(false);
    notify.success('鍮꾨?踰덊샇媛 蹂寃쎈릺?덉뒿?덈떎. (紐⑹뾽)');
  };

  const autoOpenIds = useMemo(() => {
    const ids = new Set();
    const checkNode = (node, parentIds = []) => {
      if (node.path && isPathActive(location.pathname, node.path)) {
        parentIds.forEach((pid) => ids.add(pid));
      }
      if (node.children) {
        node.children.forEach((child) => {
          const newParentIds = [...parentIds, node.id];
          if (child.path && isPathActive(location.pathname, child.path)) {
            newParentIds.forEach((pid) => ids.add(pid));
          }
          if (child.children) {
            child.children.forEach((grandchild) => {
              if (grandchild.path && isPathActive(location.pathname, grandchild.path)) {
                newParentIds.forEach((pid) => ids.add(pid));
                ids.add(child.id);
              }
            });
          }
        });
      }
    };
    IA_SIDEBAR_SECTIONS.forEach((section) => {
      section.items.forEach((top) => checkNode(top));
    });
    return ids;
  }, [location.pathname]);

  useEffect(() => {
    setOpenMap((prev) => {
      const next = { ...prev };
      autoOpenIds.forEach((id) => {
        next[id] = true;
      });
      return next;
    });
  }, [autoOpenIds]);

  const toggleSection = (id) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavClick = () => {
    if (typeof onClose === 'function') onClose();
  };

  const isFavorite = useCallback((path) => {
    return favorites.some((fav) => fav.path === path);
  }, [favorites]);

  const toggleFavorite = useCallback((node) => {
    if (!node.path) return;

    const favIndex = favorites.findIndex((fav) => fav.path === node.path);
    let newFavorites;

    if (favIndex >= 0) {
      newFavorites = favorites.filter((_, idx) => idx !== favIndex);
    } else {
      newFavorites = [...favorites, { path: node.path, label: node.label }];
    }

    setFavorites(newFavorites);
    try {
      localStorage.setItem(`favorites_${userKey}`, JSON.stringify(newFavorites));
      window.dispatchEvent(
        new CustomEvent('favorites-updated', {
          detail: { userId: userKey, favorites: newFavorites },
        })
      );
    } catch (e) {
      // ignore
    }
  }, [favorites, userKey]);

  const favoriteMenuItems = useMemo(() => {
    const allItems = [];
    IA_SIDEBAR_SECTIONS.forEach((section) => {
      collectAllMenuItems(section.items, allItems);
    });

    const favoritePaths = new Set(favorites.map((fav) => fav.path));
    return allItems.filter((item) => favoritePaths.has(item.path));
  }, [favorites]);

  return (
    <>
      <aside
        className={classnames(styles.sidebar, isOpen && styles.sidebarExpanded)}
        aria-expanded={isOpen}
      >
        {/* 1. ?곷떒: 濡쒓퀬 & 而⑦듃濡?(Toggle, Pin) */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <button
              type="button"
              className={styles.brandMark}
              onClick={goDashboard}
              aria-label="대시보드로 이동"
              title="대시보드"
            >
              <img className={styles.brandLogoImg} src="/logo.png" alt="?뚯궗 濡쒓퀬" />
            </button>
          </div>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={onToggle}
              aria-label={isOpen ? '사이드바 접기' : '사이드바 펼치기'}
              title={isOpen ? '사이드바 접기' : '사이드바 펼치기'}
            >
              {isOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>
            {isOpen && (
              <button
                type="button"
                className={classnames(styles.controlBtn, pinned && styles.controlBtnActive)}
                onClick={onTogglePin}
                aria-label={pinned ? '怨좎젙 ?댁젣' : '怨좎젙'}
                aria-pressed={pinned}
                title={pinned ? '怨좎젙 ?댁젣' : '怨좎젙'}
              >
                {pinned ? <PinOff size={20} /> : <Pin size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* 2. 以묎컙: 硫붾돱 (flex-1, overflow-y-auto) */}
        <div className={styles.navWrap}>
          {isOpen ? (
            <SidebarExpandedNav
              styles={styles}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              favoriteMenuItems={favoriteMenuItems}
              openMap={openMap}
              toggleSection={toggleSection}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              handleNavClick={handleNavClick}
            />
          ) : (
            <SidebarCollapsedNav
              styles={styles}
              handleNavClick={handleNavClick}
              onToggle={onToggle}
            />
          )}
        </div>

        {/* 3. ?섎떒: ?ъ슜???뺣낫 + 硫붾돱 */}
        <SidebarUserPanel
          styles={styles}
          user={user}
          userMenuRef={userMenuRef}
          userMenuOpen={userMenuOpen}
          setUserMenuOpen={setUserMenuOpen}
          openChangePassword={openChangePassword}
          handleLogout={handleLogout}
        />
      </aside>

      <Modal open={pwModalOpen} onClose={() => setPwModalOpen(false)} title="비밀번호 변경" size="sm">
        <form className={styles.pwForm} onSubmit={submitChangePassword}>
          <label className={styles.pwField}>
            <span className={styles.pwLabel}>?꾩옱 鍮꾨?踰덊샇</span>
            <input
              className={styles.pwInput}
              type="password"
              value={pwForm.current}
              onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
              autoComplete="current-password"
            />
          </label>
          <label className={styles.pwField}>
            <span className={styles.pwLabel}>??鍮꾨?踰덊샇</span>
            <input
              className={styles.pwInput}
              type="password"
              value={pwForm.next}
              onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
              autoComplete="new-password"
            />
          </label>
          <label className={styles.pwField}>
            <span className={styles.pwLabel}>??鍮꾨?踰덊샇 ?뺤씤</span>
            <input
              className={styles.pwInput}
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
              autoComplete="new-password"
            />
          </label>
          {pwError && <div className={styles.pwError}>{pwError}</div>}
          <div className={styles.pwActions}>
            <button type="button" className={styles.pwBtn} onClick={() => setPwModalOpen(false)}>
              痍⑥냼
            </button>
            <button type="submit" className={classnames(styles.pwBtn, styles.pwBtnPrimary)}>
              蹂寃?
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

