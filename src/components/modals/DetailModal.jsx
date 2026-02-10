import React, { useEffect, useMemo } from 'react';
import './DetailModal.css';

export function DetailModal({
  open,
  type, // 'site' | 'item'
  site,
  item,
  itemsBySite,
  statusMeta,
  compareIsoDate,
  diffDaysIso,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isSite = type === 'site';
  const title = isSite
    ? `📍 ${site?.siteName || ''} (${site?.siteStatus || ''})`
    : `📦 ${item?.itemName || ''} (${item?.itemStatus || ''})`;

  const itemSchedule = useMemo(() => {
    if (!item?.actualDeliveryDate) return null;
    const cmp = compareIsoDate(item.actualDeliveryDate, item.plannedDeliveryDate);
    if (cmp < 0) {
      const days = Math.abs(diffDaysIso(item.plannedDeliveryDate, item.actualDeliveryDate));
      return { icon: '⭐', label: '선납품', days };
    }
    if (cmp > 0) {
      const days = Math.abs(diffDaysIso(item.actualDeliveryDate, item.plannedDeliveryDate));
      return { icon: '⚠️', label: '지연', days };
    }
    return { icon: '✓', label: '정상', days: 0 };
  }, [item?.actualDeliveryDate, item?.plannedDeliveryDate, compareIsoDate, diffDaysIso]);

  const progress = useMemo(() => {
    if (!item?.quantity) return 0;
    return Math.max(0, Math.min(100, (item.deliveredQuantity / item.quantity) * 100));
  }, [item?.quantity, item?.deliveredQuantity]);

  if (!open) return null;

  return (
    <div className="dpmModalOverlay" onMouseDown={onClose}>
      <div className="dpmDetailModal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <div className="dpmModal__head">
          <div className="dpmModal__title">{title}</div>
          <button type="button" className="dpmModal__close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="dpmDetailModal__body">
          {isSite ? (
            <>
              <section className="dpmDetailSection">
                <div className="dpmDetailSection__title">기본 정보</div>
                <div className="dpmInfoGrid">
                  <div className="dpmInfoCell">
                    <div className="dpmInfoCell__label">현장명</div>
                    <div className="dpmInfoCell__value">{site?.siteName}</div>
                  </div>
                  <div className="dpmInfoCell">
                    <div className="dpmInfoCell__label">기본 예정 납품일</div>
                    <div className="dpmInfoCell__value">{site?.plannedDeliveryDate}</div>
                  </div>
                  <div className="dpmInfoCell">
                    <div className="dpmInfoCell__label">담당자</div>
                    <div className="dpmInfoCell__value">{site?.manager}</div>
                  </div>
                  <div className="dpmInfoCell">
                    <div className="dpmInfoCell__label">현장 상태</div>
                    <div className="dpmInfoCell__value">
                      <span className="dpmStatusPill" style={{ background: statusMeta?.[site?.siteStatus]?.color || '#667eea' }}>
                        {site?.siteStatus} {statusMeta?.[site?.siteStatus]?.icon || ''}
                      </span>
                    </div>
                  </div>
                  <div className="dpmInfoCell">
                    <div className="dpmInfoCell__label">생성 일시</div>
                    <div className="dpmInfoCell__value">{site?.createdAt}</div>
                  </div>
                  <div className="dpmInfoCell">
                    <div className="dpmInfoCell__label">마지막 수정</div>
                    <div className="dpmInfoCell__value">{site?.updatedAt}</div>
                  </div>
                </div>
              </section>

              <section className="dpmDetailSection">
                <div className="dpmDetailSection__title">📦 포함된 품목 ({itemsBySite?.length || 0}개)</div>
                {(!itemsBySite || itemsBySite.length === 0) ? (
                  <div className="dpmDetailEmpty">품목이 없습니다.</div>
                ) : (
                  <div className="dpmTableWrap">
                    <table className="dpmTable">
                      <thead>
                        <tr>
                          <th>품목명</th>
                          <th>상태</th>
                          <th className="tRight">주문</th>
                          <th className="tRight">납품</th>
                          <th>예정</th>
                          <th>실제</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsBySite.map((it) => (
                          <tr key={it.id}>
                            <td>{it.itemName}</td>
                            <td>{it.itemStatus}</td>
                            <td className="tRight">{it.quantity}</td>
                            <td className="tRight">{it.deliveredQuantity}</td>
                            <td>{it.plannedDeliveryDate}</td>
                            <td>{it.actualDeliveryDate || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section className="dpmDetailSection">
                <div className="dpmDetailSection__title">📜 현장 변경 이력</div>
                {(!site?.siteHistory || site.siteHistory.length === 0) ? (
                  <div className="dpmDetailEmpty">변경 이력이 없습니다.</div>
                ) : (
                  <div className="dpmHistoryList">
                    {site.siteHistory.map((h, idx) => (
                      <div key={idx} className="dpmHistoryRow">
                        <div className="dpmHistoryRow__meta">
                          <span>{h.changedAt}</span> | <span>{h.changedBy}</span> | <b>{h.action}</b>
                        </div>
                        <div className="dpmHistoryRow__desc">
                          {h.action === '상태 변경' ? (
                            <>
                              {h.previousStatus} → {h.newStatus} / 사유: {h.reason}
                            </>
                          ) : (
                            <>{h.reason}</>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <>
              <section className="dpmDetailSection">
                <div className="dpmDetailSection__title">기본 정보</div>
                <div className="dpmInfoGrid">
                  <div className="dpmInfoCell">
                    <div className="dpmInfoCell__label">현장명</div>
                    <div className="dpmInfoCell__value">{site?.siteName || '-'}</div>
                  </div>
                  <div className="dpmInfoCell">
                    <div className="dpmInfoCell__label">품목명</div>
                    <div className="dpmInfoCell__value">{item?.itemName || '-'}</div>
                  </div>
                  <div className="dpmInfoCell">
                    <div className="dpmInfoCell__label">품목 상태</div>
                    <div className="dpmInfoCell__value">
                      <span className="dpmStatusPill" style={{ background: statusMeta?.[item?.itemStatus]?.color || '#667eea' }}>
                        {item?.itemStatus} {statusMeta?.[item?.itemStatus]?.icon || ''}
                      </span>
                    </div>
                  </div>
                  <div className="dpmInfoCell">
                    <div className="dpmInfoCell__label">생성 일시</div>
                    <div className="dpmInfoCell__value">{item?.createdAt || '-'}</div>
                  </div>
                  <div className="dpmInfoCell">
                    <div className="dpmInfoCell__label">마지막 수정</div>
                    <div className="dpmInfoCell__value">{item?.updatedAt || '-'}</div>
                  </div>
                </div>
              </section>

              <section className="dpmDetailSection">
                <div className="dpmDetailSection__title">납품 현황</div>
                <div className="dpmQtyBox">
                  <div className="dpmQtyRow"><span>주문 수량</span><b>{item?.quantity ?? 0}개</b></div>
                  <div className="dpmQtyRow"><span>납품된 수량</span><b>{item?.deliveredQuantity ?? 0}개</b></div>
                  <div className="dpmQtyRow"><span>남은 수량</span><b>{(item?.quantity ?? 0) - (item?.deliveredQuantity ?? 0)}개</b></div>
                  <div className="dpmProgress">
                    <div className="dpmProgress__bar">
                      <div className="dpmProgress__fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="dpmProgress__text">{Math.round(progress)}%</div>
                  </div>
                </div>
              </section>

              <section className="dpmDetailSection">
                <div className="dpmDetailSection__title">납품 일정</div>
                <div className="dpmQtyBox">
                  <div className="dpmQtyRow"><span>예정 납품일</span><b>{item?.plannedDeliveryDate || '-'}</b></div>
                  {item?.actualDeliveryDate && (
                    <div className="dpmQtyRow">
                      <span>실제 납품일</span>
                      <b>
                        {item.actualDeliveryDate}{' '}
                        {itemSchedule && (
                          <span className="dpmScheduleMark">
                            {itemSchedule.icon} {itemSchedule.label}
                            {itemSchedule.days ? ` (${itemSchedule.days}일)` : ''}
                          </span>
                        )}
                      </b>
                    </div>
                  )}
                </div>
              </section>

              <section className="dpmDetailSection">
                <div className="dpmDetailSection__title">📜 품목 변경 이력</div>
                {(!item?.itemHistory || item.itemHistory.length === 0) ? (
                  <div className="dpmDetailEmpty">변경 이력이 없습니다.</div>
                ) : (
                  <div className="dpmHistoryList">
                    {item.itemHistory.map((h, idx) => (
                      <div key={idx} className="dpmHistoryRow">
                        <div className="dpmHistoryRow__meta">
                          <span>{h.changedAt}</span> | <span>{h.changedBy}</span> | <b>{h.action}</b>
                        </div>
                        <div className="dpmHistoryRow__desc">
                          {h.action === '부분 납품' && (
                            <>
                              납품량: {h.previousDeliveredQuantity}개 → {h.newDeliveredQuantity}개 / 실제 납품일: {h.actualDeliveryDate}
                            </>
                          )}
                          {h.action === '상태 변경' && (
                            <>
                              상태: {h.previousStatus} → {h.newStatus} / 사유: {h.reason}
                            </>
                          )}
                          {h.action === '품목 생성' && <>초기 생성</>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        <div className="dpmModal__footer">
          <button type="button" className="dpmModalBtn dpmModalBtn--cancel" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

