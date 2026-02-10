import React from 'react';
import './Header.css';

export function Header({ title = '📦 납품 계획 관리 시스템', userName = '홍길동' }) {
  return (
    <header className="dpmHeader">
      <div className="dpmHeader__left">
        <div className="dpmHeader__title">{title}</div>
      </div>

      <div className="dpmHeader__right">
        <div className="dpmHeader__user">👤 {userName}</div>
      </div>
    </header>
  );
}

