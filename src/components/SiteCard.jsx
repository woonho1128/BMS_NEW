import React from 'react';
import './SiteCard.css';

export function SiteCard({ site, statusMeta, onSelect, onView, onChangeStatus, onDelete }) {
  const meta = statusMeta?.[site.siteStatus] || { color: '#667eea', icon: '⏳' };
  const itemCount = site.items?.length || 0;

  return (
    <div className="dpmSiteCard" role="button" tabIndex={0} onClick={onSelect} onKeyDown={(e) => e.key === 'Enter' && onSelect?.()}>
      <div className="dpmSiteCard__header">
        <div className="dpmSiteCard__name" title={site.siteName}>
          📍 {site.siteName}
        </div>
        <span className="dpmStatusBadge" style={{ background: meta.color }}>
          {site.siteStatus} {meta.icon}
        </span>
      </div>

      <div className="dpmSiteCard__body">
        <div className="dpmSiteCard__row">
          <span className="dpmSiteCard__label">📅 예정 납품일</span>
          <span className="dpmSiteCard__value">{site.plannedDeliveryDate}</span>
        </div>
        <div className="dpmSiteCard__row">
          <span className="dpmSiteCard__label">👤 담당자</span>
          <span className="dpmSiteCard__value">{site.manager}</span>
        </div>
        <div className="dpmSiteCard__row">
          <span className="dpmSiteCard__label">📊 품목 수</span>
          <span className="dpmSiteCard__value">{itemCount}개</span>
        </div>
      </div>

      <div className="dpmSiteCard__actions" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="dpmBtn dpmBtn--primary" onClick={onView}>
          상세보기
        </button>
        <button type="button" className="dpmBtn dpmBtn--warn" onClick={onChangeStatus}>
          상태변경
        </button>
        <button
          type="button"
          className="dpmBtn dpmBtn--danger"
          onClick={() => {
            if (window.confirm(`"${site.siteName}" 현장을 삭제할까요? (해당 현장의 품목도 함께 삭제됩니다)`)) {
              onDelete?.();
            }
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

