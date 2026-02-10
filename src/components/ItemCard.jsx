import React, { useMemo } from 'react';
import './ItemCard.css';

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export function ItemCard({
  item,
  site,
  statusMeta,
  compareIsoDate,
  diffDaysIso,
  onView,
  onDelivery,
  onChangeStatus,
  onDelete,
}) {
  const meta = statusMeta?.[item.itemStatus] || { color: '#667eea', icon: '⏳' };
  const remaining = item.quantity - item.deliveredQuantity;
  const percent = useMemo(() => {
    if (!item.quantity) return 0;
    return clamp((item.deliveredQuantity / item.quantity) * 100, 0, 100);
  }, [item.quantity, item.deliveredQuantity]);

  const planned = item.plannedDeliveryDate;
  const actual = item.actualDeliveryDate;
  const scheduleMark = useMemo(() => {
    if (!actual) return null;
    const cmp = compareIsoDate(actual, planned);
    if (cmp < 0) return { icon: '⭐', label: '선납품', days: Math.abs(diffDaysIso(planned, actual)) };
    if (cmp > 0) return { icon: '⚠️', label: '지연', days: Math.abs(diffDaysIso(actual, planned)) };
    return { icon: '✓', label: '정상', days: 0 };
  }, [actual, planned, compareIsoDate, diffDaysIso]);

  return (
    <div className="dpmItemCard">
      <div className="dpmItemCard__header">
        <div className="dpmItemCard__title" title={item.itemName}>
          📦 {item.itemName}
        </div>
        <span className="dpmStatusBadge" style={{ background: meta.color }}>
          {item.itemStatus} {meta.icon}
        </span>
      </div>

      <div className="dpmItemCard__body">
        <div className="dpmItemCard__row">
          <span className="dpmItemCard__label">주문 수량</span>
          <span className="dpmItemCard__value">{item.quantity}개</span>
        </div>
        <div className="dpmItemCard__row">
          <span className="dpmItemCard__label">납품된 수량</span>
          <span className="dpmItemCard__value">{item.deliveredQuantity}개</span>
        </div>
        <div className="dpmItemCard__row">
          <span className="dpmItemCard__label">남은 수량</span>
          <span className="dpmItemCard__value">{remaining}개</span>
        </div>

        <div className="dpmProgress">
          <div className="dpmProgress__bar">
            <div className="dpmProgress__fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="dpmProgress__text">{Math.round(percent)}%</div>
        </div>

        <div className="dpmItemCard__row">
          <span className="dpmItemCard__label">📅 예정 납품일</span>
          <span className="dpmItemCard__value">{planned}</span>
        </div>

        {actual && (
          <div className="dpmItemCard__row">
            <span className="dpmItemCard__label">📅 실제 납품일</span>
            <span className="dpmItemCard__value">
              {actual}{' '}
              {scheduleMark && (
                <span className="dpmScheduleMark">
                  {scheduleMark.icon} {scheduleMark.label}
                  {scheduleMark.days ? ` (${scheduleMark.days}일)` : ''}
                </span>
              )}
            </span>
          </div>
        )}

        {site && (
          <div className="dpmItemCard__siteHint">📍 {site.siteName}</div>
        )}
      </div>

      <div className="dpmItemCard__actions">
        <button type="button" className="dpmBtn dpmBtn--primary" onClick={onView}>
          상세보기
        </button>
        <button type="button" className="dpmBtn dpmBtn--success" onClick={onDelivery} disabled={remaining <= 0}>
          납품입력
        </button>
        <button type="button" className="dpmBtn dpmBtn--warn" onClick={onChangeStatus}>
          상태변경
        </button>
        <button
          type="button"
          className="dpmBtn dpmBtn--danger"
          onClick={() => {
            if (window.confirm(`"${item.itemName}" 품목을 삭제할까요?`)) onDelete?.();
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

