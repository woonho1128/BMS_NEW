import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { RichTextEditor } from '../../../shared/components/RichTextEditor/RichTextEditor';
import { ROUTES } from '../../../router/routePaths';
import { notify } from '../../../shared/utils/notify';
import { MOCK_AUTHORS } from '../data/reportMock';
import tripStyles from './TripReportFormPage.module.css';

export function TripReportFormPage() {
  const navigate = useNavigate();

  const [tripFrom, setTripFrom] = useState('');
  const [tripTo, setTripTo] = useState('');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [companions, setCompanions] = useState([]);
  const [activityResultHtml, setActivityResultHtml] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [attachments, setAttachments] = useState([]);

  const companionOptions = useMemo(() => MOCK_AUTHORS || [], []);

  const addCompanion = useCallback(
    (name) => {
      if (!name) return;
      setCompanions((prev) => (prev.includes(name) ? prev : [...prev, name]));
    },
    [setCompanions],
  );

  const removeCompanion = useCallback((name) => {
    setCompanions((prev) => prev.filter((item) => item !== name));
  }, []);

  const onFileChange = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  }, []);

  const removeAttachment = useCallback((index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const onTempSave = useCallback(() => {
    notify.info('출장보고가 임시저장되었습니다. (목업)');
    navigate(ROUTES.SALES_REPORT);
  }, [navigate]);

  const onSave = useCallback(() => {
    notify.success('출장보고가 저장되었습니다. (목업)');
    navigate(ROUTES.SALES_REPORT);
  }, [navigate]);

  return (
    <PageShell path={ROUTES.SALES_REPORT} title="출장보고 등록">
      <div className={tripStyles.page}>
        <Card title="출장 기본 정보" className={tripStyles.basicInfoCard}>
          <CardBody className={tripStyles.basicInfoGrid}>
            <div className={tripStyles.basicInfoField}>
              <label className={tripStyles.basicInfoLabel}>
                출장기간 <span className={tripStyles.required}>*</span>
              </label>
              <div className={tripStyles.dateRangeWrap}>
                <input
                  type="date"
                  className={tripStyles.basicInfoInput}
                  value={tripFrom}
                  onChange={(e) => setTripFrom(e.target.value)}
                />
                <span className={tripStyles.dateRangeSep}>~</span>
                <input type="date" className={tripStyles.basicInfoInput} value={tripTo} onChange={(e) => setTripTo(e.target.value)} />
              </div>
            </div>

            <div className={tripStyles.basicInfoField}>
              <label className={tripStyles.basicInfoLabel}>
                출장지 <span className={tripStyles.required}>*</span>
              </label>
              <input
                className={tripStyles.basicInfoInput}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="출장지를 입력하세요."
              />
            </div>

            <div className={tripStyles.basicInfoField}>
              <label className={tripStyles.basicInfoLabel}>
                출장 목적 <span className={tripStyles.required}>*</span>
              </label>
              <input
                className={tripStyles.basicInfoInput}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="출장 목적을 입력하세요."
              />
            </div>

            <div className={tripStyles.basicInfoField}>
              <label className={tripStyles.basicInfoLabel}>동행자</label>
              <div className={tripStyles.multiSelect}>
                <select
                  className={tripStyles.companionSelect}
                  defaultValue=""
                  onChange={(e) => {
                    addCompanion(e.target.value);
                    e.currentTarget.value = '';
                  }}
                >
                  <option value="">동행자 선택</option>
                  {companionOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <div className={tripStyles.chips}>
                  {companions.length === 0 && <span className={tripStyles.readOnlyLabel}>선택된 동행자가 없습니다.</span>}
                  {companions.map((name) => (
                    <span key={name} className={tripStyles.chip}>
                      {name}
                      <button type="button" className={tripStyles.chipRemove} onClick={() => removeCompanion(name)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card title="출장 활동 & 결과" className={tripStyles.contentCard}>
          <CardBody className={tripStyles.contentCardBody}>
            <RichTextEditor
              value={activityResultHtml}
              onChange={setActivityResultHtml}
              placeholder="출장 활동 내용과 결과를 상세히 작성해 주세요."
              minHeight={260}
              maxHeight={520}
            />
          </CardBody>
        </Card>

        <Card title="후속 조치" className={tripStyles.contentCard}>
          <CardBody>
            <textarea
              className={tripStyles.basicInfoInput}
              rows={5}
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="후속 조치 계획을 입력하세요."
            />
          </CardBody>
        </Card>

        <Card title="첨부 파일" className={tripStyles.attachCard}>
          <CardBody>
            <div className={tripStyles.uploadArea}>
              <label className={tripStyles.uploadLabel}>파일 첨부</label>
              <input type="file" multiple className={tripStyles.fileInput} onChange={onFileChange} />
            </div>
            <ul className={tripStyles.attachmentList}>
              {attachments.map((file, index) => (
                <li key={`${file.name}-${index}`} className={tripStyles.attachmentItem}>
                  <span className={tripStyles.attachmentName}>{file.name}</span>
                  <button type="button" className={tripStyles.attachmentRemove} onClick={() => removeAttachment(index)}>
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <div className={tripStyles.footer}>
          <Button variant="secondary" onClick={() => navigate(ROUTES.SALES_REPORT)}>
            취소
          </Button>
          <Button variant="secondary" onClick={onTempSave}>
            임시저장
          </Button>
          <Button onClick={onSave}>저장</Button>
        </div>
      </div>
    </PageShell>
  );
}
