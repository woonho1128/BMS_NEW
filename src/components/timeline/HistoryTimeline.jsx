import React from 'react';
import './HistoryTimeline.css';

function actionLabel(e) {
  if (e.type === 'site') {
    if (e.action === '현장 생성') return '현장 생성';
    if (e.action === '상태 변경') return '상태 변경';
    return e.action;
  }
  // item
  if (e.action === '품목 생성') return '품목 생성';
  if (e.action === '부분 납품') return '부분 납품';
  if (e.action === '상태 변경') return '상태 변경';
  return e.action;
}

export function HistoryTimeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="dpmTimelineEmpty">
        <div className="dpmTimelineEmpty__emoji">🕘</div>
        <div className="dpmTimelineEmpty__title">변경 내역이 없습니다</div>
        <div className="dpmTimelineEmpty__desc">현장/품목 변경이 발생하면 여기에 기록됩니다.</div>
      </div>
    );
  }

  return (
    <div className="dpmTimeline">
      {events.map((e) => (
        <div key={e.id} className="dpmTimeline__item">
          <span className="dpmTimeline__marker" aria-hidden="true" />
          <div className="dpmTimeline__box">
            <div className="dpmTimeline__head">
              <div className="dpmTimeline__time">🕐 {e.changedAt}</div>
              <div className="dpmTimeline__by">by {e.changedBy}</div>
            </div>
            <div className="dpmTimeline__divider" />

            <div className="dpmTimeline__target">
              <div>📍 현장: {e.siteName}</div>
              {e.type === 'item' && <div>📦 품목: {e.itemName}</div>}
            </div>

            <div className="dpmTimeline__divider" />

            <div className="dpmTimeline__action">[{actionLabel(e)}]</div>

            <div className="dpmTimeline__details">
              {e.action === '상태 변경' && (
                <div>
                  상태: {e.previousStatus} → {e.newStatus}
                  {e.reason ? ` / 사유: ${e.reason}` : ''}
                </div>
              )}

              {e.action === '부분 납품' && (
                <>
                  <div>납품량: {e.previousDeliveredQuantity}개 → {e.newDeliveredQuantity}개</div>
                  <div>실제 납품일: {e.actualDeliveryDate}</div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

