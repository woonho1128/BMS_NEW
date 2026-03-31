import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { getPartnerCompetitorBrandOptions } from '../data/partnersMock';
import { getBusinessCardsList } from '../../sales/data/businessCardMock';
import { classnames } from '../../../shared/utils/classnames';
import styles from './PartnerRegisterPage.module.css';

function createDefaultCompetitorBrands(names) {
  return names.reduce((acc, name) => {
    acc[name] = { isHandling: false, scale: '' };
    return acc;
  }, {});
}

const EMAIL_DOMAIN_OPTIONS = ['naver.com', 'gmail.com', 'daum.net', 'nate.com', 'hanmail.net'];

function parseEmail(email) {
  const raw = String(email || '');
  if (!raw.includes('@')) return { local: '', domain: '' };
  const [local, domain] = raw.split('@');
  return { local: local || '', domain: domain || '' };
}

export function PartnerRegisterPage() {
  const navigate = useNavigate();
  const competitorNames = useMemo(() => getPartnerCompetitorBrandOptions(), []);
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
    },
    partnerMemo: '',
    competitorBrands: defaultCompetitorBrands,
    mapCenter: { lat: 37.5665, lng: 126.978, radiusKm: 3 },
    nearbyPoints: [],
    historyNotes: '',
  });

  const [cardKeyword, setCardKeyword] = useState('');
  const [isCardDropdownOpen, setIsCardDropdownOpen] = useState(false);
  const [isRepresentativeEditable, setIsRepresentativeEditable] = useState(false);
  const [emailLocal, setEmailLocal] = useState('');
  const [emailDomainType, setEmailDomainType] = useState('');
  const [emailDomainDirect, setEmailDomainDirect] = useState('');
  const [saved, setSaved] = useState(false);

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

  const setRepresentativeEmail = useCallback((local, domain) => {
    const email = local && domain ? `${local}@${domain}` : '';
    setFormData((prev) => ({
      ...prev,
      representative: { ...prev.representative, email },
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
      setIsRepresentativeEditable(true);
      const parsed = parseEmail(card.email || '');
      const isCommonDomain = EMAIL_DOMAIN_OPTIONS.includes(parsed.domain);
      setEmailLocal(parsed.local);
      setEmailDomainType(isCommonDomain ? parsed.domain : parsed.domain ? 'direct' : '');
      setEmailDomainDirect(isCommonDomain ? '' : parsed.domain);
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
    },
    [businessCards]
  );

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
      },
      partnerMemo: '',
      competitorBrands: defaultCompetitorBrands,
      mapCenter: { lat: 37.5665, lng: 126.978, radiusKm: 3 },
      nearbyPoints: [],
      historyNotes: '',
    });
    setCardKeyword('');
    setIsCardDropdownOpen(false);
    setIsRepresentativeEditable(false);
    setEmailLocal('');
    setEmailDomainType('');
    setEmailDomainDirect('');
  }, [defaultCompetitorBrands]);

  const handleManualRepresentative = useCallback(() => {
    setIsRepresentativeEditable(true);
    const parsed = parseEmail(formData.representative.email);
    const isCommonDomain = EMAIL_DOMAIN_OPTIONS.includes(parsed.domain);
    setEmailLocal(parsed.local);
    setEmailDomainType(isCommonDomain ? parsed.domain : parsed.domain ? 'direct' : '');
    setEmailDomainDirect(isCommonDomain ? '' : parsed.domain);
  }, [formData.representative.email]);

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
      if (value === 'direct') {
        setRepresentativeEmail(emailLocal, emailDomainDirect);
        return;
      }
      setRepresentativeEmail(emailLocal, value);
    },
    [emailDomainDirect, emailLocal, setRepresentativeEmail]
  );

  const handleEmailDomainDirectChange = useCallback(
    (value) => {
      setEmailDomainDirect(value);
      setRepresentativeEmail(emailLocal, value);
    },
    [emailLocal, setRepresentativeEmail]
  );

  const handleSubmit = useCallback(() => {
    setSaved(true);
    console.log('partner register payload', formData);
    setTimeout(() => navigate('/master/partners'), 500);
  }, [formData, navigate]);

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

  return (
    <PageShell
      path="/master/partners"
      title="대리점 등록"
      description="상세 화면 구조와 동일한 등록 창입니다."
    >
      <div className={styles.page}>
        <Card title="1) 대리점 정보" className={styles.card}>
          <CardBody>
            <div className={styles.erpBlock}>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label className={styles.label}>거래처코드</label>
                  <input
                    className={styles.input}
                    value={formData.basic.partnerCode}
                    onChange={(e) => updateBasic('partnerCode', e.target.value)}
                    placeholder="예 PRT-009"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>상호</label>
                  <input
                    className={styles.input}
                    value={formData.basic.companyName}
                    onChange={(e) => updateBasic('companyName', e.target.value)}
                    placeholder="대리점 상호 입력"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>사업자번호</label>
                  <input
                    className={styles.input}
                    value={formData.basic.bizNo}
                    onChange={(e) => updateBasic('bizNo', e.target.value)}
                    placeholder="000-00-00000"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>대표자</label>
                  <input
                    className={styles.input}
                    value={formData.basic.ceoName}
                    onChange={(e) => updateBasic('ceoName', e.target.value)}
                    placeholder="대표자명"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>전화</label>
                  <input
                    className={styles.input}
                    value={formData.basic.phone}
                    onChange={(e) => updateBasic('phone', e.target.value)}
                    placeholder="02-0000-0000"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>팩스</label>
                  <input
                    className={styles.input}
                    value={formData.basic.fax}
                    onChange={(e) => updateBasic('fax', e.target.value)}
                    placeholder="02-0000-0001"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>업태</label>
                  <input
                    className={styles.input}
                    value={formData.basic.bizType}
                    onChange={(e) => updateBasic('bizType', e.target.value)}
                    placeholder="업태 입력"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>종목</label>
                  <input
                    className={styles.input}
                    value={formData.basic.bizItem}
                    onChange={(e) => updateBasic('bizItem', e.target.value)}
                    placeholder="종목 입력"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>설립일</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={formData.basic.establishedAt}
                    onChange={(e) => updateBasic('establishedAt', e.target.value)}
                  />
                </div>
                <div className={`${styles.field} ${styles.full}`}>
                  <label className={styles.label}>주소</label>
                  <input
                    className={styles.input}
                    value={formData.basic.address}
                    onChange={(e) => updateBasic('address', e.target.value)}
                    placeholder="주소 입력"
                  />
                </div>
              </div>
            </div>
            <div className={styles.editableBlock}>
              <label className={styles.label}>대리점 메모</label>
              <textarea
                className={styles.textarea}
                value={formData.partnerMemo}
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
                    setIsCardDropdownOpen(true);
                  }}
                  onFocus={() => setIsCardDropdownOpen(true)}
                  onBlur={() => {
                    setTimeout(() => setIsCardDropdownOpen(false), 120);
                  }}
                  placeholder="명함 검색 (이름/회사명)"
                />
                <Button variant="secondary" onClick={handleManualRepresentative}>
                  직접 입력
                </Button>
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
            <p className={styles.hint}>
              이름 또는 회사명 입력 시 자동 검색됩니다. 선택 시 자동 적용됩니다.
            </p>

            <div className={styles.grid}>
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
              <div className={styles.field}>
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
                    <option value="">이메일 도메인</option>
                    {EMAIL_DOMAIN_OPTIONS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                    <option value="direct">직접입력</option>
                  </select>
                  {emailDomainType === 'direct' && (
                    <input
                      className={styles.input}
                      value={emailDomainDirect}
                      onChange={(e) => handleEmailDomainDirectChange(e.target.value)}
                      disabled={!isRepresentativeEditable}
                      placeholder="domain.com"
                    />
                  )}
                </div>
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <label className={styles.label}>주소</label>
                <input
                  className={styles.input}
                  value={formData.representative.address}
                  onChange={(e) => updateRepresentative('address', e.target.value)}
                  disabled={!isRepresentativeEditable}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card title="3) 최근 5년간 매출 실적" className={styles.card}>
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
                    {emptyRows.map((year) => (
                      <tr key={year}>
                        <td>{year}</td>
                        <td className={styles.right}>-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card title="4) 대리점 담당 영업직원" className={styles.card}>
          <CardBody>
            <p className={styles.hint}>등록 후 담당자 이력은 상세 화면에서 관리합니다.</p>
          </CardBody>
        </Card>

        <Card title="5) 경쟁사 취급 브랜드 (단위: 천원)" className={classnames(styles.card, styles.competitorCard)}>
          <CardBody>
            <div className={styles.editableBlock}>
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
                          <select
                            className={classnames(styles.select, styles.competitorToggle)}
                            value={comp.isHandling ? 'Y' : 'N'}
                            onChange={(e) =>
                              handleCompetitorChange(name, 'isHandling', e.target.value === 'Y')
                            }
                          >
                            <option value="N">X</option>
                            <option value="Y">O</option>
                          </select>
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
                            disabled={!comp.isHandling}
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
            <p className={styles.hint}>ERP 연동 데이터는 등록 후 상세 화면에서 조회합니다.</p>
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
          <Button variant="secondary" onClick={() => navigate('/master/partners')}>
            목록
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            초기화
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            등록
          </Button>
        </div>

        {saved && <p className={styles.toast}>등록 데이터를 저장했습니다.</p>}
      </div>
    </PageShell>
  );
}
