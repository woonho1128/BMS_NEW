import React, { useEffect, useMemo, useState } from 'react';
import './DeliveryInputModal.css';

function todayIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function DeliveryInputModal({ open, item, site, canEditDates = true, onClose, onSave, compareIsoDate }) {
  const [qty, setQty] = useState('');
  const [actualDate, setActualDate] = useState(todayIso());
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setQty('');
    setActualDate(todayIso());
    setError('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const remaining = item ? item.quantity - item.deliveredQuantity : 0;
  const percent = item && item.quantity ? Math.round((item.deliveredQuantity / item.quantity) * 100) : 0;
  const planned = item?.plannedDeliveryDate || site?.plannedDeliveryDate || '';

  const preview = useMemo(() => {
    if (!planned || !actualDate) return null;
    const cmp = compareIsoDate(actualDate, planned);
    if (cmp < 0) return '⭐ 선납품';
    if (cmp > 0) return '⚠️ 지연';
    return '✓ 정상';
  }, [planned, actualDate, compareIsoDate]);

  if (!open) return null;

  const submit = () => {
    setError('');
    if (!item) return;
    const n = Number(qty);
    if (!Number.isFinite(n) || n <= 0) {
      setError('수량을 입력해주세요');
      return;
    }
    if (n > remaining) {
      setError('남은 수량을 초과할 수 없습니다');
      return;
    }
    if (!actualDate) {
      setError('날짜를 선택해주세요');
      return;
    }
    onSave?.({ deliveredQty: n, actualDate });
  };

  return (
    <div className="dpmModalOverlay" onMouseDown={onClose}>
      <div className="dpmModal" role="dialog" aria-modal="true" aria-label="부분 납품 입력" onMouseDown={(e) => e.stopPropagation()}>
        <div className="dpmModal__head">
          <div className="dpmModal__title">📦 부분 납품 입력</div>
          <button type="button" className="dpmModal__close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="dpmModal__body">
          <div className="dpmHint">
            <div>품목명: <b>{item?.itemName || '-'}</b></div>
            <div>주문 수량: <b>{item?.quantity ?? 0}</b>개</div>
            <div>이미 납품: <b>{item?.deliveredQuantity ?? 0}</b>개 ({percent}%)</div>
            <div>남은 수량: <b>{remaining}</b>개</div>
          </div>

          <label className="dpmField">
            <div className="dpmField__label">이번 납품 수량</div>
            <input
              className="dpmField__input"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder={`최대 ${remaining}개`}
            />
          </label>

          <label className="dpmField">
            <div className="dpmField__label">실제 납품일</div>
            <input
              className="dpmField__input"
              type="date"
              value={actualDate}
              onChange={(e) => setActualDate(e.target.value)}
              disabled={!canEditDates}
            />
          </label>

          {!canEditDates && (
            <div className="dpmField__error">날짜 변경 권한이 없어 실제 납품일을 수정할 수 없습니다. (오늘 날짜로 고정)</div>
          )}

          <div className="dpmDeliveryPreview">
            <div>예정 납품일: <b>{planned || '-'}</b></div>
            <div>미리보기: <b>{preview || '-'}</b></div>
          </div>

          {error && <div className="dpmField__error">{error}</div>}
        </div>

        <div className="dpmModal__footer">
          <button type="button" className="dpmModalBtn dpmModalBtn--cancel" onClick={onClose}>
            취소
          </button>
          <button type="button" className="dpmModalBtn dpmModalBtn--primary" onClick={submit}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

