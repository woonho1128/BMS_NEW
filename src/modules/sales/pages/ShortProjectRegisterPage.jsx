import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { createShortProjectApproval } from '../../approval/data/salesApprovalMock';
import styles from './ShortProjectRegisterPage.module.css';

const VIEW_MODE = {
  LIST: 'list',
  FORM: 'form',
};

const MOCK_SITES = [
  {
    id: 'site-1',
    dealer: '동신건재',
    siteName: '제주 신선고 기숙사',
    builder: 'XX종건',
    deliveryFrom: '2026-03-05',
    deliveryTo: '2026-09-30',
    notes: '관급 공사 현장, XX설비 견적요청, 동종업체 입찰',
    majorItems: [
      { code: 'CC-735', qty: 100, unit: 'SET' },
      { code: 'CL-384', qty: 100, unit: 'EA' },
    ],
    createdAt: '2026-03-01',
  },
  {
    id: 'site-2',
    dealer: '동신건재',
    siteName: '제주 미지정 현장',
    builder: '제주개발',
    deliveryFrom: '2026-04-01',
    deliveryTo: '2026-06-20',
    notes: '모델하우스 우선 출고, 동시견적 검토 가능',
    majorItems: [{ code: 'CC-735', qty: 120, unit: 'SET' }],
    createdAt: '2026-03-18',
  },
];

const EMPTY_ITEM = {
  id: '',
  itemCode: '',
  qty: '1',
  unit: 'EA',
  standardPrice: '0',
  discountRate: '0',
  note: '',
};

function nextItemId() {
  return `item-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function createItem(overrides = {}) {
  return {
    ...EMPTY_ITEM,
    id: nextItemId(),
    ...overrides,
  };
}

function sanitizeNumber(value) {
  return String(value || '').replace(/[^\d.-]/g, '');
}

function formatDateRange(from, to) {
  if (!from && !to) return '-';
  if (!to) return from;
  return `${from} ~ ${to}`;
}

function formatNumber(value) {
  return (Number(value) || 0).toLocaleString('ko-KR');
}

function computeItem(row) {
  const qty = Number(row.qty) || 0;
  const standardPrice = Number(row.standardPrice) || 0;
  const discountRate = Number(row.discountRate) || 0;
  const standardAmount = qty * standardPrice;
  const unitPriceAfterDiscount = Math.round(standardPrice * (1 - discountRate / 100));
  const amountAfterDiscount = qty * unitPriceAfterDiscount;

  return {
    ...row,
    qty,
    standardPrice,
    discountRate,
    standardAmount,
    unitPriceAfterDiscount,
    amountAfterDiscount,
  };
}

function parseDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function ShortProjectRegisterPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(VIEW_MODE.LIST);

  const [dealerFilter, setDealerFilter] = useState('');
  const [builderFilter, setBuilderFilter] = useState('');
  const [siteFilter, setSiteFilter] = useState('');
  const [deliveryFromFilter, setDeliveryFromFilter] = useState('');
  const [deliveryToFilter, setDeliveryToFilter] = useState('');
  const [expandedSiteId, setExpandedSiteId] = useState('');

  const [siteName, setSiteName] = useState('제주 미지정 현장');
  const [builder, setBuilder] = useState('제주개발');
  const [dealer, setDealer] = useState('동신건재');
  const [deliveryFrom, setDeliveryFrom] = useState('2026-04-01');
  const [deliveryTo, setDeliveryTo] = useState('2026-06-20');
  const [duplicateHint, setDuplicateHint] = useState('');
  const [specialNotes, setSpecialNotes] = useState('동종업체 입찰\n관급 공사\n모델하우스 우선 출고');
  const [majorItems, setMajorItems] = useState([
    createItem({
      itemCode: 'CC-735',
      qty: '100',
      unit: 'SET',
      standardPrice: '300000',
      discountRate: '7',
      note: '세트 제외, 부품 포함',
    }),
    createItem({
      itemCode: 'CL-384',
      qty: '100',
      unit: 'EA',
      standardPrice: '280000',
      discountRate: '5',
      note: '비고',
    }),
  ]);

  const filteredSites = useMemo(() => {
    const from = parseDate(deliveryFromFilter);
    const to = parseDate(deliveryToFilter);
    return MOCK_SITES.filter((site) => {
      const dealerOk = !dealerFilter.trim() || site.dealer.toLowerCase().includes(dealerFilter.trim().toLowerCase());
      const builderOk = !builderFilter.trim() || site.builder.toLowerCase().includes(builderFilter.trim().toLowerCase());
      const siteOk = !siteFilter.trim() || site.siteName.toLowerCase().includes(siteFilter.trim().toLowerCase());
      const fromOk = !from || site.deliveryFrom >= from;
      const toOk = !to || site.deliveryFrom <= to;
      return dealerOk && builderOk && siteOk && fromOk && toOk;
    });
  }, [dealerFilter, builderFilter, siteFilter, deliveryFromFilter, deliveryToFilter]);

  const computedItems = useMemo(() => majorItems.map(computeItem), [majorItems]);

  const total = useMemo(
    () =>
      computedItems.reduce(
        (acc, item) => ({
          standard: acc.standard + item.standardAmount,
          discounted: acc.discounted + item.amountAfterDiscount,
        }),
        { standard: 0, discounted: 0 }
      ),
    [computedItems]
  );

  const isFormValid = Boolean(siteName.trim() && dealer.trim() && deliveryFrom && computedItems.length > 0);

  const runDuplicateSearch = useCallback(() => {
    const query = siteName.trim().toLowerCase();
    if (!query) {
      setDuplicateHint('현장명을 입력 후 중복검사를 눌러주세요');
      return;
    }
    const hit = MOCK_SITES.find((s) => s.siteName.toLowerCase().includes(query));
    if (hit) {
      setDuplicateHint(`같은 현장(${hit.siteName}) 이력이 있습니다. 동시견적 가능여부를 확인하세요`);
      return;
    }
    setDuplicateHint('중복된 현장 이력이 없습니다.');
  }, [siteName]);

  const addItemRow = useCallback(() => {
    setMajorItems((prev) => [...prev, createItem()]);
  }, []);

  const removeItemRow = useCallback((id) => {
    setMajorItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItem = useCallback((id, field, value) => {
    setMajorItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === 'qty' || field === 'standardPrice' || field === 'discountRate') {
          return { ...item, [field]: sanitizeNumber(value) };
        }
        return { ...item, [field]: value };
      })
    );
  }, []);

  const loadSiteToForm = useCallback((site) => {
    setSiteName(site.siteName);
    setBuilder(site.builder);
    setDealer(site.dealer);
    setDeliveryFrom(site.deliveryFrom);
    setDeliveryTo(site.deliveryTo);
    setSpecialNotes(site.notes.replace(/, /g, '\n'));
    setDuplicateHint('');
    setMajorItems(
      site.majorItems.map((item) =>
        createItem({
          itemCode: item.code,
          qty: String(item.qty),
          unit: item.unit,
          standardPrice: '300000',
          discountRate: '0',
          note: '',
        })
      )
    );
    setMode(VIEW_MODE.FORM);
  }, []);

  const openForm = useCallback(() => {
    setMode(VIEW_MODE.FORM);
  }, []);

  const backToList = useCallback(() => {
    setMode(VIEW_MODE.LIST);
  }, []);

  const saveDraft = useCallback(() => {
    console.log('단납 현장 임시저장', {
      siteName,
      builder,
      dealer,
      deliveryFrom,
      deliveryTo,
      specialNotes,
      majorItems,
    });
  }, [siteName, builder, dealer, deliveryFrom, deliveryTo, specialNotes, majorItems]);

  const submitForm = useCallback(() => {
    if (!isFormValid) return;
    createShortProjectApproval({
      siteName,
      builder,
      dealer,
      deliveryFrom,
      deliveryTo,
      specialNote: specialNotes,
      items: computedItems.map((item) => ({
        itemCode: item.itemCode,
        qty: Number(item.qty) || 0,
        unit: item.unit,
        standardPrice: Number(item.standardPrice) || 0,
        discountRate: Number(item.discountRate) || 0,
        standardAmount: Number(item.standardAmount) || 0,
        unitPrice: Number(item.unitPriceAfterDiscount) || 0,
        amount: Number(item.amountAfterDiscount) || 0,
        discountAmount: (Number(item.standardAmount) || 0) - (Number(item.amountAfterDiscount) || 0),
        note: item.note || '',
      })),
      grossRate: '-',
      drafter: '영업담당',
    });
    navigate(`${ROUTES.APPROVAL_SALES}?category=shortProject`);
  }, [isFormValid, siteName, builder, dealer, deliveryFrom, deliveryTo, specialNotes, computedItems, navigate]);

  const listActions = (
    <Button variant="primary" onClick={openForm}>
      등록하기
    </Button>
  );

  const formActions = (
    <Button variant="secondary" onClick={backToList}>
      목록으로
    </Button>
  );

  return (
    <PageShell
      path={ROUTES.SHORT_PROJECT_REGISTER}
      title="단납 현장 등록"
      description={
        mode === VIEW_MODE.LIST
          ? '기존 등록 현장을 조회하고 신규 등록으로 이어서 작업하세요'
          : '기본 정보와 대표품번을 입력하여 결재 상신할 수 있습니다.'
      }
      actions={mode === VIEW_MODE.LIST ? listActions : formActions}
      className={styles.shellWide}
    >
      <div className={styles.page}>
        {mode === VIEW_MODE.LIST ? (
          <>
            <Card title="조회 조건" className={styles.sectionCard}>
              <CardBody>
                <div className={styles.searchRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>대리점</label>
                    <input
                      className={styles.input}
                      value={dealerFilter}
                      onChange={(e) => setDealerFilter(e.target.value)}
                      placeholder="대리점 검색"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>건설사</label>
                    <input
                      className={styles.input}
                      value={builderFilter}
                      onChange={(e) => setBuilderFilter(e.target.value)}
                      placeholder="건설사검색"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>현장명</label>
                    <input
                      className={styles.input}
                      value={siteFilter}
                      onChange={(e) => setSiteFilter(e.target.value)}
                      placeholder="현장명검색"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>납품예정일</label>
                    <div className={styles.dateRange}>
                      <input
                        className={styles.input}
                        type="date"
                        value={deliveryFromFilter}
                        onChange={(e) => setDeliveryFromFilter(e.target.value)}
                      />
                      <span className={styles.rangeDivider}>~</span>
                      <input
                        className={styles.input}
                        type="date"
                        value={deliveryToFilter}
                        onChange={(e) => setDeliveryToFilter(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card title={`조회 결과 (${filteredSites.length}건)`} className={styles.sectionCard}>
              <CardBody tight>
                <div className={styles.tableWrap}>
                  <table className={styles.listTable}>
                    <thead>
                      <tr>
                        <th>대리점</th>
                        <th>현장명</th>
                        <th>건설사</th>
                        <th>납품예정일</th>
                        <th>특이사항</th>
                        <th>대표품번</th>
                        <th>등록일자</th>
                        <th>등록</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSites.map((site) => (
                        <Fragment key={site.id}>
                          <tr>
                            <td>{site.dealer}</td>
                            <td>{site.siteName}</td>
                            <td>{site.builder}</td>
                            <td>{formatDateRange(site.deliveryFrom, site.deliveryTo)}</td>
                            <td>{site.notes}</td>
                            <td>
                              <button
                                type="button"
                                className={styles.textButton}
                                onClick={() => setExpandedSiteId((prev) => (prev === site.id ? '' : site.id))}
                              >
                                보기
                              </button>
                            </td>
                            <td>{site.createdAt}</td>
                            <td>
                              <Button variant="secondary" onClick={() => loadSiteToForm(site)}>
                                등록하기
                              </Button>
                            </td>
                          </tr>
                          {expandedSiteId === site.id && (
                            <tr className={styles.expandedRow}>
                              <td colSpan={8}>
                                <div className={styles.itemPreviewWrap}>
                                  {site.majorItems.map((item) => (
                                    <span key={`${site.id}-${item.code}`} className={styles.itemChip}>
                                      {item.code} / {item.qty} {item.unit}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </>
        ) : (
          <>
            <Card title="기본 정보" className={styles.sectionCard}>
              <CardBody>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      현장명<span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inlineField}>
                      <input className={styles.input} value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                      <Button variant="secondary" onClick={runDuplicateSearch}>
                        중복검사
                      </Button>
                    </div>
                    <p className={styles.helper}>{duplicateHint || '같은 현장 이력 여부를 먼저 확인하세요'}</p>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>건설사</label>
                    <input className={styles.input} value={builder} onChange={(e) => setBuilder(e.target.value)} />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>
                      대리점 <span className={styles.required}>*</span>
                    </label>
                    <input className={styles.input} value={dealer} onChange={(e) => setDealer(e.target.value)} />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>납품예정</label>
                    <div className={styles.dateRange}>
                      <input className={styles.input} type="date" value={deliveryFrom} onChange={(e) => setDeliveryFrom(e.target.value)} />
                      <span className={styles.rangeDivider}>~</span>
                      <input className={styles.input} type="date" value={deliveryTo} onChange={(e) => setDeliveryTo(e.target.value)} />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card
              title="대표품번"
              className={styles.sectionCard}
              actions={
                <Button variant="secondary" onClick={addItemRow}>
                  대표품번 추가
                </Button>
              }
            >
              <CardBody tight>
                <div className={styles.tableWrap}>
                  <table className={styles.itemTable}>
                    <colgroup>
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '9%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '9%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '8%' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>항목명</th>
                        <th>수량</th>
                        <th>단위</th>
                        <th>기준단가</th>
                        <th>금액</th>
                        <th>할인율(%)</th>
                        <th>기본 할인단가</th>
                        <th>금액</th>
                        <th>특이사항</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {computedItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <input
                              className={styles.tableInput}
                              value={item.itemCode}
                              onChange={(e) => updateItem(item.id, 'itemCode', e.target.value)}
                              placeholder="예) CC-735"
                            />
                          </td>
                          <td>
                            <input
                              className={styles.tableInput}
                              inputMode="numeric"
                              value={item.qty}
                              onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                            />
                          </td>
                          <td>
                            <input className={styles.tableInput} value={item.unit} onChange={(e) => updateItem(item.id, 'unit', e.target.value)} />
                          </td>
                          <td>
                            <input
                              className={styles.tableInput}
                              inputMode="numeric"
                              value={item.standardPrice}
                              onChange={(e) => updateItem(item.id, 'standardPrice', e.target.value)}
                            />
                          </td>
                          <td className={styles.numberCell}>{formatNumber(item.standardAmount)}</td>
                          <td>
                            <input
                              className={styles.tableInput}
                              inputMode="decimal"
                              value={item.discountRate}
                              onChange={(e) => updateItem(item.id, 'discountRate', e.target.value)}
                            />
                          </td>
                          <td className={styles.numberCell}>{formatNumber(item.unitPriceAfterDiscount)}</td>
                          <td className={styles.numberCell}>{formatNumber(item.amountAfterDiscount)}</td>
                          <td>
                            <input
                              className={styles.tableInput}
                              value={item.note}
                              onChange={(e) => updateItem(item.id, 'note', e.target.value)}
                              placeholder="비고"
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className={styles.deleteRowButton}
                              onClick={() => removeItemRow(item.id)}
                              disabled={computedItems.length <= 1}
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4}>합계</td>
                        <td className={styles.numberCell}>{formatNumber(total.standard)}</td>
                        <td />
                        <td />
                        <td className={styles.numberCell}>{formatNumber(total.discounted)}</td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardBody>
            </Card>

            <Card title="특이사항" className={styles.sectionCard}>
              <CardBody>
                <textarea
                  className={styles.textarea}
                  rows={6}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="동종업체 입찰, 관급 공사, 모델하우스 우선 출고 등"
                />
              </CardBody>
            </Card>

            <div className={styles.footer}>
              <Button variant="secondary" onClick={backToList}>
                취소
              </Button>
              <Button variant="secondary" onClick={saveDraft}>
                임시저장
              </Button>
              <Button variant="primary" onClick={submitForm} disabled={!isFormValid}>
                결재 상신
              </Button>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}

export default ShortProjectRegisterPage;
