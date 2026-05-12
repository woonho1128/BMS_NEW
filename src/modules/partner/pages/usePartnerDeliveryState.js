import { useCallback, useEffect, useMemo, useState } from 'react';
import { downloadCsv } from '../../../shared/utils/csv';
import { useAuth } from '../../auth/hooks/useAuth';
import { MOCK_PARTNERS_LIST } from '../../master/data/partnersMock';
import { fetchPartnerMonthlyDelivery, fetchPartnerShipmentStatus } from '../api/partnerDelivery.api';
import { createYearOptions } from './partnerDelivery.helpers';

export function usePartnerDeliveryState() {
  const { user } = useAuth();
  const isAgencyRole = user?.role === 'AGENCY' || user?.role === 'PARTNER' || user?.role === 'DEALER';
  const [activeTab, setActiveTab] = useState('monthly');

  const now = useMemo(() => new Date(), []);
  const defaultYear = now.getFullYear();

  const [partnerId, setPartnerId] = useState('');
  const [partnerQuery, setPartnerQuery] = useState('');

  const [monthlyYear, setMonthlyYear] = useState(String(defaultYear));
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [monthlyResult, setMonthlyResult] = useState({ rows: [], totalCount: 0, totalAmount: 0, totalVat: 0, totalSum: 0 });

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

  useEffect(() => {
    if (isAgencyRole) return;
    if (activeTab === 'monthly') setMonthlyResult({ rows: [], totalCount: 0, totalAmount: 0, totalVat: 0, totalSum: 0 });
  }, [isAgencyRole, activeTab, partnerId, monthlyYear]);

  useEffect(() => {
    if (isAgencyRole) return;
    if (activeTab === 'status') setStatusResult({ rows: [], totalCount: 0, totalQty: 0, totalAmount: 0 });
  }, [isAgencyRole, activeTab, partnerId, factory, shipType, shipStatus, dateFrom, dateTo]);

  useEffect(() => {
    if (!isAgencyRole) return;
    if (!partnerId) return;
    if (activeTab === 'monthly') runMonthlySearch();
    if (activeTab === 'status') runStatusSearch();
  }, [isAgencyRole, partnerId, activeTab, monthlyYear, factory, shipType, shipStatus, dateFrom, dateTo, runMonthlySearch, runStatusSearch]);

  const yearOptions = useMemo(() => {
    return createYearOptions(defaultYear).map((opt) => ({ value: opt.value, label: opt.value }));
  }, [defaultYear]);

  const monthlyFilterValue = useMemo(() => ({ year: monthlyYear, partnerQuery, partnerId }), [monthlyYear, partnerQuery, partnerId]);
  const statusFilterValue = useMemo(() => ({ factory, shipType, shipStatus, dateFrom, dateTo, partnerQuery, partnerId }), [factory, shipType, shipStatus, dateFrom, dateTo, partnerQuery, partnerId]);

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

  const resetMonthlyFilter = useCallback(() => {
    setMonthlyYear(String(defaultYear));
    if (!isAgencyRole) {
      setPartnerQuery('');
      setPartnerId('');
    }
  }, [defaultYear, isAgencyRole]);

  const resetStatusFilter = useCallback(() => {
    setFactory('');
    setShipType('');
    setShipStatus('전체');
    setDateFrom('');
    setDateTo('');
    if (!isAgencyRole) {
      setPartnerQuery('');
      setPartnerId('');
    }
  }, [isAgencyRole]);

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
    downloadCsv('월별내역.csv', [
      { key: 'shipYm', label: '출고 연월' },
      { key: 'partnerName', label: '대리점명' },
      { key: 'shipType', label: '출고형태' },
      { key: 'vatType', label: '부가유형' },
      { key: 'amount', label: '금액' },
      { key: 'vat', label: '부가세' },
      { key: 'total', label: '합계' },
    ], rows);
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
    downloadCsv('출고현황.csv', [
      { key: 'salesGroup', label: '영업그룹' },
      { key: 'factoryCategory', label: '공장구분' },
      { key: 'shipType', label: '출고형태' },
      { key: 'qty', label: '수량' },
      { key: 'amount', label: '금액(원)' },
    ], rows);
  }, [statusResult.rows]);

  return {
    isAgencyRole,
    activeTab,
    setActiveTab,
    partnerId,
    partnerQuery,
    monthlyYear,
    monthlyLoading,
    monthlyResult,
    factory,
    shipType,
    shipStatus,
    dateFrom,
    dateTo,
    statusLoading,
    statusResult,
    partnerOptionsFiltered,
    selectedPartnerLabel,
    yearOptions,
    monthlyFilterValue,
    statusFilterValue,
    runMonthlySearch,
    runStatusSearch,
    onMonthlyChange,
    onStatusChange,
    resetMonthlyFilter,
    resetStatusFilter,
    handleMonthlyDownload,
    handleStatusDownload,
  };
}
