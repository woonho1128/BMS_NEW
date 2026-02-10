import React, { useMemo, useState } from 'react';
import './HistoryPage.css';
import { HistoryTimeline } from '../components/timeline/HistoryTimeline';

export function HistoryPage({ sites, changedByOptions, getHistoryEvents }) {
  const [siteId, setSiteId] = useState('ALL');
  const [includeSite, setIncludeSite] = useState(true);
  const [includeItem, setIncludeItem] = useState(true);
  const [changedBy, setChangedBy] = useState('ALL');

  const typeFilter = useMemo(() => {
    const list = [];
    if (includeSite) list.push('site');
    if (includeItem) list.push('item');
    return list;
  }, [includeSite, includeItem]);

  const events = useMemo(() => {
    const filter = {
      siteId: siteId === 'ALL' ? undefined : siteId,
      type: typeFilter.length === 2 ? undefined : typeFilter,
      changedBy: changedBy === 'ALL' ? undefined : changedBy,
    };
    return getHistoryEvents(filter);
  }, [siteId, typeFilter, changedBy, getHistoryEvents]);

  return (
    <div className="dpmHistoryPage">
      <section className="dpmHistoryFilters">
        <div className="dpmHistoryFilters__row">
          <div className="dpmHistoryFilters__field">
            <div className="dpmHistoryFilters__label">현장 선택</div>
            <select className="dpmSelect" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              <option value="ALL">모든 현장</option>
              {(sites || []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.siteName}
                </option>
              ))}
            </select>
          </div>

          <div className="dpmHistoryFilters__field">
            <div className="dpmHistoryFilters__label">변경자</div>
            <select className="dpmSelect" value={changedBy} onChange={(e) => setChangedBy(e.target.value)}>
              <option value="ALL">모든 사용자</option>
              {(changedByOptions || []).map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="dpmHistoryFilters__checks">
          <label className="dpmCheck">
            <input type="checkbox" checked={includeSite} onChange={(e) => setIncludeSite(e.target.checked)} />
            <span>현장 변경</span>
          </label>
          <label className="dpmCheck">
            <input type="checkbox" checked={includeItem} onChange={(e) => setIncludeItem(e.target.checked)} />
            <span>품목 변경</span>
          </label>
        </div>
      </section>

      <section className="dpmHistoryTimeline">
        <HistoryTimeline events={events} />
      </section>
    </div>
  );
}

