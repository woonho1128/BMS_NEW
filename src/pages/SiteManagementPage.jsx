import React from 'react';
import './SiteManagementPage.css';
import { SiteCard } from '../components/SiteCard';

export function SiteManagementPage({
  sites,
  statusMeta,
  onCreateSite,
  onSelectSite,
  onViewSite,
  onChangeStatus,
  onDeleteSite,
}) {
  return (
    <div className="dpmSitePage">
      <section className="dpmSection">
        <div className="dpmSection__head">
          <div className="dpmSection__title">📝 새 현장 추가</div>
          <button type="button" className="dpmPrimaryBtn" onClick={onCreateSite} disabled={!onCreateSite}>
            + 새 현장 생성
          </button>
        </div>
      </section>

      <section className="dpmSection">
        <div className="dpmSection__head">
          <div className="dpmSection__title">📍 현장 목록</div>
        </div>

        {!sites || sites.length === 0 ? (
          <div className="dpmEmpty">
            <div className="dpmEmpty__emoji">📍</div>
            <div className="dpmEmpty__title">현장이 없습니다</div>
            <div className="dpmEmpty__desc">새 현장을 추가해주세요.</div>
          </div>
        ) : (
          <div className="dpmGrid">
            {sites.map((s) => (
              <SiteCard
                key={s.id}
                site={s}
                statusMeta={statusMeta}
                onSelect={() => onSelectSite?.(s.id)}
                onView={() => onViewSite?.(s.id)}
                onChangeStatus={() => onChangeStatus?.(s.id)}
                onDelete={() => onDeleteSite?.(s.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

