import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../router/routePaths';
import { notify } from '../../../shared/utils/notify';
import { MOCK_ITEM_MASTER, getProfitDetail } from '../data/profitAnalysisMock';
import {
  calculateRow,
  createDefaultForm,
  mapDetailItems,
  toNumber,
  createEmptyItem,
} from './salesProfitAnalysisNew.helpers';

export function useSalesProfitAnalysisState() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = useMemo(() => Boolean(id), [id]);
  const detail = useMemo(() => (isEditMode ? getProfitDetail(id) : null), [id, isEditMode]);

  const [activeStep, setActiveStep] = useState(1);
  const [foldSpec, setFoldSpec] = useState(false);
  const [rowAddCount, setRowAddCount] = useState(1);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [form, setForm] = useState(() => {
    if (!detail) return createDefaultForm();
    return {
      specType: detail.specType || '',
      costIncreaseRate: detail.costIncreaseRate || '3',
      builder: detail.builder || '',
      partnerName: detail.partnerName || '',
      siteName: detail.siteName || '',
      region: detail.region || '',
      orderType: detail.orderType || '',
      businessType: detail.businessType || '',
      salesManager: detail.salesManager || '',
      specDate: detail.specDate || '',
      progressStatus: detail.integratedProgress || '',
      expectedDeliveryDate: detail.expectedDeliveryDate || '',
      bidetProgress: detail.integratedProgress || '미진행',
      paidOption: detail.paidOption || '미적용',
      totalHouseholds: detail.totalHouseholds || '',
      appliedHouseholds: detail.appliedHouseholds || '',
      completionDate: detail.completionDate || '',
      originSpecNo: detail.originSpecNo || '',
      partnerDeliveryAmount: '',
      expectedProfitRate: '',
      commissionEnabled: Boolean(detail.commissionEnabled),
      commissionFee: detail.commissionFee || '',
      remark: detail.remark || '',
    };
  });

  const [items, setItems] = useState(() => mapDetailItems(detail));

  const handleFormChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleItemChange = (index, key, value) => {
    setItems((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const updated = { ...row, [key]: value };
        if (key === 'itemCode' && MOCK_ITEM_MASTER[value]) {
          const master = MOCK_ITEM_MASTER[value];
          updated.factoryPrice = master.factoryPrice || 0;
          updated.setUnitPrice = master.factoryPrice || 0;
          updated.cost2026 = master.cost2026 || 0;
          updated.cost2027 = master.cost2027 || 0;
        }
        return calculateRow(updated);
      })
    );
  };

  const addRows = () => {
    const count = Math.max(1, Math.min(10, toNumber(rowAddCount)));
    setItems((prev) => {
      const next = [...prev, ...Array.from({ length: count }, (_, idx) => createEmptyItem(idx))];
      setSelectedRowIndex(next.length - 1);
      return next;
    });
  };

  const removeRow = (index) => setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  const removeSelectedRow = () => {
    if (items.length <= 1) return;
    removeRow(selectedRowIndex);
    setSelectedRowIndex((prev) => Math.max(0, prev - 1));
  };

  const summary = useMemo(
    () =>
      items.reduce(
        (acc, row) => {
          const computed = calculateRow(row);
          acc.factory += toNumber(computed.factoryPrice) * toNumber(computed.qty);
          acc.sales += toNumber(computed.amountSales);
          acc.gross += toNumber(computed.amountGross);
          acc.op += toNumber(computed.amountOp);
          return acc;
        },
        { factory: 0, sales: 0, gross: 0, op: 0 }
      ),
    [items]
  );

  const handleSubmit = () => {
    notify.success(isEditMode ? '수정 저장이 완료되었습니다. (목업)' : '결재상신이 완료되었습니다. (목업)');
    navigate(ROUTES.PROFIT);
  };

  const handleTempSave = () => {
    notify.info('임시저장이 완료되었습니다. (목업)');
    navigate(ROUTES.PROFIT);
  };

  return {
    navigate,
    isEditMode,
    activeStep,
    setActiveStep,
    foldSpec,
    setFoldSpec,
    rowAddCount,
    setRowAddCount,
    selectedRowIndex,
    setSelectedRowIndex,
    form,
    items,
    summary,
    handleFormChange,
    handleItemChange,
    addRows,
    removeSelectedRow,
    handleSubmit,
    handleTempSave,
  };
}
