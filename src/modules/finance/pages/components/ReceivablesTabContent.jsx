import React from 'react';
import { AlertCircle, CreditCard, Download, FileText, Search } from 'lucide-react';
import { Card, CardBody } from '../../../../shared/components/Card';
import { Button } from '../../../../shared/components/Button/Button';
import { ListFilter } from '../../../../shared/components/ListFilter/ListFilter';

export function ReceivablesTabContent({
  activeTab,
  styles,
  fields,
  filterValue,
  handleFilterChange,
  handleReset,
  runSearch,
  isAgencyRole,
  loading,
  selectedPartnerLabel,
  data,
  rows,
  formatMoney,
  billFields,
  billFilterValue,
  handleBillFilterChange,
  handleBillReset,
  runBillSearch,
  billLoading,
  billResult,
  handleBillDownload,
  collateralFields,
  collateralFilterValue,
  handleCollateralFilterChange,
  handleCollateralReset,
  runCollateralSearch,
  collateralLoading,
  collateralResult,
  handleCollateralDownload,
  depositFields,
  depositFilterValue,
  handleDepositFilterChange,
  handleDepositReset,
  runDepositSearch,
  depositLoading,
  depositResult,
}) {
  if (activeTab === 'receivable') {
    return (
      <>
        <ListFilter
          className={styles.filterToolbar}
          fields={fields}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearch={runSearch}
          searchLabel="조회"
          searchDisabled={isAgencyRole || !filterValue.partnerId || loading}
          actionsAddon={
            <span className={styles.filterNotice}>
              <AlertCircle size={14} className={styles.noticeIcon} aria-hidden="true" />
              전월데이터는 매달 10일에 업데이트됩니다.
            </span>
          }
          onKeyDownEnter={runSearch}
        />
        <Card className={styles.carryCard} variant="highlight">
          <CardBody className={styles.carryBody}>
            <div className={styles.carryLeft}>
              <div className={styles.carryTitle}>전기이월 외상매출금</div>
              <div className={styles.carrySub}>
                {filterValue.partnerId ? <span className={styles.carryPartner}>{selectedPartnerLabel}</span> : '대리점을 선택하세요.'}
              </div>
            </div>
            <div className={styles.carryValue}>{formatMoney(data?.carryOver)} 원</div>
          </CardBody>
        </Card>
        <section className={styles.tableSection} aria-label="채권채무 그리드">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>채권채무 현황</div>
            <div className={styles.formulas} aria-label="공식 안내">
              <div>* 외상매출금 = 전월외상매출금 + 당월판매 - 당월수금</div>
              <div>* 여신한도 = 거래한도 - 당월외상매출금 - 미결제어음</div>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>기준연월</th>
                  <th className={styles.thNum}>거래한도</th>
                  <th className={styles.thNum}>여신한도</th>
                  <th className={styles.thNum}>전월 외상매출금</th>
                  <th className={styles.thNum}>당월 판매금액</th>
                  <th className={styles.thNum}>당월 입금금액</th>
                  <th className={styles.thNum}>당월 외상매출금</th>
                  <th className={styles.thNum}>미결제어음</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyCell}>
                      로딩 중...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyCell}>
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, idx) => (
                    <tr key={r.baseYm ?? idx}>
                      <td>{r.baseYm}</td>
                      <td className={styles.tdNum}>{formatMoney(r.tradeLimit)}</td>
                      <td className={styles.tdNum}>{formatMoney(r.creditLimit)}</td>
                      <td className={styles.tdNum}>{formatMoney(r.prevReceivable)}</td>
                      <td className={styles.tdNum}>{formatMoney(r.salesThisMonth)}</td>
                      <td className={styles.tdNum}>{formatMoney(r.depositThisMonth)}</td>
                      <td className={styles.tdNum}>{formatMoney(r.receivableThisMonth)}</td>
                      <td className={styles.tdNum}>{formatMoney(r.unpaidBill)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  if (activeTab === 'bill') {
    return (
      <div className={styles.billWrap}>
        <ListFilter
          className={styles.billFilterToolbar}
          fields={billFields}
          value={billFilterValue}
          onChange={handleBillFilterChange}
          onReset={handleBillReset}
          onSearch={runBillSearch}
          searchLabel="조회"
          searchDisabled={isAgencyRole || !filterValue.partnerId || billLoading}
        />
        <div className={styles.summaryRow} aria-label="어음 요약">
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <FileText size={20} />
            </div>
            <div className={styles.summaryText}>
              <div className={styles.summaryLabel}>총 건수</div>
              <div className={styles.summaryValue}>{billResult.totalCount.toLocaleString()}건</div>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIconAlt}>
              <CreditCard size={20} />
            </div>
            <div className={styles.summaryText}>
              <div className={styles.summaryLabel}>총 금액</div>
              <div className={styles.summaryValue}>{formatMoney(billResult.totalAmount)}원</div>
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.tableTop}>
            <div className={styles.tableTopTitle}>어음 내역</div>
            <Button variant="secondary" onClick={handleBillDownload} disabled={!billResult.rows.length} title="다운로드">
              <Download size={16} />
              다운로드
            </Button>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.billTable}>
              <thead>
                <tr>
                  <th>어음번호</th>
                  <th>발행일</th>
                  <th>만기일</th>
                  <th className={styles.thNum}>금액</th>
                  <th>상태</th>
                  <th>메모</th>
                </tr>
              </thead>
              <tbody>
                {billLoading ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      로딩 중...
                    </td>
                  </tr>
                ) : billResult.rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  billResult.rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.billNo}</td>
                      <td>{r.issueDate}</td>
                      <td>{r.dueDate}</td>
                      <td className={styles.tdNum}>{formatMoney(r.amount)}</td>
                      <td>{r.status}</td>
                      <td>{r.memo || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'collateral') {
    return (
      <div className={styles.billWrap}>
        <ListFilter
          className={styles.collateralFilterToolbar}
          fields={collateralFields}
          value={collateralFilterValue}
          onChange={handleCollateralFilterChange}
          onReset={handleCollateralReset}
          onSearch={runCollateralSearch}
          searchLabel="조회"
          searchDisabled={isAgencyRole || !filterValue.partnerId || collateralLoading}
        />
        <div className={styles.card}>
          <div className={styles.gridTop}>
            <div>
              <div className={styles.gridTitle}>담보조회</div>
              <div className={styles.gridCount}>총: {collateralResult.totalCount.toLocaleString()}건</div>
            </div>
            <Button
              variant="secondary"
              onClick={handleCollateralDownload}
              disabled={!collateralResult.rows.length}
              title="엑셀 다운로드"
            >
              <Download size={16} />
              엑셀 다운로드
            </Button>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.collateralTable}>
              <thead>
                <tr>
                  <th>담보명</th>
                  <th>담보상태</th>
                  <th className={styles.thNum}>당사설정액</th>
                  <th className={styles.thNum}>여신한도</th>
                  <th className={styles.thNum}>감정가</th>
                  <th>설정년도</th>
                </tr>
              </thead>
              <tbody>
                {collateralLoading ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      로딩 중...
                    </td>
                  </tr>
                ) : collateralResult.rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  collateralResult.rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.collateralName}</td>
                      <td>
                        <span className={`${styles.badge} ${r.status === '정상' ? styles.badgeNormal : styles.badgeCancelled}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className={styles.tdNum}>{formatMoney(r.companySetAmount)}</td>
                      <td className={styles.tdNum}>{formatMoney(r.creditLimit)}</td>
                      <td className={styles.tdNum}>{formatMoney(r.appraisedValue)}</td>
                      <td>{r.year}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'deposit') {
    return (
      <div className={styles.depositWrap}>
        <ListFilter
          className={styles.depositFilterToolbar}
          fields={depositFields}
          value={depositFilterValue}
          onChange={handleDepositFilterChange}
          onReset={handleDepositReset}
          showReset={false}
          actionsAddon={
            <Button
              className={styles.depositSearchBtn}
              onClick={runDepositSearch}
              disabled={isAgencyRole || !filterValue.partnerId || depositLoading}
            >
              <Search size={16} />
              조회
            </Button>
          }
        />
        <div className={styles.depositCard}>
          <div className={styles.depositTop}>
            <div className={styles.depositTitle}>입금내역</div>
            <div className={styles.depositSum}>총 입금 합계: {formatMoney(depositResult.totalAmount)}원</div>
          </div>
          <div className={styles.depositTableWrap}>
            <table className={styles.depositTable}>
              <thead>
                <tr>
                  <th>입금일자</th>
                  <th>구분</th>
                  <th className={styles.thNum}>입금금액</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                {depositLoading ? (
                  <tr>
                    <td colSpan={4} className={styles.emptyCell}>
                      로딩 중...
                    </td>
                  </tr>
                ) : depositResult.rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.emptyCell}>
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  depositResult.rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.depositDate}</td>
                      <td>{r.type}</td>
                      <td className={styles.depositAmount}>{formatMoney(r.amount)}</td>
                      <td>{r.memo || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={styles.placeholderCard}>
      <CardBody className={styles.placeholderBody}>
        <div className={styles.placeholderTitle}>
          {activeTab === 'bill' && '어음 정보 조회'}
          {activeTab === 'collateral' && '담보 정보 조회'}
          {activeTab === 'deposit' && '입금 정보 조회'}
        </div>
        <div className={styles.placeholderDesc}>해당 탭은 추후 API 연동 예정입니다.</div>
      </CardBody>
    </Card>
  );
}

export default ReceivablesTabContent;
