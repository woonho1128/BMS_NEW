import React, { useEffect, useMemo, useState } from 'react';
import './StatusChangeModal.css';

export function StatusChangeModal({
  open,
  type, // 'site' | 'item'
  site,
  item,
  statusList,
  statusMeta,
  onClose,
  onSave,
}) {
  const target = type === 'site' ? site : item;
  const currentStatus = type === 'site' ? site?.siteStatus : item?.itemStatus;

  const [newStatus, setNewStatus] = useState(currentStatus || '');
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setNewStatus(currentStatus || '');
    setReason('');
    setTouched(false);
  }, [open, currentStatus]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const title = type === 'site' ? '🔄 현장 상태 변경' : '🔄 품목 상태 변경';

  const errors = useMemo(() => {
    const e = {};
    if (!newStatus) e.newStatus = '새로운 상태를 선택해주세요';
    if (newStatus === currentStatus) e.newStatus = '현재 상태와 다른 상태를 선택해주세요';
    if (!reason.trim()) e.reason = '변경 사유를 입력해주세요';
    if (reason.trim().length > 200) e.reason = '변경 사유는 200자 이내로 입력해주세요';
    return e;
  }, [newStatus, currentStatus, reason]);

  const canSubmit = Object.keys(errors).length === 0 && !!target;

  if (!open) return null;

  return (
    <div className="dpmModalOverlay" onMouseDown={onClose}>
      <div className="dpmModal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <div className="dpmModal__head">
          <div className="dpmModal__title">{title}</div>
          <button type="button" className="dpmModal__close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="dpmModal__body">
          {type === 'site' ? (
            <div className="dpmHint">
              <div>현장명: <b>{site?.siteName || '-'}</b></div>
              <div>
                현재 상태:{' '}
                <span className="dpmStatusPill" style={{ background: statusMeta?.[currentStatus]?.color || '#667eea' }}>
                  {currentStatus} {statusMeta?.[currentStatus]?.icon || ''}
                </span>
              </div>
              <div>포함된 품목: <b>{site?.items?.length || 0}</b>개</div>
            </div>
          ) : (
            <div className="dpmHint">
              <div>현장명: <b>{site?.siteName || '-'}</b></div>
              <div>품목명: <b>{item?.itemName || '-'}</b></div>
              <div>
                현재 상태:{' '}
                <span className="dpmStatusPill" style={{ background: statusMeta?.[currentStatus]?.color || '#667eea' }}>
                  {currentStatus} {statusMeta?.[currentStatus]?.icon || ''}
                </span>
              </div>
            </div>
          )}

          <div className="dpmRadioGroup">
            <div className="dpmField__label">새로운 상태 선택</div>
            <div className="dpmRadios">
              {(statusList || []).map((s) => {
                const meta = statusMeta?.[s] || { color: '#667eea', icon: '⏳' };
                const checked = newStatus === s;
                return (
                  <label key={s} className={`dpmRadio ${checked ? 'dpmRadio--checked' : ''}`}>
                    <input type="radio" name="status" value={s} checked={checked} onChange={() => setNewStatus(s)} />
                    <span className="dpmRadio__dot" />
                    <span className="dpmRadio__text">
                      {s} {meta.icon}
                    </span>
                    <span className="dpmRadio__swatch" style={{ background: meta.color }} aria-hidden="true" />
                  </label>
                );
              })}
            </div>
            {touched && errors.newStatus && <div className="dpmField__error">{errors.newStatus}</div>}
          </div>

          <label className="dpmField">
            <div className="dpmField__label">변경 사유</div>
            <textarea
              className="dpmTextarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="상태를 변경한 이유를 입력해주세요"
              maxLength={200}
              onBlur={() => setTouched(true)}
            />
            <div className="dpmTextarea__meta">{reason.trim().length}/200</div>
            {touched && errors.reason && <div className="dpmField__error">{errors.reason}</div>}
          </label>
        </div>

        <div className="dpmModal__footer">
          <button type="button" className="dpmModalBtn dpmModalBtn--cancel" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="dpmModalBtn dpmModalBtn--primary"
            disabled={!canSubmit}
            onClick={() => {
              setTouched(true);
              if (!canSubmit) return;
              onSave?.({ newStatus, reason: reason.trim() });
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

