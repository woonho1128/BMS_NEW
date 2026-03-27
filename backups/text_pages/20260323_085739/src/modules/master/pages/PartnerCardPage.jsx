import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { getPartnerById } from '../data/partnersMock';
import { classnames } from '../../../shared/utils/classnames';
import styles from './PartnerCardPage.module.css';

function LockIcon() {
  return (
    <span className={styles.lockIcon} aria-label="ERP 연동 (읽기 전용)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </span>
  );
}

function ReadOnlyRow({ label, value, withLock }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>
        {label}
        {withLock && <LockIcon />}
      </span>
      <span className={styles.value}>{value ?? '—'}</span>
    </div>
  );
}

export function PartnerCardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const partner = isNew ? null : getPartnerById(id);

  const [editable, setEditable] = useState({
    partnerMemo: '',
    competitorBrands: {},
    competitorWithin3km: '',
    historyNotes: '',
  });
  const [saved, setSaved] = useState(false);

  const DEFAULT_COMPETITOR_BRANDS = {
    '계림요업': { isHandling: false, scale: '' },
    '이누스': { isHandling: false, scale: '' },
    '대림통상': { isHandling: false, scale: '' },
    'ASK': { isHandling: false, scale: '' },
    'R&CO': { isHandling: false, scale: '' },
    'VOVO': { isHandling: false, scale: '' },
  };

  useEffect(() => {
    if (partner) {
      const partnerBrands = partner.competitorBrands || {};
      setEditable({
        partnerMemo: partner.partnerMemo ?? '',
        competitorBrands: { ...DEFAULT_COMPETITOR_BRANDS, ...partnerBrands },
        competitorWithin3km: partner.competitorWithin3km ?? '',
        historyNotes: partner.historyNotes ?? '',
      });
    } else if (isNew) {
      setEditable({
        partnerMemo: '',
        competitorBrands: { ...DEFAULT_COMPETITOR_BRANDS },
        competitorWithin3km: '',
        historyNotes: '',
      });
    }
  }, [partner?.id, isNew]);

  const handleEditableChange = useCallback((field, value) => {
    setEditable((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    setSaved(true);
    console.log('담당자 수정 영역 저장', editable);
  }, [editable]);

  const handleCancel = useCallback(() => {
    if (partner) {
      setEditable({
        partnerMemo: partner.partnerMemo ?? '',
        competitorBrands: partner.competitorBrands ? { ...partner.competitorBrands } : {},
        competitorWithin3km: partner.competitorWithin3km ?? '',
        historyNotes: partner.historyNotes ?? '',
      });
    }
  }, [partner]);

  const handleCompetitorChange = useCallback((compName, field, value) => {
    setEditable((prev) => ({
      ...prev,
      competitorBrands: {
        ...prev.competitorBrands,
        [compName]: {
          ...prev.competitorBrands[compName],
          [field]: value,
        },
      },
    }));
  }, []);

  const YEARS = [2020, 2021, 2022, 2023, 2024];
  const COMPETITOR_NAMES = ['계림요업', '이누스', '대림통상', 'ASK', 'R&CO', 'VOVO'];

  const handleList = useCallback(() => {
    navigate('/master/partners');
  }, [navigate]);

  if (!isNew && !partner) {
    return (
      <PageShell path="/master/partners" title="대리점 관리카드">
        <p className={styles.notFound}>대리점을 찾을 수 없습니다.</p>
        <Button variant="secondary" onClick={handleList}>목록</Button>
      </PageShell>
    );
  }

  const basic = partner?.basic ?? {};
  const representative = partner?.representative ?? {};
  const salesByYear = partner?.salesByYear ?? [];
  const staffByYear = partner?.staffByYear ?? {};
  const financialByYear = partner?.financialByYear ?? [];
  const title = isNew ? '대리점 등록' : `${partner?.name ?? ''} 관리카드`;

  return (
    <PageShell path="/master/partners" title={title}>
      <div className={styles.page}>
        {/* 1) 대리점 정보 (ERP ReadOnly + 담당자 입력) */}
        <Card title="1) 대리점 정보" className={styles.card}>
          <CardBody>
            <div className={styles.erpBlock}>
              <div className={styles.grid}>
                <ReadOnlyRow label="거래처코드" value={basic.partnerCode} withLock />
                <ReadOnlyRow label="상호" value={basic.companyName} withLock />
                <ReadOnlyRow label="사업자번호" value={basic.bizNo} withLock />
                <ReadOnlyRow label="대표자" value={basic.ceoName} withLock />
                <ReadOnlyRow label="주소" value={basic.address} withLock />
                <ReadOnlyRow label="전화" value={basic.phone} withLock />
                <ReadOnlyRow label="팩스" value={basic.fax} withLock />
                <ReadOnlyRow label="업태" value={basic.bizType} withLock />
                <ReadOnlyRow label="종목" value={basic.bizItem} withLock />
                <ReadOnlyRow label="설립일" value={basic.establishedAt} withLock />
              </div>
            </div>
            <div className={styles.editableBlock}>
              <label className={styles.editableLabel}>담당자 메모</label>
              <textarea
                className={styles.textarea}
                value={editable.partnerMemo}
                onChange={(e) => handleEditableChange('partnerMemo', e.target.value)}
                placeholder="대리점 정보 관련 담당자 입력"
                rows={2}
                aria-label="담당자 메모"
              />
            </div>
          </CardBody>
        </Card>

        {/* 2) 대표자 인적사항 (ERP ReadOnly) */}
        <Card title="2) 대표자 인적사항" className={styles.card}>
          <CardBody>
            <div className={styles.erpBlock}>
              <div className={styles.grid}>
                <ReadOnlyRow label="성명" value={representative.name} withLock />
                <ReadOnlyRow label="생년월일" value={representative.birthDate} withLock />
                <ReadOnlyRow label="휴대폰" value={representative.mobile} withLock />
                <ReadOnlyRow label="이메일" value={representative.email} withLock />
                <ReadOnlyRow label="주소" value={representative.address} withLock />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 3) 최근 5년간 매출실적 (ERP ReadOnly) */}
        <Card title="3) 최근 5년간 매출실적" className={styles.card}>
          <CardBody>
            <div className={styles.erpBlock}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>연도</th>
                      <th className={styles.thNum}>매출액(원)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesByYear.length === 0 ? (
                      <tr>
                        <td colSpan={2} className={styles.emptyCell}>데이터 없음</td>
                      </tr>
                    ) : (
                      salesByYear.map((row) => (
                        <tr key={row.year}>
                          <td className={styles.td}>{row.year}</td>
                          <td className={styles.tdNum}>{Number(row.amount).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 4) 대리점 담당 영업직원 (ERP ReadOnly 테이블 - 가로형) */}
        <Card title="4) 대리점 담당 영업직원" className={styles.card}>
          <CardBody>
            <div className={styles.erpBlock}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>
                        <span>구분</span>
                        <LockIcon />
                      </th>
                      {YEARS.map((year) => (
                        <th key={year} className={styles.th}>
                          <span>{year}년</span>
                          <LockIcon />
                        </th>
                      ))}
                      <th className={styles.th}>
                        <span>비고</span>
                        <LockIcon />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.td}>담당자</td>
                      {YEARS.map((year) => {
                        const staff = staffByYear[year];
                        return (
                          <td key={year} className={styles.td}>
                            {staff?.name || ''}
                          </td>
                        );
                      })}
                      <td className={styles.td}></td>
                    </tr>
                    <tr>
                      <td className={styles.td}>재직유무</td>
                      {YEARS.map((year) => {
                        const staff = staffByYear[year];
                        return (
                          <td key={year} className={styles.td}>
                            {staff?.isActive === true ? '재직' : staff?.isActive === false ? '퇴직' : ''}
                          </td>
                        );
                      })}
                      <td className={styles.td}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 5) 경쟁사 취급 브랜드 (담당자 입력 테이블 - 가로형) */}
        <Card title="5) 경쟁사 취급 브랜드 (단위:억원)" className={styles.card}>
          <CardBody>
            <div className={styles.editableBlock}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>경쟁사</th>
                      {COMPETITOR_NAMES.map((name) => (
                        <th key={name} className={styles.th}>
                          {name}
                        </th>
                      ))}
                      <th className={styles.th}>비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.td}>취급여부</td>
                      {COMPETITOR_NAMES.map((compName) => {
                        const comp = editable.competitorBrands[compName] || { isHandling: false, scale: '' };
                        return (
                          <td key={compName} className={styles.td}>
                            <select
                              className={styles.tableSelect}
                              value={comp.isHandling ? 'Y' : 'N'}
                              onChange={(e) =>
                                handleCompetitorChange(compName, 'isHandling', e.target.value === 'Y')
                              }
                              aria-label={`${compName} 취급여부`}
                            >
                              <option value="N">X</option>
                              <option value="Y">O</option>
                            </select>
                          </td>
                        );
                      })}
                      <td className={styles.td}></td>
                    </tr>
                    <tr>
                      <td className={styles.td}>취급규모</td>
                      {COMPETITOR_NAMES.map((compName) => {
                        const comp = editable.competitorBrands[compName] || { isHandling: false, scale: '' };
                        return (
                          <td key={compName} className={styles.td}>
                            <input
                              type="text"
                              className={styles.tableInput}
                              value={comp.scale || ''}
                              onChange={(e) => handleCompetitorChange(compName, 'scale', e.target.value)}
                              placeholder="억원"
                              aria-label={`${compName} 취급규모`}
                            />
                          </td>
                        );
                      })}
                      <td className={styles.td}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 6) 거래처 최근 5년 재무/매출 현황 (ERP ReadOnly) */}
        <Card title="6) 거래처 최근 5년 재무/매출 현황" className={styles.card}>
          <CardBody>
            <div className={styles.erpBlock}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>연도</th>
                      <th className={styles.thNum}>매출액</th>
                      <th className={styles.thNum}>매출원가</th>
                      <th className={styles.thNum}>당기순이익</th>
                      <th className={styles.thNum}>자본총계</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialByYear.length === 0 ? (
                      <tr>
                        <td colSpan={5} className={styles.emptyCell}>데이터 없음</td>
                      </tr>
                    ) : (
                      financialByYear.map((row) => (
                        <tr key={row.year}>
                          <td className={styles.td}>{row.year}</td>
                          <td className={styles.tdNum}>{Number(row.revenue).toLocaleString()}</td>
                          <td className={styles.tdNum}>{Number(row.cost).toLocaleString()}</td>
                          <td className={styles.tdNum}>{Number(row.profit).toLocaleString()}</td>
                          <td className={styles.tdNum}>{Number(row.equity).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 7) 반경 3Km 내 당사/경쟁사 현황 (담당자 입력) */}
        <Card title="7) 반경 3Km 내 당사/경쟁사 현황" className={styles.card}>
          <CardBody>
            <div className={styles.editableBlock}>
              <textarea
                className={styles.textarea}
                value={editable.competitorWithin3km}
                onChange={(e) => handleEditableChange('competitorWithin3km', e.target.value)}
                placeholder="반경 3Km 내 당사/경쟁사 현황 입력"
                rows={3}
                aria-label="반경 3Km 내 당사/경쟁사 현황"
              />
            </div>
          </CardBody>
        </Card>

        {/* 8) 거래처 이력 및 특이사항 (담당자 입력) */}
        <Card title="8) 거래처 이력 및 특이사항" className={styles.card}>
          <CardBody>
            <div className={styles.editableBlock}>
              <textarea
                className={styles.textarea}
                value={editable.historyNotes}
                onChange={(e) => handleEditableChange('historyNotes', e.target.value)}
                placeholder="거래처 이력 및 특이사항 입력"
                rows={4}
                aria-label="거래처 이력 및 특이사항"
              />
            </div>
          </CardBody>
        </Card>

        <div className={styles.footer}>
          <Button variant="secondary" onClick={handleList}>목록</Button>
          {!isNew && (
            <>
              <Button variant="secondary" onClick={handleCancel}>취소</Button>
              <Button variant="primary" onClick={handleSave}>저장</Button>
            </>
          )}
        </div>

        {saved && <p className={styles.toast} role="status">저장되었습니다.</p>}
      </div>
    </PageShell>
  );
}
