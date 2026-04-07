import React, { useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { usePagination } from '../../../shared/hooks/usePagination';
import { Pagination } from '../../../shared/components/Pagination/Pagination';
import { PRICE_CATEGORY_TREE, PRICE_PRODUCT_DATA } from '../../sales/data/priceCatalogMock';
import { formatNumber } from '../../../shared/utils/formatters';
import styles from './PartnerCatalogPage.module.css';

export function PartnerCatalogPage() {
  const [majorCategory, setMajorCategory] = useState('');
  const [middleCategory, setMiddleCategory] = useState('');
  const [keyword, setKeyword] = useState('');

  const middleOptions = useMemo(() => {
    if (!majorCategory) return [];
    return PRICE_CATEGORY_TREE.find((row) => row.major === majorCategory)?.middle || [];
  }, [majorCategory]);

  const filteredProducts = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return PRICE_PRODUCT_DATA.filter((row) => {
      if (majorCategory && row.majorCategory !== majorCategory) return false;
      if (middleCategory && row.middleCategory !== middleCategory) return false;
      if (
        q &&
        !String(row.modelName || '').toLowerCase().includes(q) &&
        !String(row.itemCode || '').toLowerCase().includes(q) &&
        !String(row.series || '').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [keyword, majorCategory, middleCategory]);

  const {
    currentPage,
    pageSize,
    totalCount,
    pagedData,
    setPage,
    setPageSize,
  } = usePagination(filteredProducts, { initialPageSize: 12 });

  return (
    <PageShell
      path="/partner/catalog"
      title="제품 카탈로그"
      description="판매단가 관리 기준의 최신 품번/구성 정보를 카탈로그 형태로 조회합니다."
    >
      <div className={styles.page}>
        <section className={styles.filterBar}>
          <select
            value={majorCategory}
            onChange={(e) => {
              setMajorCategory(e.target.value);
              setMiddleCategory('');
              setPage(1);
            }}
          >
            <option value="">대분류 전체</option>
            {PRICE_CATEGORY_TREE.map((row) => (
              <option key={row.major} value={row.major}>
                {row.major}
              </option>
            ))}
          </select>
          <select
            value={middleCategory}
            onChange={(e) => {
              setMiddleCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">중분류 전체</option>
            {middleOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <input
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            placeholder="품목명/시리즈/품번 검색"
          />
          <div className={styles.count}>조회 {totalCount.toLocaleString()}건</div>
        </section>

        <section className={styles.grid}>
          {pagedData.map((item) => {
            const factoryTotal = (item.components || []).reduce((sum, row) => sum + Number(row.factoryPrice || 0), 0);
            const consumerTotal = (item.components || []).reduce((sum, row) => sum + Number(row.consumerPrice || 0), 0);
            return (
              <article key={item.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <p className={styles.badge}>
                      {item.majorCategory} · {item.middleCategory}
                    </p>
                    <h3 className={styles.title}>{item.modelName}</h3>
                    <p className={styles.code}>{item.itemCode}</p>
                  </div>
                  <div className={styles.imageMock}>{item.imageLabel}</div>
                </div>

                <div className={styles.metaGrid}>
                  <div><span>시리즈</span><strong>{item.series}</strong></div>
                  <div><span>중량</span><strong>{item.weightKg}kg</strong></div>
                  <div><span>KS규격</span><strong>{item.ksSpec}</strong></div>
                  <div><span>포장단위</span><strong>{item.packUnit}</strong></div>
                </div>

                <table className={styles.partsTable}>
                  <thead>
                    <tr>
                      <th>세부품명</th>
                      <th>품번</th>
                      <th>공장도가</th>
                      <th>권장소비자가</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(item.components || []).slice(0, 4).map((row) => (
                      <tr key={row.id}>
                        <td>{row.partName}</td>
                        <td>{row.partCode}</td>
                        <td className={styles.right}>{formatNumber(row.factoryPrice)}</td>
                        <td className={styles.right}>{formatNumber(row.consumerPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={2}>합계</th>
                      <th className={styles.right}>{formatNumber(factoryTotal)}</th>
                      <th className={styles.right}>{formatNumber(consumerTotal)}</th>
                    </tr>
                  </tfoot>
                </table>
              </article>
            );
          })}
        </section>

        <Pagination
          className={styles.pagination}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </PageShell>
  );
}

export default PartnerCatalogPage;
