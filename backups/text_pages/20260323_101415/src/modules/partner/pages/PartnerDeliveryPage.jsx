/**
 * 출고 정보 조회 (partner/delivery)
 * - 탭(월별 내역 / 출고 현황) 통합
 * - 권한 분기: 대리점(AGENCY/PARTNER/DEALER)은 본인 대리점 고정 + 자동조회
 * - 숫자/CSV는 공통 유틸(`formatters`, `csv`)로 일원화
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Printer, Search } from 'lucide-react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter';
import { downloadCsv } from '../../../shared/utils/csv';
import { formatNumber } from '../../../shared/utils/formatters';
import { useAuth } from '../../auth/hooks/useAuth';
import { MOCK_PARTNERS_LIST } from '../../master/data/partnersMock';
import { fetchPartnerMonthlyDelivery, fetchPartnerShipmentStatus } from '../api/partnerDelivery.api';
import styles from './PartnerDeliveryPage.module.css';

export function PartnerDeliveryPage() {
  const { user } = useAuth();
  const isAgencyRole = user?.role === 'AGENCY' || user?.role === 'PARTNER' || user?.role === 'DEALER';
  const [activeTab, setActiveTab] = useState('monthly'); // monthly | status

  const now = useMemo(() => new Date(), []);
  const defaultYear = now.getFullYear();

  // shared partner selection
  const [partnerId, setPartnerId] = useState('');
  const [partnerQuery, setPartnerQuery] = useState('');

  // 월별 내역 탭 상태
  const [monthlyYear, setMonthlyYear] = useState(String(defaultYear));
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [monthlyResult, setMonthlyResult] = useState({ rows: [], totalCount: 0, totalAmount: 0, totalVat: 0, totalSum: 0 });

  // 출고 현황 탭 상태
  const [factory, setFactory] = useState('');
  const [shipType, setShipType] = useState('');
  const [shipStatus, setShipStatus] = useState('전체');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusResult, setStatusResult] = useState({ rows: [], totalCount: 0, totalQty: 0, totalAmount: 0 });

  const partnerOptionsAll = useMemo(() => {
    const base = MOCK_PARTNERS_LIST.map((p) => ({ value: p.id, label: p.name }));
    return [{ value: '', label: '대리점 선택' }, ...base];
  }, []);

  const partnerOptionsFiltered = useMemo(() => {
    if (!partnerQuery.trim()) return partnerOptionsAll;
    const q = partnerQuery.toLowerCase().trim();
    return partnerOptionsAll.filter((o) => !o.value || o.label.toLowerCase().includes(q));
  }, [partnerOptionsAll, partnerQuery]);

  const myPartnerId = String(user?.partnerId ?? user?.partner?.id ?? '');
  const myPartnerName = user?.partnerName ?? user?.partner?.name;

  const selectedPartnerLabel = useMemo(() => {
    if (isAgencyRole && myPartnerName) return myPartnerName;
    return MOCK_PARTNERS_LIST.find((p) => p.id === partnerId)?.name ?? '';
  }, [isAgencyRole, myPartnerName, partnerId]);

  // 대리점 권한: 본인 대리점 고정
  useEffect(() => {
    if (!isAgencyRole) return;
    const resolvedId = myPartnerId || (MOCK_PARTNERS_LIST[0]?.id ?? '');
    if (!resolvedId) return;
    setPartnerId(resolvedId);
  }, [isAgencyRole, myPartnerId]);

  const runMonthlySearch = useCallback(async () => {
    if (!partnerId) return;
    setMonthlyLoading(true);
    try {
      const res = await fetchPartnerMonthlyDelivery({ partnerId, year: Number(monthlyYear) });
      setMonthlyResult({
        ...res,
        rows: (res.rows || []).map((r) => ({ ...r, partnerName: selectedPartnerLabel || '-' })),
      });
    } finally {
      setMonthlyLoading(false);
    }
  }, [partnerId, monthlyYear, selectedPartnerLabel]);

  const runStatusSearch = useCallback(async () => {
    if (!partnerId) return;
    setStatusLoading(true);
    try {
      const res = await fetchPartnerShipmentStatus({
        partnerId,
        factory: factory || undefined,
        shipType: shipType || undefined,
        shipStatus: shipStatus || undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
      });
      setStatusResult(res);
    } finally {
      setStatusLoading(false);
    }
  }, [partnerId, factory, shipType, shipStatus, dateFrom, dateTo]);

  // 본사 권한: 조건 변경 시 결과 숨김(조회 버튼 필요)
  useEffect(() => {
    if (isAgencyRole) return;
    if (activeTab === 'monthly') setMonthlyResult({ rows: [], totalCount: 0, totalAmount: 0, totalVat: 0, totalSum: 0 });
  }, [isAgencyRole, activeTab, partnerId, monthlyYear]);

  useEffect(() => {
    if (isAgencyRole) return;
    if (activeTab === 'status') setStatusResult({ rows: [], totalCount: 0, totalQty: 0, totalAmount: 0 });
  }, [isAgencyRole, activeTab, partnerId, factory, shipType, shipStatus, dateFrom, dateTo]);

  // 대리점 권한: 탭/필터 변경 시 자동 조회
  useEffect(() => {
    if (!isAgencyRole) return;
    if (!partnerId) return;
    if (activeTab === 'monthly') runMonthlySearch();
    if (activeTab === 'status') runStatusSearch();
  }, [isAgencyRole, partnerId, activeTab, monthlyYear, factory, shipType, shipStatus, dateFrom, dateTo, runMonthlySearch, runStatusSearch]);

  const yearOptions = useMemo(() => {
    const list = [];
    for (let i = 0; i < 5; i += 1) {
      const y = String(defaultYear - i);
      list.push({ value: y, label: `${y}년` });
    }
    return list;
  }, [defaultYear]);

  const factoryOptions = useMemo(
    () => [
      { value: '', label: '전체' },
      { value: '서울공장', label: '서울공장' },
      { value: '부산공장', label: '부산공장' },
      { value: '대구공장', label: '대구공장' },
    ],
    []
  );

  const shipTypeOptions = useMemo(
    () => [
      { value: '', label: '전체' },
      { value: '직송', label: '직송' },
      { value: '택배', label: '택배' },
    ],
    []
  );

  const monthlyFilterValue = useMemo(
    () => ({ year: monthlyYear, partnerQuery, partnerId }),
    [monthlyYear, partnerQuery, partnerId]
  );

  const statusFilterValue = useMemo(
    () => ({
      factory,
      shipType,
      shipStatus,
      dateFrom,
      dateTo,
      partnerQuery,
      partnerId,
    }),
    [factory, shipType, shipStatus, dateFrom, dateTo, partnerQuery, partnerId]
  );

  const monthlyFields = useMemo(() => {
    const fields = [];
    fields.push({ id: 'year', label: '년도', type: 'select', options: yearOptions, width: 120, row: 0 });
    if (!isAgencyRole) {
      fields.push({ id: 'partnerQuery', label: '대리점검색', type: 'text', placeholder: '대리점 검색', wide: true, row: 0 });
    }
    fields.push({
      id: 'partnerId',
      label: '대리점',
      type: 'select',
      options: isAgencyRole
        ? [{ value: partnerId, label: selectedPartnerLabel || '내 대리점' }]
        : partnerOptionsFiltered,
      disabled: isAgencyRole,
      wide: true,
      row: 0,
    });
    return fields;
  }, [yearOptions, isAgencyRole, partnerId, selectedPartnerLabel, partnerOptionsFiltered]);

  const statusFields = useMemo(() => {
    const fields = [];
    fields.push({ id: 'factory', label: '공장명', type: 'select', options: factoryOptions, width: 140, row: 0 });
    fields.push({ id: 'shipType', label: '출고형태', type: 'select', options: shipTypeOptions, width: 120, row: 0 });
    fields.push({
      id: 'shipStatus',
      label: '출고상태',
      type: 'radio',
      options: [
        { value: '전체', label: '전체' },
        { value: '출고대기', label: '출고대기' },
        { value: '출고완료', label: '출고완료' },
      ],
      row: 0,
    });
    fields.push({ id: 'range', label: '출고일자', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 });
    if (!isAgencyRole) {
      fields.push({ id: 'partnerQuery', label: '대리점검색', type: 'text', placeholder: '대리점 검색', wide: true, row: 1 });
    }
    fields.push({
      id: 'partnerId',
      label: '대리점',
      type: 'select',
      options: isAgencyRole
        ? [{ value: partnerId, label: selectedPartnerLabel || '내 대리점' }]
        : partnerOptionsFiltered,
      disabled: isAgencyRole,
      wide: true,
      row: isAgencyRole ? 1 : 1,
    });
    return fields;
  }, [factoryOptions, shipTypeOptions, isAgencyRole, partnerId, selectedPartnerLabel, partnerOptionsFiltered]);

  const onMonthlyChange = useCallback((id, value) => {
    if (id === 'year') setMonthlyYear(value);
    if (id === 'partnerQuery') setPartnerQuery(value);
    if (id === 'partnerId') setPartnerId(value);
  }, []);

  const onStatusChange = useCallback((id, value) => {
    if (id === 'factory') setFactory(value);
    if (id === 'shipType') setShipType(value);
    if (id === 'shipStatus') setShipStatus(value);
    if (id === 'dateFrom') setDateFrom(value);
    if (id === 'dateTo') setDateTo(value);
    if (id === 'partnerQuery') setPartnerQuery(value);
    if (id === 'partnerId') setPartnerId(value);
  }, []);

  const handleMonthlyDownload = useCallback(() => {
    if (!monthlyResult.rows.length) return;
    const rows = monthlyResult.rows.map((r) => ({
      shipYm: r.shipYm,
      partnerName: r.partnerName,
      shipType: r.shipType,
      vatType: r.vatType,
      amount: r.amount,
      vat: r.vat,
      total: r.total,
    }));
    downloadCsv(
      '월별내역.csv',
      [
        { key: 'shipYm', label: '출고 년월' },
        { key: 'partnerName', label: '대리점명' },
        { key: 'shipType', label: '출고형태' },
        { key: 'vatType', label: '부가세형태' },
        { key: 'amount', label: '금액' },
        { key: 'vat', label: '부가세' },
        { key: 'total', label: '합계' },
      ],
      rows
    );
  }, [monthlyResult.rows]);

  const handleStatusDownload = useCallback(() => {
    if (!statusResult.rows.length) return;
    const rows = statusResult.rows.map((r) => ({
      salesGroup: r.salesGroup,
      factoryCategory: r.factoryCategory,
      shipType: r.shipType,
      qty: r.qty,
      amount: r.amount,
    }));
    downloadCsv(
      '출고현황.csv',
      [
        { key: 'salesGroup', label: '영업그룹' },
        { key: 'factoryCategory', label: '공장구분' },
        { key: 'shipType', label: '출고형태' },
        { key: 'qty', label: '수량' },
        { key: 'amount', label: '금액(원)' },
      ],
      rows
    );
  }, [statusResult.rows]);

  return (
    <PageShell
      path="/partner/delivery"
      title="출고 정보 조회"
      description="월별 내역 및 출고 현황 조회"
    >
      <div className={styles.page}>
        <div className={styles.tabs} role="tablist" aria-label="출고 정보 탭">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'monthly'}
            className={`${styles.tabBtn} ${activeTab === 'monthly' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            월별 내역
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'status'}
            className={`${styles.tabBtn} ${activeTab === 'status' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('status')}
          >
            출고 현황
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'monthly' ? (
          <ListFilter
            className={`${styles.card} ${styles.filterCard}`}
            fields={monthlyFields}
            value={monthlyFilterValue}
            onChange={onMonthlyChange}
            onReset={() => {
              setMonthlyYear(String(defaultYear));
              if (!isAgencyRole) {
                setPartnerQuery('');
                setPartnerId('');
              }
            }}
            actionsAddon={
              <button
                type="button"
                className={styles.actionBtn}
                onClick={runMonthlySearch}
                disabled={isAgencyRole || !partnerId || monthlyLoading}
              >
                <Search size={16} />
                조회
              </button>
            }
            showReset={false}
          />
        ) : (
          <ListFilter
            className={`${styles.card} ${styles.filterCard}`}
            fields={statusFields}
            value={statusFilterValue}
            onChange={onStatusChange}
            onReset={() => {
              setFactory('');
              setShipType('');
              setShipStatus('전체');
              setDateFrom('');
              setDateTo('');
              if (!isAgencyRole) {
                setPartnerQuery('');
                setPartnerId('');
              }
            }}
            actionsAddon={
              <button
                type="button"
                className={styles.actionBtn}
                onClick={runStatusSearch}
                disabled={isAgencyRole || !partnerId || statusLoading}
              >
                <Search size={16} />
                조회
              </button>
            }
            showReset={false}
          />
        )}

        {/* Tables */}
        {activeTab === 'monthly' ? (
          <section className={styles.card} aria-label="월별 내역 테이블">
            <div className={styles.tableTop}>
              <div>
                <div className={styles.tableTitle}>월별 내역</div>
                <div className={styles.hint}>
                  {partnerId ? selectedPartnerLabel : '대리점을 선택하세요.'} · 총 {formatNumber(monthlyResult.totalCount)}건 · 합계{' '}
                  {formatNumber(monthlyResult.totalSum)}원
                </div>
              </div>
              <div className={styles.tableActions}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={handleMonthlyDownload}
                  disabled={!monthlyResult.rows.length}
                >
                  <Download size={16} />
                  엑셀
                </button>
                <button type="button" className={styles.actionBtn} onClick={() => window.print()}>
                  <Printer size={16} />
                  인쇄
                </button>
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>출고 년월</th>
                    <th>대리점명</th>
                    <th>출고형태</th>
                    <th>부가세형태</th>
                    <th className={styles.thNum}>금액</th>
                    <th className={styles.thNum}>부가세</th>
                    <th className={styles.thNum}>합계</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyLoading ? (
                    <tr>
                      <td colSpan={7} className={styles.emptyCell}>
                        로딩 중...
                      </td>
                    </tr>
                  ) : monthlyResult.rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={styles.emptyCell}>
                        데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    monthlyResult.rows.map((r) => (
                      <tr key={`${r.shipYm}-${r.shipType}-${r.vatType}`}>
                        <td>{r.shipYm}</td>
                        <td>{r.partnerName}</td>
                        <td>{r.shipType}</td>
                        <td>{r.vatType}</td>
                        <td className={styles.tdNum}>{formatNumber(r.amount)}</td>
                        <td className={styles.tdNum}>{formatNumber(r.vat)}</td>
                        <td className={styles.tdTotal}>{formatNumber(r.total)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className={styles.card} aria-label="출고 현황 테이블">
            <div className={styles.tableTop}>
              <div>
                <div className={styles.tableTitle}>출고 현황</div>
                <div className={styles.hint}>
                  총 {formatNumber(statusResult.totalCount)}건 / 수량 {formatNumber(statusResult.totalQty)} / 금액{' '}
                  {formatNumber(statusResult.totalAmount)}원
                </div>
              </div>
              <div className={styles.tableActions}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={handleStatusDownload}
                  disabled={!statusResult.rows.length}
                >
                  <Download size={16} />
                  엑셀
                </button>
                <button type="button" className={styles.actionBtn} onClick={() => window.print()}>
                  <Printer size={16} />
                  인쇄
                </button>
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>영업그룹</th>
                    <th>공장구분</th>
                    <th>출고형태</th>
                    <th className={styles.thNum}>수량</th>
                    <th className={styles.thNum}>금액(원)</th>
                  </tr>
                </thead>
                <tbody>
                  {statusLoading ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyCell}>
                        로딩 중...
                      </td>
                    </tr>
                  ) : statusResult.rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyCell}>
                        데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    statusResult.rows.map((r) => (
                      <tr key={r.id}>
                        <td>{r.salesGroup}</td>
                        <td>{r.factoryCategory}</td>
                        <td>{r.shipType}</td>
                        <td className={styles.tdNum}>{formatNumber(r.qty)}</td>
                        <td className={styles.tdNum}>{formatNumber(r.amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
