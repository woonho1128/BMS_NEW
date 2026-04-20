/**
 * 거래 정보 조회 (finance/receivable)
 * - 단일 페이지 내 탭(채권/어음/담보/입금)으로 통합
 * - 권한 분기: 대리점(AGENCY/PARTNER/DEALER)은 대리점 고정 + 자동조회, 본사는 선택 후 조회
 * - 다운로드는 공통 `downloadCsv` 유틸 사용(엑셀 한글 깨짐 완화용 BOM 포함)
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { downloadCsv } from '../../../shared/utils/csv';
import { formatMoney } from '../../../shared/utils/formatters';
import { useAuth } from '../../auth/hooks/useAuth';
import { fetchReceivablesStatus } from '../api/receivables.api';
import { fetchBills } from '../api/bills.api';
import { fetchCollateral } from '../api/collateral.api';
import { fetchDeposits } from '../api/deposits.api';
import { MOCK_PARTNERS_LIST } from '../../master/data/partnersMock';
import ReceivablesTabContent from './components/ReceivablesTabContent';
import styles from './ReceivablesPage.module.css';

function getDefaultYearMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

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

  const billFields = useMemo(() => {
    return [
      {
        id: 'billCriteria',
        label: '설정기준',
        type: 'radio',
        options: [
          { value: 'issueDate', label: '발행일' },
          { value: 'dueDate', label: '만기일' },
        ],
        row: 0,
      },
      {
        id: 'billRange',
        label: '설정기간',
        type: 'dateRange',
        fromKey: 'billFrom',
        toKey: 'billTo',
        row: 0,
      },
      {
        id: 'partnerId',
        label: '대리점',
        type: 'select',
        options: isAgencyRole
          ? [{ value: filterValue.partnerId, label: selectedPartnerLabel || '내 대리점' }]
          : partnerOptionsAll,
        disabled: isAgencyRole,
        wide: true,
        row: 0,
      },
    ];
  }, [isAgencyRole, filterValue.partnerId, selectedPartnerLabel, partnerOptionsAll]);

  const handleBillFilterChange = useCallback((id, value) => {
    if (id === 'partnerId') {
      setFilterValue((prev) => ({ ...prev, partnerId: value }));
      return;
    }
    if (id === 'billCriteria') {
      setBillCriteria(value);
      return;
    }
    if (id === 'billFrom') {
      setBillFrom(value);
      return;
    }
    if (id === 'billTo') {
      setBillTo(value);
      return;
    }
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

  const yearOptions = useMemo(() => {
    const y = Number(defaultYear);
    const list = [];
    for (let i = 0; i < 5; i += 1) {
      const yy = String(y - i);
      list.push({ value: yy, label: `${yy}년` });
    }
    return list;
  }, [defaultYear]);

  const monthOptions = useMemo(() => {
    const list = [{ value: '', label: '월 선택' }];
    for (let m = 1; m <= 12; m += 1) {
      const mm = String(m).padStart(2, '0');
      list.push({ value: mm, label: `${m}월` });
    }
    return list;
  }, []);

  const handleDownload = useCallback(() => {
    if (!rows.length) return;
    const safePartner = (selectedPartnerLabel || 'partner').replaceAll(' ', '_');
    downloadCsv(
      `채권채무현황_${safePartner}_${filterValue.year}${filterValue.month}.csv`,
      [
        { key: 'baseYm', label: '기준연월' },
        { key: 'tradeLimit', label: '거래한도' },
        { key: 'creditLimit', label: '여신한도' },
        { key: 'prevReceivable', label: '전월 외상매출금' },
        { key: 'salesThisMonth', label: '당월 판매금액' },
        { key: 'depositThisMonth', label: '당월 입금금액' },
        { key: 'receivableThisMonth', label: '당월 외상매출금' },
        { key: 'unpaidBill', label: '미결제어음' },
      ],
      rows
    );
  }, [rows, selectedPartnerLabel, filterValue.year, filterValue.month]);

  const handleBillDownload = useCallback(() => {
    const rowsToExport = billResult.rows || [];
    if (!rowsToExport.length) return;
    const safePartner = (selectedPartnerLabel || 'partner').replaceAll(' ', '_');
    downloadCsv(
      `어음조회_${safePartner}.csv`,
      [
        { key: 'billNo', label: '어음번호' },
        { key: 'issueDate', label: '발행일' },
        { key: 'dueDate', label: '만기일' },
        { key: 'amount', label: '금액' },
        { key: 'status', label: '상태' },
        { key: 'memo', label: '메모' },
      ],
      rowsToExport.map((r) => ({ ...r, memo: r.memo || '' }))
    );
  }, [billResult.rows, selectedPartnerLabel]);

  const handleCollateralDownload = useCallback(() => {
    const rowsToExport = collateralResult.rows || [];
    if (!rowsToExport.length) return;
    const safePartner = (selectedPartnerLabel || 'partner').replaceAll(' ', '_');
    downloadCsv(
      `담보조회_${safePartner}_${collateralYear}.csv`,
      [
        { key: 'collateralName', label: '담보명' },
        { key: 'status', label: '담보상태' },
        { key: 'companySetAmount', label: '당사설정액' },
        { key: 'creditLimit', label: '여신한도' },
        { key: 'appraisedValue', label: '감정가' },
        { key: 'year', label: '설정년도' },
      ],
      rowsToExport
    );
  }, [collateralResult.rows, selectedPartnerLabel, collateralYear]);

  const depositFilterValue = useMemo(
    () => ({
      depositYear,
      depositMonth,
      partnerId: filterValue.partnerId,
    }),
    [depositYear, depositMonth, filterValue.partnerId]
  );

  const depositFields = useMemo(() => {
    const yearOptionsForFilter = yearOptions.map((o) => ({ value: o.value, label: o.label }));
    const monthOptionsForFilter = monthOptions.filter((o) => o.value !== '').map((o) => ({ value: o.value, label: o.label }));
    return [
      { id: 'depositYear', label: '년도', type: 'select', options: yearOptionsForFilter, width: 120, row: 0 },
      { id: 'depositMonth', label: '월', type: 'select', options: monthOptionsForFilter, width: 90, row: 0 },
      {
        id: 'partnerId',
        label: '대리점',
        type: 'select',
        options: isAgencyRole
          ? [{ value: filterValue.partnerId, label: selectedPartnerLabel || '내 대리점' }]
          : partnerOptionsAll,
        disabled: isAgencyRole,
        wide: true,
        row: 0,
      },
    ];
  }, [yearOptions, monthOptions, isAgencyRole, filterValue.partnerId, selectedPartnerLabel, partnerOptionsAll]);

  const handleDepositFilterChange = useCallback((id, value) => {
    if (id === 'partnerId') {
      setFilterValue((prev) => ({ ...prev, partnerId: value }));
      return;
    }
    if (id === 'depositYear') setDepositYear(value);
    if (id === 'depositMonth') setDepositMonth(value);
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

  const fields = useMemo(() => {
    const yearOptionsForFilter = yearOptions.map((o) => ({ value: o.value, label: o.label }));
    const monthOptionsForFilter = monthOptions.filter((o) => o.value !== '').map((o) => ({ value: o.value, label: o.label }));

    const partnerField = {
      id: 'partnerId',
      label: '대리점',
      type: 'select',
      options: isAgencyRole
        ? [{ value: filterValue.partnerId, label: selectedPartnerLabel || '내 대리점' }]
        : partnerOptions,
      disabled: isAgencyRole,
      wide: true,
      row: 0,
    };

    const yearField = {
      id: 'year',
      label: '기준년도',
      type: 'select',
      options: yearOptionsForFilter,
      width: 120,
      row: 0,
    };

    const monthField = {
      id: 'month',
      label: '기준월',
      type: 'select',
      options: monthOptionsForFilter,
      width: 120,
      row: 0,
    };

    if (isAgencyRole) {
      return [partnerField, yearField, monthField];
    }

    const partnerQueryField = {
      id: 'partnerQuery',
      label: '대리점검색',
      type: 'text',
      placeholder: '대리점 검색',
      wide: true,
      row: 0,
    };

    return [partnerQueryField, partnerField, yearField, monthField];
  }, [isAgencyRole, filterValue.partnerId, selectedPartnerLabel, partnerOptions, yearOptions, monthOptions]);

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

  const collateralFields = useMemo(() => {
    const yearOptionsForFilter = yearOptions.map((o) => ({ value: o.value, label: o.label }));
    const statusOptions = [
      { value: '전체', label: '전체' },
      { value: '정상', label: '정상' },
      { value: '해지', label: '해지' },
    ];

    const statusField = {
      id: 'collateralStatus',
      label: '담보상태',
      type: 'select',
      options: statusOptions,
      width: 120,
      row: 0,
    };

    const yearField = {
      id: 'collateralYear',
      label: '설정년도',
      type: 'select',
      options: yearOptionsForFilter,
      width: 120,
      row: 0,
    };

    const partnerField = {
      id: 'partnerId',
      label: '대리점',
      type: 'select',
      options: isAgencyRole
        ? [{ value: filterValue.partnerId, label: selectedPartnerLabel || '내 대리점' }]
        : collateralPartnerOptions,
      disabled: isAgencyRole,
      wide: true,
      row: 0,
    };

    if (isAgencyRole) {
      return [statusField, yearField, partnerField];
    }

    const partnerQueryField = {
      id: 'collateralPartnerQuery',
      label: '대리점검색',
      type: 'text',
      placeholder: '대리점 검색',
      wide: true,
      row: 0,
    };

    return [statusField, yearField, partnerQueryField, partnerField];
  }, [yearOptions, isAgencyRole, filterValue.partnerId, selectedPartnerLabel, collateralPartnerOptions]);

  const handleCollateralFilterChange = useCallback((id, value) => {
    if (id === 'partnerId') {
      setFilterValue((prev) => ({ ...prev, partnerId: value }));
      return;
    }
    if (id === 'collateralStatus') {
      setCollateralStatus(value);
      return;
    }
    if (id === 'collateralYear') {
      setCollateralYear(value);
      return;
    }
    if (id === 'collateralPartnerQuery') {
      setCollateralPartnerQuery(value);
    }
  }, []);

  const handleCollateralReset = useCallback(() => {
    setCollateralStatus('전체');
    setCollateralYear(String(defaultYear));
    setCollateralPartnerQuery('');
  }, [defaultYear]);

  const actions = (
    <div className={styles.headerActions}>
      <Button
        variant="icon"
        onClick={handleDownload}
        disabled={activeTab !== 'receivable' || !rows.length}
        aria-label="다운로드(엑셀)"
        title="다운로드(엑셀)"
      >
        <Download size={18} />
      </Button>
      <Button
        variant="icon"
        onClick={() => window.print()}
        aria-label="인쇄"
        title="인쇄"
      >
        <Printer size={18} />
      </Button>
    </div>
  );

  return (
    <PageShell
      path="/finance/receivable"
      title="거래 정보 조회"
      description="채권/어음/담보/입금 정보를 탭으로 조회"
      actions={actions}
    >
      <div className={styles.page}>
        <div className={styles.tabs} role="tablist" aria-label="채권 정보 탭">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'receivable'}
            className={activeTab === 'receivable' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('receivable')}
          >
            채권
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'bill'}
            className={activeTab === 'bill' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('bill')}
          >
            어음
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'collateral'}
            className={activeTab === 'collateral' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('collateral')}
          >
            담보
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'deposit'}
            className={activeTab === 'deposit' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('deposit')}
          >
            입금
          </button>
        </div>

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

