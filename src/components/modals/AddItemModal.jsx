import React, { useEffect, useMemo, useState } from 'react';
import './AddItemModal.css';

export function AddItemModal({ open, site, canEditDates = true, onClose, onAdd }) {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setItemName('');
    setQuantity('');
    setUseCustomDate(false);
    setCustomDate(site?.plannedDeliveryDate || '');
    setTouched(false);
  }, [open, site?.plannedDeliveryDate]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const errors = useMemo(() => {
    const e = {};
    if (!itemName.trim()) e.itemName = '품목명을 입력해주세요';
    const q = Number(quantity);
    if (!Number.isFinite(q) || q < 1) e.quantity = '유효한 수량을 입력해주세요';
    if (useCustomDate && !customDate) e.customDate = '날짜를 선택해주세요';
    return e;
  }, [itemName, quantity, useCustomDate, customDate]);

  const canSubmit = Object.keys(errors).length === 0 && !!site;

  if (!open) return null;

  return (
    <div className="dpmModalOverlay" onMouseDown={onClose}>
      <div className="dpmModal" role="dialog" aria-modal="true" aria-label="품목 추가" onMouseDown={(e) => e.stopPropagation()}>
        <div className="dpmModal__head">
          <div className="dpmModal__title">📦 현장에 품목 추가</div>
          <button type="button" className="dpmModal__close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="dpmModal__body">
          <div className="dpmHint">
            <div>현장명: <b>{site?.siteName || '-'}</b></div>
            <div>기본 예정일: <b>{site?.plannedDeliveryDate || '-'}</b></div>
          </div>

          <label className="dpmField">
            <div className="dpmField__label">품목명</div>
            <input
              className="dpmField__input"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="예) 마우스"
              onBlur={() => setTouched(true)}
            />
            {touched && errors.itemName && <div className="dpmField__error">{errors.itemName}</div>}
          </label>

          <label className="dpmField">
            <div className="dpmField__label">수량</div>
            <input
              className="dpmField__input"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="예) 100"
              onBlur={() => setTouched(true)}
            />
            {touched && errors.quantity && <div className="dpmField__error">{errors.quantity}</div>}
          </label>

          <div className="dpmCustomDate">
            <label className="dpmCheck">
              <input
                type="checkbox"
                checked={useCustomDate}
                disabled={!canEditDates}
                onChange={(e) => {
                  const next = e.target.checked;
                  setUseCustomDate(next);
                  if (next && !customDate) setCustomDate(site?.plannedDeliveryDate || '');
                }}
              />
              <span>현장 기본 예정일과 다른 날짜 사용</span>
            </label>

            <label className="dpmField">
              <div className="dpmField__label">개별 납품일 (선택)</div>
              <input
                className="dpmField__input"
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                disabled={!useCustomDate || !canEditDates}
                onBlur={() => setTouched(true)}
              />
              {touched && errors.customDate && <div className="dpmField__error">{errors.customDate}</div>}
            </label>
          </div>
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
              const plannedDeliveryDate = useCustomDate ? customDate : undefined;
              onAdd?.({
                itemName: itemName.trim(),
                quantity: Number(quantity),
                plannedDeliveryDate,
              });
            }}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}

