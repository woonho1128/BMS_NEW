import React from 'react';
import { MoreVertical } from 'lucide-react';
import { classnames } from '../../utils/classnames';

export default function SidebarUserPanel({
  styles,
  user,
  userMenuRef,
  userMenuOpen,
  setUserMenuOpen,
  openChangePassword,
  handleLogout,
}) {
  return (
    <div className={styles.userPanel} ref={userMenuRef}>
      <div className={styles.userPanelInfo}>
        <div className={styles.userPanelName}>{user?.name ?? '-'}</div>
        <div className={styles.userPanelSub}>{(user?.position ?? '직원')}{user?.role ? ` / ${user.role}` : ''}</div>
      </div>
      <button type="button" className={styles.userPanelMenuBtn} onClick={() => setUserMenuOpen((v) => !v)} aria-label="사용자 메뉴" title="사용자 메뉴">
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
  );
}
