import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { notify } from '../../../shared/utils/notify';
import styles from './SalesMaterialsPage.module.css';

const MOCK = [
  { id: 1, title: '2026년 2분기 영업 브로슈어', type: 'PDF', date: '2026-04-01', attachments: 2 },
  { id: 2, title: '상품 설명 자료', type: 'PPT', date: '2026-04-03', attachments: 1 },
  { id: 3, title: '가격 정책 안내', type: 'DOC', date: '2026-04-05', attachments: 0 },
];

export function SalesMaterialsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    if (!query.trim()) return MOCK;
    return MOCK.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <PageShell path={ROUTES.SALES_MATERIAL} title="영업자료실" description="영업 자료를 조회하고 다운로드합니다.">
      <div className={styles.page}>
        <div className={styles.toolbar}>
          <input
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목 검색"
          />
          <div className={styles.toolbarActions}>
            <Button onClick={() => navigate(ROUTES.SALES_MATERIAL_NEW)}>등록</Button>
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.count}>조회 {list.length}건</div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={`${styles.th}`}>제목</th>
                  <th className={`${styles.th}`}>유형</th>
                  <th className={`${styles.th}`}>등록일</th>
                  <th className={`${styles.th} ${styles.thAction}`}>첨부</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.empty}>조회 결과가 없습니다.</td>
                  </tr>
                ) : (
                  list.map((item) => (
                    <tr key={item.id} className={styles.row} onClick={() => navigate(`${ROUTES.SALES_MATERIAL}/${item.id}`)}>
                      <td className={styles.td}>
                        <button type="button" className={styles.titleLink}>{item.title}</button>
                      </td>
                      <td className={styles.td}>{item.type}</td>
                      <td className={styles.td}>{item.date}</td>
                      <td className={`${styles.td} ${styles.tdAction}`}>
                        {item.attachments > 0 ? (
                          <button
                            type="button"
                            className={styles.downloadBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              notify.info('첨부파일 다운로드는 추후 API 연동 예정입니다.');
                            }}
                          >
                            다운로드
                            <span className={styles.attachmentCount}>{item.attachments}</span>
                          </button>
                        ) : (
                          <span className={styles.noAttachment}>없음</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.mobileList}>
            {list.length === 0 ? (
              <div className={styles.mobileEmpty}>조회 결과가 없습니다.</div>
            ) : (
              list.map((item) => (
                <article
                  key={`mobile-${item.id}`}
                  className={styles.mobileCard}
                  onClick={() => navigate(`${ROUTES.SALES_MATERIAL}/${item.id}`)}
                >
                  <div className={styles.mobileTitle}>{item.title}</div>
                  <div className={styles.mobileMetaGrid}>
                    <div className={styles.mobileMetaItem}>
                      <span className={styles.mobileMetaLabel}>유형</span>
                      <span className={styles.mobileMetaValue}>{item.type}</span>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span className={styles.mobileMetaLabel}>등록일</span>
                      <span className={styles.mobileMetaValue}>{item.date}</span>
                    </div>
                  </div>
                  <div className={styles.mobileActionRow}>
                    {item.attachments > 0 ? (
                      <button
                        type="button"
                        className={styles.downloadBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          notify.info('첨부파일 다운로드는 추후 API 연동 예정입니다.');
                        }}
                      >
                        다운로드
                        <span className={styles.attachmentCount}>{item.attachments}</span>
                      </button>
                    ) : (
                      <span className={styles.noAttachment}>첨부 없음</span>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
