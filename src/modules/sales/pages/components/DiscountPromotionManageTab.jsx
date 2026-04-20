import React, { useMemo, useState } from 'react';
import { notify } from '../../../../shared/utils/notify';

const createRow = (overrides = {}) => ({
  id: `promo-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  division: '장기재고',
  itemType: '',
  setCode: '',
  componentCode: '',
  erpCode: '',
  stockQty: 0,
  stockAmount: 0,
  reserveAmount: 0,
  estimatedSales: 0,
  salePrice: 0,
  costPrice: 0,
  margin: 0,
  targetQty: 0,
  promoPrice: 0,
  discountRate: 0,
  promoSales: 0,
  promoMargin: 0,
  promoMarginRate: 0,
  salesContribution: 0,
  promoContribution: 0,
  contributionGap: 0,
  remark: '',
  rowType: 'normal',
  ...overrides,
});

const INITIAL_ROWS = [
  createRow({
    division: '장기재고',
    itemType: '일체형(국산)',
    setCode: 'DST-650',
    componentCode: 'CC-650',
    erpCode: 'CCS650LZWHW',
    stockQty: 349,
    stockAmount: 112,
    reserveAmount: 0,
    estimatedSales: 0,
    salePrice: 320717,
    costPrice: 476540,
    margin: 33,
    targetQty: 349,
    promoPrice: 330000,
    discountRate: 31,
    promoSales: 166,
    promoMargin: 115,
    promoMarginRate: 3,
    salesContribution: 54,
    promoContribution: 3,
    contributionGap: -51,
    remark: '일체형 하부도기 포함, 세트출고',
  }),
  createRow({
    division: '일반',
    itemType: '세면기(국산)',
    setCode: 'CL-1200',
    componentCode: 'DST-650D',
    erpCode: 'CLA1200ZWHW',
    stockQty: 30,
    stockAmount: 3,
    reserveAmount: 0,
    estimatedSales: 0,
    salePrice: 85435,
    costPrice: 109990,
    margin: 22,
    targetQty: 30,
    promoPrice: 40000,
    discountRate: 64,
    promoSales: 3,
    promoMargin: 1,
    promoMarginRate: -114,
    salesContribution: 1,
    promoContribution: -1,
    contributionGap: -2,
    remark: '장기재고 소진',
  }),
  createRow({
    division: '일반',
    itemType: '양변기(OEM)',
    setCode: 'CL-1300',
    componentCode: 'TFT-650L',
    erpCode: 'CLA1300ZWHW',
    stockQty: 313,
    stockAmount: 40,
    reserveAmount: 0,
    estimatedSales: 0,
    salePrice: 128086,
    costPrice: 192490,
    margin: 33,
    targetQty: 313,
    promoPrice: 40000,
    discountRate: 79,
    promoSales: 60,
    promoMargin: 13,
    promoMarginRate: -220,
    salesContribution: 20,
    promoContribution: -28,
    contributionGap: -48,
    remark: '장기재고 소진',
  }),
];

const metricFields = [
  { key: 'stockQty', colClass: 'colStock' },
  { key: 'stockAmount', colClass: 'colStock' },
  { key: 'reserveAmount', colClass: 'colStock' },
  { key: 'estimatedSales', colClass: 'colStock' },
  { key: 'salePrice', colClass: 'colNormal' },
  { key: 'costPrice', colClass: 'colNormal' },
  { key: 'margin', colClass: 'colNormal' },
  { key: 'targetQty', colClass: 'colPromo' },
  { key: 'promoPrice', colClass: 'colPromo' },
  { key: 'discountRate', colClass: 'colPromo' },
  { key: 'promoSales', colClass: 'colPromo' },
  { key: 'promoMargin', colClass: 'colPromo' },
  { key: 'promoMarginRate', colClass: 'colPromo' },
  { key: 'salesContribution', colClass: 'colProfit' },
  { key: 'promoContribution', colClass: 'colProfit' },
  { key: 'contributionGap', colClass: 'colProfit' },
];

const formatNumber = (value) => {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return '0';
  return num.toLocaleString();
};

function NumericInput({ value, onChange, className, disabled = false }) {
  return (
    <input
      className={className}
      value={formatNumber(value)}
      disabled={disabled}
      onChange={(e) => {
        if (disabled) return;
        const next = Number(String(e.target.value).replaceAll(',', '')) || 0;
        onChange(next);
      }}
    />
  );
}

export default function DiscountPromotionManageTab({ styles }) {
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [promoLabel, setPromoLabel] = useState('2026년 1월~2월 프로모션');
  const selectableRows = rows.filter((row) => row.rowType !== 'subtotal');

  const selectedCount = selectedIds.length;

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        if (row.rowType === 'subtotal') return acc;
        return {
          stockQty: acc.stockQty + Number(row.stockQty || 0),
          stockAmount: acc.stockAmount + Number(row.stockAmount || 0),
          promoSales: acc.promoSales + Number(row.promoSales || 0),
          promoMargin: acc.promoMargin + Number(row.promoMargin || 0),
          salesContribution: acc.salesContribution + Number(row.salesContribution || 0),
          promoContribution: acc.promoContribution + Number(row.promoContribution || 0),
          contributionGap: acc.contributionGap + Number(row.contributionGap || 0),
        };
      },
      { stockQty: 0, stockAmount: 0, promoSales: 0, promoMargin: 0, salesContribution: 0, promoContribution: 0, contributionGap: 0 },
    );
  }, [rows]);

  const toggleRow = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    if (selectedIds.length === selectableRows.length) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(selectableRows.map((row) => row.id));
  };

  const updateField = (id, field, value) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleAddRow = () => {
    const newRow = createRow();
    setRows((prev) => [...prev, newRow]);
    setExpandedIds((prev) => [...prev, newRow.id]);
  };

  const handleAddSubtotal = () => {
    const lastSubtotalIndex = [...rows]
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => row.rowType === 'subtotal')
      .map(({ index }) => index)
      .pop();

    const startIndex = Number.isInteger(lastSubtotalIndex) ? lastSubtotalIndex + 1 : 0;
    const targetRows = rows
      .slice(startIndex)
      .filter((row) => row.rowType !== 'subtotal');

    if (!targetRows.length) {
      notify.warning('소계를 계산할 대상 행이 없습니다.');
      return;
    }

    const subtotal = targetRows.reduce(
      (acc, row) => ({
        stockQty: acc.stockQty + Number(row.stockQty || 0),
        stockAmount: acc.stockAmount + Number(row.stockAmount || 0),
        promoSales: acc.promoSales + Number(row.promoSales || 0),
        promoMargin: acc.promoMargin + Number(row.promoMargin || 0),
      }),
      { stockQty: 0, stockAmount: 0, promoSales: 0, promoMargin: 0 },
    );

    const subtotalRow = createRow({
      division: '소계',
      itemType: '-',
      setCode: '-',
      componentCode: '-',
      erpCode: '-',
      stockQty: subtotal.stockQty,
      stockAmount: subtotal.stockAmount,
      promoSales: subtotal.promoSales,
      promoMargin: subtotal.promoMargin,
      remark: '누적 소계',
      rowType: 'subtotal',
    });

    setRows((prev) => [...prev, subtotalRow]);
    notify.success('소계를 추가했습니다.');
  };

  const handleDelete = () => {
    if (!selectedIds.length) {
      notify.info('삭제할 행을 선택해주세요.');
      return;
    }
    setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
    setExpandedIds((prev) => prev.filter((id) => !selectedIds.includes(id)));
    setSelectedIds([]);
    notify.success(`${selectedIds.length}건을 삭제했습니다.`);
  };

  return (
    <div className={styles.promoManageFrame}>
      <div className={styles.promoManageTopBar}>
        <div className={styles.promoManageLeftControls}>
          <h3 className={styles.promoManageTitle}>프로모션 등록</h3>
          <span className={styles.promoControlLabel}>프로모션</span>
          <input
            className={styles.promoControlInput}
            value={promoLabel}
            onChange={(e) => setPromoLabel(e.target.value)}
          />
          <button type="button" className={styles.promoGhostBtn} onClick={() => notify.info('판매단가 관리 데이터를 불러오는 기능은 다음 단계에서 연결합니다.')}>
            판매단가 관리(단가표) 불러오기
          </button>
        </div>

        <div className={styles.promoManageRightControls}>
          <button type="button" className={styles.promoTinyBtn} onClick={handleAddRow}>행추가</button>
          <button type="button" className={styles.promoTinyBtn} onClick={handleAddSubtotal}>소계 추가</button>
          <button type="button" className={styles.promoTinyBtnDanger} onClick={handleDelete}>삭제</button>
        </div>
      </div>

      <div className={styles.promoManageTableWrap}>
        <table className={styles.promoManageTable}>
          <thead>
            <tr>
              <th rowSpan={2} className={styles.stickyCol}>
                <div className={styles.checkCellInner}>
                  <input
                    className={styles.checkInput}
                    type="checkbox"
                    checked={selectableRows.length > 0 && selectedIds.length === selectableRows.length}
                    onChange={toggleAll}
                    aria-label="전체 선택"
                  />
                </div>
              </th>
              <th rowSpan={2} className={styles.expandColHead}>비고</th>
              <th rowSpan={2} className={styles.colDivisionHead}>구분</th>
              <th rowSpan={2} className={styles.colSetHead}>SET품번</th>
              <th rowSpan={2} className={styles.colComponentHead}>구성품</th>
              <th rowSpan={2} className={styles.colErpHead}>세부(ERP)품번</th>
              <th colSpan={4} className={styles.groupStock}>
                재고(8/26 기준)
                <br />
                재고충당금 (백만원)
              </th>
              <th colSpan={3} className={styles.groupNormal}>정상판매</th>
              <th colSpan={6} className={styles.groupPromo}>프로모션(안)</th>
              <th colSpan={3} className={styles.groupProfit}>
                매출총이익
                <br />
                (백만원)
              </th>
            </tr>
            <tr>
              <th className={styles.groupStock}>수량<br />(EA)</th>
              <th className={styles.groupStock}>금액<br />(백만원)</th>
              <th className={styles.groupStock}>충당금</th>
              <th className={styles.groupStock}>예상 할인금액</th>
              <th className={styles.groupNormal}>재고단가<br />(원)</th>
              <th className={styles.groupNormal}>공장도가<br />(원)</th>
              <th className={`${styles.groupNormal} ${styles.colMarginRateHead}`}>매출<br />총이익율(%)</th>
              <th className={styles.groupPromo}>목표수량<br />(EA)</th>
              <th className={styles.groupPromo}>프로모션가<br />(원)</th>
              <th className={styles.groupPromo}>할인율(%)</th>
              <th className={styles.groupPromo}>공장도가 매출액<br />(백만원)</th>
              <th className={styles.groupPromo}>프로모션 매출액<br />(백만원)</th>
              <th className={`${styles.groupPromo} ${styles.colMarginRateHead}`}>매출<br />총이익율(%)</th>
              <th className={styles.groupProfit}>공장도</th>
              <th className={styles.groupProfit}>프로모션</th>
              <th className={styles.groupProfit}>공장도<br />대비 증감</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const checked = selectedIds.includes(row.id);
              const expanded = expandedIds.includes(row.id);
              const isSubtotal = row.rowType === 'subtotal';
              return (
                <React.Fragment key={row.id}>
                  <tr className={isSubtotal ? styles.promoSubtotalRow : ''}>
                    <td className={styles.stickyCol}>
                      <div className={styles.checkCellInner}>
                        <input
                          className={styles.checkInput}
                          type="checkbox"
                          checked={checked}
                          disabled={isSubtotal}
                          onChange={() => {
                            if (isSubtotal) return;
                            toggleRow(row.id);
                          }}
                        />
                      </div>
                    </td>
                    {isSubtotal ? (
                      <>
                        <td className={styles.expandColCell} />
                        <td colSpan={4} className={styles.subtotalLabelCell}>소계</td>
                      </>
                    ) : (
                      <>
                        <td className={styles.expandColCell}>
                          <button
                            type="button"
                            className={styles.expandBtn}
                            onClick={() => toggleExpand(row.id)}
                            aria-label="비고 열기"
                          >
                            {expanded ? '▾' : '▸'}
                          </button>
                        </td>
                        <td className={styles.colDivisionCell}>
                          <div className={styles.promoDivisionCell}>
                            <select
                              className={styles.promoCellSelect}
                              value={row.division}
                              disabled={isSubtotal}
                              onChange={(e) => updateField(row.id, 'division', e.target.value)}
                            >
                              <option value="일반">일반</option>
                              <option value="장기재고">장기재고</option>
                              <option value="신제품">신제품</option>
                              <option value="컨테이너">컨테이너</option>
                              <option value="전시지원">전시지원</option>
                              <option value="온라인마케팅활성화">온라인마케팅활성화</option>
                              <option value="소계">소계</option>
                            </select>
                            <select
                              className={`${styles.promoCellSelect} ${styles.promoTypeSelect}`}
                              value={row.itemType}
                              disabled={isSubtotal}
                              onChange={(e) => updateField(row.id, 'itemType', e.target.value)}
                            >
                              <option value="">유형 선택</option>
                              <option value="일체형(국산)">일체형(국산)</option>
                              <option value="세면기(국산)">세면기(국산)</option>
                              <option value="양변기(OEM)">양변기(OEM)</option>
                            </select>
                          </div>
                        </td>
                        <td className={styles.colSetCell}>
                          <input
                            className={styles.promoCellInput}
                            value={row.setCode}
                            placeholder="SET품번"
                            disabled={isSubtotal}
                            onChange={(e) => updateField(row.id, 'setCode', e.target.value)}
                          />
                        </td>
                        <td className={styles.colComponentCell}>
                          <input
                            className={styles.promoCellInput}
                            value={row.componentCode}
                            placeholder="구성품"
                            disabled={isSubtotal}
                            onChange={(e) => updateField(row.id, 'componentCode', e.target.value)}
                          />
                        </td>
                        <td className={styles.colErpCell}>
                          <input
                            className={styles.promoCellInput}
                            value={row.erpCode}
                            placeholder="세부(ERP)품번"
                            disabled={isSubtotal}
                            onChange={(e) => updateField(row.id, 'erpCode', e.target.value)}
                          />
                        </td>
                      </>
                    )}
                    {metricFields.map((field) => (
                      <td
                        key={`${row.id}-${field.key}`}
                        className={`${styles[field.colClass]} ${(field.key === 'margin' || field.key === 'promoMarginRate') ? styles.colMarginRate : ''}`}
                      >
                        <NumericInput
                          className={`${styles.promoCellInput} ${styles.promoCellInputNum}`}
                          value={row[field.key]}
                          disabled={isSubtotal}
                          onChange={(value) => updateField(row.id, field.key, value)}
                        />
                      </td>
                    ))}
                  </tr>
                  {!isSubtotal && expanded && (
                    <tr className={styles.promoRemarkRow}>
                      <td colSpan={22}>
                        <div className={styles.promoRemarkInner}>
                          <strong>비고</strong>
                          <input
                            className={styles.promoRemarkInput}
                            value={row.remark}
                            placeholder="비고 입력"
                            disabled={isSubtotal}
                            onChange={(e) => updateField(row.id, 'remark', e.target.value)}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th className={styles.stickyCol} />
              <th className={styles.expandColCell}>{selectedCount ? `${selectedCount}건` : ''}</th>
              <th colSpan={4}>합계</th>
              <th className={styles.colStock}>{formatNumber(totals.stockQty)}</th>
              <th className={styles.colStock}>{formatNumber(totals.stockAmount)}</th>
              <th className={styles.colStock}>-</th>
              <th className={styles.colStock}>-</th>
              <th className={styles.colNormal}>-</th>
              <th className={styles.colNormal}>-</th>
              <th className={styles.colNormal}>-</th>
              <th className={styles.colPromo}>-</th>
              <th className={styles.colPromo}>-</th>
              <th className={styles.colPromo}>-</th>
              <th className={styles.colPromo}>{formatNumber(totals.promoSales)}</th>
              <th className={styles.colPromo}>{formatNumber(totals.promoMargin)}</th>
              <th className={styles.colPromo}>-</th>
              <th className={styles.colProfit}>{formatNumber(totals.salesContribution)}</th>
              <th className={styles.colProfit}>{formatNumber(totals.promoContribution)}</th>
              <th className={styles.colProfit}>{formatNumber(totals.contributionGap)}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className={styles.promoManageBottomBar}>
        <div className={styles.promoActionWrap}>
          <button type="button" className={styles.promoActionSecondary}>취소</button>
          <button type="button" className={styles.promoActionSecondary}>임시저장</button>
          <button type="button" className={styles.promoActionPrimary}>저장</button>
        </div>
      </div>
    </div>
  );
}
