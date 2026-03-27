import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { RichTextEditor } from '../../../shared/components/RichTextEditor';
import { ROUTES } from '../../../router/routePaths';
import tripStyles from './TripReportFormPage.module.css';

// Mock: 동행자 후보 목록
const MOCK_COMPANION_OPTIONS = [
  { value: 'user1', label: '김철수' },
  { value: 'user2', label: '이영희' },
  { value: 'user3', label: '박지훈' },
  { value: 'user4', label: '정수진' },
  { value: 'user5', label: '최민호' },
];

// Mock: 등록자, 수정일 (실제 연동 시 API/세션에서)
const MOCK_REGISTRANT = '홍길동';
const MOCK_MODIFIED_AT = '2025-01-30 14:00';

const TRIP_CONTENT_PLACEHOLDER =
  '출장 목적, 방문처, 주요 논의 사항, 결과 및 후속 조치 등을 작성해 주세요. (굵게, 목록, 링크, 이미지, 표 등을 활용할 수 있습니다.)';

export function TripReportFormPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [tripFrom, setTripFrom] = useState('');
  const [tripTo, setTripTo] = useState('');
  const [destination, setDestination] = useState('');
  const [companionIds, setCompanionIds] = useState([]);
  const [contentHtml, setContentHtml] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleCompanion = useCallback((value) => {
    setCompanionIds((prev) =>
      prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]
    );
  }, []);

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  }, []);

  const removeAttachment = useCallback((index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleTempSave = useCallback(() => {
    console.log('출장보고 임시저장', {
      title,
      tripFrom,
      tripTo,
      destination,
      companionIds,
      contentHtml,
      attachments: attachments.map((f) => f.name),
    });
    navigate(ROUTES.SALES_REPORT);
  }, [title, tripFrom, tripTo, destination, companionIds, contentHtml, attachments, navigate]);

  const handleSubmit = useCallback(() => {
    if (!title.trim()) {
      return;
    }
    setSubmitted(true);
    console.log('결재요청 SUBMITTED', {
      title,
      tripFrom,
      tripTo,
      destination,
      companionIds,
      contentHtml,
      attachments: attachments.map((f) => f.name),
    });
  }, [title, tripFrom, tripTo, destination, companionIds, contentHtml, attachments]);

  const handleCancel = useCallback(() => {
    navigate(ROUTES.SALES_REPORT);
  }, [navigate]);

  return (
    <PageShell path="/sales/report" title="출장보고 등록">
      <div className={tripStyles.page}>
        {/* 1. 출장 기본 정보 카드 */}
        <Card title="출장 기본 정보" className={tripStyles.basicInfoCard}>
          <CardBody>
            <div className={tripStyles.basicInfoGrid}>
              <div className={tripStyles.basicInfoFieldFull}>
                <label className={tripStyles.basicInfoLabel}>
                  제목 <span className={tripStyles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={tripStyles.basicInfoInput}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="출장보고 제목을 입력하세요"
                  aria-label="제목"
                  disabled={submitted}
                />
              </div>

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
                    aria-label="출발일"
                    disabled={submitted}
                  />
                  <span className={tripStyles.dateRangeSep}>~</span>
                  <input
                    type="date"
                    className={tripStyles.basicInfoInput}
                    value={tripTo}
                    onChange={(e) => setTripTo(e.target.value)}
                    aria-label="종료일"
                    disabled={submitted}
                  />
                </div>
              </div>
              <div className={tripStyles.basicInfoField}>
                <label className={tripStyles.basicInfoLabel}>출장지</label>
                <input
                  type="text"
                  className={tripStyles.basicInfoInput}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="출장지 입력"
                  aria-label="출장지"
                  disabled={submitted}
                />
              </div>

              <div className={tripStyles.basicInfoField}>
                <span className={tripStyles.readOnlyLabel}>등록자</span>
                <span className={tripStyles.readOnlyValue}>{MOCK_REGISTRANT}</span>
              </div>
              <div className={tripStyles.basicInfoField}>
                <span className={tripStyles.readOnlyLabel}>수정일</span>
                <span className={tripStyles.readOnlyValue}>{MOCK_MODIFIED_AT}</span>
              </div>

              <div className={tripStyles.basicInfoFieldFull}>
                <label className={tripStyles.basicInfoLabel}>동행자</label>
                <div className={tripStyles.multiSelect}>
                  <div className={tripStyles.chips}>
                    {companionIds.map((id) => {
                      const opt = MOCK_COMPANION_OPTIONS.find((o) => o.value === id);
                      return (
                        <span key={id} className={tripStyles.chip}>
                          {opt?.label ?? id}
                          {!submitted && (
                            <button
                              type="button"
                              className={tripStyles.chipRemove}
                              onClick={() => toggleCompanion(id)}
                              aria-label={`${opt?.label ?? id} 제거`}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  {!submitted && (
                    <select
                      className={tripStyles.companionSelect}
                      value=""
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v) toggleCompanion(v);
                        e.target.value = '';
                      }}
                      aria-label="동행자 추가"
                    >
                      <option value="">동행자 선택...</option>
                      {MOCK_COMPANION_OPTIONS.filter((o) => !companionIds.includes(o.value)).map(
                        (o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 2. 출장내용 카드 (WYSIWYG, 가장 큰 비중) */}
        <Card title="출장내용" className={tripStyles.contentCard}>
          <CardBody className={tripStyles.contentCardBody}>
            <RichTextEditor
              value={contentHtml}
              onChange={setContentHtml}
              placeholder={TRIP_CONTENT_PLACEHOLDER}
              minHeight={320}
              maxHeight={600}
              disabled={submitted}
            />
          </CardBody>
        </Card>

        {/* 3. 첨부 자료 카드 */}
        <Card title="첨부 자료" className={tripStyles.attachCard}>
          <CardBody>
            {!submitted && (
              <div className={tripStyles.uploadArea}>
                <label className={tripStyles.uploadLabel}>파일 선택</label>
                <input
                  type="file"
                  className={tripStyles.fileInput}
                  multiple
                  onChange={handleFileChange}
                  aria-label="첨부파일"
                />
              </div>
            )}
            {attachments.length > 0 && (
              <ul className={tripStyles.attachmentList}>
                {attachments.map((file, index) => (
                  <li key={index} className={tripStyles.attachmentItem}>
                    <span className={tripStyles.attachmentName}>{file.name}</span>
                    {!submitted && (
                      <button
                        type="button"
                        className={tripStyles.attachmentRemove}
                        onClick={() => removeAttachment(index)}
                        aria-label="첨부 삭제"
                      >
                        삭제
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        {/* 4. 결재 / 저장 영역 */}
        <div className={tripStyles.footer}>
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          {!submitted ? (
            <>
              <Button variant="secondary" onClick={handleTempSave}>
                임시저장
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!title.trim()}
              >
                결재요청
              </Button>
            </>
          ) : (
            <span className={tripStyles.submittedBadge}>결재 요청됨 (SUBMITTED)</span>
          )}
        </div>
      </div>
    </PageShell>
  );
}
