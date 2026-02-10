import React, { useMemo, useState } from 'react';
import './ItemManagementPage.css';
import { ItemCard } from '../components/ItemCard';

const FILTERS = [
  { key: 'PLANNED', label: '⏳ 예정', status: '예정' },
  { key: 'IN_PROGRESS', label: '🔄 진행중', status: '진행중' },
  { key: 'DONE', label: '✅ 완료', status: '완료' },
  { key: 'DELAYED', label: '⚠️ 지연', status: '지연' },
  { key: 'ALL', label: '📊 전체', status: null },
];

export function ItemManagementPage({
  sites,
  items,
  selectedSiteId,
  onSelectSite,
  onAddItem,
  onViewItem,
  onDeliveryInput,
  onChangeItemStatus,
  onDeleteItem,
  statusMeta,
  compareIsoDate,
  diffDaysIso,
}) {
  const [filterKey, setFilterKey] = useState('ALL');

  const selectedSite = useMemo(
    () => (sites || []).find((s) => s.id === selectedSiteId) || null,
    [sites, selectedSiteId]
  );

  const itemsBySite = useMemo(
    () => (selectedSiteId ? (items || []).filter((it) => it.siteId === selectedSiteId) : []),
    [items, selectedSiteId]
  );

  const filteredItems = useMemo(() => {
    const f = FILTERS.find((x) => x.key === filterKey);
    if (!f || !f.status) return itemsBySite;
    return itemsBySite.filter((it) => it.itemStatus === f.status);
  }, [itemsBySite, filterKey]);

  return (
    <div className="dpmItemPage">
      <section className="dpmItemPage__top">
        <div className="dpmItemPage__select">
          <div className="dpmItemPage__label">현장 선택</div>
          <select
            className="dpmSelect"
            value={selectedSiteId || ''}
            onChange={(e) => {
              onSelectSite?.(e.target.value || null);
              setFilterKey('ALL');
            }}
          >
            <option value="">현장을 선택해주세요</option>
            {(sites || []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.siteName} ({s.siteStatus})
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="dpmPrimaryBtn" onClick={onAddItem} disabled={!selectedSiteId}>
          + 품목 추가
        </button>
      </section>

      <section className="dpmItemPage__siteInfo">
        {!selectedSite ? (
          <div className="dpmInfoBox">현장을 선택해주세요.</div>
        ) : (
          <div className="dpmInfoBox">
            <div className="dpmInfoBox__title">
              📍 {selectedSite.siteName}{' '}
              <span className="dpmInfoBox__status" style={{ background: statusMeta?.[selectedSite.siteStatus]?.color || '#667eea' }}>
                {selectedSite.siteStatus} {statusMeta?.[selectedSite.siteStatus]?.icon || ''}
              </span>
            </div>
            <div className="dpmInfoBox__rows">
              <div>📅 기본 예정일: {selectedSite.plannedDeliveryDate}</div>
              <div>👤 담당자: {selectedSite.manager}</div>
            </div>
          </div>
        )}
      </section>

      <section className="dpmItemPage__filters">
        <div className="dpmFilterTabs">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`dpmFilterTab ${filterKey === f.key ? 'dpmFilterTab--active' : ''}`}
              onClick={() => setFilterKey(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="dpmItemPage__list">
        {!selectedSite ? (
          <div className="dpmEmpty dpmEmpty--compact">
            <div className="dpmEmpty__emoji">📍</div>
            <div className="dpmEmpty__title">현장을 선택해주세요</div>
          </div>
        ) : itemsBySite.length === 0 ? (
          <div className="dpmEmpty dpmEmpty--compact">
            <div className="dpmEmpty__emoji">📦</div>
            <div className="dpmEmpty__title">품목이 없습니다</div>
            <div className="dpmEmpty__desc">품목을 추가해주세요.</div>
          </div>
        ) : (
          <div className="dpmItemGrid">
            {filteredItems.map((it) => (
              <ItemCard
                key={it.id}
                item={it}
                site={selectedSite}
                statusMeta={statusMeta}
                compareIsoDate={compareIsoDate}
                diffDaysIso={diffDaysIso}
                onView={() => onViewItem?.(it.id)}
                onDelivery={() => onDeliveryInput?.(it.id)}
                onChangeStatus={() => onChangeItemStatus?.(it.id)}
                onDelete={() => onDeleteItem?.(it.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

