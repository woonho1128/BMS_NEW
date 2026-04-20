import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Modal } from '../../../shared/components/Modal/Modal';
import { ROUTES } from '../../../router/routePaths';
import { getMyLatestWeeklyReport, getMyWeeklyReportById, getMyWeeklyReportList } from '../data/reportMock';
import { notify } from '../../../shared/utils/notify';
import styles from './WeeklyReportFormPage.module.css';

const EMPTY_TASK = { text: '' };

function parseWeekValue(value) {
  const match = /^(\d{4})-W(\d{2})$/.exec(value || '');
  if (!match) return null;
  return { year: Number(match[1]), week: Number(match[2]) };
}

function getIsoWeekMondayUtc(year, week) {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const firstIsoMonday = new Date(jan4);
  firstIsoMonday.setUTCDate(jan4.getUTCDate() - (jan4Day - 1));
  const monday = new Date(firstIsoMonday);
  monday.setUTCDate(firstIsoMonday.getUTCDate() + (week - 1) * 7);
  return monday;
}

function formatWeekAsMonthWeek(value) {
  const parsed = parseWeekValue(value);
  if (!parsed) return '';
  const monday = getIsoWeekMondayUtc(parsed.year, parsed.week);
  const month = monday.getUTCMonth() + 1;
  const firstDayOfMonth = new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), 1));
  const firstDayOffsetMonStart = (firstDayOfMonth.getUTCDay() + 6) % 7;
  const weekOfMonth = Math.floor((monday.getUTCDate() + firstDayOffsetMonStart - 1) / 7) + 1;
  return `${month}\uC6D4 ${weekOfMonth}\uC8FC\uCC28`;
}

export function WeeklyReportFormPage() {
  const navigate = useNavigate();
  const latestMyReport = useMemo(() => getMyLatestWeeklyReport(), []);

  const [week, setWeek] = useState('');
  const [keyTasks, setKeyTasks] = useState([{ ...EMPTY_TASK }]);
  const [keyTaskDetail, setKeyTaskDetail] = useState('');
  const [issues, setIssues] = useState('');
  const [nextWeekTasks, setNextWeekTasks] = useState([{ ...EMPTY_TASK }]);
  const [nextWeekDetail, setNextWeekDetail] = useState('');
  const [nextWeekIssues, setNextWeekIssues] = useState('');
  const [attachments, setAttachments] = useState([]);

  const [openPrev, setOpenPrev] = useState(false);
  const prevList = useMemo(() => getMyWeeklyReportList(), []);
  const [prevId, setPrevId] = useState(prevList[0]?.id ?? '');
  const prevReport = useMemo(() => (prevId ? getMyWeeklyReportById(prevId) : null), [prevId]);
  const selectedWeekLabel = useMemo(() => formatWeekAsMonthWeek(week), [week]);

  const updateTask = useCallback((index, text) => {
    setKeyTasks((prev) => prev.map((item, i) => (i === index ? { ...item, text } : item)));
  }, []);

  const removeTask = useCallback((index) => {
    setKeyTasks((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

  const addTask = useCallback(() => {
    setKeyTasks((prev) => [...prev, { ...EMPTY_TASK }]);
  }, []);

  const updateNextTask = useCallback((index, text) => {
    setNextWeekTasks((prev) => prev.map((item, i) => (i === index ? { ...item, text } : item)));
  }, []);

  const removeNextTask = useCallback((index) => {
    setNextWeekTasks((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

  const addNextTask = useCallback(() => {
    setNextWeekTasks((prev) => [...prev, { ...EMPTY_TASK }]);
  }, []);

  const onFileChange = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  }, []);

  const removeAttachment = useCallback((index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const onTempSave = useCallback(() => {
    notify.info('주간보고가 임시저장되었습니다. (목업)');
    navigate(ROUTES.SALES_REPORT);
  }, [navigate]);

  const onSave = useCallback(() => {
    notify.success('주간보고가 저장되었습니다. (목업)');
    navigate(ROUTES.SALES_REPORT);
  }, [navigate]);

  return (
    <PageShell path={ROUTES.SALES_REPORT} title="주간보고 작성">
      <div className={styles.page}>
        <section className={styles.topRow}>
          <Card title="기본 정보" className={styles.basicInfoCard}>
            <CardBody className={styles.basicInfoBody}>
              <div className={styles.basicInfoField}>
                <label className={styles.docTitleLabel}>
                  주차 선택 <span className={styles.required}>*</span>
                </label>
                <input type="week" className={styles.weekInput} value={week} onChange={(e) => setWeek(e.target.value)} />
                {selectedWeekLabel && <div className={styles.weekDisplay}>{selectedWeekLabel}</div>}
              </div>

              <div className={styles.basicInfoMeta}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>작성자</span>
                  <span className={styles.metaValue}>{latestMyReport?.author || '-'}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>팀</span>
                  <span className={styles.metaValue}>{latestMyReport?.team || '-'}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>최근 작성</span>
                  <span className={styles.metaValue}>{latestMyReport?.createdAt || '-'}</span>
                </div>
              </div>

              <div className={styles.basicInfoCardFooter}>
                <Button variant="secondary" className={styles.prevReportBtn} onClick={() => setOpenPrev(true)}>
                  이전 보고 보기
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card title="이번 주" className={styles.weekCard}>
            <CardBody className={styles.weekCardBody}>
              <section className={styles.repeatSection}>
                <div className={styles.repeatHeader}>
                  <h4 className={styles.repeatTitle}>중점 업무</h4>
                  <Button variant="secondary" onClick={addTask}>
                    + 업무 추가
                  </Button>
                </div>
                {keyTasks.map((task, index) => (
                  <div key={`task-${index}`} className={styles.repeatCard}>
                    <input
                      className={styles.input}
                      value={task.text}
                      onChange={(e) => updateTask(index, e.target.value)}
                      placeholder="업무 내용을 입력하세요"
                    />
                    {keyTasks.length > 1 && (
                      <button type="button" className={styles.removeBtn} onClick={() => removeTask(index)}>
                        삭제
                      </button>
                    )}
                  </div>
                ))}
              </section>

              <div className={styles.field}>
                <label className={styles.label}>상세 내용</label>
                <textarea
                  className={styles.detailTextarea}
                  rows={3}
                  value={keyTaskDetail}
                  onChange={(e) => setKeyTaskDetail(e.target.value)}
                  placeholder="업무 진행 상세를 입력하세요"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>이슈 / 요청사항</label>
                <textarea
                  className={styles.issueTextarea}
                  rows={3}
                  value={issues}
                  onChange={(e) => setIssues(e.target.value)}
                  placeholder="이슈 또는 요청사항을 입력하세요"
                />
              </div>
            </CardBody>
          </Card>

          <Card title="다음 주" className={styles.weekCard}>
            <CardBody className={styles.weekCardBody}>
              <section className={styles.repeatSection}>
                <div className={styles.repeatHeader}>
                  <h4 className={styles.repeatTitle}>계획 업무</h4>
                  <Button variant="secondary" onClick={addNextTask}>
                    + 계획 추가
                  </Button>
                </div>
                {nextWeekTasks.map((task, index) => (
                  <div key={`next-task-${index}`} className={styles.repeatCard}>
                    <input
                      className={styles.input}
                      value={task.text}
                      onChange={(e) => updateNextTask(index, e.target.value)}
                      placeholder="차주 계획을 입력하세요"
                    />
                    {nextWeekTasks.length > 1 && (
                      <button type="button" className={styles.removeBtn} onClick={() => removeNextTask(index)}>
                        삭제
                      </button>
                    )}
                  </div>
                ))}
              </section>

              <div className={styles.field}>
                <label className={styles.label}>상세 계획</label>
                <textarea
                  className={styles.detailTextarea}
                  rows={3}
                  value={nextWeekDetail}
                  onChange={(e) => setNextWeekDetail(e.target.value)}
                  placeholder="차주 계획 상세를 입력하세요"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>예상 이슈</label>
                <textarea
                  className={styles.issueTextarea}
                  rows={3}
                  value={nextWeekIssues}
                  onChange={(e) => setNextWeekIssues(e.target.value)}
                  placeholder="예상 이슈를 입력하세요"
                />
              </div>
            </CardBody>
          </Card>
        </section>

        <Card title="첨부 파일" className={styles.attachCard}>
          <CardBody>
            <div className={styles.uploadArea}>
              <label className={styles.uploadLabel}>파일 첨부</label>
              <input type="file" multiple className={styles.fileInput} onChange={onFileChange} />
            </div>
            <ul className={styles.attachmentList}>
              {attachments.map((file, index) => (
                <li key={`${file.name}-${index}`} className={styles.attachmentItem}>
                  <span className={styles.attachmentName}>{file.name}</span>
                  <button type="button" className={styles.attachmentRemove} onClick={() => removeAttachment(index)}>
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <div className={styles.footer}>
          <Button variant="secondary" onClick={() => navigate(ROUTES.SALES_REPORT)}>
            취소
          </Button>
          <Button variant="secondary" onClick={onTempSave}>
            임시저장
          </Button>
          <Button onClick={onSave}>저장</Button>
        </div>
      </div>

      <Modal open={openPrev} onClose={() => setOpenPrev(false)} title="이전 주간보고" width="980px">
        <div className={styles.prevReportModal}>
          {prevList.length > 0 && prevReport ? (
            <>
              <div className={styles.prevReportMeta}>
                <label className={styles.prevReportSelectLabel}>보고 선택</label>
                <select className={styles.prevReportSelect} value={prevId} onChange={(e) => setPrevId(e.target.value)}>
                  {prevList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.weekLabel}
                    </option>
                  ))}
                </select>
                <span className={styles.prevReportAuthor}>
                  작성자: {prevReport.author || '-'} / 작성일: {prevReport.createdAt || '-'}
                </span>
              </div>

              <div className={styles.prevReportTwoCol}>
                <section className={styles.prevReportSection}>
                  <h4 className={styles.prevReportSectionTitle}>이번 주</h4>
                  <div className={styles.prevReportBlock}>
                    <p className={styles.prevReportLabel}>중점 업무</p>
                    <ul className={styles.prevReportList}>
                      {(prevReport.keyTasks || []).map((task, idx) => (
                        <li key={`p-task-${idx}`}>{typeof task === 'string' ? task : task.text}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.prevReportBlock}>
                    <p className={styles.prevReportLabel}>상세 내용</p>
                    <p className={styles.prevReportText}>{prevReport.keyTaskDetail || '-'}</p>
                  </div>
                  <div className={styles.prevReportBlock}>
                    <p className={styles.prevReportLabel}>이슈 / 요청사항</p>
                    <p className={styles.prevReportText}>{prevReport.issues || '-'}</p>
                  </div>
                </section>

                <section className={styles.prevReportSection}>
                  <h4 className={styles.prevReportSectionTitle}>다음 주</h4>
                  <div className={styles.prevReportBlock}>
                    <p className={styles.prevReportLabel}>계획 업무</p>
                    <ul className={styles.prevReportList}>
                      {(prevReport.nextWeekTasks || []).map((task, idx) => (
                        <li key={`p-next-${idx}`}>{typeof task === 'string' ? task : task.text}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.prevReportBlock}>
                    <p className={styles.prevReportLabel}>상세 계획</p>
                    <p className={styles.prevReportText}>{prevReport.nextWeekDetail || prevReport.nextPlan || '-'}</p>
                  </div>
                  <div className={styles.prevReportBlock}>
                    <p className={styles.prevReportLabel}>예상 이슈</p>
                    <p className={styles.prevReportText}>{prevReport.nextWeekIssues || '-'}</p>
                  </div>
                </section>
              </div>

              <div className={styles.prevReportModalFooter}>
                <Button variant="secondary" onClick={() => setOpenPrev(false)}>
                  닫기
                </Button>
              </div>
            </>
          ) : (
            <p className={styles.modalEmpty}>이전 보고가 없습니다.</p>
          )}
        </div>
      </Modal>
    </PageShell>
  );
}
