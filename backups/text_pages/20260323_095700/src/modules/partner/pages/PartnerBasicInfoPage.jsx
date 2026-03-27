import { useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { PARTNER_BASIC_MOCK } from '../data/partnerBasicMock';
import styles from './PartnerBasicInfoPage.module.css';

export function PartnerBasicInfoPage() {
  const info = PARTNER_BASIC_MOCK;

  const badgeClass = useMemo(() => {
    if (info.status === '정상' || info.status === '거래중') return `${styles.badge} ${styles.badgeNormal}`;
    return `${styles.badge} ${styles.badgeNormal}`;
  }, [info.status]);

  // pagination (history)
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(info.history.length / pageSize));
  const historyPage = useMemo(() => {
    const start = (page - 1) * pageSize;
    return info.history.slice(start, start + pageSize);
  }, [info.history, page]);

  return (
    <PageShell
      path="/partner/basic"
      title="대리점 기본 정보"
      description="대리점 기본 정보 및 이력 조회"
    >
      <div className={styles.page}>
        {/* 1) 프로필 헤더 */}
        <section className={styles.card} aria-label="대리점 프로필">
          <div className={styles.profileHeader}>
            <div className={styles.profileMain}>
              <div className={styles.partnerName}>{info.name}</div>
              <div className={styles.partnerCode}>거래처코드 {info.code}</div>
            </div>
            <span className={badgeClass}>{info.status}</span>
          </div>
        </section>

        {/* 2) 상세 정보 - 3컬럼 Description List */}
        <section className={styles.descGrid} aria-label="대리점 상세 정보">
          <div className={styles.card}>
            <div className={styles.groupTitle}>기본정보</div>
            <div className={styles.descList}>
              <div className={styles.descRow}>
                <div className={styles.label}>사업자번호</div>
                <div className={styles.value}>{info.basic.bizNo}</div>
              </div>
              <div className={styles.descRow}>
                <div className={styles.label}>대표자명</div>
                <div className={styles.value}>{info.basic.ceoName}</div>
              </div>
              <div className={styles.descRow}>
                <div className={styles.label}>업태</div>
                <div className={styles.value}>{info.basic.bizType}</div>
              </div>
              <div className={styles.descRow}>
                <div className={styles.label}>업종</div>
                <div className={styles.value}>{info.basic.bizItem}</div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.groupTitle}>연락처</div>
            <div className={styles.descList}>
              <div className={styles.descRow}>
                <div className={styles.label}>전화번호</div>
                <div className={styles.value}>{info.contact.phone}</div>
              </div>
              <div className={styles.descRow}>
                <div className={styles.label}>휴대폰</div>
                <div className={styles.value}>{info.contact.mobile}</div>
              </div>
              <div className={styles.descRow}>
                <div className={styles.label}>FAX</div>
                <div className={styles.value}>{info.contact.fax}</div>
              </div>
              <div className={styles.descRow}>
                <div className={styles.label}>이메일</div>
                <div className={styles.value}>{info.contact.email}</div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.groupTitle}>기타</div>
            <div className={styles.descList}>
              <div className={styles.descRow}>
                <div className={styles.label}>주소</div>
                <div className={`${styles.value} ${styles.valueLong}`}>{info.etc.address}</div>
              </div>
              <div className={styles.descRow}>
                <div className={styles.label}>시작일</div>
                <div className={styles.value}>{info.etc.startedAt}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3) 거래처 이력정보 */}
        <section className={styles.card} aria-label="거래처 이력정보">
          <div className={styles.sectionTitleRow}>
            <div className={styles.sectionTitle}>거래처 이력정보</div>
            <div className={`${styles.valueMuted}`}>총 {info.history.length}건</div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>일자</th>
                  <th>구분</th>
                  <th>내용</th>
                </tr>
              </thead>
              <tbody>
                {historyPage.map((row) => (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td>{row.type}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination} aria-label="페이지네이션">
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`${styles.pageNum} ${p === page ? styles.pageNumActive : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              다음
            </button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
