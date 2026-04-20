import React from 'react';
import { Button } from '../../../../shared/components/Button/Button';
import { PRICE_CATEGORY_TREE } from '../../data/priceCatalogMock';
import { formatNum } from '../discountPromotion.constants';

export default function DiscountPriceManageTab({
  styles,
  priceFilter,
  handlePriceFilterChange,
  middleCategoryOptions,
  pagedPriceProducts,
  selectedPriceProduct,
  handlePriceSelectItem,
  priceTotalCount,
  handleNewPriceProduct,
  setPriceUploadModalOpen,
  priceCurrentPage,
  setPricePage,
  priceTotalPages,
  priceDraft,
  priceDraftStatus,
  handleSavePriceDraft,
  handlePriceDraftField,
  handlePriceDraftSeriesName,
  handlePriceDraftComponentField,
  selectedPriceSummary,
  handleAddPriceComponent,
  handlePriceDraftDocResetAll,
  handlePriceDraftDocUpload,
  handlePriceDraftDocReset,
  handlePriceDraftDocRemove,
}) {
  return (
    <div className={styles.priceManageLayout}>
      <aside className={styles.priceItemPanel}>
        <div className={styles.priceItemPanelTitle}>품목 목록</div>
        <div className={styles.priceSearchBox}>
          <select value={priceFilter.majorCategory} onChange={(e) => handlePriceFilterChange('majorCategory', e.target.value)}>
            <option value="">대분류 전체</option>
            {PRICE_CATEGORY_TREE.map((row) => (
              <option key={row.major} value={row.major}>
                {row.major}
              </option>
            ))}
          </select>
          <select value={priceFilter.middleCategory} onChange={(e) => handlePriceFilterChange('middleCategory', e.target.value)}>
            <option value="">중분류 전체</option>
            {middleCategoryOptions.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <input value={priceFilter.keyword} onChange={(e) => handlePriceFilterChange('keyword', e.target.value)} placeholder="품목명/품번 검색" />
        </div>
        <div className={styles.priceItemList}>
          {pagedPriceProducts.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.priceItemButton} ${selectedPriceProduct?.id === item.id ? styles.priceItemButtonActive : ''}`}
              onClick={() => handlePriceSelectItem(item.id)}
            >
              <strong>{item.modelName}</strong>
              <span>
                {item.itemCode} · {item.middleCategory}
              </span>
            </button>
          ))}
        </div>
        <div className={styles.priceItemPanelFooter}>
          <div className={styles.priceItemCount}>조회 {priceTotalCount.toLocaleString()}건</div>
          <div className={styles.priceItemButtons}>
            <Button variant="secondary" onClick={handleNewPriceProduct}>
              + 신규 등록
            </Button>
            <Button variant="secondary" onClick={() => setPriceUploadModalOpen(true)}>
              엑셀 업로드
            </Button>
          </div>
          <div className={styles.priceArrowPager}>
            <button
              type="button"
              className={styles.priceArrowButton}
              onClick={() => setPricePage(priceCurrentPage - 1)}
              disabled={priceCurrentPage <= 1}
              aria-label="이전 페이지"
            >
              ◀
            </button>
            <span className={styles.priceArrowPageText}>
              {priceCurrentPage} / {priceTotalPages}
            </span>
            <button
              type="button"
              className={styles.priceArrowButton}
              onClick={() => setPricePage(priceCurrentPage + 1)}
              disabled={priceCurrentPage >= priceTotalPages}
              aria-label="다음 페이지"
            >
              ▶
            </button>
          </div>
        </div>
      </aside>

      <section className={styles.priceEditorPanel}>
        <div className={styles.priceEditorHeader}>
          <div>
            <h3>{priceDraft?.modelName || '-'}</h3>
            <p>
              기준일 {priceDraft?.baseDate || '-'} · 단위 원 · {priceDraftStatus}
            </p>
          </div>
          <div className={styles.priceEditorActions}>
            <Button variant="secondary">엑셀 양식 다운로드</Button>
            <Button variant="primary" onClick={handleSavePriceDraft}>
              등록/수정 저장
            </Button>
          </div>
        </div>

        <div className={styles.priceInfoGrid}>
          <label className={styles.priceInfoField}>
            <span>대분류</span>
            <select value={priceDraft?.majorCategory || ''} onChange={(e) => handlePriceDraftField('majorCategory', e.target.value)}>
              {PRICE_CATEGORY_TREE.map((row) => (
                <option key={row.major} value={row.major}>
                  {row.major}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.priceInfoField}>
            <span>중분류</span>
            <input value={priceDraft?.middleCategory || ''} onChange={(e) => handlePriceDraftField('middleCategory', e.target.value)} />
          </label>
          <label className={styles.priceInfoField}>
            <span>시리즈명</span>
            <input value={priceDraft?.seriesName || priceDraft?.series || ''} onChange={(e) => handlePriceDraftSeriesName(e.target.value)} />
          </label>
          <label className={styles.priceInfoField}>
            <span>대표 품번</span>
            <input value={priceDraft?.itemCode || ''} onChange={(e) => handlePriceDraftField('itemCode', e.target.value)} />
          </label>
          <label className={styles.priceInfoField}>
            <span>중량(Kg)</span>
            <input value={priceDraft?.weightKg || ''} onChange={(e) => handlePriceDraftField('weightKg', e.target.value)} />
          </label>
          <label className={styles.priceInfoField}>
            <span>KS규격</span>
            <input value={priceDraft?.ksSpec || ''} onChange={(e) => handlePriceDraftField('ksSpec', e.target.value)} />
          </label>
          <label className={styles.priceInfoField}>
            <span>절수등급</span>
            <input value={priceDraft?.waterSavingGrade || ''} onChange={(e) => handlePriceDraftField('waterSavingGrade', e.target.value)} placeholder="예: 1등급" />
          </label>
          <label className={styles.priceInfoField}>
            <span>포장단위</span>
            <input value={priceDraft?.packUnit || ''} onChange={(e) => handlePriceDraftField('packUnit', e.target.value)} />
          </label>
          <label className={styles.priceInfoField}>
            <span>출고지</span>
            <input value={priceDraft?.shippingOrigin || ''} onChange={(e) => handlePriceDraftField('shippingOrigin', e.target.value)} placeholder="예: 제천, 창원" />
          </label>
          <label className={styles.priceInfoField}>
            <span>비고</span>
            <input value={priceDraft?.note || ''} onChange={(e) => handlePriceDraftField('note', e.target.value)} />
          </label>
        </div>

        <div className={styles.priceContentRow}>
          <div className={styles.priceImageBox}>
            <div className={styles.priceImageMock}>{priceDraft?.imageLabel || 'IMAGE'}</div>
            <Button variant="secondary" className={styles.priceImageButton}>
              이미지 변경
            </Button>
          </div>

          <div className={styles.priceTableWrap}>
            <table className={styles.priceEditorTable}>
              <thead>
                <tr>
                  <th>세부품명</th>
                  <th>품번</th>
                  <th className={styles.rightCell}>공장도가(VAT-)</th>
                  <th className={styles.rightCell}>권장소비자가(VAT+)</th>
                  <th>포장정보</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                {(priceDraft?.components || []).map((row) => (
                  <tr key={`${priceDraft?.id}-${row.id}`}>
                    <td>
                      <input className={styles.priceCellInput} value={row.partName} onChange={(e) => handlePriceDraftComponentField(row.id, 'partName', e.target.value)} />
                    </td>
                    <td>
                      <input className={styles.priceCellInput} value={row.partCode} onChange={(e) => handlePriceDraftComponentField(row.id, 'partCode', e.target.value)} />
                    </td>
                    <td className={styles.rightCell}>
                      <input className={`${styles.priceCellInput} ${styles.priceCellInputRight}`} value={formatNum(row.factoryPrice)} onChange={(e) => handlePriceDraftComponentField(row.id, 'factoryPrice', e.target.value)} />
                    </td>
                    <td className={styles.rightCell}>
                      <input className={`${styles.priceCellInput} ${styles.priceCellInputRight}`} value={formatNum(row.consumerPrice)} onChange={(e) => handlePriceDraftComponentField(row.id, 'consumerPrice', e.target.value)} />
                    </td>
                    <td>
                      <input className={styles.priceCellInput} value={row.packInfo} onChange={(e) => handlePriceDraftComponentField(row.id, 'packInfo', e.target.value)} />
                    </td>
                    <td>
                      <input className={styles.priceCellInput} value={row.remark} onChange={(e) => handlePriceDraftComponentField(row.id, 'remark', e.target.value)} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={2}>합계</th>
                  <th className={styles.rightCell}>{formatNum(selectedPriceSummary.factory)}</th>
                  <th className={styles.rightCell}>{formatNum(selectedPriceSummary.consumer)}</th>
                  <th colSpan={2} />
                </tr>
              </tfoot>
            </table>
            <div className={styles.priceTableFooter}>
              <Button variant="secondary" onClick={handleAddPriceComponent}>
                + 세부 품번 행 추가
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.priceDocsSection}>
          <div className={styles.priceDocsHeader}>
            <div>
              <div className={styles.priceDocsTitle}>품목 문서 등록</div>
              <p className={styles.priceDocsGuide}>문서별 파일 업로드로 등록하며, 다중 선택 업로드를 지원합니다.</p>
            </div>
            <Button variant="secondary" onClick={handlePriceDraftDocResetAll}>
              문서 전체 초기화
            </Button>
          </div>
          <div className={styles.priceDocsGrid}>
            <label className={styles.priceDocField}>
              <span>시험성적서</span>
              <div className={styles.priceDocInputRow}>
                <label className={styles.priceUploadLabel}>
                  파일 업로드
                  <input type="file" multiple onChange={(e) => { handlePriceDraftDocUpload('testReport', e.target.files); e.target.value = ''; }} />
                </label>
                <Button variant="secondary" onClick={() => handlePriceDraftDocReset('testReport')}>초기화</Button>
              </div>
              <div className={styles.priceDocList}>
                {(priceDraft?.docFiles?.testReport || []).map((name, idx) => (
                  <button key={`${name}-${idx}`} type="button" className={styles.priceDocChip} onClick={() => handlePriceDraftDocRemove('testReport', idx)}>
                    {name} ✕
                  </button>
                ))}
              </div>
            </label>
            <label className={styles.priceDocField}>
              <span>환경표지인증서</span>
              <div className={styles.priceDocInputRow}>
                <label className={styles.priceUploadLabel}>
                  파일 업로드
                  <input type="file" multiple onChange={(e) => { handlePriceDraftDocUpload('ecoCert', e.target.files); e.target.value = ''; }} />
                </label>
                <Button variant="secondary" onClick={() => handlePriceDraftDocReset('ecoCert')}>초기화</Button>
              </div>
              <div className={styles.priceDocList}>
                {(priceDraft?.docFiles?.ecoCert || []).map((name, idx) => (
                  <button key={`${name}-${idx}`} type="button" className={styles.priceDocChip} onClick={() => handlePriceDraftDocRemove('ecoCert', idx)}>
                    {name} ✕
                  </button>
                ))}
              </div>
            </label>
            <label className={styles.priceDocField}>
              <span>제품이미지 도면 PDF</span>
              <div className={styles.priceDocInputRow}>
                <label className={styles.priceUploadLabel}>
                  파일 업로드
                  <input type="file" multiple accept=".pdf" onChange={(e) => { handlePriceDraftDocUpload('drawingPdf', e.target.files); e.target.value = ''; }} />
                </label>
                <Button variant="secondary" onClick={() => handlePriceDraftDocReset('drawingPdf')}>초기화</Button>
              </div>
              <div className={styles.priceDocList}>
                {(priceDraft?.docFiles?.drawingPdf || []).map((name, idx) => (
                  <button key={`${name}-${idx}`} type="button" className={styles.priceDocChip} onClick={() => handlePriceDraftDocRemove('drawingPdf', idx)}>
                    {name} ✕
                  </button>
                ))}
              </div>
            </label>
            <label className={styles.priceDocField}>
              <span>DWG</span>
              <div className={styles.priceDocInputRow}>
                <label className={styles.priceUploadLabel}>
                  파일 업로드
                  <input type="file" multiple accept=".dwg" onChange={(e) => { handlePriceDraftDocUpload('drawingDwg', e.target.files); e.target.value = ''; }} />
                </label>
                <Button variant="secondary" onClick={() => handlePriceDraftDocReset('drawingDwg')}>초기화</Button>
              </div>
              <div className={styles.priceDocList}>
                {(priceDraft?.docFiles?.drawingDwg || []).map((name, idx) => (
                  <button key={`${name}-${idx}`} type="button" className={styles.priceDocChip} onClick={() => handlePriceDraftDocRemove('drawingDwg', idx)}>
                    {name} ✕
                  </button>
                ))}
              </div>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}
