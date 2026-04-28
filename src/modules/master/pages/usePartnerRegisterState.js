import { useCallback, useEffect, useMemo, useState } from 'react';
import { notify } from '../../../shared/utils/notify';
import { getPartnerById, getPartnersList } from '../data/partnersMock';
import { getCodesList } from '../../admin/data/adminMock';
import { RECEIVABLES_MOCK } from '../../finance/data/receivablesMock';
import { BILLS_MOCK } from '../../finance/data/billsMock';
import { COLLATERAL_MOCK } from '../../finance/data/collateralMock';
import {
  ADDRESS_SELECTION_OPTIONS,
  buildHistoryChanges,
  buildInitialPartnerHistory,
  createEmptyFinancePreview,
  createFinancePreviewByPartnerId,
  createEmptyCompetitorBrand,
  createEmptyStaffMember,
  createHistorySnapshot,
  createInitialPartnerFormData,
  DEFAULT_DIVISION,
  EMAIL_DOMAIN_OPTIONS,
  formatHistoryTimestamp,
  getDivisionLabelSet,
  normalizeCompetitorBrands,
  parseEmail,
  SALES_CATEGORY_COLORS,
} from './PartnerRegisterPage.helpers';
import {
  buildFinanceCumulative,
  buildOutstandingTabRows,
  buildSalesCategoryOptions,
  buildSalesChartData,
  buildSalesChartModel,
  buildStaffByYearRows,
  buildVisibleSalesSeries,
} from './partnerRegister.computed';

export function usePartnerRegisterState({ navigate, isDetailMode, resolvedPartnerId, businessCards }) {
  const [formData, setFormData] = useState(createInitialPartnerFormData);
  const [cardKeyword, setCardKeyword] = useState('');
  const [partnerKeyword, setPartnerKeyword] = useState('');
  const [isPartnerDropdownOpen, setIsPartnerDropdownOpen] = useState(false);
  const [partnerSearchMessage, setPartnerSearchMessage] = useState('');
  const [isCardDropdownOpen, setIsCardDropdownOpen] = useState(false);
  const [isRepresentativeEditable, setIsRepresentativeEditable] = useState(false);
  const [cardSearchMessage, setCardSearchMessage] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [emailDomainType, setEmailDomainType] = useState('');
  const [emailDomainDirect, setEmailDomainDirect] = useState('');
  const [, setRepresentativeAddressType] = useState('');
  const [, setRepresentativeAddressDirect] = useState('');
  const [saved, setSaved] = useState(false);
  const [financeLoaded, setFinanceLoaded] = useState(false);
  const [financeSearchMessage, setFinanceSearchMessage] = useState('');
  const [financeTab, setFinanceTab] = useState('receivable');
  const [selectedPartnerDetail, setSelectedPartnerDetail] = useState(null);
  const [isBusinessCardLinked, setIsBusinessCardLinked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [financePreview, setFinancePreview] = useState(createEmptyFinancePreview);
  const [salesChartMode, setSalesChartMode] = useState('single');
  const [selectedSalesCategory, setSelectedSalesCategory] = useState('total');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [editHistoryRows, setEditHistoryRows] = useState([]);
  const [editStartSnapshot, setEditStartSnapshot] = useState(null);
  const [divisionMode, setDivisionMode] = useState(DEFAULT_DIVISION);

  const partnerCandidates = useMemo(() => getPartnersList({}), []);
  const partnerTraitCodes = useMemo(() => getCodesList({ groupCode: 'PARTNER_TRAIT', codeName: '' }).filter((row) => row.useYn), []);
  const partnerRegionOptions = useMemo(() => {
    const unique = Array.from(new Set(partnerCandidates.map((row) => row.region).filter(Boolean)));
    return unique.map((region) => ({ value: region, label: region }));
  }, [partnerCandidates]);
  const representativeAddressOptions = useMemo(
    () => Array.from(new Set([...ADDRESS_SELECTION_OPTIONS, ...partnerRegionOptions.map((option) => option.value).filter(Boolean)])),
    [partnerRegionOptions]
  );

  const autoCardResults = useMemo(() => {
    const q = cardKeyword.trim().toLowerCase();
    if (!q) return [];
    return businessCards.filter((card) => String(card.name || '').toLowerCase().includes(q) || String(card.company || '').toLowerCase().includes(q)).slice(0, 8);
  }, [businessCards, cardKeyword]);

  const autoPartnerResults = useMemo(() => {
    const q = partnerKeyword.trim().toLowerCase();
    if (!q) return [];
    return partnerCandidates.filter((partner) => (divisionMode ? partner.division === divisionMode : true)).filter((partner) => String(partner.name || '').toLowerCase().includes(q)).slice(0, 8);
  }, [divisionMode, partnerCandidates, partnerKeyword]);

  const updateRepresentative = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, representative: { ...prev.representative, [field]: value } }));
  }, []);
  const updateStaff = useCallback((id, field, value) => {
    setFormData((prev) => ({ ...prev, staffMembers: (prev.staffMembers || []).map((member) => (member.id === id ? { ...member, [field]: value } : member)) }));
  }, []);
  const handleAddStaff = useCallback(() => setFormData((prev) => ({ ...prev, staffMembers: [...(prev.staffMembers || []), createEmptyStaffMember()] })), []);
  const handleRemoveStaff = useCallback((id) => {
    setFormData((prev) => {
      const next = (prev.staffMembers || []).filter((member) => member.id !== id);
      return { ...prev, staffMembers: next.length > 0 ? next : [createEmptyStaffMember()] };
    });
  }, []);

  const setRepresentativeEmail = useCallback((local, domain) => {
    const email = local && domain ? `${local}@${domain}` : '';
    setFormData((prev) => ({ ...prev, representative: { ...prev.representative, email } }));
  }, []);

  const setStaffEmailParts = useCallback((id, local, domainType, domainDirect) => {
    const domain = domainType === 'direct' ? domainDirect : domainType;
    const email = local && domain ? `${local}@${domain}` : '';
    setFormData((prev) => ({
      ...prev,
      staffMembers: (prev.staffMembers || []).map((member) => (member.id === id ? { ...member, emailLocal: local, emailDomainType: domainType, emailDomainDirect: domainDirect, email } : member)),
    }));
  }, []);

  const updateEditable = useCallback((field, value) => setFormData((prev) => ({ ...prev, [field]: value })), []);
  const handleCompetitorChange = useCallback((id, field, value) => setFormData((prev) => ({ ...prev, competitorBrands: (prev.competitorBrands || []).map((row) => (row.id === id ? { ...row, [field]: value } : row)) })), []);
  const handleAddCompetitorBrand = useCallback(() => setFormData((prev) => ({ ...prev, competitorBrands: [...(prev.competitorBrands || []), createEmptyCompetitorBrand()] })), []);
  const handleRemoveCompetitorBrand = useCallback((id) => {
    setFormData((prev) => {
      const next = (prev.competitorBrands || []).filter((row) => row.id !== id);
      return { ...prev, competitorBrands: next.length > 0 ? next : [createEmptyCompetitorBrand()] };
    });
  }, []);

  const handleCardSelect = useCallback((id) => {
    setIsCardDropdownOpen(false);
    const card = businessCards.find((row) => row.id === id);
    if (!card) return;
    setCardKeyword(`${card.name} / ${card.company}`);
    setIsBusinessCardLinked(true);
    setIsRepresentativeEditable(false);
    const parsed = parseEmail(card.email || '');
    const isCommonDomain = EMAIL_DOMAIN_OPTIONS.includes(parsed.domain);
    setEmailLocal(parsed.local);
    setEmailDomainType(isCommonDomain ? parsed.domain : parsed.domain ? 'direct' : '');
    setEmailDomainDirect(parsed.domain || '');
    setRepresentativeAddressType('direct');
    setRepresentativeAddressDirect(card.address || '');
    setFormData((prev) => ({
      ...prev,
      basic: { ...prev.basic, companyName: prev.basic.companyName || card.company || '', address: prev.basic.address || card.address || '', phone: prev.basic.phone || card.phone || '', ceoName: prev.basic.ceoName || card.name || '' },
      representative: { ...prev.representative, name: card.name || '', mobile: card.phone || '', email: card.email || '', address: card.address || '' },
    }));
    setCardSearchMessage(`${card.company} / ${card.name} 데이터를 가져왔습니다. 직접 입력을 누르면 수정할 수 있습니다.`);
  }, [businessCards]);

  const loadFinancePreviewByPartnerId = useCallback((partnerId, partnerName = '') => {
    const { hasData, preview } = createFinancePreviewByPartnerId(partnerId, RECEIVABLES_MOCK, BILLS_MOCK, COLLATERAL_MOCK, 8);
    setFinancePreview(preview);
    setFinanceLoaded(hasData);
    setFinanceSearchMessage(hasData ? `${partnerName || '선택 대리점'} 기준 데이터를 불러왔습니다.` : `${partnerName || '선택 대리점'} 기준 데이터가 없습니다.`);
  }, []);

  const onPartnerSelect = useCallback((id) => {
    const partnerDetail = getPartnerById(String(id));
    if (!partnerDetail) {
      setPartnerSearchMessage('선택한 대리점 정보를 찾지 못했습니다.');
      return;
    }
    setIsPartnerDropdownOpen(false);
    setPartnerKeyword(partnerDetail.name || '');
    setPartnerSearchMessage(`${partnerDetail.name || '대리점'} 정보를 불러왔습니다.`);
    setSelectedPartnerDetail(partnerDetail);
    setIsBusinessCardLinked(Boolean(partnerDetail.businessCardLinked));
    setFormData((prev) => ({
      ...prev,
      basic: { ...prev.basic, ...(partnerDetail.basic || {}) },
      division: partnerDetail.division || prev.division || DEFAULT_DIVISION,
      region: partnerDetail.region || prev.region,
      partnerTraits: Array.isArray(partnerDetail.partnerTraits) ? partnerDetail.partnerTraits : prev.partnerTraits,
      partnerTraitRatios: partnerDetail.partnerTraitRatios || prev.partnerTraitRatios || {},
      partnerMemo: partnerDetail.partnerMemo || prev.partnerMemo,
      competitorBrands: (() => {
        const normalized = normalizeCompetitorBrands(partnerDetail.competitorBrands);
        return normalized.length > 0 ? normalized : prev.competitorBrands;
      })(),
      historyNotes: partnerDetail.historyNotes || prev.historyNotes,
    }));
    setFinanceTab('receivable');
    loadFinancePreviewByPartnerId(String(id), partnerDetail.name || '');
  }, [loadFinancePreviewByPartnerId]);

  const handleLoadBusinessCardByKeyword = useCallback(() => {
    const q = cardKeyword.trim().toLowerCase();
    if (!q) {
      setCardSearchMessage('이름 또는 회사명을 입력한 뒤 데이터 가져오기를 눌러주세요.');
      return;
    }
    const matched = businessCards.find((card) => String(card.name || '').toLowerCase().includes(q) || String(card.company || '').toLowerCase().includes(q));
    if (!matched) {
      setCardSearchMessage('일치하는 명함이 없습니다. 직접 입력으로 진행할 수 있습니다.');
      return;
    }
    handleCardSelect(matched.id);
  }, [businessCards, cardKeyword, handleCardSelect]);

  const handleReset = useCallback(() => {
    setFormData(createInitialPartnerFormData());
    setPartnerKeyword('');
    setPartnerSearchMessage('');
    setCardKeyword('');
    setCardSearchMessage('');
    setIsPartnerDropdownOpen(false);
    setIsCardDropdownOpen(false);
    setIsRepresentativeEditable(false);
    setIsEditMode(false);
    setIsBusinessCardLinked(false);
    setEmailLocal('');
    setEmailDomainType('');
    setEmailDomainDirect('');
    setRepresentativeAddressType('');
    setRepresentativeAddressDirect('');
    setEditStartSnapshot(null);
    setDivisionMode(DEFAULT_DIVISION);
    setFinanceSearchMessage('');
    setFinanceLoaded(false);
    setFinancePreview(createEmptyFinancePreview());
  }, []);

  const handleManualRepresentative = useCallback(() => {
    setIsRepresentativeEditable(true);
    setIsBusinessCardLinked(false);
    setCardSearchMessage('직접 입력 모드입니다. 대표자 정보를 수정할 수 있습니다.');
    const parsed = parseEmail(formData.representative.email);
    const isCommonDomain = EMAIL_DOMAIN_OPTIONS.includes(parsed.domain);
    setEmailLocal(parsed.local);
    setEmailDomainType(isCommonDomain ? parsed.domain : parsed.domain ? 'direct' : '');
    setEmailDomainDirect(parsed.domain || '');
    const currentAddress = String(formData.representative.address || '');
    if (!currentAddress) {
      setRepresentativeAddressType('');
      setRepresentativeAddressDirect('');
      return;
    }
    if (representativeAddressOptions.includes(currentAddress)) {
      setRepresentativeAddressType(currentAddress);
      setRepresentativeAddressDirect('');
      return;
    }
    setRepresentativeAddressType('direct');
    setRepresentativeAddressDirect(currentAddress);
  }, [formData.representative.address, formData.representative.email, representativeAddressOptions]);

  const handleEmailLocalChange = useCallback((value) => {
    setEmailLocal(value);
    const domain = emailDomainType === 'direct' ? emailDomainDirect : emailDomainType;
    setRepresentativeEmail(value, domain);
  }, [emailDomainDirect, emailDomainType, setRepresentativeEmail]);

  const handleEmailDomainTypeChange = useCallback((value) => {
    setEmailDomainType(value);
    if (!value) {
      setEmailDomainDirect('');
      setRepresentativeEmail(emailLocal, '');
      return;
    }
    if (value === 'direct') {
      setRepresentativeEmail(emailLocal, emailDomainDirect);
      return;
    }
    setEmailDomainDirect(value);
    setRepresentativeEmail(emailLocal, value);
  }, [emailDomainDirect, emailLocal, setRepresentativeEmail]);

  const handleEmailDomainDirectChange = useCallback((value) => {
    setEmailDomainDirect(value);
    if (emailDomainType === 'direct') {
      setRepresentativeEmail(emailLocal, value);
    }
  }, [emailDomainType, emailLocal, setRepresentativeEmail]);

  const handleSubmit = useCallback(() => {
    setSaved(true);
    const currentLabels = getDivisionLabelSet(formData.division || DEFAULT_DIVISION);
    notify.info(`${currentLabels.entityName} 카드 저장 데이터가 준비되었습니다. (목업)`);
    if (isDetailMode) {
      const afterSnapshot = createHistorySnapshot(formData);
      const beforeSnapshot = editStartSnapshot || afterSnapshot;
      const changes = buildHistoryChanges(beforeSnapshot, afterSnapshot, currentLabels);
      if (changes.length > 0) {
        setEditHistoryRows((prev) => [{ id: `history-${Date.now()}`, changedAt: formatHistoryTimestamp(), changedBy: '현재 사용자', reason: '상세 화면 수정 저장', changes }, ...prev]);
      }
      setEditStartSnapshot(null);
      setIsEditMode(false);
      setIsRepresentativeEditable(false);
      return;
    }
    setTimeout(() => navigate('/master/partners'), 500);
  }, [editStartSnapshot, formData, isDetailMode, navigate]);

  const handleMapCenterChange = useCallback((field, value) => setFormData((prev) => ({ ...prev, mapCenter: { ...prev.mapCenter, [field]: value === '' ? '' : Number(value) } })), []);
  const handlePointChange = useCallback((id, field, value) => setFormData((prev) => ({ ...prev, nearbyPoints: prev.nearbyPoints.map((point) => (point.id === id ? { ...point, [field]: field === 'lat' || field === 'lng' ? (value === '' ? '' : Number(value)) : value } : point)) })), []);
  const handleAddPoint = useCallback(() => setFormData((prev) => ({ ...prev, nearbyPoints: [...prev.nearbyPoints, { id: `register-nearby-${Date.now()}`, name: '', type: 'competitor', lat: Number(prev.mapCenter?.lat) || 37.5665, lng: Number(prev.mapCenter?.lng) || 126.978, note: '' }] })), []);
  const handleRemovePoint = useCallback((id) => setFormData((prev) => ({ ...prev, nearbyPoints: prev.nearbyPoints.filter((point) => point.id !== id) })), []);

  const mapPins = useMemo(() => formData.nearbyPoints || [], [formData.nearbyPoints]);
  const handlePartnerTraitToggle = useCallback((traitCode, checked) => {
    setFormData((prev) => {
      const current = prev.partnerTraits || [];
      const nextTraits = checked ? Array.from(new Set([...current, traitCode])) : current.filter((code) => code !== traitCode);
      const nextRatios = { ...(prev.partnerTraitRatios || {}) };
      if (!checked) delete nextRatios[traitCode];
      return { ...prev, partnerTraits: nextTraits, partnerTraitRatios: nextRatios };
    });
  }, []);
  const handlePartnerTraitRatioChange = useCallback((traitCode, value) => {
    const numeric = value.replace(/[^\d.]/g, '');
    setFormData((prev) => ({ ...prev, partnerTraitRatios: { ...(prev.partnerTraitRatios || {}), [traitCode]: numeric } }));
  }, []);

  const salesByYearRows = useMemo(() => (selectedPartnerDetail?.salesByYear || []).slice().sort((a, b) => a.year - b.year), [selectedPartnerDetail]);
  const salesCategoryOptions = useMemo(() => buildSalesCategoryOptions(salesByYearRows), [salesByYearRows]);
  const visibleSalesSeries = useMemo(() => buildVisibleSalesSeries(salesCategoryOptions, salesChartMode, selectedSalesCategory, SALES_CATEGORY_COLORS), [salesCategoryOptions, salesChartMode, selectedSalesCategory]);
  const salesChartData = useMemo(() => buildSalesChartData(salesByYearRows), [salesByYearRows]);
  const salesChartModel = useMemo(() => buildSalesChartModel(salesChartData, visibleSalesSeries), [salesChartData, visibleSalesSeries]);
  const staffByYearRows = useMemo(() => buildStaffByYearRows(selectedPartnerDetail), [selectedPartnerDetail]);
  const outstandingTabRows = useMemo(() => buildOutstandingTabRows(financePreview.receivableRows, selectedPartnerDetail), [financePreview.receivableRows, selectedPartnerDetail]);
  const financeCumulative = useMemo(() => buildFinanceCumulative(financePreview, outstandingTabRows), [financePreview, outstandingTabRows]);
  const hasBusinessCardLinked = isBusinessCardLinked;
  const isEditableMode = !isDetailMode || isEditMode;
  const handleOpenHistory = useCallback(() => setHistoryModalOpen(true), []);
  const handleStartEditMode = useCallback(() => {
    setEditStartSnapshot(createHistorySnapshot(formData));
    setIsEditMode(true);
    setIsRepresentativeEditable(true);
  }, [formData]);

  useEffect(() => {
    if (!salesCategoryOptions.length) return;
    if (!salesCategoryOptions.some((category) => category.key === selectedSalesCategory)) {
      setSelectedSalesCategory(salesCategoryOptions[0].key);
    }
  }, [salesCategoryOptions, selectedSalesCategory]);

  useEffect(() => {
    if (!isDetailMode || !resolvedPartnerId) return;
    const partnerDetail = getPartnerById(String(resolvedPartnerId));
    if (!partnerDetail) return;
    const detailLabels = getDivisionLabelSet(partnerDetail.division || DEFAULT_DIVISION);

    setSelectedPartnerDetail(partnerDetail);
    setPartnerKeyword(partnerDetail.name || '');
    setPartnerSearchMessage('');
    setIsPartnerDropdownOpen(false);
    setCardKeyword('');
    setCardSearchMessage('');
    setIsCardDropdownOpen(false);
    setIsRepresentativeEditable(false);
    setIsEditMode(false);
    setEditStartSnapshot(null);
    setIsBusinessCardLinked(Boolean(partnerDetail.businessCardLinked));
    setEditHistoryRows(buildInitialPartnerHistory(partnerDetail, detailLabels));

    const representative = partnerDetail.representative || {};
    const parsedEmail = parseEmail(representative.email || '');
    const isCommonDomain = EMAIL_DOMAIN_OPTIONS.includes(parsedEmail.domain);
    setEmailLocal(parsedEmail.local);
    setEmailDomainType(isCommonDomain ? parsedEmail.domain : parsedEmail.domain ? 'direct' : '');
    setEmailDomainDirect(parsedEmail.domain || '');
    setRepresentativeAddressType('direct');
    setRepresentativeAddressDirect(representative.address || '');

    setFormData((prev) => ({
      ...prev,
      basic: { ...prev.basic, ...(partnerDetail.basic || {}) },
      division: partnerDetail.division || prev.division || DEFAULT_DIVISION,
      representative: { ...prev.representative, ...representative },
      partnerMemo: partnerDetail.partnerMemo || '',
      region: partnerDetail.region || '',
      partnerTraits: Array.isArray(partnerDetail.partnerTraits) ? partnerDetail.partnerTraits : [],
      partnerTraitRatios: partnerDetail.partnerTraitRatios || {},
      competitorBrands: (() => {
        const normalized = normalizeCompetitorBrands(partnerDetail.competitorBrands);
        return normalized.length > 0 ? normalized : prev.competitorBrands;
      })(),
      mapCenter: partnerDetail.mapCenter || prev.mapCenter,
      nearbyPoints: Array.isArray(partnerDetail.nearbyPoints) ? partnerDetail.nearbyPoints : [],
      historyNotes: partnerDetail.historyNotes || '',
      staffMembers: Array.isArray(partnerDetail.staffMembers) && partnerDetail.staffMembers.length > 0 ? partnerDetail.staffMembers.map((row) => ({ ...createEmptyStaffMember(), ...row })) : prev.staffMembers,
    }));

    loadFinancePreviewByPartnerId(String(partnerDetail.id), partnerDetail.name || '');
  }, [isDetailMode, resolvedPartnerId, loadFinancePreviewByPartnerId]);

  useEffect(() => {
    setDivisionMode(formData.division || DEFAULT_DIVISION);
  }, [formData.division]);

  const divisionLabels = useMemo(() => getDivisionLabelSet(divisionMode), [divisionMode]);

  return {
    formData,setFormData,cardKeyword,setCardKeyword,partnerKeyword,setPartnerKeyword,isPartnerDropdownOpen,setIsPartnerDropdownOpen,partnerSearchMessage,setPartnerSearchMessage,isCardDropdownOpen,setIsCardDropdownOpen,isRepresentativeEditable,setIsRepresentativeEditable,cardSearchMessage,setCardSearchMessage,emailLocal,emailDomainType,emailDomainDirect,saved,financeLoaded,financeSearchMessage,financeTab,setFinanceTab,selectedPartnerDetail,isBusinessCardLinked,isEditMode,setIsEditMode,financePreview,salesChartMode,setSalesChartMode,selectedSalesCategory,setSelectedSalesCategory,historyModalOpen,setHistoryModalOpen,editHistoryRows,editStartSnapshot,setEditStartSnapshot,divisionMode,
    partnerTraitCodes,partnerRegionOptions,autoCardResults,autoPartnerResults,updateRepresentative,updateStaff,handleAddStaff,handleRemoveStaff,setStaffEmailParts,updateEditable,handleCompetitorChange,handleAddCompetitorBrand,handleRemoveCompetitorBrand,handleCardSelect,onPartnerSelect,handleLoadBusinessCardByKeyword,handleReset,handleManualRepresentative,handleEmailLocalChange,handleEmailDomainTypeChange,handleEmailDomainDirectChange,handleSubmit,handleMapCenterChange,handlePointChange,handleAddPoint,handleRemovePoint,mapPins,handlePartnerTraitToggle,handlePartnerTraitRatioChange,salesByYearRows,salesCategoryOptions,visibleSalesSeries,salesChartData,salesChartModel,staffByYearRows,outstandingTabRows,financeCumulative,hasBusinessCardLinked,isEditableMode,handleOpenHistory,handleStartEditMode,divisionLabels,
  };
}
