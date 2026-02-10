import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../shared/components/Sidebar/Sidebar';
import { classnames } from '../shared/utils/classnames';
import styles from './AppLayout.module.css';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // 사이드바 "고정"을 디폴트로
  const [sidebarPinned, setSidebarPinned] = useState(true);

  const handleToggle = () => {
    if (sidebarPinned) {
      setSidebarPinned(false);
      setSidebarOpen(false);
    } else {
      setSidebarOpen((v) => !v);
    }
  };

  const handleTogglePin = () => {
    setSidebarPinned((v) => !v);
    if (!sidebarPinned) setSidebarOpen(true);
  };

  const effectiveOpen = sidebarOpen || sidebarPinned;
  const showOverlay = sidebarOpen && !sidebarPinned;

  return (
    <div className={styles.layout}>
      <div className={styles.body}>
        {showOverlay && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => !sidebarPinned && setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <Sidebar
          isOpen={effectiveOpen}
          pinned={sidebarPinned}
          onToggle={handleToggle}
          onTogglePin={handleTogglePin}
          onClose={() => !sidebarPinned && setSidebarOpen(false)}
        />
        <main className={classnames(styles.main, !effectiveOpen && styles.mainFullWidth)}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
