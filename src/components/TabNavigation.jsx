import React from 'react';
import './TabNavigation.css';

const TAB_META = [
  { key: 'site', label: '📍 현장 관리', color: '#667eea' },
  { key: 'item', label: '📦 품목 관리', color: '#3498db' },
  { key: 'history', label: '📋 변경내역', color: '#9b59b6' },
  { key: 'settings', label: '⚙️ 설정', color: '#6c757d' },
];

export function TabNavigation({ activeTab, onChange }) {
  return (
    <nav className="dpmTabs" aria-label="납품 계획 탭">
      <div className="dpmTabs__row">
        {TAB_META.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              className={`dpmTabs__tab ${isActive ? 'dpmTabs__tab--active' : ''}`}
              onClick={() => onChange(t.key)}
              style={isActive ? { borderBottomColor: t.color } : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="dpmTabs__label">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

