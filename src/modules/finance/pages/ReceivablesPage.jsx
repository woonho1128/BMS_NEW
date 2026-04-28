/**
 * 거래 정보 조회 (finance/receivable)
 * - 단일 페이지 내 탭(채권/어음/담보/입금)으로 통합
 * - 권한 분기: 대리점(AGENCY/PARTNER/DEALER)은 대리점 고정 + 자동조회, 본사는 선택 후 조회
 * - 다운로드는 공통 `downloadCsv` 유틸 사용(엑셀 한글 깨짐 완화용 BOM 포함)
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { formatMoney } from '../../../shared/utils/formatters';
import { useAuth } from '../../auth/hooks/useAuth';
import { fetchReceivablesStatus } from '../api/receivables.api';
import { fetchBills } from '../api/bills.api';
import { fetchCollateral } from '../api/collateral.api';
import { fetchDeposits } from '../api/deposits.api';
import { MOCK_PARTNERS_LIST } from '../../master/data/partnersMock';
import ReceivablesTabContent from './components/ReceivablesTabContent';
import { ReceivablesHeaderActions, ReceivablesTabs } from './components/ReceivablesHeaderTabs';
import {
  buildBillFields,
  buildCollateralFields,
  buildDepositFields,
  buildReceivableFields,
  createMonthOptions,
  createYearOptions,
  getDefaultYearMonth,
} from './receivablesPage.helpers';
import {
  downloadBillCsv,
  downloadCollateralCsv,
  downloadReceivableCsv,
  handleBillFilterInput,
  handleCollateralFilterInput,
  handleDepositFilterInput,
} from './receivablesPage.actions';
import styles from './ReceivablesPage.module.css';

export function ReceivablesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('receivable'); // receivable | bill | collateral | deposit

  // 요구사항 기준: role로 분기 (대리점 vs 본사)
  const isAgencyRole = user?.role === 'AGENCY' || user?.role === 'PARTNER' || user?.role === 'DEALER';

  const { year: defaultYear, month: defaultMonth } = useMemo(() => getDefaultYearMonth(), []);
  const [filterValue, setFilterValue] = useState(() => ({
    partnerQuery: '',
    partnerId: '',
    year: String(defaultYear),
    month: String(defaultMonth).padStart(2, '0'),
  }));

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // 어음 탭 상태
  const [billCriteria, setBillCriteria] = useState('issueDate'); // issueDate | dueDate
  const [billFrom, setBillFrom] = useState('');
  const [billTo, setBillTo] = useState('');
  const [billLoading, setBillLoading] = useState(false);
  const [billResult, setBillResult] = useState({ rows: [], totalCount: 0, totalAmount: 0 });

  // 담보 탭 상태
  const [collateralStatus, setCollateralStatus] = useState('전체');
  const [collateralYear, setCollateralYear] = useState(() => String(defaultYear));
  const [collateralPartnerQuery, setCollateralPartnerQuery] = useState('');
  const [collateralLoading, setCollateralLoading] = useState(false);
  const [collateralResult, setCollateralResult] = useState({ rows: [], totalCount: 0 });

  // 입금 탭 상태
  const [depositYear, setDepositYear] = useState(() => String(defaultYear));
  const [depositMonth, setDepositMonth] = useState(() => String(defaultMonth).padStart(2, '0'));
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositResult, setDepositResult] = useState({ rows: [], totalAmount: 0, totalCount: 0 });

  const partnerOptionsAll = useMemo(() => {
    const base = MOCK_PARTNERS_LIST.map((p) => ({ value: p.id, label: p.name }));
    return [{ value: '', label: '대리점 선택' }, ...base];
  }, []);

  const partnerOptions = useMemo(() => {
    if (!filterValue.partnerQuery.trim()) return partnerOptionsAll;
    const q = filterValue.partnerQuery.toLowerCase().trim();
    return partnerOptionsAll.filter((o) => !o.value || o.label.toLowerCase().includes(q));
  }, [partnerOptionsAll, filterValue.partnerQuery]);

  const myPartnerId = String(user?.partnerId ?? user?.partner?.id ?? '');
  const myPartnerName = user?.partnerName ?? user?.partner?.name;

  // 대리점 권한: 본인 대리점 기본값 + 자동 조회
  useEffect(() => {
    if (!isAgencyRole) return;
    const resolvedId = myPartnerId || (MOCK_PARTNERS_LIST[0]?.id ?? '');
    if (!resolvedId) return;
    setFilterValue((prev) => ({ ...prev, partnerId: resolvedId }));
  }, [isAgencyRole, myPartnerId]);

  const runSearch = useCallback(async () => {
    if (!filterValue.partnerId) return;
    setLoading(true);
    try {
      const res = await fetchReceivablesStatus({
        partnerId: filterValue.partnerId,
        year: Number(filterValue.year),
        month: Number(filterValue.month),
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [filterValue.partnerId, filterValue.year, filterValue.month]);

  const runBillSearch = useCallback(async () => {
    if (!filterValue.partnerId) return;
    setBillLoading(true);
    try {
      const res = await fetchBills({
        partnerId: filterValue.partnerId,
        criteria: billCriteria,
        from: billFrom || undefined,
        to: billTo || undefined,
      });
      setBillResult(res);
    } finally {
      setBillLoading(false);
    }
  }, [filterValue.partnerId, billCriteria, billFrom, billTo]);

  const runCollateralSearch = useCallback(async () => {
    if (!filterValue.partnerId) return;
    setCollateralLoading(true);
    try {
      const res = await fetchCollateral({
        partnerId: filterValue.partnerId,
        year: Number(collateralYear),
        status: collateralStatus === '전체' ? undefined : collateralStatus,
      });
      setCollateralResult(res);
    } finally {
      setCollateralLoading(false);
    }
  }, [filterValue.partnerId, collateralYear, collateralStatus]);

  const runDepositSearch = useCallback(async () => {
    if (!filterValue.partnerId) return;
    setDepositLoading(true);
    try {
      const res = await fetchDeposits({
        partnerId: filterValue.partnerId,
        year: Number(depositYear),
        month: Number(depositMonth),
      });
      setDepositResult(res);
    } finally {
      setDepositLoading(false);
    }
  }, [filterValue.partnerId, depositYear, depositMonth]);

  const selectedPartnerLabel = useMemo(() => {
    if (isAgencyRole && myPartnerName) return myPartnerName;
    return MOCK_PARTNERS_LIST.find((p) => p.id === filterValue.partnerId)?.name ?? '';
  }, [isAgencyRole, myPartnerName, filterValue.partnerId]);

  const billFilterValue = useMemo(
    () => ({
      billCriteria,
      billFrom,
      billTo,
      partnerId: filterValue.partnerId,
    }),
    [billCriteria, billFrom, billTo, filterValue.partnerId]
  );

  const billFields = useMemo(
    () => buildBillFields({ isAgencyRole, partnerId: filterValue.partnerId, selectedPartnerLabel, partnerOptionsAll }),
    [isAgencyRole, filterValue.partnerId, selectedPartnerLabel, partnerOptionsAll]
  );

  const handleBillFilterChange = useCallback((id, value) => {
    handleBillFilterInput({ setFilterValue, setBillCriteria, setBillFrom, setBillTo }, id, value);
  }, []);

  const handleBillReset = useCallback(() => {
    setBillCriteria('issueDate');
    setBillFrom('');
    setBillTo('');
  }, []);

  // 본사 권한: 선택/조건 변경 시 기존 결과를 숨기고 "조회"가 필요
  useEffect(() => {
    if (isAgencyRole) return;
    setData(null);
  }, [isAgencyRole, filterValue.partnerId, filterValue.year, filterValue.month]);

  useEffect(() => {
    if (!isAgencyRole) return;
    if (!filterValue.partnerId) return;
    if (activeTab === 'receivable') runSearch();
    if (activeTab === 'bill') runBillSearch();
    if (activeTab === 'collateral') runCollateralSearch();
    if (activeTab === 'deposit') runDepositSearch();
  }, [
    isAgencyRole,
    activeTab,
    filterValue.partnerId,
    filterValue.year,
    filterValue.month,
    runSearch,
    runBillSearch,
    runCollateralSearch,
    runDepositSearch,
  ]);

  const rows = useMemo(() => data?.rows ?? [], [data]);

  const yearOptions = useMemo(() => createYearOptions(defaultYear), [defaultYear]);
  const monthOptions = useMemo(() => createMonthOptions(), []);

  const handleDownload = useCallback(() => {
    downloadReceivableCsv(rows, selectedPartnerLabel, filterValue.year, filterValue.month);
  }, [rows, selectedPartnerLabel, filterValue.year, filterValue.month]);

  const handleBillDownload = useCallback(() => {
    downloadBillCsv(billResult.rows || [], selectedPartnerLabel);
  }, [billResult.rows, selectedPartnerLabel]);

  const handleCollateralDownload = useCallback(() => {
    downloadCollateralCsv(collateralResult.rows || [], selectedPartnerLabel, collateralYear);
  }, [collateralResult.rows, selectedPartnerLabel, collateralYear]);

  const depositFilterValue = useMemo(
    () => ({
      depositYear,
      depositMonth,
      partnerId: filterValue.partnerId,
    }),
    [depositYear, depositMonth, filterValue.partnerId]
  );

  const depositFields = useMemo(
    () => buildDepositFields({
      yearOptions,
      monthOptions,
      isAgencyRole,
      partnerId: filterValue.partnerId,
      selectedPartnerLabel,
      partnerOptionsAll,
    }),
    [yearOptions, monthOptions, isAgencyRole, filterValue.partnerId, selectedPartnerLabel, partnerOptionsAll]
  );

  const handleDepositFilterChange = useCallback((id, value) => {
    handleDepositFilterInput({ setFilterValue, setDepositYear, setDepositMonth }, id, value);
  }, []);

  const handleDepositReset = useCallback(() => {
    setDepositYear(String(defaultYear));
    setDepositMonth(String(defaultMonth).padStart(2, '0'));
  }, [defaultYear, defaultMonth]);

  // 본사 권한: 입금 조건 변경 시 결과 숨김(조회 버튼 필요)
  useEffect(() => {
    if (isAgencyRole) return;
    if (activeTab !== 'deposit') return;
    setDepositResult({ rows: [], totalAmount: 0, totalCount: 0 });
  }, [isAgencyRole, activeTab, depositYear, depositMonth, filterValue.partnerId]);

  const fields = useMemo(
    () => buildReceivableFields({
      isAgencyRole,
      filterValue,
      selectedPartnerLabel,
      partnerOptions,
      yearOptions,
      monthOptions,
    }),
    [isAgencyRole, filterValue, selectedPartnerLabel, partnerOptions, yearOptions, monthOptions]
  );

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue((prev) => ({
      ...prev,
      partnerQuery: '',
      partnerId: isAgencyRole ? prev.partnerId : '',
      year: String(defaultYear),
      month: String(defaultMonth).padStart(2, '0'),
    }));
  }, [defaultYear, defaultMonth, isAgencyRole]);

  const collateralPartnerOptions = useMemo(() => {
    if (!collateralPartnerQuery.trim()) return partnerOptionsAll;
    const q = collateralPartnerQuery.toLowerCase().trim();
    return partnerOptionsAll.filter((o) => !o.value || o.label.toLowerCase().includes(q));
  }, [partnerOptionsAll, collateralPartnerQuery]);

  const collateralFilterValue = useMemo(
    () => ({
      collateralStatus,
      collateralYear,
      collateralPartnerQuery,
      partnerId: filterValue.partnerId,
    }),
    [collateralStatus, collateralYear, collateralPartnerQuery, filterValue.partnerId]
  );

  const collateralFields = useMemo(
    () => buildCollateralFields({
      yearOptions,
      isAgencyRole,
      partnerId: filterValue.partnerId,
      selectedPartnerLabel,
      collateralPartnerOptions,
    }),
    [yearOptions, isAgencyRole, filterValue.partnerId, selectedPartnerLabel, collateralPartnerOptions]
  );

  const handleCollateralFilterChange = useCallback((id, value) => {
    handleCollateralFilterInput({ setFilterValue, setCollateralStatus, setCollateralYear, setCollateralPartnerQuery }, id, value);
  }, []);

  const handleCollateralReset = useCallback(() => {
    setCollateralStatus('전체');
    setCollateralYear(String(defaultYear));
    setCollateralPartnerQuery('');
  }, [defaultYear]);

  const actions = (
    <ReceivablesHeaderActions
      styles={styles}
      onDownload={handleDownload}
      disableDownload={activeTab !== 'receivable' || !rows.length}
    />
  );

  return (
    <PageShell
      path="/finance/receivable"
      title="거래 정보 조회"
      description="채권/어음/담보/입금 정보를 탭으로 조회"
      actions={actions}
    >
      <div className={styles.page}>
        <ReceivablesTabs styles={styles} activeTab={activeTab} setActiveTab={setActiveTab} />

                <ReceivablesTabContent
          activeTab={activeTab}
          styles={styles}
          fields={fields}
          filterValue={filterValue}
          handleFilterChange={handleFilterChange}
          handleReset={handleReset}
          runSearch={runSearch}
          isAgencyRole={isAgencyRole}
          loading={loading}
          selectedPartnerLabel={selectedPartnerLabel}
          data={data}
          rows={rows}
          formatMoney={formatMoney}
          billFields={billFields}
          billFilterValue={billFilterValue}
          handleBillFilterChange={handleBillFilterChange}
          handleBillReset={handleBillReset}
          runBillSearch={runBillSearch}
          billLoading={billLoading}
          billResult={billResult}
          handleBillDownload={handleBillDownload}
          collateralFields={collateralFields}
          collateralFilterValue={collateralFilterValue}
          handleCollateralFilterChange={handleCollateralFilterChange}
          handleCollateralReset={handleCollateralReset}
          runCollateralSearch={runCollateralSearch}
          collateralLoading={collateralLoading}
          collateralResult={collateralResult}
          handleCollateralDownload={handleCollateralDownload}
          depositFields={depositFields}
          depositFilterValue={depositFilterValue}
          handleDepositFilterChange={handleDepositFilterChange}
          handleDepositReset={handleDepositReset}
          runDepositSearch={runDepositSearch}
          depositLoading={depositLoading}
          depositResult={depositResult}
        /></div>
    </PageShell>
  );
}

