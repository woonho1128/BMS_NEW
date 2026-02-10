import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, PanelLeftClose, PanelLeft, Pin, PinOff, LogOut, Star, MoreVertical } from 'lucide-react';
import { useAuth } from '../../../modules/auth/hooks/useAuth';
import { classnames } from '../../utils/classnames';
import styles from './Sidebar.module.css';
import { ROUTES } from '../../../router/routePaths';
import { IA_SIDEBAR_SECTIONS } from '../../constants/ia';
import { Modal } from '../Modal/Modal';

function isPathActive(locationPath, targetPath) {
  if (!targetPath) return false;
  if (targetPath === '/') return locationPath === '/';
  return locationPath === targetPath || locationPath.startsWith(targetPath + '/');
}

function allChildrenAreCategoryGroups(node) {
  if (!Array.isArray(node.children) || node.children.length === 0) return false;
  return node.children.every(
    (c) => Array.isArray(c.children) && c.children.length > 0 && c.children.every((g) => !g.children || g.children.length === 0)
  );
}

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
      setPwError('새 비밀번호를 4자 이상 입력하세요.');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('새 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    // Mock 처리
    setPwModalOpen(false);
    alert('비밀번호가 변경되었습니다. (Mock)');
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

  const renderLeafItem = (node, level, showStar = true) => {
    const Icon = node.icon;
    const isFav = isFavorite(node.path);

    return (
      <div key={node.id} className={styles.itemWrapper}>
        <NavLink
          to={node.path}
          end={node.path === '/'}
          onClick={handleNavClick}
          className={({ isActive }) =>
            classnames(
              styles.item,
              level === 0 ? styles.topItem : styles.childItem,
              isActive && styles.active
            )
          }
          title={node.label}
        >
          {(level === 0 || Icon) && Icon && (
            <span className={styles.iconSlot} aria-hidden="true">
              <Icon size={18} strokeWidth={2} />
            </span>
          )}
          {level > 0 && !Icon && <span className={styles.iconSlot} aria-hidden="true" />}
          <span className={styles.label}>{node.label}</span>
        </NavLink>
        {showStar && node.path && (
          <button
            type="button"
            className={classnames(styles.starBtn, isFav && styles.starBtnActive)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(node);
            }}
            aria-label={isFav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            title={isFav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            <Star size={16} fill={isFav ? '#FFD700' : 'none'} color={isFav ? '#FFD700' : '#94a3b8'} />
          </button>
        )}
      </div>
    );
  };

  const renderNode = (node, level = 0, showStar = true) => {
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const Icon = node.icon;
    const opened = !!openMap[node.id];

    if (!hasChildren && node.path) {
      return renderLeafItem(node, level, showStar);
    }

    if (!hasChildren) return null;

    const showAsCategoryBlocks = allChildrenAreCategoryGroups(node);

    return (
      <div key={node.id} className={styles.group}>
        <button
          type="button"
          className={classnames(
            styles.groupHeader,
            level === 0 ? styles.topGroupHeader : styles.middleGroupHeader,
            opened && styles.opened
          )}
          onClick={() => toggleSection(node.id)}
          aria-expanded={opened}
          title={node.label}
        >
          {level === 0 && Icon && (
            <span className={styles.iconSlot} aria-hidden="true">
              <Icon size={18} strokeWidth={2} />
            </span>
          )}
          <span className={styles.groupLabel}>{node.label}</span>
          <span className={classnames(styles.chev, opened && styles.chevOpen)} aria-hidden="true">
            <ChevronRight size={16} strokeWidth={2} />
          </span>
        </button>
        <div className={classnames(styles.groupBody, opened ? styles.show : styles.hide)}>
          {showAsCategoryBlocks
            ? node.children.map((child) => {
                const childOpened = !!openMap[child.id];
                return (
                  <div key={child.id} className={classnames(styles.group, styles.nestedGroup)}>
                    <button
                      type="button"
                      className={classnames(
                        styles.groupHeader,
                        styles.middleGroupHeader,
                        childOpened && styles.opened
                      )}
                      onClick={() => toggleSection(child.id)}
                      aria-expanded={childOpened}
                      title={child.label}
                    >
                      <span className={styles.iconSlot} aria-hidden="true" />
                      <span className={styles.groupLabel}>{child.label}</span>
                      <span
                        className={classnames(styles.chev, childOpened && styles.chevOpen)}
                        aria-hidden="true"
                      >
                        <ChevronRight size={16} strokeWidth={2} />
                      </span>
                    </button>
                    <div
                      className={classnames(
                        styles.groupBody,
                        childOpened ? styles.show : styles.hide
                      )}
                    >
                      <div className={styles.categoryItems}>
                        {child.children.map((leaf) => renderLeafItem(leaf, 1, showStar))}
                      </div>
                    </div>
                  </div>
                );
              })
            : node.children.map((child) => renderNode(child, level + 1, showStar))}
        </div>
      </div>
    );
  };

  // 모든 메뉴 항목을 재귀적으로 수집하는 함수
  const collectAllMenuItems = useCallback((nodes, result = []) => {
    nodes.forEach((node) => {
      if (node.path) {
        result.push(node);
      }
      if (node.children) {
        collectAllMenuItems(node.children, result);
      }
    });
    return result;
  }, []);

  // 즐겨찾기 항목만 필터링하여 메뉴 구조로 변환
  const favoriteMenuItems = useMemo(() => {
    const allItems = [];
    IA_SIDEBAR_SECTIONS.forEach((section) => {
      collectAllMenuItems(section.items, allItems);
    });

    const favoritePaths = new Set(favorites.map((fav) => fav.path));
    return allItems.filter((item) => favoritePaths.has(item.path));
  }, [favorites, collectAllMenuItems]);

  /** 접힌 상태: 대분류만 아이콘으로 표시 */
  const renderCollapsedNav = () => (
    <div className={styles.collapsedNav}>
      <div className={styles.favCollapsed} title="즐겨찾기">
        <Star size={18} color="#FFD700" />
      </div>
      {IA_SIDEBAR_SECTIONS.map((section) => (
        <React.Fragment key={section.key}>
          {section.divider && <div className={styles.divider} />}
          {section.items.map((node) => {
            if (node.path) {
              const Icon = node.icon;
              return (
                <NavLink
                  key={node.id}
                  to={node.path}
                  end={node.path === '/'}
                  onClick={handleNavClick}
                  className={({ isActive }) => classnames(styles.collapsedItem, isActive && styles.active)}
                  title={node.label}
                >
                  {Icon && <Icon size={20} strokeWidth={2} />}
                </NavLink>
              );
            }
            const Icon = node.icon;
            return (
              <button
                key={node.id}
                type="button"
                className={styles.collapsedItem}
                onClick={() => onToggle?.()}
                title={node.label}
              >
                {Icon && <Icon size={20} strokeWidth={2} />}
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      <aside
        className={classnames(styles.sidebar, isOpen && styles.sidebarExpanded)}
        aria-expanded={isOpen}
      >
      {/* 1. 상단: 로고 & 컨트롤 (Toggle, Pin) */}
      <div className={styles.top}>
        <div className={styles.brand}>
          <button
            type="button"
            className={styles.brandMark}
            onClick={goDashboard}
            aria-label="대시보드로 이동"
            title="대시보드"
          >
            <img className={styles.brandLogoImg} src="/logo.png" alt="회사 로고" />
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
              aria-label={pinned ? '고정 해제' : '고정'}
              aria-pressed={pinned}
              title={pinned ? '고정 해제' : '고정'}
            >
              {pinned ? <PinOff size={20} /> : <Pin size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* 2. 중간: 메뉴 (flex-1, overflow-y-auto) */}
      <div className={styles.navWrap}>
        {isOpen ? (
          <nav className={styles.nav} aria-label="Primary">
            {/* 탭 전환 UI */}
            <div className={styles.tabs}>
              <button
                type="button"
                className={classnames(styles.tab, activeTab === 'all' && styles.tabActive)}
                onClick={() => handleTabChange('all')}
              >
                전체 메뉴
              </button>
              <button
                type="button"
                className={classnames(styles.tab, activeTab === 'favorites' && styles.tabActive)}
                onClick={() => handleTabChange('favorites')}
              >
                즐겨찾기
              </button>
            </div>

            {/* 탭별 콘텐츠 */}
            <div className={styles.tabContent}>
              {activeTab === 'all' ? (
                <>
                  {IA_SIDEBAR_SECTIONS.map((section) => (
                    <div key={section.key} className={styles.section}>
                      {section.divider && <div className={styles.divider} />}
                      {section.items.map((top) => renderNode(top, 0, true))}
                    </div>
                  ))}
                </>
              ) : (
                <div className={styles.section}>
                  {favoriteMenuItems.length === 0 ? (
                    <div className={styles.favEmpty}>등록된 즐겨찾기가 없습니다.</div>
                  ) : (
                    <div className={styles.favList}>
                      {favoriteMenuItems.map((item) => (
                        <div key={item.id} className={styles.favItemWrapper}>
                          <NavLink
                            to={item.path}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                              classnames(styles.favItem, isActive && styles.active)
                            }
                          >
                            {item.icon && (
                              <span className={styles.iconSlot} aria-hidden="true">
                                <item.icon size={16} strokeWidth={2} />
                              </span>
                            )}
                            <span>{item.label}</span>
                          </NavLink>
                          <button
                            type="button"
                            className={classnames(styles.starBtn, styles.starBtnActive)}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(item);
                            }}
                            aria-label="즐겨찾기 해제"
                            title="즐겨찾기 해제"
                          >
                            <Star size={16} fill="#FFD700" color="#FFD700" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        ) : (
          renderCollapsedNav()
        )}
      </div>

      {/* 3. 하단: 사용자 정보 + 메뉴 */}
      <div className={styles.userPanel} ref={userMenuRef}>
        <div className={styles.userPanelInfo}>
          <div className={styles.userPanelName}>{user?.name ?? '-'}</div>
          <div className={styles.userPanelSub}>
            {(user?.position ?? '직원')}{user?.role ? ` / ${user.role}` : ''}
          </div>
        </div>
        <button
          type="button"
          className={styles.userPanelMenuBtn}
          onClick={() => setUserMenuOpen((v) => !v)}
          aria-label="사용자 메뉴"
          title="사용자 메뉴"
        >
          <MoreVertical size={18} />
        </button>

        {userMenuOpen && (
          <div className={styles.userDropdown} role="menu" aria-label="사용자 메뉴">
            <button type="button" className={styles.userDropdownItem} onClick={openChangePassword} role="menuitem">
              비밀번호 변경
            </button>
            <button
              type="button"
              className={classnames(styles.userDropdownItem, styles.userDropdownDanger)}
              onClick={() => {
                setUserMenuOpen(false);
                handleLogout();
              }}
              role="menuitem"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </aside>

    <Modal open={pwModalOpen} onClose={() => setPwModalOpen(false)} title="비밀번호 변경" size="sm">
      <form className={styles.pwForm} onSubmit={submitChangePassword}>
        <label className={styles.pwField}>
          <span className={styles.pwLabel}>현재 비밀번호</span>
          <input
            className={styles.pwInput}
            type="password"
            value={pwForm.current}
            onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
            autoComplete="current-password"
          />
        </label>
        <label className={styles.pwField}>
          <span className={styles.pwLabel}>새 비밀번호</span>
          <input
            className={styles.pwInput}
            type="password"
            value={pwForm.next}
            onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
            autoComplete="new-password"
          />
        </label>
        <label className={styles.pwField}>
          <span className={styles.pwLabel}>새 비밀번호 확인</span>
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
            취소
          </button>
          <button type="submit" className={classnames(styles.pwBtn, styles.pwBtnPrimary)}>
            변경
          </button>
        </div>
      </form>
    </Modal>
    </>
  );
}
