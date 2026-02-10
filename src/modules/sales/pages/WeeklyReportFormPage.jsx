import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Modal } from '../../../shared/components/Modal/Modal';
import { ROUTES } from '../../../router/routePaths';
import { getMyWeeklyReportList, getMyWeeklyReportById, getMyLatestWeeklyReport } from '../data/reportMock';
import styles from './WeeklyReportFormPage.module.css';

const DEFAULT_TASK = { text: '' };

// Mock: 작성자·팀 (실제 연동 시 API/세션에서)
const MOCK_AUTHOR = '홍길동';
const MOCK_TEAM = '영업1팀';

/**
 * input type="week" 값(예: "2026-W06")을 "2026년 2월 2주차" 형식으로 변환
 */
function formatWeekDisplay(weekValue) {
  if (!weekValue || !/^\d{4}-W\d{2}$/.test(weekValue)) return '';
  const [y, w] = weekValue.split('-W').map(Number);
  const jan4 = new Date(y, 0, 4);
  const dayOfJan4 = jan4.getDay();
  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setDate(jan4.getDate() - (dayOfJan4 === 0 ? 6 : dayOfJan4 - 1));
  const mondayOfWeek = new Date(mondayWeek1);
  mondayOfWeek.setDate(mondayWeek1.getDate() + (w - 1) * 7);
  const month = mondayOfWeek.getMonth() + 1;
  const date = mondayOfWeek.getDate();
  const weekOfMonth = Math.ceil(date / 7);
  return `${y}년 ${month}월 ${weekOfMonth}주차`;
}

/** 주차 값으로 해당 주 월요일·일요일 반환 */
function getWeekRange(weekValue) {
  if (!weekValue || !/^\d{4}-W\d{2}$/.test(weekValue)) return null;
  const [y, w] = weekValue.split('-W').map(Number);
  const jan4 = new Date(y, 0, 4);
  const dayOfJan4 = jan4.getDay();
  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setDate(jan4.getDate() - (dayOfJan4 === 0 ? 6 : dayOfJan4 - 1));
  const monday = new Date(mondayWeek1);
  monday.setDate(mondayWeek1.getDate() + (w - 1) * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
}

/** "2월 1일 ~ 2월 7일" 형식 */
function formatDateRangeLabel(monday, sunday) {
  if (!monday || !sunday) return '';
  const m = monday.getMonth() + 1;
  const d1 = monday.getDate();
  const s = sunday.getMonth() + 1;
  const d2 = sunday.getDate();
  if (m === s) return `${m}월 ${d1}일 ~ ${d2}일`;
  return `${m}월 ${d1}일 ~ ${s}월 ${d2}일`;
}

/** 이전 주간보고 팝업 내용 (읽기 전용, 날짜 선택, 이번 주/차주 가로 배치) */
function PrevReportModalContent({ onClose }) {
  const list = getMyWeeklyReportList();
  const [selectedId, setSelectedId] = useState(list[0]?.id ?? '');
  const report = selectedId ? getMyWeeklyReportById(selectedId) : null;

  if (list.length === 0) return <p className={styles.modalEmpty}>최근 작성한 주간보고가 없습니다.</p>;
  if (!report) return <p className={styles.modalEmpty}>보고를 불러올 수 없습니다.</p>;

  return (
    <div className={styles.prevReportModal}>
      <div className={styles.prevReportMeta}>
        <label className={styles.prevReportSelectLabel}>보고 선택</label>
        <select
          className={styles.prevReportSelect}
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          aria-label="주간보고 선택"
        >
          {list.map((item) => (
            <option key={item.id} value={item.id}>
              {item.weekLabel} ({item.periodLabel})
            </option>
          ))}
        </select>
        <span className={styles.prevReportAuthor}>{report.author} · {report.team}</span>
      </div>
      <div className={styles.prevReportTwoCol}>
        <div className={styles.prevReportSection}>
          <h3 className={styles.prevReportSectionTitle}>이번 주</h3>
          <div className={styles.prevReportBlock}>
            <span className={styles.prevReportLabel}>핵심 업무 요약</span>
            <ul className={styles.prevReportList}>
              {report.keyTasks.map((t, i) => (
                <li key={i}>{t.text}</li>
              ))}
            </ul>
          </div>
          <div className={styles.prevReportBlock}>
            <span className={styles.prevReportLabel}>상세 내용</span>
            <p className={styles.prevReportText}>{report.keyTaskDetail || '-'}</p>
          </div>
          <div className={styles.prevReportBlock}>
            <span className={styles.prevReportLabel}>이슈 / 요청사항</span>
            <p className={styles.prevReportText}>{report.issues || '-'}</p>
          </div>
        </div>
        <div className={styles.prevReportSection}>
          <h3 className={styles.prevReportSectionTitle}>차주</h3>
          <div className={styles.prevReportBlock}>
            <span className={styles.prevReportLabel}>예정 업무 요약</span>
            <ul className={styles.prevReportList}>
              {report.nextWeekTasks.map((t, i) => (
                <li key={i}>{t.text}</li>
              ))}
            </ul>
          </div>
          <div className={styles.prevReportBlock}>
            <span className={styles.prevReportLabel}>상세 내용</span>
            <p className={styles.prevReportText}>{report.nextWeekDetail || '-'}</p>
          </div>
          <div className={styles.prevReportBlock}>
            <span className={styles.prevReportLabel}>이슈 / 요청사항</span>
            <p className={styles.prevReportText}>{report.nextWeekIssues || '-'}</p>
          </div>
        </div>
      </div>
      <div className={styles.prevReportModalFooter}>
        <Button variant="secondary" onClick={onClose}>닫기</Button>
      </div>
    </div>
  );
}

export function WeeklyReportFormPage() {
  const navigate = useNavigate();
  const [week, setWeek] = useState('');
  const [keyTasks, setKeyTasks] = useState([{ ...DEFAULT_TASK }]);
  const [keyTaskDetail, setKeyTaskDetail] = useState('');
  const [issues, setIssues] = useState('');
  const [nextWeekTasks, setNextWeekTasks] = useState([{ ...DEFAULT_TASK }]);
  const [nextWeekDetail, setNextWeekDetail] = useState('');
  const [nextWeekIssues, setNextWeekIssues] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showPrevReportModal, setShowPrevReportModal] = useState(false);

  const addTask = useCallback(() => {
    setKeyTasks((prev) => [...prev, { ...DEFAULT_TASK }]);
  }, []);

  const removeTask = useCallback((index) => {
    setKeyTasks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateTask = useCallback((index, text) => {
    setKeyTasks((prev) => prev.map((t, i) => (i === index ? { ...t, text } : t)));
  }, []);

  const addNextWeekTask = useCallback(() => {
    setNextWeekTasks((prev) => [...prev, { ...DEFAULT_TASK }]);
  }, []);

  const removeNextWeekTask = useCallback((index) => {
    setNextWeekTasks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateNextWeekTask = useCallback((index, text) => {
    setNextWeekTasks((prev) => prev.map((t, i) => (i === index ? { ...t, text } : t)));
  }, []);

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  }, []);

  const removeAttachment = useCallback((index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(() => {
    console.log('주간보고 저장', {
      week,
      keyTasks,
      keyTaskDetail,
      issues,
      nextWeekTasks,
      nextWeekDetail,
      nextWeekIssues,
      attachments,
    });
    navigate(ROUTES.SALES_REPORT);
  }, [week, keyTasks, keyTaskDetail, issues, nextWeekTasks, nextWeekDetail, nextWeekIssues, attachments, navigate]);

  const handleTempSave = useCallback(() => {
    console.log('주간보고 임시저장', {
      week,
      keyTasks,
      keyTaskDetail,
      issues,
      nextWeekTasks,
      nextWeekDetail,
      nextWeekIssues,
    });
    navigate(ROUTES.SALES_REPORT);
  }, [week, keyTasks, keyTaskDetail, issues, nextWeekTasks, nextWeekDetail, nextWeekIssues, navigate]);

  const handleCancel = useCallback(() => {
    navigate(ROUTES.SALES_REPORT);
  }, [navigate]);

  const thisWeekRange = week ? getWeekRange(week) : null;
  const nextWeekRange = thisWeekRange
    ? {
        monday: new Date(thisWeekRange.monday.getTime() + 7 * 24 * 60 * 60 * 1000),
        sunday: new Date(thisWeekRange.sunday.getTime() + 7 * 24 * 60 * 60 * 1000),
      }
    : null;
  const thisWeekDateLabel = thisWeekRange ? formatDateRangeLabel(thisWeekRange.monday, thisWeekRange.sunday) : '';
  const nextWeekDateLabel = nextWeekRange ? formatDateRangeLabel(nextWeekRange.monday, nextWeekRange.sunday) : '';

  return (
    <PageShell path="/sales/report" title="주간보고 작성">
      <div className={styles.page}>
        {/* 1. 기본정보(왼쪽) + 이번 주 + 차주 한 줄 */}
        <div className={styles.topRow}>
        <Card title="기본 정보" className={styles.basicInfoCard}>
          <CardBody className={styles.basicInfoBody}>
            <div className={styles.basicInfoField}>
              <label className={styles.docTitleLabel}>
                주차 선택 <span className={styles.required}>*</span>
              </label>
              {week ? (
                <span className={styles.weekDisplay} aria-live="polite">
                  {formatWeekDisplay(week)}
                </span>
              ) : null}
              <input
                type="week"
                className={styles.weekInput}
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                placeholder="예: 2025-W04"
                aria-label="주차"
              />
            </div>
            <div className={styles.basicInfoMeta}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>작성자</span>
                <span className={styles.metaValue}>{MOCK_AUTHOR}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>팀</span>
                <span className={styles.metaValue}>{MOCK_TEAM}</span>
              </div>
            </div>
            <div className={styles.basicInfoCardFooter}>
              <Button
                variant="secondary"
                className={styles.prevReportBtn}
                onClick={() => setShowPrevReportModal(true)}
              >
                이전 주간보고 보기
              </Button>
            </div>
          </CardBody>
        </Card>

        <Modal
          open={showPrevReportModal}
          onClose={() => setShowPrevReportModal(false)}
          title="이전 주간보고"
          size="xl"
        >
          <PrevReportModalContent onClose={() => setShowPrevReportModal(false)} />
        </Modal>
        <Card
          title="이번 주"
          className={styles.weekCard}
          actions={thisWeekDateLabel ? <span className={styles.weekDateRange}>{thisWeekDateLabel}</span> : null}
        >
          <CardBody className={styles.weekCardBody}>
            <div className={styles.repeatSection}>
              <div className={styles.repeatHeader}>
                <h3 className={styles.repeatTitle}>핵심 업무 요약</h3>
                <Button variant="secondary" onClick={addTask}>+ 추가</Button>
              </div>
              {keyTasks.map((task, index) => (
                <div key={index} className={styles.repeatCard}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="핵심 업무 한 줄 요약"
                    value={task.text}
                    onChange={(e) => updateTask(index, e.target.value)}
                    aria-label={`핵심 업무 ${index + 1}`}
                  />
                  {keyTasks.length > 1 && (
                    <button type="button" className={styles.removeBtn} onClick={() => removeTask(index)} aria-label="삭제">삭제</button>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>상세 내용</label>
              <textarea
                className={styles.detailTextarea}
                placeholder="업무 내용을 상세히 입력하세요 (목표, 진행 상황, 결과 등)"
                value={keyTaskDetail}
                onChange={(e) => setKeyTaskDetail(e.target.value)}
                aria-label="상세 내용"
                rows={5}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>이슈 / 요청사항</label>
              <textarea
                className={styles.issueTextarea}
                placeholder="공유할 이슈, 상단 요청사항, 협조 요청 등을 입력하세요."
                value={issues}
                onChange={(e) => setIssues(e.target.value)}
                aria-label="이번 주 이슈 요청사항"
                rows={3}
              />
            </div>
          </CardBody>
        </Card>

        {/* 3. 차주 카드 */}
        <Card
          title="차주"
          className={styles.weekCard}
          actions={nextWeekDateLabel ? <span className={styles.weekDateRange}>{nextWeekDateLabel}</span> : null}
        >
          <CardBody className={styles.weekCardBody}>
            <div className={styles.repeatSection}>
              <div className={styles.repeatHeader}>
                <h3 className={styles.repeatTitle}>예정 업무 요약</h3>
                <Button variant="secondary" onClick={addNextWeekTask}>+ 추가</Button>
              </div>
              {nextWeekTasks.map((task, index) => (
                <div key={index} className={styles.repeatCard}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="예정 업무 한 줄 요약"
                    value={task.text}
                    onChange={(e) => updateNextWeekTask(index, e.target.value)}
                    aria-label={`차주 업무 ${index + 1}`}
                  />
                  {nextWeekTasks.length > 1 && (
                    <button type="button" className={styles.removeBtn} onClick={() => removeNextWeekTask(index)} aria-label="삭제">삭제</button>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>상세 내용</label>
              <textarea
                className={styles.detailTextarea}
                placeholder="차주 업무를 상세히 입력하세요 (일정, 목표, 준비 사항 등)"
                value={nextWeekDetail}
                onChange={(e) => setNextWeekDetail(e.target.value)}
                aria-label="차주 상세 내용"
                rows={5}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>이슈 / 요청사항</label>
              <textarea
                className={styles.issueTextarea}
                placeholder="차주 관련 이슈, 요청사항, 협조 요청 등을 입력하세요."
                value={nextWeekIssues}
                onChange={(e) => setNextWeekIssues(e.target.value)}
                aria-label="차주 이슈 요청사항"
                rows={3}
              />
            </div>
          </CardBody>
        </Card>
        </div>

        {/* 2. 기타 / 첨부 카드 - 시각적 무게 축소, Drag & Drop 톤 */}
        <Card title="기타 / 첨부" className={styles.attachCard}>
          <CardBody>
            <div className={styles.uploadArea}>
              <label className={styles.uploadLabel}>첨부 파일</label>
              <input
                type="file"
                className={styles.fileInput}
                multiple
                onChange={handleFileChange}
                aria-label="첨부파일"
              />
            </div>
            {attachments.length > 0 && (
              <ul className={styles.attachmentList}>
                {attachments.map((file, index) => (
                  <li key={index} className={styles.attachmentItem}>
                    <span className={styles.attachmentName}>{file.name}</span>
                    <button
                      type="button"
                      className={styles.attachmentRemove}
                      onClick={() => removeAttachment(index)}
                      aria-label="첨부 삭제"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        {/* 3. 버튼 영역: 임시저장 / 저장(Primary) / 취소, 우측 정렬 */}
        <div className={styles.footer}>
          <Button variant="secondary" onClick={handleTempSave}>임시저장</Button>
          <Button variant="primary" onClick={handleSave}>저장</Button>
          <Button variant="secondary" onClick={handleCancel}>취소</Button>
        </div>
      </div>
    </PageShell>
  );
}
