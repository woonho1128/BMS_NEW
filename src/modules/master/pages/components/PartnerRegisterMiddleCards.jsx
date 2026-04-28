import { Button } from '../../../../shared/components/Button/Button';
import { Card, CardBody } from '../../../../shared/components/Card';
import { classnames } from '../../../../shared/utils/classnames';

export function PartnerRegisterMiddleCards({
  styles,
  classnamesFn,
  divisionLabels,
  isDetailMode,
  isEditMode,
  salesByYearRows,
  salesChartMode,
  setSalesChartMode,
  selectedSalesCategory,
  setSelectedSalesCategory,
  salesCategoryOptions,
  salesChartModel,
  visibleSalesSeries,
  salesChartData,
  selectedPartnerDetail,
  staffByYearRows,
  formData,
  isEditableMode,
  handleAddCompetitorBrand,
  handleCompetitorChange,
  handleRemoveCompetitorBrand,
  financeSearchMessage,
  financeLoaded,
  financeTab,
  setFinanceTab,
  financePreview,
  financeCumulative,
  outstandingTabRows,
  mapCardNode,
  updateEditable,
}) {
  const cx = classnamesFn || classnames;

  return (
    <>
      <Card title="3) 최근 5년간 매출 실적(연도별)" className={styles.card}>
        <CardBody>
          <div className={styles.erpBlock}>
            {salesByYearRows.length === 0 ? (
              <p className={styles.hint}>대리점을 먼저 선택하면 최근 5개년 매출 그래프를 볼 수 있습니다.</p>
            ) : (
              <>
                <div className={styles.salesChartToolbar}>
                  <div className={styles.salesModeButtons}>
                    <button
                      type="button"
                      className={cx(styles.salesModeButton, salesChartMode === 'single' && styles.salesModeButtonActive, isDetailMode && !isEditMode && styles.allowAction)}
                      onClick={() => setSalesChartMode('single')}
                    >
                      단일 카테고리
                    </button>
                    <button
                      type="button"
                      className={cx(styles.salesModeButton, salesChartMode === 'compare' && styles.salesModeButtonActive, isDetailMode && !isEditMode && styles.allowAction)}
                      onClick={() => setSalesChartMode('compare')}
                    >
                      카테고리 비교
                    </button>
                  </div>
                  <div className={styles.salesCategorySelector}>
                    <label htmlFor="salesCategorySelect">그래프 항목</label>
                    <select
                      id="salesCategorySelect"
                      className={cx(styles.select, styles.salesCategorySelect, isDetailMode && !isEditMode && styles.allowAction)}
                      value={selectedSalesCategory}
                      onChange={(e) => setSelectedSalesCategory(e.target.value)}
                      disabled={salesChartMode === 'compare'}
                    >
                      {salesCategoryOptions.map((category) => (
                        <option key={category.key} value={category.key}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.salesChartCard}>
                  <svg className={styles.salesChartSvg} viewBox={`0 0 ${salesChartModel.chartWidth} ${salesChartModel.chartHeight}`} role="img" aria-label="최근 5년 매출 실적 그래프">
                    {salesChartModel.yTicks.map((tick) => (
                      <g key={`tick-${tick.value}`}>
                        <line x1={74} y1={tick.y} x2={736} y2={tick.y} stroke="#dbe6f5" strokeDasharray="4 4" />
                        <text x={68} y={tick.y + 4} textAnchor="end" className={styles.salesChartTickLabel}>
                          {tick.value.toLocaleString()}
                        </text>
                      </g>
                    ))}
                    {salesChartModel.series.map((series) => (
                      <g key={series.key}>
                        <polyline fill="none" stroke={series.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" points={series.polyline} />
                        {series.points.map((point) => (
                          <circle key={`${series.key}-${point.year}`} cx={point.x} cy={point.y} r="4" fill="#fff" stroke={series.color} strokeWidth="2" />
                        ))}
                      </g>
                    ))}
                    {salesChartModel.series[0]?.points.map((point) => (
                      <text key={`year-${point.year}`} x={point.x} y={252} textAnchor="middle" className={styles.salesChartYearLabel}>
                        {point.year}
                      </text>
                    ))}
                  </svg>
                  <div className={styles.salesChartLegend}>
                    {visibleSalesSeries.map((series) => (
                      <span key={`legend-${series.key}`} className={styles.salesChartLegendItem}>
                        <span className={styles.salesChartLegendColor} style={{ backgroundColor: series.color }} />
                        {series.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>연도</th>
                        {visibleSalesSeries.map((series) => (
                          <th key={`head-${series.key}`} className={styles.right}>{series.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {salesChartData.map((row) => (
                        <tr key={row.year}>
                          <td>{row.year}</td>
                          {visibleSalesSeries.map((series) => (
                            <td key={`${row.year}-${series.key}`} className={styles.right}>{Number(row[series.key] || 0).toLocaleString()}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      <Card title={divisionLabels.staffCardTitle} className={styles.card}>
        <CardBody>
          <div className={styles.erpBlock}>
            {!selectedPartnerDetail ? (
              <p className={styles.hint}>{divisionLabels.staffHint}</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>연도</th>
                      <th>담당자</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffByYearRows.map((row) => (
                      <tr key={row.year}>
                        <td>{row.year}년</td>
                        <td>{row.name}</td>
                        <td>{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <Card title="5) 경쟁사 취급 브랜드 (단위: 천원)" className={cx(styles.card, styles.competitorCard)}>
        <CardBody>
          <div className={cx(styles.competitorPanel, !isEditableMode && styles.readonlyBlock)}>
            <div className={styles.competitorHeader}>
              <span className={styles.hint}>대리점별로 경쟁사 항목을 직접 추가해 관리합니다.</span>
              {isEditableMode && (
                <Button variant="secondary" onClick={handleAddCompetitorBrand}>
                  + 경쟁사 추가
                </Button>
              )}
            </div>
            <div className={cx(styles.tableWrap, styles.competitorTableWrap)}>
              <table className={cx(styles.table, styles.competitorTable)}>
                <thead>
                  <tr>
                    <th>경쟁사명</th>
                    <th>취급여부</th>
                    <th>취급규모(천원)</th>
                    <th>비고</th>
                  </tr>
                </thead>
                <tbody>
                  {(formData.competitorBrands || []).map((row) => (
                    <tr key={row.id}>
                      <td>
                        <input className={styles.input} value={row.name || ''} onChange={(e) => handleCompetitorChange(row.id, 'name', e.target.value)} disabled={!isEditableMode} placeholder="경쟁사명 입력" />
                      </td>
                      <td>
                        {isEditableMode ? (
                          <select className={cx(styles.select, styles.competitorToggle)} value={row.isHandling ? 'Y' : 'N'} onChange={(e) => handleCompetitorChange(row.id, 'isHandling', e.target.value === 'Y')}>
                            <option value="N">X</option>
                            <option value="Y">O</option>
                          </select>
                        ) : (
                          <span className={cx(styles.readonlyBadge, row.isHandling ? styles.readonlyYes : styles.readonlyNo)}>{row.isHandling ? 'O' : 'X'}</span>
                        )}
                      </td>
                      <td>
                        <input
                          className={cx(styles.input, styles.competitorInput, !row.isHandling && styles.competitorInputDisabled)}
                          value={row.scale || ''}
                          onChange={(e) => handleCompetitorChange(row.id, 'scale', e.target.value)}
                          disabled={!isEditableMode || !row.isHandling}
                          placeholder={row.isHandling ? '천원' : 'O 선택 시 입력'}
                        />
                      </td>
                      <td>
                        {isEditableMode ? (
                          <button type="button" className={styles.deleteBtn} onClick={() => handleRemoveCompetitorBrand(row.id)}>
                            삭제
                          </button>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card title="6) 거래처 최근 5개년 재무/매출 현황" className={styles.card}>
        <CardBody>
          <div className={styles.financeHeader}>
            <p className={styles.hint}>여신/수금관리와 유사한 목업 데이터를 가져와 미리 확인합니다.</p>
          </div>
          {financeSearchMessage ? <p className={styles.financeStatus}>{financeSearchMessage}</p> : null}

          {!financeLoaded ? (
            <div className={styles.financeEmpty}>대리점명을 검색한 뒤 데이터 가져오기를 눌러주세요.</div>
          ) : (
            <div className={styles.financePanel}>
              <div className={styles.financeTabRow}>
                <button type="button" className={cx(styles.financeTab, financeTab === 'receivable' && styles.financeTabActive, isDetailMode && styles.allowAction)} onClick={() => setFinanceTab('receivable')}>채권 및 채신 현황</button>
                <button type="button" className={cx(styles.financeTab, financeTab === 'collection' && styles.financeTabActive, isDetailMode && styles.allowAction)} onClick={() => setFinanceTab('collection')}>수금 현황</button>
                <button type="button" className={cx(styles.financeTab, financeTab === 'note' && styles.financeTabActive, isDetailMode && styles.allowAction)} onClick={() => setFinanceTab('note')}>어음 현황</button>
                <button type="button" className={cx(styles.financeTab, financeTab === 'outstanding' && styles.financeTabActive, isDetailMode && styles.allowAction)} onClick={() => setFinanceTab('outstanding')}>미수금 현황</button>
              </div>
              <div className={styles.financeSummary}>
                <div className={styles.financeChip}><span>채권</span><strong>{financePreview.receivableRows.length}건</strong></div>
                <div className={styles.financeChip}><span>어음</span><strong>{financePreview.billRows.length}건</strong></div>
                <div className={styles.financeChip}><span>담보</span><strong>{financePreview.collateralRows.length}건</strong></div>
                <div className={styles.financeChip}><span>누계매출</span><strong>{financeCumulative.receivableSales.toLocaleString()}</strong></div>
                <div className={styles.financeChip}><span>누계수금</span><strong>{financeCumulative.receivableDeposit.toLocaleString()}</strong></div>
                <div className={styles.financeChip}><span>누계미수</span><strong>{financeCumulative.outstandingAmount.toLocaleString()}</strong></div>
              </div>

              <div className={styles.financeTables}>
                {financeTab === 'receivable' && (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead><tr><th>기준월</th><th className={styles.right}>거래한도</th><th className={styles.right}>당월매출</th><th className={styles.right}>당월수금</th></tr></thead>
                      <tbody>
                        {financePreview.receivableRows.map((row, index) => (
                          <tr key={`recv-${index}`}><td>{row.baseYm}</td><td className={styles.right}>{Number(row.tradeLimit).toLocaleString()}</td><td className={styles.right}>{Number(row.salesThisMonth).toLocaleString()}</td><td className={styles.right}>{Number(row.depositThisMonth).toLocaleString()}</td></tr>
                        ))}
                      </tbody>
                      <tfoot><tr><th>누계</th><th className={styles.right}>{financeCumulative.receivableTradeLimit.toLocaleString()}</th><th className={styles.right}>{financeCumulative.receivableSales.toLocaleString()}</th><th className={styles.right}>{financeCumulative.receivableDeposit.toLocaleString()}</th></tr></tfoot>
                    </table>
                  </div>
                )}
                {financeTab === 'collection' && (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead><tr><th>어음번호</th><th>만기일</th><th className={styles.right}>금액</th></tr></thead>
                      <tbody>{financePreview.billRows.map((row) => <tr key={row.id}><td>{row.billNo}</td><td>{row.dueDate}</td><td className={styles.right}>{Number(row.amount).toLocaleString()}</td></tr>)}</tbody>
                      <tfoot><tr><th colSpan={2}>누계</th><th className={styles.right}>{financeCumulative.billAmount.toLocaleString()}</th></tr></tfoot>
                    </table>
                  </div>
                )}
                {financeTab === 'note' && (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead><tr><th>담보명</th><th>상태</th><th className={styles.right}>설정액</th></tr></thead>
                      <tbody>{financePreview.collateralRows.map((row) => <tr key={row.id}><td>{row.collateralName}</td><td>{row.status}</td><td className={styles.right}>{Number(row.companySetAmount).toLocaleString()}</td></tr>)}</tbody>
                      <tfoot><tr><th colSpan={2}>누계</th><th className={styles.right}>{financeCumulative.collateralAmount.toLocaleString()}</th></tr></tfoot>
                    </table>
                  </div>
                )}
                {financeTab === 'outstanding' && (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead><tr><th>거래처</th><th>거래처명</th><th>매출번호</th><th className={styles.right}>매출금액</th><th className={styles.right}>수금액</th><th className={styles.right}>미수금액</th></tr></thead>
                      <tbody>{outstandingTabRows.map((row, index) => <tr key={`outstanding-${index}`}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td className={styles.right}>{Number(row[3]).toLocaleString()}</td><td className={styles.right}>{Number(row[4]).toLocaleString()}</td><td className={styles.right}>{Number(row[5]).toLocaleString()}</td></tr>)}</tbody>
                      <tfoot><tr><th colSpan={3}>누계</th><th className={styles.right}>{financeCumulative.receivableSales.toLocaleString()}</th><th className={styles.right}>{financeCumulative.receivableDeposit.toLocaleString()}</th><th className={styles.right}>{financeCumulative.outstandingAmount.toLocaleString()}</th></tr></tfoot>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {mapCardNode}

      <Card title={divisionLabels.historyCardTitle} className={styles.card}>
        <CardBody>
          <div className={styles.editableBlock}>
            <textarea className={styles.textarea} value={formData.historyNotes} onChange={(e) => updateEditable('historyNotes', e.target.value)} rows={4} placeholder={divisionLabels.historyPlaceholder} />
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default PartnerRegisterMiddleCards;
