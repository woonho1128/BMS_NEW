import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../modules/auth/hooks/useAuth';
import { ROUTES } from '../../../router/routePaths';
import './TopRightPanelReset.css';

/**
 * 우측 상단 패널 (정확한 HTML 구조)
 */
export function TopRightPanel() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [badgeCount, setBadgeCount] = useState(3);

  // Optional realtime badge update hook
  useEffect(() => {
    const onCount = (e) => {
      const next = Number(e?.detail?.count);
      if (Number.isFinite(next)) setBadgeCount(Math.max(0, next));
    };
    window.addEventListener('notifications:count', onCount);
    return () => window.removeEventListener('notifications:count', onCount);
  }, []);

  const doLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="top-right-panel" aria-label="우측 상단 패널">
      <button className="notification-btn" id="notificationBtn" type="button" title="알림" aria-label="알림">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className={`badge${badgeCount > 0 ? '' : ' hidden'}`} id="notificationBadge">
          {badgeCount}
        </span>
      </button>

      <button
        className="logout-btn"
        id="logoutBtn"
        type="button"
        onClick={() => {
          if (window.confirm('로그아웃 하시겠습니까?')) doLogout();
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>로그아웃</span>
      </button>
    </div>
  );
}

