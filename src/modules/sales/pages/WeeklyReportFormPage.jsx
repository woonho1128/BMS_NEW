import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Modal } from '../../../shared/components/Modal/Modal';
import { ROUTES } from '../../../router/routePaths';
import { getMyWeeklyReportList, getMyWeeklyReportById } from '../data/reportMock';
import { notify } from '../../../shared/utils/notify';
import styles from './WeeklyReportFormPage.module.css';

const DEFAULT_TASK = { text: '' };

export function WeeklyReportFormPage() {
  const navigate = useNavigate();
  const [week, setWeek] = useState('');
  const [keyTasks, setKeyTasks] = useState([{ ...DEFAULT_TASK }]);
  const [nextWeekTasks, setNextWeekTasks] = useState([{ ...DEFAULT_TASK }]);
  const [issues, setIssues] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [openPrev, setOpenPrev] = useState(false);
  const prevList = useMemo(() => getMyWeeklyReportList(), []);
  const [prevId, setPrevId] = useState(prevList[0]?.id ?? '');
  const prevReport = useMemo(() => (prevId ? getMyWeeklyReportById(prevId) : null), [prevId]);

  const onUpdateTask = useCallback((index, text) => {
    setKeyTasks((prev) => prev.map((item, i) => (i === index ? { ...item, text } : item)));
  }, []);

  const onUpdateNextTask = useCallback((index, text) => {
    setNextWeekTasks((prev) => prev.map((item, i) => (i === index ? { ...item, text } : item)));
  }, []);

  const onAddTask = useCallback(() => setKeyTasks((prev) => [...prev, { ...DEFAULT_TASK }]), []);
  const onAddNextTask = useCallback(() => setNextWeekTasks((prev) => [...prev, { ...DEFAULT_TASK }]), []);

  const onFileChange = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  }, []);

  const onSave = useCallback(() => {
    notify.success('주간보고가 저장되었습니다. (목업)');
    navigate(ROUTES.SALES_REPORT);
  }, [navigate]);

  const onTempSave = useCallback(() => {
    notify.info('주간보고가 임시저장되었습니다. (목업)');
    navigate(ROUTES.SALES_REPORT);
  }, [navigate]);

  return (
    <PageShell path={ROUTES.SALES_REPORT} title="주간보고 작성">
      <div className={styles.page}>
        <Card title="기본 정보">
          <CardBody>
            <div className={styles.basicInfoField}>
              <label className={styles.docTitleLabel}>주차 선택</label>
              <input type="week" className={styles.weekInput} value={week} onChange={(e) => setWeek(e.target.value)} />
            </div>
            <div className={styles.basicInfoCardFooter}>
              <Button variant="secondary" onClick={() => setOpenPrev(true)}>
                이전 보고 보기
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card title="이번 주 업무">
          <CardBody>
            {keyTasks.map((task, index) => (
              <input
                key={`task-${index}`}
                className={styles.taskInput}
                value={task.text}
                onChange={(e) => onUpdateTask(index, e.target.value)}
                placeholder="업무 내용을 입력하세요"
              />
            ))}
            <Button variant="secondary" onClick={onAddTask}>
              + 업무 추가
            </Button>
          </CardBody>
        </Card>

        <Card title="차주 계획">
          <CardBody>
            {nextWeekTasks.map((task, index) => (
              <input
                key={`next-task-${index}`}
                className={styles.taskInput}
                value={task.text}
                onChange={(e) => onUpdateNextTask(index, e.target.value)}
                placeholder="차주 계획을 입력하세요"
              />
            ))}
            <Button variant="secondary" onClick={onAddNextTask}>
              + 계획 추가
            </Button>
          </CardBody>
        </Card>

        <Card title="이슈 / 요청사항">
          <CardBody>
            <textarea className={styles.descTextarea} value={issues} onChange={(e) => setIssues(e.target.value)} rows={5} />
          </CardBody>
        </Card>

        <Card title="첨부 파일">
          <CardBody>
            <input type="file" multiple onChange={onFileChange} />
            <ul className={styles.attachmentList}>
              {attachments.map((file, index) => (
                <li key={`${file.name}-${index}`}>{file.name}</li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <div className={styles.footerActions}>
          <Button variant="secondary" onClick={() => navigate(ROUTES.SALES_REPORT)}>
            취소
          </Button>
          <Button variant="secondary" onClick={onTempSave}>
            임시저장
          </Button>
          <Button onClick={onSave}>저장</Button>
        </div>
      </div>

      <Modal open={openPrev} onClose={() => setOpenPrev(false)} title="이전 주간보고" width="800px">
        <div className={styles.prevReportModal}>
          {prevList.length > 0 ? (
            <>
              <select className={styles.prevReportSelect} value={prevId} onChange={(e) => setPrevId(e.target.value)}>
                {prevList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.weekLabel}
                  </option>
                ))}
              </select>
              <pre className={styles.prevReportText}>{JSON.stringify(prevReport, null, 2)}</pre>
            </>
          ) : (
            <p className={styles.modalEmpty}>이전 보고가 없습니다.</p>
          )}
        </div>
      </Modal>
    </PageShell>
  );
}
