import { Button } from '../../../../shared/components/Button/Button';
import { Card, CardBody } from '../../../../shared/components/Card';
import { classnames } from '../../../../shared/utils/classnames';
import { EMAIL_DOMAIN_OPTIONS } from '../PartnerRegisterPage.helpers';

export function PartnerRegisterTopCards({
  styles,
  divisionLabels,
  formData,
  isDetailMode,
  isEditMode,
  partnerKeyword,
  setPartnerKeyword,
  setPartnerSearchMessage,
  setIsPartnerDropdownOpen,
  autoPartnerResults,
  onPartnerSelect,
  partnerSearchMessage,
  partnerRegionOptions,
  partnerTraitCodes,
  handlePartnerTraitToggle,
  handlePartnerTraitRatioChange,
  updateEditable,
  cardKeyword,
  setCardKeyword,
  setCardSearchMessage,
  setIsCardDropdownOpen,
  handleLoadBusinessCardByKeyword,
  handleManualRepresentative,
  hasBusinessCardLinked,
  onNavigateSalesCard,
  autoCardResults,
  handleCardSelect,
  cardSearchMessage,
  updateRepresentative,
  isRepresentativeEditable,
  emailLocal,
  handleEmailLocalChange,
  emailDomainType,
  handleEmailDomainTypeChange,
  emailDomainDirect,
  handleEmailDomainDirectChange,
  handleAddStaff,
  handleRemoveStaff,
  parseEmail,
  setStaffEmailParts,
  updateStaff,
}) {
  return (
    <>
      <Card title={divisionLabels.infoCardTitle} className={styles.card}>
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
                  placeholder={divisionLabels.infoSearchPlaceholder}
                />
              </div>
              {autoPartnerResults.length > 0 && (
                <ul className={styles.searchList}>
                  {autoPartnerResults.map((partner) => (
                    <li key={partner.id}>
                      <button type="button" className={styles.searchItem} onClick={() => onPartnerSelect(partner.id)}>
                        {partner.name} / {partner.manager} / {partner.region}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {partnerKeyword.trim() && autoPartnerResults.length === 0 && <div className={styles.noResult}>검색 결과가 없습니다.</div>}
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
                <label className={styles.label}>부문</label>
                <select
                  className={classnames(styles.select, styles.emailDomainSelect)}
                  value={formData.division || 'project'}
                  disabled={isDetailMode}
                  onChange={(e) => updateEditable('division', e.target.value)}
                >
                  <option value="project">프로젝트부문</option>
                  <option value="retail">리테일부문</option>
                </select>
              </div>
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
            <label className={styles.label}>{divisionLabels.memoLabel}</label>
            <textarea
              className={styles.textarea}
              value={formData.partnerMemo}
              disabled={isDetailMode}
              onChange={(e) => updateEditable('partnerMemo', e.target.value)}
              rows={2}
              placeholder={divisionLabels.memoPlaceholder}
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
                  <Button variant="primary" onClick={handleLoadBusinessCardByKeyword}>데이터 가져오기</Button>
                  <Button variant="secondary" onClick={handleManualRepresentative}>직접 입력</Button>
                </>
              )}
              {isDetailMode && !isEditMode && !hasBusinessCardLinked && (
                <Button variant="primary" className={styles.allowAction} onClick={onNavigateSalesCard}>
                  명함 연동하기
                </Button>
              )}
            </div>
            {autoCardResults.length > 0 && (
              <ul className={styles.searchList}>
                {autoCardResults.map((row) => (
                  <li key={row.id}>
                    <button type="button" className={styles.searchItem} onClick={() => handleCardSelect(row.id)}>
                      {row.name} / {row.company} / {row.department}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {cardKeyword.trim() && autoCardResults.length === 0 && (
              <div className={styles.noResult}>검색 결과가 없습니다. 직접 입력을 사용해 주세요.</div>
            )}
          </div>
          <p className={styles.hint}>이름 또는 회사명을 입력하면 자동 검색됩니다. 선택 시 자동 반영됩니다.</p>
          {cardSearchMessage && <p className={styles.hint}>{cardSearchMessage}</p>}

          <div className={styles.representativeGrid}>
            <div className={styles.field}>
              <label className={styles.label}>성명</label>
              <input className={styles.input} value={formData.representative.name} onChange={(e) => updateRepresentative('name', e.target.value)} disabled={!isRepresentativeEditable} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>생년월일</label>
              <input type="date" className={styles.input} value={formData.representative.birthDate} onChange={(e) => updateRepresentative('birthDate', e.target.value)} disabled={!isRepresentativeEditable} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>휴대전화</label>
              <input className={styles.input} value={formData.representative.mobile} onChange={(e) => updateRepresentative('mobile', e.target.value)} disabled={!isRepresentativeEditable} />
            </div>
            <div className={classnames(styles.field, styles.representativeAddress, styles.representativeWide)}>
              <label className={styles.label}>주소</label>
              <div className={styles.addressRow}>
                <input className={styles.input} value={formData.representative.address} onChange={(e) => updateRepresentative('address', e.target.value)} disabled={!isRepresentativeEditable} placeholder="주소 입력" />
              </div>
            </div>
            <div className={classnames(styles.field, styles.representativeEmail)}>
              <label className={styles.label}>이메일</label>
              <div className={styles.emailRow}>
                <input className={styles.input} value={emailLocal} onChange={(e) => handleEmailLocalChange(e.target.value)} disabled={!isRepresentativeEditable} placeholder="email id" />
                <span className={styles.at}>@</span>
                <select className={styles.select} value={emailDomainType} onChange={(e) => handleEmailDomainTypeChange(e.target.value)} disabled={!isRepresentativeEditable}>
                  <option value="">도메인 선택</option>
                  {EMAIL_DOMAIN_OPTIONS.map((domain) => (
                    <option key={domain} value={domain}>{domain}</option>
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
              <input className={styles.input} value={formData.representative.memo || ''} onChange={(e) => updateRepresentative('memo', e.target.value)} disabled={!isRepresentativeEditable} placeholder="비고 입력" />
            </div>
          </div>
          <div className={styles.editableBlock}>
            <div className={styles.staffHeader}>
              <label className={styles.label}>직원 정보</label>
              <Button variant="secondary" onClick={handleAddStaff}>+ 직원 추가</Button>
            </div>
            {(formData.staffMembers || []).map((member, index) => {
              const parsedStaffEmail = parseEmail(member.email || '');
              const staffEmailLocal = member.emailLocal ?? parsedStaffEmail.local;
              const staffEmailDomainType = member.emailDomainType ?? (EMAIL_DOMAIN_OPTIONS.includes(parsedStaffEmail.domain) ? parsedStaffEmail.domain : parsedStaffEmail.domain ? 'direct' : '');
              const staffEmailDomainDirect = member.emailDomainDirect ?? (staffEmailDomainType === 'direct' ? parsedStaffEmail.domain : '');
              return (
                <div key={member.id} className={styles.staffBlock}>
                  <div className={styles.staffTitleRow}>
                    <span className={styles.staffTitle}>직원 {index + 1}</span>
                    <button type="button" className={styles.deleteBtn} onClick={() => handleRemoveStaff(member.id)}>삭제</button>
                  </div>
                  <div className={styles.staffGrid}>
                    <div className={styles.field}>
                      <label className={styles.label}>이름</label>
                      <input className={styles.input} value={member.name || ''} onChange={(e) => updateStaff(member.id, 'name', e.target.value)} placeholder="직원 이름" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>연락처</label>
                      <input className={styles.input} value={member.mobile || ''} onChange={(e) => updateStaff(member.id, 'mobile', e.target.value)} placeholder="010-0000-0000" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>이메일</label>
                      <div className={styles.staffEmailRow}>
                        <input className={styles.input} value={staffEmailLocal} onChange={(e) => setStaffEmailParts(member.id, e.target.value, staffEmailDomainType, staffEmailDomainDirect)} placeholder="email id" />
                        <span className={styles.at}>@</span>
                        <input
                          className={styles.input}
                          value={staffEmailDomainType === 'direct' ? staffEmailDomainDirect : staffEmailDomainType}
                          onChange={(e) => setStaffEmailParts(member.id, staffEmailLocal, staffEmailDomainType, e.target.value)}
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
                            <option key={domain} value={domain}>{domain}</option>
                          ))}
                          <option value="direct">직접입력</option>
                        </select>
                      </div>
                    </div>
                    <div className={`${styles.field} ${styles.staffMemoField}`}>
                      <label className={styles.label}>메모</label>
                      <input className={styles.input} value={member.memo || ''} onChange={(e) => updateStaff(member.id, 'memo', e.target.value)} placeholder="직원 메모" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default PartnerRegisterTopCards;
