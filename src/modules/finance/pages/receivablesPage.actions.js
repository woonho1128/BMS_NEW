import { downloadCsv } from '../../../shared/utils/csv';

export function makePartnerSetter(setFilterValue) {
  return (value) => setFilterValue((prev) => ({ ...prev, partnerId: value }));
}

export function handleBillFilterInput({ setFilterValue, setBillCriteria, setBillFrom, setBillTo }, id, value) {
  if (id === 'partnerId') return setFilterValue((prev) => ({ ...prev, partnerId: value }));
  if (id === 'billCriteria') return setBillCriteria(value);
  if (id === 'billFrom') return setBillFrom(value);
  if (id === 'billTo') return setBillTo(value);
}

export function handleDepositFilterInput({ setFilterValue, setDepositYear, setDepositMonth }, id, value) {
  if (id === 'partnerId') return setFilterValue((prev) => ({ ...prev, partnerId: value }));
  if (id === 'depositYear') return setDepositYear(value);
  if (id === 'depositMonth') return setDepositMonth(value);
}

export function handleCollateralFilterInput({ setFilterValue, setCollateralStatus, setCollateralYear, setCollateralPartnerQuery }, id, value) {
  if (id === 'partnerId') return setFilterValue((prev) => ({ ...prev, partnerId: value }));
  if (id === 'collateralStatus') return setCollateralStatus(value);
  if (id === 'collateralYear') return setCollateralYear(value);
  if (id === 'collateralPartnerQuery') return setCollateralPartnerQuery(value);
}

export function downloadReceivableCsv(rows, selectedPartnerLabel, year, month) {
  if (!rows.length) return;
  const safePartner = (selectedPartnerLabel || 'partner').replaceAll(' ', '_');
  downloadCsv(
    `채권채무현황_${safePartner}_${year}${month}.csv`,
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
}

export function downloadBillCsv(rows, selectedPartnerLabel) {
  if (!rows.length) return;
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
    rows.map((r) => ({ ...r, memo: r.memo || '' }))
  );
}

export function downloadCollateralCsv(rows, selectedPartnerLabel, year) {
  if (!rows.length) return;
  const safePartner = (selectedPartnerLabel || 'partner').replaceAll(' ', '_');
  downloadCsv(
    `담보조회_${safePartner}_${year}.csv`,
    [
      { key: 'collateralName', label: '담보명' },
      { key: 'status', label: '담보상태' },
      { key: 'companySetAmount', label: '당사설정액' },
      { key: 'creditLimit', label: '여신한도' },
      { key: 'appraisedValue', label: '감정가' },
      { key: 'year', label: '설정년도' },
    ],
    rows
  );
}
