import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../shared/components/Sidebar/Sidebar';
import { classnames } from '../shared/utils/classnames';
import styles from './AppLayout.module.css';
import { Menu } from 'lucide-react';


export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarPinned, setSidebarPinned] = useState(true);

  // Initialize for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarPinned(false);
        setSidebarOpen(false);
      } else {
        setSidebarPinned(true);
        setSidebarOpen(true);
      }
    };

    // Run once on mount
    handleResize();

    // Optional: Listen to resize if we want dynamic adaptation
    // window.addEventListener('resize', handleResize);
    // return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const openMobileSidebar = () => {
    setSidebarOpen(true);
    setSidebarPinned(false); // Ensure unpinned on mobile open
  };

  const effectiveOpen = sidebarOpen || sidebarPinned;
  // Overlay: Only show if open AND NOT pinned (mobile drawer mode)
  const showOverlay = sidebarOpen && !sidebarPinned;

  return (
    <div className={styles.layout}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <button className={styles.mobileMenuBtn} onClick={openMobileSidebar}>
          <Menu size={24} />
        </button>
        <div className={styles.mobileBrand}>
          <img src="/logo.png" alt="Logo" className={styles.mobileLogo} />
        </div>
      </div>

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
