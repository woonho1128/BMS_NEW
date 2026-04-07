import { useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { PARTNER_BASIC_MOCK } from '../data/partnerBasicMock';
import styles from './PartnerBasicInfoPage.module.css';

export function PartnerBasicInfoPage() {
  const info = PARTNER_BASIC_MOCK;

  const badgeClass = useMemo(() => `${styles.badge} ${styles.badgeNormal}`, []);
  const salesMix = useMemo(() => {
    const delivery = Number(info.salesMix?.deliveryAmount || 0);
    const retail = Number(info.salesMix?.retailAmount || 0);
    const total = delivery + retail;
    const deliveryRatio = total ? (delivery / total) * 100 : 0;
    const retailRatio = total ? (retail / total) * 100 : 0;
    return { delivery, retail, total, deliveryRatio, retailRatio };
  }, [info.salesMix]);

  const doughnutStyle = useMemo(
    () => ({
      background: `conic-gradient(#2f7df6 0% ${salesMix.deliveryRatio}%, #8bb8ff ${salesMix.deliveryRatio}% 100%)`,
    }),
    [salesMix.deliveryRatio]
  );

  const purchaseItems = useMemo(
    () => (Array.isArray(info.purchaseBest10) && info.purchaseBest10.length > 0 ? info.purchaseBest10 : info.purchaseBest5 || []),
    [info.purchaseBest10, info.purchaseBest5]
  );
  const purchaseCategories = useMemo(
    () => ['전체', ...Array.from(new Set(purchaseItems.map((item) => item.category || '기타')))],
    [purchaseItems]
  );
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const filteredPurchaseItems = useMemo(
    () =>
      purchaseItems
        .filter((item) => selectedCategory === '전체' || (item.category || '기타') === selectedCategory)
        .slice(0, 10),
    [purchaseItems, selectedCategory]
  );

  return (
    <PageShell path="/partner/basic" title="대리점 기본 정보" description="대리점 기본 정보를 조회합니다.">
      <div className={styles.page}>
        <section className={styles.card} aria-label="대리점 프로필">
          <div className={styles.profileHeader}>
            <div className={styles.profileMain}>
              <div className={styles.partnerName}>{info.name}</div>
              <div className={styles.partnerCode}>거래처코드 {info.code}</div>
            </div>
            <span className={badgeClass}>{info.status}</span>
          </div>
        </section>

        <section className={styles.descGrid} aria-label="대리점 상세 정보">
          <div className={styles.card}>
            <div className={styles.groupTitle}>기본정보</div>
            <div className={styles.descList}>
              <div className={styles.descRow}><div className={styles.label}>사업자번호</div><div className={styles.value}>{info.basic.bizNo}</div></div>
              <div className={styles.descRow}><div className={styles.label}>대표자명</div><div className={styles.value}>{info.basic.ceoName}</div></div>
              <div className={styles.descRow}><div className={styles.label}>업태</div><div className={styles.value}>{info.basic.bizType}</div></div>
              <div className={styles.descRow}><div className={styles.label}>업종</div><div className={styles.value}>{info.basic.bizItem}</div></div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.groupTitle}>연락처</div>
            <div className={styles.descList}>
              <div className={styles.descRow}><div className={styles.label}>전화번호</div><div className={styles.value}>{info.contact.phone}</div></div>
              <div className={styles.descRow}><div className={styles.label}>휴대폰</div><div className={styles.value}>{info.contact.mobile}</div></div>
              <div className={styles.descRow}><div className={styles.label}>FAX</div><div className={styles.value}>{info.contact.fax}</div></div>
              <div className={styles.descRow}><div className={styles.label}>이메일</div><div className={styles.value}>{info.contact.email}</div></div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.groupTitle}>기타</div>
            <div className={styles.descList}>
              <div className={styles.descRow}><div className={styles.label}>주소</div><div className={`${styles.value} ${styles.valueLong}`}>{info.etc.address}</div></div>
              <div className={styles.descRow}><div className={styles.label}>시작일</div><div className={styles.value}>{info.etc.startedAt}</div></div>
            </div>
          </div>
        </section>

        <section className={styles.card} aria-label="ERP 연동 예정 인사이트">
          <div className={styles.sectionTitle}>ERP 연동 예정 인사이트 (목업)</div>
          <div className={styles.insightGrid}>
            <article className={styles.insightCard}><div className={styles.insightLabel}>할인 적용 현황</div><div className={styles.insightValue}>월 {info.erpInsights.monthlyDiscountRate}% 할인 적용 중입니다.</div></article>
            <article className={styles.insightCard}><div className={styles.insightLabel}>전월 매출</div><div className={styles.insightValue}>전월 대리점 {Number(info.erpInsights.lastMonthSalesAmount).toLocaleString('ko-KR')}원 매출 달성</div></article>
            <article className={styles.insightCard}><div className={styles.insightLabel}>할인구간 업그레이드</div><div className={styles.insightValue}>이번 달 {Number(info.erpInsights.amountToUpgradeDiscountTier).toLocaleString('ko-KR')}원 매입 시 구간 업그레이드</div></article>
            <article className={styles.insightCard}><div className={styles.insightLabel}>담보 갱신</div><div className={styles.insightValue}>담보 갱신 D-{info.erpInsights.collateralRenewalDday}</div></article>
          </div>

          <div className={styles.analyticsGrid}>
            <article className={styles.bestCard}>
              <div className={styles.bestHeader}>
                <div className={styles.bestTitle}>대리점 매입품목 BEST 10</div>
                <div className={styles.valueMuted}>ERP 연동 예정 / 현재 목업</div>
              </div>
              <div className={styles.bestFilterTabs}>
                {purchaseCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`${styles.bestFilterTab} ${category === selectedCategory ? styles.bestFilterTabActive : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <ol className={styles.bestList}>
                {filteredPurchaseItems.map((item, index) => (
                  <li key={`${item.itemCode}-${item.category || '기타'}`} className={styles.bestRow}>
                    <span className={styles.rank}>{index + 1}</span>
                    <span className={styles.itemName}>[{item.category || '기타'}] {item.itemName} ({item.itemCode})</span>
                    <strong className={styles.itemAmount}>{item.amount.toLocaleString('ko-KR')}원</strong>
                  </li>
                ))}
              </ol>
            </article>

            <article className={styles.mixCard}>
              <div className={styles.bestTitle}>납품/소매 매입 비중</div>
              <div className={styles.mixSummary}>납품 {salesMix.delivery.toLocaleString('ko-KR')}원 / 소매 {salesMix.retail.toLocaleString('ko-KR')}원</div>
              <div className={styles.mixRatio}>납품 비중 {salesMix.deliveryRatio.toFixed(1)}%</div>
              <div className={styles.doughnutWrap}>
                <div className={styles.doughnut} style={doughnutStyle}>
                  <span className={styles.doughnutCenter}>{salesMix.deliveryRatio.toFixed(0)}%</span>
                </div>
              </div>
              <div className={styles.legend}>
                <span><i className={`${styles.legendDot} ${styles.legendDelivery}`} />납품</span>
                <span><i className={`${styles.legendDot} ${styles.legendRetail}`} />소매</span>
              </div>
            </article>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
