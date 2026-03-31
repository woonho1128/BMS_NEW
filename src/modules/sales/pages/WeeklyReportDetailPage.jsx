import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { REPORT_TYPE, getReportById, getStatusLabel } from '../data/reportMock';
import styles from './ReportDetail.module.css';

function formatWeekLabel(report) {
  const weekLabelText = String(report?.weekLabel || '');
  if (weekLabelText.includes('二쇱감')) return weekLabelText;
  const weekLabelCode = weekLabelText.match(/^(\d{4})-W(\d{1,2})$/);
  if (weekLabelCode) return `${weekLabelCode[1]}??${Number(weekLabelCode[2])}二쇱감`;

  const text = String(report?.periodLabel || '');
  const match = text.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const firstDayOffset = (new Date(year, month - 1, 1).getDay() + 6) % 7;
    const week = Math.floor((day + firstDayOffset - 1) / 7) + 1;
    return `${year}??${month}??${week}二쇱감`;
  }

  const periodCode = String(report?.period || '').match(/^(\d{4})-W(\d{1,2})$/);
  if (periodCode) return `${periodCode[1]}??${Number(periodCode[2])}二쇱감`;
  return report?.period || '-';
}

export function WeeklyReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = getReportById(id);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(report?.comments || []);

  const handleStatusChange = useCallback(() => {
    console.log('상태 변경', id);
    navigate('/sales/report');
  }, [id, navigate]);

  const handleAddComment = useCallback(() => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: '현재사용자',
        text: commentText.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    setCommentText('');
  }, [commentText]);

  if (!report || report.type !== REPORT_TYPE.WEEKLY) {
    return (
      <PageShell path="/sales/report" title="주간보고 상세">
        <p>주간보고를 찾을 수 없습니다.</p>
        <Button variant="secondary" onClick={() => navigate('/sales/report')}>
          목록
        </Button>
      </PageShell>
    );
  }

  const thisWeekTasks = report.keyTasks || [];
  const nextWeekTasks = report.nextWeekTasks || [];

  return (
    <PageShell path="/sales/report" title="주간보고 상세">
      <div className={styles.page}>
        <Card title="주간보고" className={styles.sectionCard}>
          <CardBody>
            <div className={styles.metaRow}>
              <span className={styles.badge}>주간보고</span>
              <span className={styles.status}>{getStatusLabel(report.status)}</span>
              <span className={styles.author}>{report.author}</span>
            </div>

            <div className={styles.readOnlyField}>
              <span className={styles.readOnlyLabel}>주차</span>
              <span className={styles.readOnlyValue}>{formatWeekLabel(report)}</span>
            </div>

            <section className={styles.weeklySplitSection} aria-label="주간 계획 비교">
              <div className={styles.weeklyColumn}>
                <div className={styles.weeklyColumnHeader}>이번 주</div>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>핵심 업무</span>
                  <ul className={styles.readOnlyList}>
                    {thisWeekTasks.length === 0 ? <li>-</li> : thisWeekTasks.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>상세 내용</span>
                  <span className={styles.readOnlyValue}>{report.keyTaskDetail || '-'}</span>
                </div>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>이슈 / 요청사항</span>
                  <span className={styles.readOnlyValue}>{report.issues || '-'}</span>
                </div>
              </div>

              <div className={styles.weeklyColumn}>
                <div className={styles.weeklyColumnHeader}>다음 주</div>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>계획 업무</span>
                  <ul className={styles.readOnlyList}>
                    {nextWeekTasks.length === 0 ? <li>{report.nextPlan || '-'}</li> : nextWeekTasks.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>상세 내용</span>
                  <span className={styles.readOnlyValue}>{report.nextWeekDetail || report.nextPlan || '-'}</span>
                </div>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>이슈 / 요청사항</span>
                  <span className={styles.readOnlyValue}>{report.nextWeekIssues || '-'}</span>
                </div>
              </div>
            </section>
          </CardBody>
        </Card>

        <Card title="코멘트" className={styles.sectionCard}>
          <CardBody>
            <ul className={styles.commentList}>
              {comments.length === 0 ? (
                <li className={styles.commentEmpty}>코멘트가 없습니다.</li>
              ) : (
                comments.map((c) => (
                  <li key={c.id} className={styles.commentItem}>
                    <span className={styles.commentAuthor}>{c.author}</span>
                    <span className={styles.commentText}>{c.text}</span>
                    <span className={styles.commentDate}>{c.createdAt}</span>
                  </li>
                ))
              )}
            </ul>
            <div className={styles.commentInputArea}>
              <textarea
                className={styles.commentInput}
                placeholder="코멘트 입력"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                aria-label="코멘트 입력"
              />
              <Button variant="primary" onClick={handleAddComment}>
                등록
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className={styles.footer}>
          <Button variant="secondary" onClick={() => navigate('/sales/report')}>
            목록
          </Button>
          <Button variant="primary" onClick={handleStatusChange}>
            상태 변경
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

