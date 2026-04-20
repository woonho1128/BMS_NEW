import { lazy, Suspense, useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Modal } from '../../../shared/components/Modal/Modal';
import { getPartnerById, getPartnersList } from '../data/partnersMock';
import { getCodesList } from '../../admin/data/adminMock';
import { getBusinessCardsList } from '../../sales/data/businessCardMock';
import { RECEIVABLES_MOCK } from '../../finance/data/receivablesMock';
import { BILLS_MOCK } from '../../finance/data/billsMock';
import { COLLATERAL_MOCK } from '../../finance/data/collateralMock';
import { classnames } from '../../../shared/utils/classnames';
import styles from './PartnerRegisterPage.module.css';
import { notify } from '../../../shared/utils/notify';

const EditHistoryModalContent = lazy(() => import('./components/EditHistoryModalContent'));
const PartnerMapCard = lazy(() => import('./components/PartnerMapCard'));

function createEmptyCompetitorBrand(name = '') {
  return {
    id: `competitor-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    isHandling: false,
    scale: '',
  };
}

function normalizeCompetitorBrands(source) {
  if (Array.isArray(source)) {
    return source.map((row, index) => ({
      id: row?.id || `competitor-loaded-${index}-${Math.random().toString(36).slice(2, 6)}`,
      name: String(row?.name || row?.brandName || ''),
      isHandling: Boolean(row?.isHandling),
      scale: row?.scale != null ? String(row.scale) : '',
    }));
  }
  if (source && typeof source === 'object') {
    return Object.entries(source).map(([name, row], index) => ({
      id: `competitor-loaded-${index}-${Math.random().toString(36).slice(2, 6)}`,
      name: String(name || ''),
      isHandling: Boolean(row?.isHandling),
      scale: row?.scale != null ? String(row.scale) : '',
    }));
  }
  return [];
}

const EMAIL_DOMAIN_OPTIONS = ['naver.com', 'gmail.com', 'daum.net', 'nate.com', 'hanmail.net'];
const ADDRESS_SELECTION_OPTIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
const SALES_CATEGORY_COLORS = ['#2563eb', '#0ea5e9', '#f59e0b', '#16a34a', '#ef4444', '#8b5cf6'];
function formatHistoryTimestamp(date = new Date()) {
  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function createHistorySnapshot(formData) {
  const competitorSummary = (formData.competitorBrands || [])
    .map((row) => `${row.name || '-'}:${row.isHandling ? 'Y' : 'N'}:${row.scale || '-'}`)
    .join('|');
  const staffSummary = (formData.staffMembers || [])
    .map((row) => `${row.name || '-'}:${row.mobile || '-'}:${row.email || '-'}`)
    .join('|');

  return {
    partnerName: formData.basic?.companyName || '',
    ceoName: formData.basic?.ceoName || '',
    basicAddress: formData.basic?.address || '',
    basicPhone: formData.basic?.phone || '',
    representativeName: formData.representative?.name || '',
    representativeMobile: formData.representative?.mobile || '',
    representativeEmail: formData.representative?.email || '',
    representativeAddress: formData.representative?.address || '',
    region: formData.region || '',
    partnerMemo: formData.partnerMemo || '',
    partnerTraits: (formData.partnerTraits || []).join(','),
    competitorSummary,
    staffSummary,
    nearbyCount: String((formData.nearbyPoints || []).length),
    historyNotes: formData.historyNotes || '',
  };
}

function buildHistoryChanges(beforeSnapshot, afterSnapshot) {
  const fields = [
    { key: 'partnerName', label: '대리점명' },
    { key: 'ceoName', label: '대표자' },
    { key: 'basicAddress', label: '기본 주소' },
    { key: 'basicPhone', label: '기본 전화번호' },
    { key: 'representativeName', label: '대표자 성명' },
    { key: 'representativeMobile', label: '대표자 휴대전화' },
    { key: 'representativeEmail', label: '대표자 이메일' },
    { key: 'representativeAddress', label: '대표자 주소' },
    { key: 'region', label: '지역' },
    { key: 'partnerMemo', label: '대리점 메모' },
    { key: 'partnerTraits', label: '성격 코드' },
    { key: 'competitorSummary', label: '경쟁사 취급 브랜드' },
    { key: 'staffSummary', label: '담당 영업직원' },
    { key: 'nearbyCount', label: '반경 내 지점 수' },
    { key: 'historyNotes', label: '거래처 이력/특이사항' },
  ];

  return fields
    .map(({ key, label }) => ({
      field: label,
      before: String(beforeSnapshot?.[key] || '-'),
      after: String(afterSnapshot?.[key] || '-'),
    }))
    .filter((row) => row.before !== row.after);
}

function buildInitialPartnerHistory(partnerDetail) {
  const partnerName = partnerDetail?.name || partnerDetail?.basic?.companyName || '대리점';
  return [
    {
      id: `${partnerDetail?.id || 'new'}-history-initial`,
      changedAt: '2026-01-10 09:30',
      changedBy: '시스템',
      reason: '최초 등록',
      changes: [
        { field: '대리점명', before: '-', after: partnerName },
        { field: '등록 상태', before: '-', after: '등록 완료' },
      ],
    },
  ];
}

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
  const businessCards = useMemo(() => getBusinessCardsList({}), []);

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
    competitorBrands: [createEmptyCompetitorBrand()],
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
  const [, setRepresentativeAddressType] = useState('');
  const [, setRepresentativeAddressDirect] = useState('');
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
  const [salesChartMode, setSalesChartMode] = useState('single');
  const [selectedSalesCategory, setSelectedSalesCategory] = useState('total');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [editHistoryRows, setEditHistoryRows] = useState([]);
  const [editStartSnapshot, setEditStartSnapshot] = useState(null);

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

  const handleCompetitorChange = useCallback((id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      competitorBrands: (prev.competitorBrands || []).map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      ),
    }));
  }, []);

  const handleAddCompetitorBrand = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      competitorBrands: [...(prev.competitorBrands || []), createEmptyCompetitorBrand()],
    }));
  }, []);

  const handleRemoveCompetitorBrand = useCallback((id) => {
    setFormData((prev) => {
      const next = (prev.competitorBrands || []).filter((row) => row.id !== id);
      return {
        ...prev,
        competitorBrands: next.length > 0 ? next : [createEmptyCompetitorBrand()],
      };
    });
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
        competitorBrands: (() => {
          const normalized = normalizeCompetitorBrands(partnerDetail.competitorBrands);
          return normalized.length > 0 ? normalized : prev.competitorBrands;
        })(),
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
      competitorBrands: [createEmptyCompetitorBrand()],
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
    setEditStartSnapshot(null);
    setFinanceSearchMessage('');
    setFinanceLoaded(false);
    setFinancePreview({
      receivableRows: [],
      billRows: [],
      collateralRows: [],
    });
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
    notify.info('대리점 카드 저장 데이터가 준비되었습니다. (목업)');
    if (isDetailMode) {
      const afterSnapshot = createHistorySnapshot(formData);
      const beforeSnapshot = editStartSnapshot || afterSnapshot;
      const changes = buildHistoryChanges(beforeSnapshot, afterSnapshot);
      if (changes.length > 0) {
        setEditHistoryRows((prev) => [
          {
            id: `history-${Date.now()}`,
            changedAt: formatHistoryTimestamp(),
            changedBy: '현재 사용자',
            reason: '상세 화면 수정 저장',
            changes,
          },
          ...prev,
        ]);
      }
      setEditStartSnapshot(null);
      setIsEditMode(false);
      setIsRepresentativeEditable(false);
      return;
    }
    setTimeout(() => navigate('/master/partners'), 500);
  }, [editStartSnapshot, formData, isDetailMode, navigate]);

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
  const salesCategoryOptions = useMemo(() => {
    const options = [{ key: 'total', label: '총 매출' }];
    const keys = new Set();
    salesByYearRows.forEach((row) => {
      Object.keys(row.categories || {}).forEach((key) => {
        if (!key || keys.has(key)) return;
        keys.add(key);
        options.push({ key, label: key });
      });
    });
    return options;
  }, [salesByYearRows]);
  const visibleSalesSeries = useMemo(() => {
    const categoryMap = salesCategoryOptions.reduce((acc, category, index) => {
      acc[category.key] = {
        ...category,
        color: SALES_CATEGORY_COLORS[index % SALES_CATEGORY_COLORS.length],
      };
      return acc;
    }, {});
    if (salesChartMode === 'compare') {
      return salesCategoryOptions.map((category) => categoryMap[category.key]);
    }
    return categoryMap[selectedSalesCategory] ? [categoryMap[selectedSalesCategory]] : [categoryMap.total];
  }, [salesCategoryOptions, salesChartMode, selectedSalesCategory]);
  const salesChartData = useMemo(
    () =>
      salesByYearRows.map((row) => {
        const categories = row.categories || {};
        return {
          year: Number(row.year),
          total: Number(row.amount || 0),
          ...Object.keys(categories).reduce((acc, key) => {
            acc[key] = Number(categories[key] || 0);
            return acc;
          }, {}),
        };
      }),
    [salesByYearRows]
  );
  const salesChartModel = useMemo(() => {
    const chartWidth = 760;
    const chartHeight = 280;
    const padding = { top: 24, right: 24, bottom: 40, left: 74 };
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;
    const maxValue = salesChartData.reduce((max, row) => {
      return Math.max(max, ...visibleSalesSeries.map((series) => Number(row[series.key] || 0)));
    }, 0);
    const roundedMax = maxValue > 0 ? Math.ceil(maxValue / 100000000) * 100000000 : 100000000;
    const yTicks = Array.from({ length: 5 }, (_, index) => {
      const ratio = index / 4;
      return {
        value: Math.round(roundedMax * (1 - ratio)),
        y: padding.top + plotHeight * ratio,
      };
    });
    const series = visibleSalesSeries.map((item) => {
      const points = salesChartData.map((row, index) => {
        const x =
          salesChartData.length === 1
            ? padding.left + plotWidth / 2
            : padding.left + (plotWidth * index) / (salesChartData.length - 1);
        const value = Number(row[item.key] || 0);
        const y = padding.top + (plotHeight * (roundedMax - value)) / roundedMax;
        return { x, y, value, year: row.year };
      });
      return {
        ...item,
        points,
        polyline: points.map((point) => `${point.x},${point.y}`).join(' '),
      };
    });
    return { chartWidth, chartHeight, yTicks, series };
  }, [salesChartData, visibleSalesSeries]);
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
  const financeCumulative = useMemo(() => {
    const receivableTradeLimit = (financePreview.receivableRows || []).reduce(
      (sum, row) => sum + Number(row.tradeLimit || 0),
      0
    );
    const receivableSales = (financePreview.receivableRows || []).reduce(
      (sum, row) => sum + Number(row.salesThisMonth || 0),
      0
    );
    const receivableDeposit = (financePreview.receivableRows || []).reduce(
      (sum, row) => sum + Number(row.depositThisMonth || 0),
      0
    );
    const billAmount = (financePreview.billRows || []).reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    );
    const collateralAmount = (financePreview.collateralRows || []).reduce(
      (sum, row) => sum + Number(row.companySetAmount || 0),
      0
    );
    const outstandingAmount = outstandingTabRows.reduce(
      (sum, row) => sum + Number(row[5] || 0),
      0
    );
    return {
      receivableTradeLimit,
      receivableSales,
      receivableDeposit,
      billAmount,
      collateralAmount,
      outstandingAmount,
    };
  }, [financePreview.receivableRows, financePreview.billRows, financePreview.collateralRows, outstandingTabRows]);
  const hasBusinessCardLinked = isBusinessCardLinked;
  const isEditableMode = !isDetailMode || isEditMode;
  const handleOpenHistory = useCallback(() => {
    setHistoryModalOpen(true);
  }, []);
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
    setEditHistoryRows(buildInitialPartnerHistory(partnerDetail));

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
      competitorBrands: (() => {
        const normalized = normalizeCompetitorBrands(partnerDetail.competitorBrands);
        return normalized.length > 0 ? normalized : prev.competitorBrands;
      })(),
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
              {salesByYearRows.length === 0 ? (
                <p className={styles.hint}>대리점을 먼저 선택하면 최근 5개년 매출 그래프를 볼 수 있습니다.</p>
              ) : (
                <>
                  <div className={styles.salesChartToolbar}>
                    <div className={styles.salesModeButtons}>
                      <button
                        type="button"
                        className={classnames(
                          styles.salesModeButton,
                          salesChartMode === 'single' && styles.salesModeButtonActive,
                          isDetailMode && !isEditMode && styles.allowAction
                        )}
                        onClick={() => setSalesChartMode('single')}
                      >
                        단일 카테고리
                      </button>
                      <button
                        type="button"
                        className={classnames(
                          styles.salesModeButton,
                          salesChartMode === 'compare' && styles.salesModeButtonActive,
                          isDetailMode && !isEditMode && styles.allowAction
                        )}
                        onClick={() => setSalesChartMode('compare')}
                      >
                        카테고리 비교
                      </button>
                    </div>
                    <div className={styles.salesCategorySelector}>
                      <label htmlFor="salesCategorySelect">그래프 항목</label>
                      <select
                        id="salesCategorySelect"
                        className={classnames(
                          styles.select,
                          styles.salesCategorySelect,
                          isDetailMode && !isEditMode && styles.allowAction
                        )}
                        value={selectedSalesCategory}
                        onChange={(e) => setSelectedSalesCategory(e.target.value)}
                        disabled={salesChartMode === 'compare'}
                      >
                        {salesCategoryOptions.map((category) => (
                          <option key={category.key} value={category.key}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={styles.salesChartCard}>
                    <svg
                      className={styles.salesChartSvg}
                      viewBox={`0 0 ${salesChartModel.chartWidth} ${salesChartModel.chartHeight}`}
                      role="img"
                      aria-label="최근 5년 매출 실적 그래프"
                    >
                      {salesChartModel.yTicks.map((tick) => (
                        <g key={`tick-${tick.value}`}>
                          <line x1={74} y1={tick.y} x2={736} y2={tick.y} stroke="#dbe6f5" strokeDasharray="4 4" />
                          <text x={68} y={tick.y + 4} textAnchor="end" className={styles.salesChartTickLabel}>
                            {tick.value.toLocaleString()}
                          </text>
                        </g>
                      ))}
                      {salesChartModel.series.map((series) => (
                        <g key={series.key}>
                          <polyline
                            fill="none"
                            stroke={series.color}
                            strokeWidth="3"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            points={series.polyline}
                          />
                          {series.points.map((point) => (
                            <circle
                              key={`${series.key}-${point.year}`}
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill="#fff"
                              stroke={series.color}
                              strokeWidth="2"
                            />
                          ))}
                        </g>
                      ))}
                      {salesChartModel.series[0]?.points.map((point) => (
                        <text key={`year-${point.year}`} x={point.x} y={252} textAnchor="middle" className={styles.salesChartYearLabel}>
                          {point.year}
                        </text>
                      ))}
                    </svg>
                    <div className={styles.salesChartLegend}>
                      {visibleSalesSeries.map((series) => (
                        <span key={`legend-${series.key}`} className={styles.salesChartLegendItem}>
                          <span className={styles.salesChartLegendColor} style={{ backgroundColor: series.color }} />
                          {series.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>연도</th>
                          {visibleSalesSeries.map((series) => (
                            <th key={`head-${series.key}`} className={styles.right}>{series.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {salesChartData.map((row) => (
                          <tr key={row.year}>
                            <td>{row.year}</td>
                            {visibleSalesSeries.map((series) => (
                              <td key={`${row.year}-${series.key}`} className={styles.right}>
                                {Number(row[series.key] || 0).toLocaleString()}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
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
            <div className={classnames(styles.competitorPanel, !isEditableMode && styles.readonlyBlock)}>
              <div className={styles.competitorHeader}>
                <span className={styles.hint}>대리점별로 경쟁사 항목을 직접 추가해 관리합니다.</span>
                {isEditableMode && (
                  <Button variant="secondary" onClick={handleAddCompetitorBrand}>
                    + 경쟁사 추가
                  </Button>
                )}
              </div>
              <div className={classnames(styles.tableWrap, styles.competitorTableWrap)}>
                <table className={classnames(styles.table, styles.competitorTable)}>
                <thead>
                  <tr>
                    <th>경쟁사명</th>
                    <th>취급여부</th>
                    <th>취급규모(천원)</th>
                    <th>비고</th>
                  </tr>
                </thead>
                <tbody>
                  {(formData.competitorBrands || []).map((row) => (
                    <tr key={row.id}>
                      <td>
                        <input
                          className={styles.input}
                          value={row.name || ''}
                          onChange={(e) => handleCompetitorChange(row.id, 'name', e.target.value)}
                          disabled={!isEditableMode}
                          placeholder="경쟁사명 입력"
                        />
                      </td>
                      <td>
                        {isEditableMode ? (
                          <select
                            className={classnames(styles.select, styles.competitorToggle)}
                            value={row.isHandling ? 'Y' : 'N'}
                            onChange={(e) => handleCompetitorChange(row.id, 'isHandling', e.target.value === 'Y')}
                          >
                            <option value="N">X</option>
                            <option value="Y">O</option>
                          </select>
                        ) : (
                          <span className={classnames(styles.readonlyBadge, row.isHandling ? styles.readonlyYes : styles.readonlyNo)}>
                            {row.isHandling ? 'O' : 'X'}
                          </span>
                        )}
                      </td>
                      <td>
                        <input
                          className={classnames(
                            styles.input,
                            styles.competitorInput,
                            !row.isHandling && styles.competitorInputDisabled
                          )}
                          value={row.scale || ''}
                          onChange={(e) => handleCompetitorChange(row.id, 'scale', e.target.value)}
                          disabled={!isEditableMode || !row.isHandling}
                          placeholder={row.isHandling ? '천원' : 'O 선택 시 입력'}
                        />
                      </td>
                      <td>
                        {isEditableMode ? (
                          <button type="button" className={styles.deleteBtn} onClick={() => handleRemoveCompetitorBrand(row.id)}>
                            삭제
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
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
                  <div className={styles.financeChip}>
                    <span>누계매출</span>
                    <strong>{financeCumulative.receivableSales.toLocaleString()}</strong>
                  </div>
                  <div className={styles.financeChip}>
                    <span>누계수금</span>
                    <strong>{financeCumulative.receivableDeposit.toLocaleString()}</strong>
                  </div>
                  <div className={styles.financeChip}>
                    <span>누계미수</span>
                    <strong>{financeCumulative.outstandingAmount.toLocaleString()}</strong>
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
                      <tfoot>
                        <tr>
                          <th>누계</th>
                          <th className={styles.right}>{financeCumulative.receivableTradeLimit.toLocaleString()}</th>
                          <th className={styles.right}>{financeCumulative.receivableSales.toLocaleString()}</th>
                          <th className={styles.right}>{financeCumulative.receivableDeposit.toLocaleString()}</th>
                        </tr>
                      </tfoot>
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
                      <tfoot>
                        <tr>
                          <th colSpan={2}>누계</th>
                          <th className={styles.right}>{financeCumulative.billAmount.toLocaleString()}</th>
                        </tr>
                      </tfoot>
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
                      <tfoot>
                        <tr>
                          <th colSpan={2}>누계</th>
                          <th className={styles.right}>{financeCumulative.collateralAmount.toLocaleString()}</th>
                        </tr>
                      </tfoot>
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
                      <tfoot>
                        <tr>
                          <th colSpan={3}>누계</th>
                          <th className={styles.right}>{financeCumulative.receivableSales.toLocaleString()}</th>
                          <th className={styles.right}>{financeCumulative.receivableDeposit.toLocaleString()}</th>
                          <th className={styles.right}>{financeCumulative.outstandingAmount.toLocaleString()}</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  )}
                </div>
              </div>
            )}
          </CardBody>
        </Card>

                <Suspense fallback={<div style={{ padding: 12 }}>지도 카드 불러오는 중...</div>}>
          <PartnerMapCard
            formData={formData}
            mapPins={mapPins}
            handleMapCenterChange={handleMapCenterChange}
            handleAddPoint={handleAddPoint}
            handlePointChange={handlePointChange}
            handleRemovePoint={handleRemovePoint}
          />
        </Suspense>

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
              onClick={handleStartEditMode}
            >
              수정하기
            </Button>
          )}
          {isDetailMode && (
            <Button variant="secondary" className={styles.allowAction} onClick={handleOpenHistory}>
              수정 이력
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

      {isDetailMode && (
        <Modal
          open={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          title={`${selectedPartnerDetail?.name || formData.basic.companyName || '대리점'} 전체 수정 이력`}
          size="xl"
        >
                    <Suspense fallback={<div style={{ padding: 12 }}>이력 불러오는 중...</div>}>
            <EditHistoryModalContent editHistoryRows={editHistoryRows} />
          </Suspense>
        </Modal>
      )}
    </PageShell>
  );
}









