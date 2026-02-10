import React, { useEffect, useMemo, useState } from 'react';
import './AddSiteModal.css';

function isValidDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function todayIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function AddSiteModal({ open, managers, canEditDates = true, onClose, onCreate }) {
  const [siteName, setSiteName] = useState('');
  const [plannedDeliveryDate, setPlannedDeliveryDate] = useState('');
  const [manager, setManager] = useState((managers && managers[0]) || '홍길동');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSiteName('');
    setPlannedDeliveryDate(canEditDates ? '' : todayIso());
    setManager((managers && managers[0]) || '홍길동');
    setTouched(false);
  }, [open, managers, canEditDates]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const errors = useMemo(() => {
    const e = {};
    if (!siteName.trim()) e.siteName = '현장명을 입력해주세요';
    if (!plannedDeliveryDate || !isValidDate(plannedDeliveryDate)) e.plannedDeliveryDate = '날짜를 선택해주세요';
    if (!manager) e.manager = '담당자를 선택해주세요';
    return e;
  }, [siteName, plannedDeliveryDate, manager]);

  const canSubmit = Object.keys(errors).length === 0;

  if (!open) return null;

  return (
    <div className="dpmModalOverlay" onMouseDown={onClose}>
      <div className="dpmModal" role="dialog" aria-modal="true" aria-label="새 현장 추가" onMouseDown={(e) => e.stopPropagation()}>
        <div className="dpmModal__head">
          <div className="dpmModal__title">➕ 새 현장 추가</div>
          <button type="button" className="dpmModal__close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="dpmModal__body">
          <label className="dpmField">
            <div className="dpmField__label">현장명</div>
            <input
              className="dpmField__input"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="예) A 공사 현장"
              onBlur={() => setTouched(true)}
            />
            {touched && errors.siteName && <div className="dpmField__error">{errors.siteName}</div>}
          </label>

          <label className="dpmField">
            <div className="dpmField__label">기본 예정 납품일</div>
            <input
              className="dpmField__input"
              type="date"
              value={plannedDeliveryDate}
              onChange={(e) => setPlannedDeliveryDate(e.target.value)}
              onBlur={() => setTouched(true)}
              disabled={!canEditDates}
            />
            {touched && errors.plannedDeliveryDate && <div className="dpmField__error">{errors.plannedDeliveryDate}</div>}
          </label>

          {!canEditDates && (
            <div className="dpmField__error">날짜 변경 권한이 없어 예정 납품일을 수정할 수 없습니다. (오늘 날짜로 고정)</div>
          )}

          <label className="dpmField">
            <div className="dpmField__label">담당자</div>
            <select className="dpmField__input" value={manager} onChange={(e) => setManager(e.target.value)} onBlur={() => setTouched(true)}>
              {(managers || []).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {touched && errors.manager && <div className="dpmField__error">{errors.manager}</div>}
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
              onCreate?.({ siteName: siteName.trim(), plannedDeliveryDate, manager });
            }}
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
}

