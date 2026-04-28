import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../router/routePaths';
import { notify } from '../../../shared/utils/notify';
import { getProfitDetail } from '../data/profitAnalysisMock';
import {
  createDefaultForm,
  filterProfitList,
  mapProfitRows,
  patchFormWithProfitDetail,
  summarizeProfitRows,
} from './salesInfoRegister.helpers';

export function useSalesInfoRegisterState() {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState('profit');
  const [profitSearch, setProfitSearch] = useState('');
  const [selectedProfitId, setSelectedProfitId] = useState('');
  const [form, setForm] = useState(createDefaultForm);
  const [attachedImage, setAttachedImage] = useState('');
  const [attachedPdf, setAttachedPdf] = useState('');
  const [attachedChecklist, setAttachedChecklist] = useState('');

  useEffect(() => {
    if (inputMode === 'direct' && selectedProfitId) {
      setSelectedProfitId('');
    }
  }, [inputMode, selectedProfitId]);

  const selectedProfit = useMemo(() => (selectedProfitId ? getProfitDetail(selectedProfitId) : null), [selectedProfitId]);
  const filteredProfitList = useMemo(() => filterProfitList(profitSearch), [profitSearch]);
  const profitRows = useMemo(() => mapProfitRows(selectedProfit), [selectedProfit]);
  const profitSummary = useMemo(() => summarizeProfitRows(profitRows), [profitRows]);

  const applyProfitDetailToForm = (detail) => {
    setForm((prev) => patchFormWithProfitDetail(prev, detail));
  };

  const handleProfitSelect = (profitId) => {
    setSelectedProfitId(profitId);
    if (!profitId) return;
    const detail = getProfitDetail(profitId);
    if (detail) {
      applyProfitDetailToForm(detail);
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = () => {
    notify.success('영업정보가 저장되었습니다. (목업)');
    navigate(ROUTES.SALES_INFO);
  };

  return {
    navigate,
    inputMode,
    setInputMode,
    profitSearch,
    setProfitSearch,
    selectedProfitId,
    form,
    setAttachedImage,
    attachedImage,
    setAttachedPdf,
    attachedPdf,
    setAttachedChecklist,
    attachedChecklist,
    filteredProfitList,
    profitRows,
    profitSummary,
    handleProfitSelect,
    updateField,
    save,
  };
}
