import { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { getPartnerById, getPartnersList } from '../data/partnersMock';
import { getCodesList } from '../../admin/data/adminMock';
import { getBusinessCardsList } from '../../sales/data/businessCardMock';
import { RECEIVABLES_MOCK } from '../../finance/data/receivablesMock';
import { BILLS_MOCK } from '../../finance/data/billsMock';
import { COLLATERAL_MOCK } from '../../finance/data/collateralMock';
import { classnames } from '../../../shared/utils/classnames';
import styles from './PartnerRegisterPage.module.css';

function createDefaultCompetitorBrands(names) {
  return names.reduce((acc, name) => {
    acc[name] = { isHandling: false, scale: '' };
    return acc;
  }, {});
}

const EMAIL_DOMAIN_OPTIONS = ['naver.com', 'gmail.com', 'daum.net', 'nate.com', 'hanmail.net'];
const ADDRESS_SELECTION_OPTIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
const COMPETITOR_BRAND_OPTIONS = ['계림요업', '아메리칸스탠다드', '대림통상', 'ASK', 'R&CO', 'VOVO'];

function parseEmail(email) {
  const raw = String(email || '');
  if (!raw.includes('@')) return { local: '', domain: '' };
  const [local, domain] = raw.split('@');
  return { local: local || '', domain: domain || '' };
}

function createEmptyStaffMember() {
  return {
    id: `staff-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    mobile: '',
    email: '',
    emailLocal: '',
    emailDomainType: '',
    emailDomainDirect: '',
    memo: '',
  };
}

export function PartnerRegisterPage({ mode = 'register', partnerId: initialPartnerId = '' }) {
  const navigate = useNavigate();
  const { id: routePartnerId } = useParams();
  const resolvedPartnerId = initialPartnerId || routePartnerId || '';
  const isDetailMode = mode === 'detail';
  const competitorNames = useMemo(() => COMPETITOR_BRAND_OPTIONS, []);
  const businessCards = useMemo(() => getBusinessCardsList({}), []);
  const defaultCompetitorBrands = useMemo(
    () => createDefaultCompetitorBrands(competitorNames),
    [competitorNames]
  );

  const [formData, setFormData] = useState({
    basic: {
      partnerCode: '',
      companyName: '',
      bizNo: '',
      ceoName: '',
      address: '',
      phone: '',
      fax: '',
      bizType: '',
      bizItem: '',
      establishedAt: '',
    },
    representative: {
      name: '',
      birthDate: '',
      mobile: '',
      email: '',
      address: '',
      memo: '',
    },
    staffMembers: [createEmptyStaffMember()],
    partnerMemo: '',
    region: '',
    partnerTraits: [],
    partnerTraitRatios: {},
    competitorBrands: defaultCompetitorBrands,
    mapCenter: { lat: 37.5665, lng: 126.978, radiusKm: 3 },
    nearbyPoints: [],
    historyNotes: '',
  });

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
  const [representativeAddressType, setRepresentativeAddressType] = useState('');
  const [representativeAddressDirect, setRepresentativeAddressDirect] = useState('');
  const [saved, setSaved] = useState(false);
  const [financeLoaded, setFinanceLoaded] = useState(false);
  const [financePartnerQuery, setFinancePartnerQuery] = useState('');
  const [financeSearchMessage, setFinanceSearchMessage] = useState('');
  const [financeTab, setFinanceTab] = useState('receivable');
  const [selectedPartnerDetail, setSelectedPartnerDetail] = useState(null);
  const [isBusinessCardLinked, setIsBusinessCardLinked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [financePreview, setFinancePreview] = useState({
    receivableRows: [],
    billRows: [],
    collateralRows: [],
  });

  const partnerCandidates = useMemo(() => getPartnersList({}), []);
  const partnerTraitCodes = useMemo(
    () => getCodesList({ groupCode: 'PARTNER_TRAIT', codeName: '' }).filter((row) => row.useYn),
    []
  );
  const partnerRegionOptions = useMemo(() => {
    const unique = Array.from(
      new Set(
        partnerCandidates
          .map((row) => row.region)
          .filter(Boolean)
      )
    );
    return unique.map((region) => ({ value: region, label: region }));
  }, [partnerCandidates]);
  const representativeAddressOptions = useMemo(
    () =>
      Array.from(new Set([...ADDRESS_SELECTION_OPTIONS, ...partnerRegionOptions.map((option) => option.value).filter(Boolean)])),
    [partnerRegionOptions]
  );

  const autoCardResults = useMemo(() => {
    const q = cardKeyword.trim().toLowerCase();
    if (!q) return [];
    return businessCards
      .filter(
        (card) =>
          String(card.name || '')
            .toLowerCase()
            .includes(q) ||
          String(card.company || '')
            .toLowerCase()
            .includes(q)
      )
      .slice(0, 8);
  }, [businessCards, cardKeyword]);

  const autoPartnerResults = useMemo(() => {
    const q = partnerKeyword.trim().toLowerCase();
    if (!q) return [];
    return partnerCandidates
      .filter((partner) =>
        String(partner.name || '')
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 8);
  }, [partnerCandidates, partnerKeyword]);

  const updateBasic = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      basic: { ...prev.basic, [field]: value },
    }));
  }, []);

  const updateRepresentative = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      representative: { ...prev.representative, [field]: value },
    }));
  }, []);

  const updateStaff = useCallback((id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      staffMembers: (prev.staffMembers || []).map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      ),
    }));
  }, []);

  const handleAddStaff = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      staffMembers: [...(prev.staffMembers || []), createEmptyStaffMember()],
    }));
  }, []);

  const handleRemoveStaff = useCallback((id) => {
    setFormData((prev) => {
      const next = (prev.staffMembers || []).filter((member) => member.id !== id);
      return {
        ...prev,
        staffMembers: next.length > 0 ? next : [createEmptyStaffMember()],
      };
    });
  }, []);

  const setRepresentativeEmail = useCallback((local, domain) => {
    const email = local && domain ? `${local}@${domain}` : '';
    setFormData((prev) => ({
      ...prev,
      representative: { ...prev.representative, email },
    }));
  }, []);

  const handleRepresentativeAddressTypeChange = useCallback((value) => {
    setRepresentativeAddressType(value);
    if (value === 'direct') {
      setFormData((prev) => ({
        ...prev,
        representative: { ...prev.representative, address: representativeAddressDirect || '' },
      }));
      return;
    }

    setRepresentativeAddressDirect('');
    setFormData((prev) => ({
      ...prev,
      representative: { ...prev.representative, address: value || '' },
    }));
  }, [representativeAddressDirect]);

  const handleRepresentativeAddressDirectChange = useCallback((value) => {
    setRepresentativeAddressDirect(value);
    if (representativeAddressType === 'direct') {
      setFormData((prev) => ({
        ...prev,
        representative: { ...prev.representative, address: value },
      }));
    }
  }, [representativeAddressType]);

  const setStaffEmailParts = useCallback((id, local, domainType, domainDirect) => {
    const domain = domainType === 'direct' ? domainDirect : domainType;
    const email = local && domain ? `${local}@${domain}` : '';
    setFormData((prev) => ({
      ...prev,
      staffMembers: (prev.staffMembers || []).map((member) =>
        member.id === id
          ? {
              ...member,
              emailLocal: local,
              emailDomainType: domainType,
              emailDomainDirect: domainDirect,
              email,
            }
          : member
      ),
    }));
  }, []);

  const updateEditable = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCompetitorChange = useCallback((brandName, field, value) => {
    setFormData((prev) => ({
      ...prev,
      competitorBrands: {
        ...prev.competitorBrands,
        [brandName]: {
          ...prev.competitorBrands[brandName],
          [field]: value,
        },
      },
    }));
  }, []);

  const handleCardSelect = useCallback(
    (id) => {
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
        basic: {
          ...prev.basic,
          companyName: prev.basic.companyName || card.company || '',
          address: prev.basic.address || card.address || '',
          phone: prev.basic.phone || card.phone || '',
          ceoName: prev.basic.ceoName || card.name || '',
        },
        representative: {
          ...prev.representative,
          name: card.name || '',
          mobile: card.phone || '',
          email: card.email || '',
          address: card.address || '',
        },
      }));
      setCardSearchMessage(`${card.company} / ${card.name} 데이터를 가져왔습니다. 직접 입력을 누르면 수정할 수 있습니다.`);
    },
    [businessCards]
  );

  const loadFinancePreviewByPartnerId = useCallback((partnerId, partnerName = '') => {
    const receivableRows = RECEIVABLES_MOCK
      .filter((entry) => entry.partnerId === partnerId)
      .flatMap((entry) =>
        (entry.rows || []).map((row) => ({
          baseYm: row.baseYm || `${entry.year}-${String(entry.month).padStart(2, '0')}`,
          tradeLimit: row.tradeLimit ?? 0,
          salesThisMonth: row.salesThisMonth ?? 0,
          depositThisMonth: row.depositThisMonth ?? 0,
          unpaidBill: row.unpaidBill ?? 0,
        }))
      );

    const billRows = BILLS_MOCK.filter((row) => row.partnerId === partnerId).slice(0, 8);
    const collateralRows = COLLATERAL_MOCK.filter((row) => row.partnerId === partnerId).slice(0, 8);
    const hasData = receivableRows.length > 0 || billRows.length > 0 || collateralRows.length > 0;

    setFinancePreview({ receivableRows, billRows, collateralRows });
    setFinanceLoaded(hasData);
    setFinanceSearchMessage(
      hasData
        ? `${partnerName || '선택 대리점'} 기준 데이터를 불러왔습니다.`
        : `${partnerName || '선택 대리점'} 기준 데이터가 없습니다.`
    );
  }, []);

  const handlePartnerSelect = useCallback((id) => {
    const partnerDetail = getPartnerById(String(id));
    if (!partnerDetail) {
      setPartnerSearchMessage('선택한 대리점 정보를 찾지 못했습니다.');
      return;
    }

    setIsPartnerDropdownOpen(false);
    setPartnerKeyword(partnerDetail.name || '');
    setPartnerSearchMessage(`${partnerDetail.name || '대리점'} 정보를 불러왔습니다.`);
    setFormData((prev) => ({
      ...prev,
      basic: {
        ...prev.basic,
        ...(partnerDetail.basic || {}),
      },
      region: partnerDetail.region || prev.region,
    }));
  }, []);

  const onPartnerSelect = useCallback(
    (id) => {
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
        basic: {
          ...prev.basic,
          ...(partnerDetail.basic || {}),
        },
        region: partnerDetail.region || prev.region,
        partnerTraits: Array.isArray(partnerDetail.partnerTraits) ? partnerDetail.partnerTraits : prev.partnerTraits,
        partnerTraitRatios: partnerDetail.partnerTraitRatios || prev.partnerTraitRatios || {},
        partnerMemo: partnerDetail.partnerMemo || prev.partnerMemo,
        competitorBrands: partnerDetail.competitorBrands || prev.competitorBrands,
        historyNotes: partnerDetail.historyNotes || prev.historyNotes,
      }));
      setFinanceTab('receivable');
      loadFinancePreviewByPartnerId(String(id), partnerDetail.name || '');
    },
    [loadFinancePreviewByPartnerId]
  );

  const handleLoadBusinessCardByKeyword = useCallback(() => {
    const q = cardKeyword.trim().toLowerCase();
    if (!q) {
      setCardSearchMessage('이름 또는 회사명을 입력한 뒤 데이터 가져오기를 눌러주세요.');
      return;
    }

    const matched = businessCards.find(
      (card) =>
        String(card.name || '')
          .toLowerCase()
          .includes(q) ||
        String(card.company || '')
          .toLowerCase()
          .includes(q)
    );

    if (!matched) {
      setCardSearchMessage('일치하는 명함이 없습니다. 직접 입력으로 진행할 수 있습니다.');
      return;
    }

    handleCardSelect(matched.id);
  }, [businessCards, cardKeyword, handleCardSelect]);

  const handleReset = useCallback(() => {
    setFormData({
      basic: {
        partnerCode: '',
        companyName: '',
        bizNo: '',
        ceoName: '',
        address: '',
        phone: '',
        fax: '',
        bizType: '',
        bizItem: '',
        establishedAt: '',
      },
      representative: {
        name: '',
        birthDate: '',
        mobile: '',
        email: '',
        address: '',
        memo: '',
      },
      staffMembers: [createEmptyStaffMember()],
      partnerMemo: '',
      region: '',
      partnerTraits: [],
      partnerTraitRatios: {},
      competitorBrands: defaultCompetitorBrands,
      mapCenter: { lat: 37.5665, lng: 126.978, radiusKm: 3 },
      nearbyPoints: [],
      historyNotes: '',
    });
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
    setFinanceSearchMessage('');
    setFinanceLoaded(false);
    setFinancePreview({
      receivableRows: [],
      billRows: [],
      collateralRows: [],
    });
  }, [defaultCompetitorBrands]);

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

  const handleEmailLocalChange = useCallback(
    (value) => {
      setEmailLocal(value);
      const domain = emailDomainType === 'direct' ? emailDomainDirect : emailDomainType;
      setRepresentativeEmail(value, domain);
    },
    [emailDomainDirect, emailDomainType, setRepresentativeEmail]
  );

  const handleEmailDomainTypeChange = useCallback(
    (value) => {
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
    },
    [emailDomainDirect, emailLocal, setRepresentativeEmail]
  );

  const handleEmailDomainDirectChange = useCallback(
    (value) => {
      setEmailDomainDirect(value);
      if (emailDomainType === 'direct') {
        setRepresentativeEmail(emailLocal, value);
      }
    },
    [emailDomainType, emailLocal, setRepresentativeEmail]
  );

  const handleSubmit = useCallback(() => {
    setSaved(true);
    console.log('partner register payload', formData);
    if (isDetailMode) {
      setIsEditMode(false);
      setIsRepresentativeEditable(false);
      return;
    }
    setTimeout(() => navigate('/master/partners'), 500);
  }, [formData, isDetailMode, navigate]);

  const handleLoadFinanceMock = useCallback(() => {
    const q = financePartnerQuery.trim().toLowerCase();
    if (!q) {
      setFinanceLoaded(false);
      setFinanceSearchMessage('대리점명을 입력한 뒤 데이터 가져오기를 실행해 주세요.');
      return;
    }

    const matchedPartner = partnerCandidates.find((partner) =>
      String(partner.name || '')
        .toLowerCase()
        .includes(q)
    );

    if (!matchedPartner) {
      setFinancePreview({
        receivableRows: [],
        billRows: [],
        collateralRows: [],
      });
      setFinanceLoaded(false);
      setFinanceSearchMessage('일치하는 대리점이 없습니다. 다른 이름으로 다시 검색해 주세요.');
      return;
    }

    const partnerId = String(matchedPartner.id);
    const receivableRows = RECEIVABLES_MOCK
      .filter((entry) => entry.partnerId === partnerId)
      .flatMap((entry) => (entry.rows || []).map((row) => ({
        baseYm: row.baseYm || `${entry.year}-${String(entry.month).padStart(2, '0')}`,
        tradeLimit: row.tradeLimit ?? 0,
        salesThisMonth: row.salesThisMonth ?? 0,
        depositThisMonth: row.depositThisMonth ?? 0,
        unpaidBill: row.unpaidBill ?? 0,
      })));

    const billRows = BILLS_MOCK.filter((row) => row.partnerId === partnerId).slice(0, 4);
    const collateralRows = COLLATERAL_MOCK.filter((row) => row.partnerId === partnerId).slice(0, 4);

    setFinancePreview({ receivableRows, billRows, collateralRows });
    const hasData = receivableRows.length > 0 || billRows.length > 0 || collateralRows.length > 0;
    setFinanceLoaded(hasData);
    setFinanceSearchMessage(
      hasData
        ? `${matchedPartner.name} 기준 목업 데이터를 불러왔습니다.`
        : `${matchedPartner.name} 기준 데이터가 아직 없습니다.`
    );
  }, [financePartnerQuery, partnerCandidates]);

  const handleMapCenterChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      mapCenter: {
        ...prev.mapCenter,
        [field]: value === '' ? '' : Number(value),
      },
    }));
  }, []);

  const handlePointChange = useCallback((id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      nearbyPoints: prev.nearbyPoints.map((point) =>
        point.id === id
          ? {
              ...point,
              [field]: field === 'lat' || field === 'lng' ? (value === '' ? '' : Number(value)) : value,
            }
          : point
      ),
    }));
  }, []);

  const handleAddPoint = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      nearbyPoints: [
        ...prev.nearbyPoints,
        {
          id: `register-nearby-${Date.now()}`,
          name: '',
          type: 'competitor',
          lat: Number(prev.mapCenter?.lat) || 37.5665,
          lng: Number(prev.mapCenter?.lng) || 126.978,
          note: '',
        },
      ],
    }));
  }, []);

  const handleRemovePoint = useCallback((id) => {
    setFormData((prev) => ({
      ...prev,
      nearbyPoints: prev.nearbyPoints.filter((point) => point.id !== id),
    }));
  }, []);

  const emptyRows = useMemo(() => [2024, 2023, 2022, 2021, 2020], []);
  const mapPins = useMemo(() => formData.nearbyPoints || [], [formData.nearbyPoints]);
  const handlePartnerTraitToggle = useCallback((traitCode, checked) => {
    setFormData((prev) => {
      const current = prev.partnerTraits || [];
      const nextTraits = checked ? Array.from(new Set([...current, traitCode])) : current.filter((code) => code !== traitCode);
      const nextRatios = { ...(prev.partnerTraitRatios || {}) };
      if (!checked) {
        delete nextRatios[traitCode];
      }
      return {
        ...prev,
        partnerTraits: nextTraits,
        partnerTraitRatios: nextRatios,
      };
    });
  }, []);

  const handlePartnerTraitRatioChange = useCallback((traitCode, value) => {
    const numeric = value.replace(/[^\d.]/g, '');
    setFormData((prev) => ({
      ...prev,
      partnerTraitRatios: {
        ...(prev.partnerTraitRatios || {}),
        [traitCode]: numeric,
      },
    }));
  }, []);

  const salesByYearRows = useMemo(
    () => (selectedPartnerDetail?.salesByYear || []).slice().sort((a, b) => a.year - b.year),
    [selectedPartnerDetail]
  );
  const maxSalesAmount = useMemo(
    () => salesByYearRows.reduce((max, row) => Math.max(max, Number(row.amount || 0)), 0),
    [salesByYearRows]
  );
  const staffByYearRows = useMemo(() => {
    const source = selectedPartnerDetail?.staffByYear || {};
    return Object.entries(source)
      .map(([year, info]) => ({
        year: Number(year),
        name: info?.name || '-',
        status: info?.isActive ? '유지' : '변경',
      }))
      .sort((a, b) => b.year - a.year)
      .slice(0, 4);
  }, [selectedPartnerDetail]);
  const competitorBrandRows = useMemo(
    () => Object.entries(selectedPartnerDetail?.competitorBrands || formData.competitorBrands || {}),
    [selectedPartnerDetail, formData.competitorBrands]
  );

  const receivableTabRows = useMemo(
    () =>
      (financePreview.receivableRows || []).map((row) => [
        row.baseYm,
        row.tradeLimit ?? 0,
        row.salesThisMonth ?? 0,
        row.depositThisMonth ?? 0,
      ]),
    [financePreview.receivableRows]
  );
  const collectionTabRows = useMemo(
    () =>
      (financePreview.billRows || []).map((row) => [
        selectedPartnerDetail?.basic?.partnerCode || '-',
        selectedPartnerDetail?.name || '-',
        selectedPartnerDetail?.basic?.ceoName || '-',
        '어음',
        row.dueDate || '-',
        row.billNo || '-',
        row.amount ?? 0,
      ]),
    [financePreview.billRows, selectedPartnerDetail]
  );
  const noteTabRows = useMemo(
    () =>
      (financePreview.billRows || []).map((row) => [
        row.status || '-',
        row.billNo || '-',
        row.amount ?? 0,
        row.dueDate || '-',
        row.bankName || '-',
      ]),
    [financePreview.billRows]
  );
  const outstandingTabRows = useMemo(
    () =>
      (financePreview.receivableRows || []).map((row, index) => {
        const sales = Number(row.salesThisMonth || 0);
        const deposit = Number(row.depositThisMonth || 0);
        return [
          selectedPartnerDetail?.basic?.partnerCode || '-',
          selectedPartnerDetail?.name || '-',
          `BN-${String(index + 1).padStart(4, '0')}`,
          sales,
          deposit,
          Math.max(0, sales - deposit),
        ];
      }),
    [financePreview.receivableRows, selectedPartnerDetail]
  );

  const hasBusinessCardLinked = isBusinessCardLinked;
  const isEditableMode = !isDetailMode || isEditMode;

  useEffect(() => {
    if (!isDetailMode || !resolvedPartnerId) return;

    const partnerDetail = getPartnerById(String(resolvedPartnerId));
    if (!partnerDetail) return;

    setSelectedPartnerDetail(partnerDetail);
    setPartnerKeyword(partnerDetail.name || '');
    setPartnerSearchMessage('');
    setIsPartnerDropdownOpen(false);
    setCardKeyword('');
    setCardSearchMessage('');
    setIsCardDropdownOpen(false);
    setIsRepresentativeEditable(false);
    setIsEditMode(false);
    setIsBusinessCardLinked(Boolean(partnerDetail.businessCardLinked));

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
      representative: { ...prev.representative, ...representative },
      partnerMemo: partnerDetail.partnerMemo || '',
      region: partnerDetail.region || '',
      partnerTraits: Array.isArray(partnerDetail.partnerTraits) ? partnerDetail.partnerTraits : [],
      partnerTraitRatios: partnerDetail.partnerTraitRatios || {},
      competitorBrands: partnerDetail.competitorBrands || prev.competitorBrands,
      mapCenter: partnerDetail.mapCenter || prev.mapCenter,
      nearbyPoints: Array.isArray(partnerDetail.nearbyPoints) ? partnerDetail.nearbyPoints : [],
      historyNotes: partnerDetail.historyNotes || '',
      staffMembers:
        Array.isArray(partnerDetail.staffMembers) && partnerDetail.staffMembers.length > 0
          ? partnerDetail.staffMembers.map((row) => ({ ...createEmptyStaffMember(), ...row }))
          : prev.staffMembers,
    }));

    loadFinancePreviewByPartnerId(String(partnerDetail.id), partnerDetail.name || '');
  }, [isDetailMode, resolvedPartnerId, loadFinancePreviewByPartnerId]);

  return (
    <PageShell
      path="/master/partners"
      title="대리점 등록"
      description="상세 화면 구조와 동일한 등록 창입니다."
      {...(isDetailMode
        ? { title: '대리점 상세', description: '등록 화면과 동일한 구성의 읽기 전용 상세 화면입니다.' }
        : { title: '대리점 등록', description: '상세 화면 구조와 동일한 등록 화면입니다.' })}
    >
      <div className={classnames(styles.page, isDetailMode && !isEditMode && styles.readOnlyPage)}>
        <Card title="1) 대리점 정보" className={styles.card}>
          <CardBody>
            <div className={styles.erpBlock}>
              <div className={styles.searchWrap}>
                <div className={classnames(styles.searchRow, styles.searchRowSingle)}>
                  <input
                    className={styles.input}
                    value={partnerKeyword}
                    disabled={isDetailMode}
                    onChange={(e) => {
                      setPartnerKeyword(e.target.value);
                      setPartnerSearchMessage('');
                      setIsPartnerDropdownOpen(true);
                    }}
                    onFocus={() => setIsPartnerDropdownOpen(true)}
                    onBlur={() => {
                      setTimeout(() => setIsPartnerDropdownOpen(false), 120);
                    }}
                    placeholder="대리점명 검색"
                  />
                </div>
                {isPartnerDropdownOpen && autoPartnerResults.length > 0 && (
                  <ul className={styles.searchList}>
                    {autoPartnerResults.map((partner) => (
                      <li key={partner.id}>
                        <button
                          type="button"
                          className={styles.searchItem}
                          onClick={() => onPartnerSelect(partner.id)}
                        >
                          {partner.name} / {partner.manager} / {partner.region}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {isPartnerDropdownOpen && partnerKeyword.trim() && autoPartnerResults.length === 0 && (
                  <div className={styles.noResult}>검색 결과가 없습니다.</div>
                )}
              </div>
              {partnerSearchMessage && <p className={styles.hint}>{partnerSearchMessage}</p>}

              <div className={styles.grid}>
                <div className={styles.field}>
                  <label className={styles.label}>대리점 코드</label>
                  <input className={styles.input} value={formData.basic.partnerCode || ''} disabled />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>대리점명</label>
                  <input className={styles.input} value={formData.basic.companyName || ''} disabled />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>대표자</label>
                  <input className={styles.input} value={formData.basic.ceoName || ''} disabled />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>사업자번호</label>
                  <input className={styles.input} value={formData.basic.bizNo || ''} disabled />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>전화번호</label>
                  <input className={styles.input} value={formData.basic.phone || ''} disabled />
                </div>
                <div className={`${styles.field} ${styles.full}`}>
                  <label className={styles.label}>주소</label>
                  <input className={styles.input} value={formData.basic.address || ''} disabled />
                </div>
              </div>
            </div>

            <div className={styles.editableBlock}>
              <div className={styles.extraGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>지역</label>
                  <select
                    className={classnames(styles.select, styles.emailDomainSelect)}
                    value={formData.region || ''}
                    disabled={isDetailMode}
                    onChange={(e) => updateEditable('region', e.target.value)}
                  >
                    <option value="">지역 선택</option>
                    {partnerRegionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>성격</label>
                  <div className={styles.checkboxRow}>
                    {partnerTraitCodes.map((code) => (
                      <label key={code.code} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={(formData.partnerTraits || []).includes(code.code)}
                          onChange={(e) => handlePartnerTraitToggle(code.code, e.target.checked)}
                          disabled={isDetailMode}
                        />
                        <span>{code.codeName}</span>
                        <input
                          type="text"
                          className={styles.traitRatioInput}
                          value={formData.partnerTraitRatios?.[code.code] || ''}
                          onChange={(e) => handlePartnerTraitRatioChange(code.code, e.target.value)}
                          disabled={!(formData.partnerTraits || []).includes(code.code) || isDetailMode}
                          placeholder="%"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <label className={styles.label}>대리점 메모</label>
              <textarea
                className={styles.textarea}
                value={formData.partnerMemo}
                disabled={isDetailMode}
                onChange={(e) => updateEditable('partnerMemo', e.target.value)}
                rows={2}
                placeholder="대리점 메모 입력"
              />
            </div>
          </CardBody>
        </Card>

        <Card title="2) 대표자 인적사항 (명함 검색 연동)" className={styles.card}>
          <CardBody>
            <div className={styles.searchWrap}>
              <div className={styles.searchRow}>
                <input
                  className={styles.input}
                  value={cardKeyword}
                  onChange={(e) => {
                    setCardKeyword(e.target.value);
                    setCardSearchMessage('');
                    setIsCardDropdownOpen(true);
                  }}
                  onFocus={() => setIsCardDropdownOpen(true)}
                  onBlur={() => {
                    setTimeout(() => setIsCardDropdownOpen(false), 120);
                  }}
                  placeholder="명함 검색(이름/회사명)"
                />
                {(!isDetailMode || isEditMode) && (
                  <>
                    <Button variant="primary" onClick={handleLoadBusinessCardByKeyword}>
                      데이터 가져오기
                    </Button>
                    <Button variant="secondary" onClick={handleManualRepresentative}>
                      직접 입력
                    </Button>
                  </>
                )}
                {isDetailMode && !isEditMode && !hasBusinessCardLinked && (
                  <Button
                    variant="primary"
                    className={styles.allowAction}
                    onClick={() => navigate('/sales/card')}
                  >
                    명함 연동하기
                  </Button>
                )}
              </div>
              {isCardDropdownOpen && autoCardResults.length > 0 && (
                <ul className={styles.searchList}>
                  {autoCardResults.map((row) => (
                    <li key={row.id}>
                      <button
                        type="button"
                        className={styles.searchItem}
                        onClick={() => handleCardSelect(row.id)}
                      >
                        {row.name} / {row.company} / {row.department}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {isCardDropdownOpen && cardKeyword.trim() && autoCardResults.length === 0 && (
                <div className={styles.noResult}>검색 결과가 없습니다. 직접 입력을 사용해 주세요.</div>
              )}
            </div>
            <p className={styles.hint}>이름 또는 회사명을 입력하면 자동 검색됩니다. 선택 시 자동 반영됩니다.</p>
            {cardSearchMessage && <p className={styles.hint}>{cardSearchMessage}</p>}

            <div className={styles.representativeGrid} style={{ display: 'none' }}>
              <div className={classnames(styles.field, styles.representativeAddress, styles.representativeWide)}>
                <label className={styles.label}>성명</label>
                <input
                  className={styles.input}
                  value={formData.representative.name}
                  onChange={(e) => updateRepresentative('name', e.target.value)}
                  disabled={!isRepresentativeEditable}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>생년월일</label>
                <input
                  type="date"
                  className={styles.input}
                  value={formData.representative.birthDate}
                  onChange={(e) => updateRepresentative('birthDate', e.target.value)}
                  disabled={!isRepresentativeEditable}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>휴대전화</label>
                <input
                  className={styles.input}
                  value={formData.representative.mobile}
                  onChange={(e) => updateRepresentative('mobile', e.target.value)}
                  disabled={!isRepresentativeEditable}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>이메일</label>
                <div className={styles.emailRow}>
                  <input
                    className={classnames(styles.input, styles.emailDomainInput)}
                    value={emailLocal}
                    onChange={(e) => handleEmailLocalChange(e.target.value)}
                    disabled={!isRepresentativeEditable}
                    placeholder="email id"
                  />
                  <span className={styles.at}>@</span>
                  <input
                    className={styles.input}
                    value={emailDomainType === 'direct' ? emailDomainDirect : emailDomainType}
                    onChange={(e) => handleEmailDomainDirectChange(e.target.value)}
                    disabled={!isRepresentativeEditable || emailDomainType !== 'direct'}
                    placeholder="domain.com"
                  />
                  <select
                    className={classnames(styles.select, styles.emailDomainSelect)}
                    value={emailDomainType}
                    onChange={(e) => handleEmailDomainTypeChange(e.target.value)}
                    disabled={!isRepresentativeEditable}
                  >
                    <option value="">이메일 도메인</option>
                    {EMAIL_DOMAIN_OPTIONS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                    <option value="direct">직접입력</option>
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>주소</label>
                <input
                  className={styles.input}
                  value={formData.representative.address}
                  onChange={(e) => updateRepresentative('address', e.target.value)}
                  disabled={!isRepresentativeEditable}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>비고</label>
                <input
                  className={styles.input}
                  value={formData.representative.memo || ''}
                  onChange={(e) => updateRepresentative('memo', e.target.value)}
                  disabled={!isRepresentativeEditable}
                  placeholder="비고 입력"
                />
              </div>
            </div>
            <div className={styles.representativeGrid}>
              <div className={styles.field}>
                <label className={styles.label}>성명</label>
                <input
                  className={styles.input}
                  value={formData.representative.name}
                  onChange={(e) => updateRepresentative('name', e.target.value)}
                  disabled={!isRepresentativeEditable}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>생년월일</label>
                <input
                  type="date"
                  className={styles.input}
                  value={formData.representative.birthDate}
                  onChange={(e) => updateRepresentative('birthDate', e.target.value)}
                  disabled={!isRepresentativeEditable}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>휴대전화</label>
                <input
                  className={styles.input}
                  value={formData.representative.mobile}
                  onChange={(e) => updateRepresentative('mobile', e.target.value)}
                  disabled={!isRepresentativeEditable}
                />
              </div>
              <div className={classnames(styles.field, styles.representativeAddress, styles.representativeWide)}>
                <label className={styles.label}>주소</label>
                <div className={styles.addressRow}>
                  <input
                    className={styles.input}
                    value={formData.representative.address}
                    onChange={(e) => updateRepresentative('address', e.target.value)}
                    disabled={!isRepresentativeEditable}
                    placeholder="주소 입력"
                  />
                </div>
              </div>
              <div className={classnames(styles.field, styles.representativeEmail)}>
                <label className={styles.label}>이메일</label>
                <div className={styles.emailRow}>
                  <input
                    className={styles.input}
                    value={emailLocal}
                    onChange={(e) => handleEmailLocalChange(e.target.value)}
                    disabled={!isRepresentativeEditable}
                    placeholder="email id"
                  />
                  <span className={styles.at}>@</span>
                  <select
                    className={styles.select}
                    value={emailDomainType}
                    onChange={(e) => handleEmailDomainTypeChange(e.target.value)}
                    disabled={!isRepresentativeEditable}
                  >
                    <option value="">도메인 선택</option>
                    {EMAIL_DOMAIN_OPTIONS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                    <option value="direct">직접입력</option>
                  </select>
                  <input
                    className={classnames(styles.input, styles.emailDomainInput)}
                    value={emailDomainType === 'direct' ? emailDomainDirect : emailDomainType}
                    onChange={(e) => handleEmailDomainDirectChange(e.target.value)}
                    disabled={!isRepresentativeEditable || emailDomainType !== 'direct'}
                    placeholder="domain.com"
                  />
                </div>
              </div>
              <div className={classnames(styles.field, styles.representativeWide, styles.representativeMemo)}>
                <label className={styles.label}>비고</label>
                <input
                  className={styles.input}
                  value={formData.representative.memo || ''}
                  onChange={(e) => updateRepresentative('memo', e.target.value)}
                  disabled={!isRepresentativeEditable}
                  placeholder="비고 입력"
                />
              </div>
            </div>
            <div className={styles.editableBlock}>
              <div className={styles.staffHeader}>
                <label className={styles.label}>직원 정보</label>
                <Button variant="secondary" onClick={handleAddStaff}>
                  + 직원 추가
                </Button>
              </div>
              {(formData.staffMembers || []).map((member, index) => {
                const parsedStaffEmail = parseEmail(member.email || '');
                const staffEmailLocal = member.emailLocal ?? parsedStaffEmail.local;
                const staffEmailDomainType =
                  member.emailDomainType ??
                  (EMAIL_DOMAIN_OPTIONS.includes(parsedStaffEmail.domain)
                    ? parsedStaffEmail.domain
                    : parsedStaffEmail.domain
                      ? 'direct'
                      : '');
                const staffEmailDomainDirect =
                  member.emailDomainDirect ?? (staffEmailDomainType === 'direct' ? parsedStaffEmail.domain : '');
                return (
                <div key={member.id} className={styles.staffBlock}>
                  <div className={styles.staffTitleRow}>
                    <span className={styles.staffTitle}>직원 {index + 1}</span>
                    <button type="button" className={styles.deleteBtn} onClick={() => handleRemoveStaff(member.id)}>
                      삭제
                    </button>
                  </div>
                  <div className={styles.staffGrid}>
                    <div className={styles.field}>
                      <label className={styles.label}>이름</label>
                      <input
                        className={styles.input}
                        value={member.name || ''}
                        onChange={(e) => updateStaff(member.id, 'name', e.target.value)}
                        placeholder="직원 이름"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>연락처</label>
                      <input
                        className={styles.input}
                        value={member.mobile || ''}
                        onChange={(e) => updateStaff(member.id, 'mobile', e.target.value)}
                        placeholder="010-0000-0000"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>이메일</label>
                      <div className={styles.staffEmailRow}>
                        <input
                          className={styles.input}
                          value={staffEmailLocal}
                          onChange={(e) =>
                            setStaffEmailParts(member.id, e.target.value, staffEmailDomainType, staffEmailDomainDirect)
                          }
                          placeholder="email id"
                        />
                        <span className={styles.at}>@</span>
                        <input
                          className={styles.input}
                          value={staffEmailDomainType === 'direct' ? staffEmailDomainDirect : staffEmailDomainType}
                          onChange={(e) =>
                            setStaffEmailParts(member.id, staffEmailLocal, staffEmailDomainType, e.target.value)
                          }
                          disabled={staffEmailDomainType !== 'direct'}
                          placeholder="domain.com"
                        />
                        <select
                          className={styles.select}
                          value={staffEmailDomainType}
                          onChange={(e) => {
                            const nextType = e.target.value;
                            if (!nextType) {
                              setStaffEmailParts(member.id, staffEmailLocal, '', '');
                              return;
                            }
                            if (nextType === 'direct') {
                              setStaffEmailParts(member.id, staffEmailLocal, 'direct', staffEmailDomainDirect);
                              return;
                            }
                            setStaffEmailParts(member.id, staffEmailLocal, nextType, nextType);
                          }}
                        >
                          <option value="">도메인 선택</option>
                          {EMAIL_DOMAIN_OPTIONS.map((domain) => (
                            <option key={domain} value={domain}>
                              {domain}
                            </option>
                          ))}
                          <option value="direct">직접입력</option>
                        </select>
                      </div>
                    </div>
                    <div className={`${styles.field} ${styles.staffMemoField}`}>
                      <label className={styles.label}>메모</label>
                      <input
                        className={styles.input}
                        value={member.memo || ''}
                        onChange={(e) => updateStaff(member.id, 'memo', e.target.value)}
                        placeholder="직원 메모"
                      />
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card title="3) 최근 5년간 매출 실적(연도별)" className={styles.card}>
          <CardBody>
            <div className={styles.erpBlock}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>연도</th>
                      <th className={styles.right}>매출액(원)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesByYearRows.length === 0 ? (
                      <tr>
                        <td colSpan={2} className={styles.right}>대리점을 먼저 선택해 주세요.</td>
                      </tr>
                    ) : (
                      salesByYearRows.map((row) => {
                        const amount = Number(row.amount || 0);
                        const ratio = maxSalesAmount > 0 ? (amount / maxSalesAmount) * 100 : 0;
                        return (
                          <tr key={row.year}>
                            <td>{row.year}</td>
                            <td className={styles.right}>
                              <div className={styles.inlineBarCell}>
                                <div className={styles.inlineBarTrack}>
                                  <div className={styles.inlineBarFill} style={{ width: `${Math.max(4, ratio)}%` }} />
                                </div>
                                <span>{amount.toLocaleString()}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card title="4) 대리점 담당 영업직원 (최근 4개년)" className={styles.card}>
          <CardBody>
            <div className={styles.erpBlock}>
              {!selectedPartnerDetail ? (
                <p className={styles.hint}>1번 카드에서 대리점을 선택하면 최근 4개년 담당자 이력이 표시됩니다.</p>
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

        <Card title="5) 경쟁사 취급 브랜드 (단위: 천원)" className={classnames(styles.card, styles.competitorCard)}>
          <CardBody>
            <div className={classnames(styles.editableBlock, !isEditableMode && styles.readonlyBlock)}>
              <div className={styles.tableWrap}>
                <table className={classnames(styles.table, styles.competitorTable)}>
                <thead>
                  <tr>
                    <th>경쟁사</th>
                    {competitorNames.map((name) => (
                      <th key={name}>{name}</th>
                    ))}
                    <th>비고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.competitorRowHeader}>취급여부</td>
                    {competitorNames.map((name) => {
                      const comp = formData.competitorBrands[name] || { isHandling: false, scale: '' };
                      return (
                        <td key={`${name}-yn`}>
                          {isEditableMode ? (
                            <select
                              className={classnames(styles.select, styles.competitorSelect)}
                              value={comp.isHandling ? 'Y' : 'N'}
                              onChange={(e) => handleCompetitorChange(name, 'isHandling', e.target.value === 'Y')}
                            >
                              <option value="N">X</option>
                              <option value="Y">O</option>
                            </select>
                          ) : (
                            <span className={classnames(styles.readonlyBadge, comp.isHandling ? styles.readonlyYes : styles.readonlyNo)}>
                              {comp.isHandling ? 'O' : 'X'}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td />
                  </tr>
                  <tr>
                    <td className={styles.competitorRowHeader}>취급규모</td>
                    {competitorNames.map((name) => {
                      const comp = formData.competitorBrands[name] || { isHandling: false, scale: '' };
                      return (
                        <td key={`${name}-scale`}>
                          <input
                            className={classnames(
                              styles.input,
                              styles.competitorInput,
                              !comp.isHandling && styles.competitorInputDisabled
                            )}
                            value={comp.scale}
                            onChange={(e) => handleCompetitorChange(name, 'scale', e.target.value)}
                            disabled={!isEditableMode || !comp.isHandling}
                            placeholder={comp.isHandling ? '천원' : 'O 선택 시 입력'}
                          />
                        </td>
                      );
                    })}
                    <td />
                  </tr>
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
              <div className={styles.financeControls} hidden>
                <input
                  className={classnames(styles.input, styles.financeSearchInput)}
                  value={financePartnerQuery}
                  onChange={(e) => {
                    setFinancePartnerQuery(e.target.value);
                    setFinanceSearchMessage('');
                  }}
                  placeholder="대리점명 검색"
                />
                <Button variant="primary" onClick={handleLoadFinanceMock}>
                데이터 가져오기
              </Button>
              </div>
            </div>
            {financeSearchMessage ? <p className={styles.financeStatus}>{financeSearchMessage}</p> : null}

            {!financeLoaded ? (
              <div className={styles.financeEmpty}>대리점명을 검색한 뒤 데이터 가져오기를 눌러주세요.</div>
            ) : (
              <div className={styles.financePanel}>
                <div className={styles.financeTabRow}>
                  <button
                    type="button"
                    className={classnames(
                      styles.financeTab,
                      financeTab === 'receivable' && styles.financeTabActive,
                      isDetailMode && styles.allowAction
                    )}
                    onClick={() => setFinanceTab('receivable')}
                  >
                    채권 및 채신 현황
                  </button>
                  <button
                    type="button"
                    className={classnames(
                      styles.financeTab,
                      financeTab === 'collection' && styles.financeTabActive,
                      isDetailMode && styles.allowAction
                    )}
                    onClick={() => setFinanceTab('collection')}
                  >
                    수금 현황
                  </button>
                  <button
                    type="button"
                    className={classnames(
                      styles.financeTab,
                      financeTab === 'note' && styles.financeTabActive,
                      isDetailMode && styles.allowAction
                    )}
                    onClick={() => setFinanceTab('note')}
                  >
                    어음 현황
                  </button>
                  <button
                    type="button"
                    className={classnames(
                      styles.financeTab,
                      financeTab === 'outstanding' && styles.financeTabActive,
                      isDetailMode && styles.allowAction
                    )}
                    onClick={() => setFinanceTab('outstanding')}
                  >
                    미수금 현황
                  </button>
                </div>
                <div className={styles.financeSummary}>
                  <div className={styles.financeChip}>
                    <span>채권</span>
                    <strong>{financePreview.receivableRows.length}건</strong>
                  </div>
                  <div className={styles.financeChip}>
                    <span>어음</span>
                    <strong>{financePreview.billRows.length}건</strong>
                  </div>
                  <div className={styles.financeChip}>
                    <span>담보</span>
                    <strong>{financePreview.collateralRows.length}건</strong>
                  </div>
                </div>

                <div className={styles.financeTables}>
                  {financeTab === 'receivable' && (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>기준월</th>
                          <th className={styles.right}>거래한도</th>
                          <th className={styles.right}>당월매출</th>
                          <th className={styles.right}>당월수금</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financePreview.receivableRows.map((row, index) => (
                          <tr key={`recv-${index}`}>
                            <td>{row.baseYm}</td>
                            <td className={styles.right}>{Number(row.tradeLimit).toLocaleString()}</td>
                            <td className={styles.right}>{Number(row.salesThisMonth).toLocaleString()}</td>
                            <td className={styles.right}>{Number(row.depositThisMonth).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}

                  {financeTab === 'collection' && (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>어음번호</th>
                          <th>만기일</th>
                          <th className={styles.right}>금액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financePreview.billRows.map((row) => (
                          <tr key={row.id}>
                            <td>{row.billNo}</td>
                            <td>{row.dueDate}</td>
                            <td className={styles.right}>{Number(row.amount).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}

                  {financeTab === 'note' && (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>담보명</th>
                          <th>상태</th>
                          <th className={styles.right}>설정액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financePreview.collateralRows.map((row) => (
                          <tr key={row.id}>
                            <td>{row.collateralName}</td>
                            <td>{row.status}</td>
                            <td className={styles.right}>{Number(row.companySetAmount).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}
                  {financeTab === 'outstanding' && (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>거래처</th>
                          <th>거래처명</th>
                          <th>매출번호</th>
                          <th className={styles.right}>매출금액</th>
                          <th className={styles.right}>수금액</th>
                          <th className={styles.right}>미수금액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {outstandingTabRows.map((row, index) => (
                          <tr key={`outstanding-${index}`}>
                            <td>{row[0]}</td>
                            <td>{row[1]}</td>
                            <td>{row[2]}</td>
                            <td className={styles.right}>{Number(row[3]).toLocaleString()}</td>
                            <td className={styles.right}>{Number(row[4]).toLocaleString()}</td>
                            <td className={styles.right}>{Number(row[5]).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card title="7) 반경 3Km 내 당사/경쟁사 현황" className={styles.card}>
          <CardBody>
            <div className={styles.editableBlock}>
              <div className={styles.mapControlBar}>
                <div className={styles.mapControlGrid}>
                  <label className={styles.inlineField}>
                    <span>중심 위도</span>
                    <input
                      type="number"
                      step="0.0001"
                      className={styles.inlineInput}
                      value={formData.mapCenter?.lat ?? ''}
                      onChange={(e) => handleMapCenterChange('lat', e.target.value)}
                    />
                  </label>
                  <label className={styles.inlineField}>
                    <span>중심 경도</span>
                    <input
                      type="number"
                      step="0.0001"
                      className={styles.inlineInput}
                      value={formData.mapCenter?.lng ?? ''}
                      onChange={(e) => handleMapCenterChange('lng', e.target.value)}
                    />
                  </label>
                  <label className={styles.inlineField}>
                    <span>반경(Km)</span>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      className={styles.inlineInput}
                      value={formData.mapCenter?.radiusKm ?? 3}
                      onChange={(e) => handleMapCenterChange('radiusKm', e.target.value)}
                    />
                  </label>
                </div>
                <Button variant="secondary" onClick={handleAddPoint}>
                  점 추가
                </Button>
              </div>

              <div className={styles.mapSection}>
                <div className={styles.mapCanvas} role="img" aria-label="반경 지도 미리보기">
                  <div className={styles.mapRadius} />
                  <div className={classnames(styles.mapMarker, styles.mapCenterMarker)} style={{ left: '50%', top: '50%' }}>
                    <span className={styles.mapPinLabel}>대리점</span>
                  </div>
                  {mapPins.map((pin) => (
                    <div
                      key={pin.id}
                      className={classnames(styles.mapMarker, pin.type === 'our' ? styles.mapMarkerOur : styles.mapMarkerCompetitor)}
                      style={{
                        left: `${Math.min(92, Math.max(8, 50 + ((Number(pin.lng) - Number(formData.mapCenter?.lng || 126.978)) * 260) / (Number(formData.mapCenter?.radiusKm || 3) * 2)))}%`,
                        top: `${Math.min(92, Math.max(8, 50 - ((Number(pin.lat) - Number(formData.mapCenter?.lat || 37.5665)) * 260) / (Number(formData.mapCenter?.radiusKm || 3) * 2)))}%`,
                      }}
                    >
                      <span className={styles.mapPinLabel}>{pin.name || '-'}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.mapMeta}>
                  <div className={styles.mapMetaRow}>
                    <span className={styles.mapMetaLabel}>중심 좌표</span>
                    <strong>{Number(formData.mapCenter?.lat || 37.5665).toFixed(4)}, {Number(formData.mapCenter?.lng || 126.978).toFixed(4)}</strong>
                  </div>
                  <div className={styles.mapMetaRow}>
                    <span className={styles.mapMetaLabel}>반경</span>
                    <strong>{Number(formData.mapCenter?.radiusKm || 3)}Km</strong>
                  </div>
                  <div className={styles.mapLegend}>
                    <span><i className={classnames(styles.legendDot, styles.legendCenter)} />대리점</span>
                    <span><i className={classnames(styles.legendDot, styles.legendOur)} />당사</span>
                    <span><i className={classnames(styles.legendDot, styles.legendCompetitor)} />경쟁사</span>
                  </div>
                </div>
              </div>

              <div className={styles.placeTableWrap}>
                <table className={styles.placeTable}>
                  <thead>
                    <tr>
                      <th>구분</th>
                      <th>지점명</th>
                      <th>위도</th>
                      <th>경도</th>
                      <th>메모</th>
                      <th>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.nearbyPoints.length === 0 ? (
                      <tr>
                        <td colSpan={6} className={styles.emptyCell}>점을 추가해 주세요.</td>
                      </tr>
                    ) : (
                      formData.nearbyPoints.map((point) => (
                        <tr key={point.id}>
                          <td>
                            <select
                              className={styles.select}
                              value={point.type}
                              onChange={(e) => handlePointChange(point.id, 'type', e.target.value)}
                            >
                              <option value="our">당사</option>
                              <option value="competitor">경쟁사</option>
                            </select>
                          </td>
                          <td>
                            <input
                              className={styles.input}
                              value={point.name || ''}
                              onChange={(e) => handlePointChange(point.id, 'name', e.target.value)}
                              placeholder="지점명"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.0001"
                              className={styles.input}
                              value={point.lat ?? ''}
                              onChange={(e) => handlePointChange(point.id, 'lat', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.0001"
                              className={styles.input}
                              value={point.lng ?? ''}
                              onChange={(e) => handlePointChange(point.id, 'lng', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className={styles.input}
                              value={point.note || ''}
                              onChange={(e) => handlePointChange(point.id, 'note', e.target.value)}
                              placeholder="메모"
                            />
                          </td>
                          <td>
                            <button type="button" className={styles.deleteBtn} onClick={() => handleRemovePoint(point.id)}>
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={styles.mapSection}>
              <div className={styles.mapCanvas} role="img" aria-label="반경 지도 목업">
                <div className={styles.mapRadius} />
                <div className={classnames(styles.mapMarker, styles.mapCenterMarker)} style={{ left: '50%', top: '50%' }}>
                  <span className={styles.mapPinLabel}>대리점</span>
                </div>
                {mapPins.map((pin) => (
                  <div
                    key={pin.id}
                    className={classnames(styles.mapMarker, pin.type === 'our' ? styles.mapMarkerOur : styles.mapMarkerCompetitor)}
                    style={{
                      left: `${Math.min(92, Math.max(8, 50 + ((Number(pin.lng) - Number(formData.mapCenter?.lng || 126.978)) * 260) / (Number(formData.mapCenter?.radiusKm || 3) * 2)))}%`,
                      top: `${Math.min(92, Math.max(8, 50 - ((Number(pin.lat) - Number(formData.mapCenter?.lat || 37.5665)) * 260) / (Number(formData.mapCenter?.radiusKm || 3) * 2)))}%`,
                    }}
                  >
                    <span className={styles.mapPinLabel}>{pin.name || '-'}</span>
                  </div>
                ))}
              </div>
              <div className={styles.mapMeta}>
                <div className={styles.mapMetaRow}>
                  <span className={styles.mapMetaLabel}>중심 좌표</span>
                  <strong>{Number(formData.mapCenter?.lat || 37.5665).toFixed(4)}, {Number(formData.mapCenter?.lng || 126.978).toFixed(4)}</strong>
                </div>
                <div className={styles.mapMetaRow}>
                  <span className={styles.mapMetaLabel}>반경</span>
                  <strong>{Number(formData.mapCenter?.radiusKm || 3)}Km</strong>
                </div>
                <div className={styles.mapLegend}>
                  <span><i className={classnames(styles.legendDot, styles.legendCenter)} />대리점</span>
                  <span><i className={classnames(styles.legendDot, styles.legendOur)} />당사</span>
                  <span><i className={classnames(styles.legendDot, styles.legendCompetitor)} />경쟁사</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card title="8) 거래처 이력 및 특이사항" className={styles.card}>
          <CardBody>
            <div className={styles.editableBlock}>
              <textarea
                className={styles.textarea}
                value={formData.historyNotes}
                onChange={(e) => updateEditable('historyNotes', e.target.value)}
                rows={4}
                placeholder="거래처 이력 및 특이사항 입력"
              />
            </div>
          </CardBody>
        </Card>

        <div className={styles.footer}>
          {isDetailMode && !isEditMode && (
            <Button
              variant="primary"
              className={classnames(styles.allowAction, styles.editModeButton)}
              onClick={() => {
                setIsEditMode(true);
                setIsRepresentativeEditable(true);
              }}
            >
              紐낇븿 ?곕룞?섍린
            </Button>
          )}
          <Button
            variant="secondary"
            className={isDetailMode ? styles.allowAction : undefined}
            onClick={() => navigate('/master/partners')}
          >
            목록
          </Button>
          {(!isDetailMode || isEditMode) && (
          <Button variant="secondary" onClick={handleReset}>
            초기화
          </Button>
          )}
          {(!isDetailMode || isEditMode) && (
          <Button
            variant="primary"
            className={isDetailMode ? styles.saveEditButton : undefined}
            onClick={handleSubmit}
          >
            등록
          </Button>
          )}
        </div>

        {saved && <p className={styles.toast}>등록 데이터를 저장했습니다.</p>}
      </div>
    </PageShell>
  );
}
