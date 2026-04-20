import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { classnames } from '../../utils/classnames';
import { IA_SIDEBAR_SECTIONS } from '../../constants/ia';
import { allChildrenAreCategoryGroups } from './sidebar.utils';

function renderLeafItem({ node, level, showStar, isFavorite, toggleFavorite, handleNavClick, styles }) {
  const Icon = node.icon;
  const isFav = isFavorite(node.path);

  return (
    <div key={node.id} className={styles.itemWrapper}>
      <NavLink
        to={node.path}
        end
        onClick={handleNavClick}
        className={({ isActive }) =>
          classnames(styles.item, level === 0 ? styles.topItem : styles.childItem, isActive && styles.active)
        }
        style={{ paddingLeft: level === 0 ? undefined : `${36 + level * 16}px` }}
        title={node.label}
      >
        {(level === 0 || Icon) && Icon && (
          <span className={styles.iconSlot} aria-hidden="true">
            <Icon size={18} strokeWidth={2} />
          </span>
        )}
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
}

function renderNode({ node, level = 0, showStar = true, openMap, toggleSection, isFavorite, toggleFavorite, handleNavClick, styles }) {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const Icon = node.icon;
  const opened = !!openMap[node.id];

  if (!hasChildren && node.path) {
    return renderLeafItem({ node, level, showStar, isFavorite, toggleFavorite, handleNavClick, styles });
  }
  if (!hasChildren) return null;

  const showAsCategoryBlocks = allChildrenAreCategoryGroups(node);

  return (
    <div key={node.id} className={styles.group}>
      <button
        type="button"
        className={classnames(styles.groupHeader, level === 0 ? styles.topGroupHeader : styles.middleGroupHeader, opened && styles.opened)}
        style={{ paddingLeft: level === 0 ? undefined : `${36 + level * 16}px` }}
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
                    className={classnames(styles.groupHeader, styles.middleGroupHeader, childOpened && styles.opened)}
                    style={{ paddingLeft: '52px' }}
                    onClick={() => toggleSection(child.id)}
                    aria-expanded={childOpened}
                    title={child.label}
                  >
                    <span className={styles.groupLabel}>{child.label}</span>
                    <span className={classnames(styles.chev, childOpened && styles.chevOpen)} aria-hidden="true">
                      <ChevronRight size={16} strokeWidth={2} />
                    </span>
                  </button>
                  <div className={classnames(styles.groupBody, childOpened ? styles.show : styles.hide)}>
                    <div className={styles.categoryItems}>
                      {child.children.map((leaf) =>
                        renderLeafItem({ node: leaf, level: 2, showStar, isFavorite, toggleFavorite, handleNavClick, styles })
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          : node.children.map((child) =>
              renderNode({ node: child, level: level + 1, showStar, openMap, toggleSection, isFavorite, toggleFavorite, handleNavClick, styles })
            )}
      </div>
    </div>
  );
}

export default function SidebarExpandedNav({
  styles,
  activeTab,
  handleTabChange,
  favoriteMenuItems,
  openMap,
  toggleSection,
  isFavorite,
  toggleFavorite,
  handleNavClick,
}) {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <div className={styles.tabs}>
        <button type="button" className={classnames(styles.tab, activeTab === 'all' && styles.tabActive)} onClick={() => handleTabChange('all')}>
          전체 메뉴
        </button>
        <button type="button" className={classnames(styles.tab, activeTab === 'favorites' && styles.tabActive)} onClick={() => handleTabChange('favorites')}>
          즐겨찾기
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'all' ? (
          <>
            {IA_SIDEBAR_SECTIONS.map((section) => (
              <div key={section.key} className={styles.section}>
                {section.divider && <div className={styles.divider} />}
                {section.items.map((top) =>
                  renderNode({ node: top, level: 0, showStar: true, openMap, toggleSection, isFavorite, toggleFavorite, handleNavClick, styles })
                )}
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
                    <NavLink to={item.path} onClick={handleNavClick} className={({ isActive }) => classnames(styles.favItem, isActive && styles.active)}>
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
  );
}
