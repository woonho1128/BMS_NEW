import React from 'react';
import { NavLink } from 'react-router-dom';
import { Star } from 'lucide-react';
import { classnames } from '../../utils/classnames';
import { IA_SIDEBAR_SECTIONS } from '../../constants/ia';

export default function SidebarCollapsedNav({ styles, handleNavClick, onToggle }) {
  return (
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
              <button key={node.id} type="button" className={styles.collapsedItem} onClick={() => onToggle?.()} title={node.label}>
                {Icon && <Icon size={20} strokeWidth={2} />}
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
