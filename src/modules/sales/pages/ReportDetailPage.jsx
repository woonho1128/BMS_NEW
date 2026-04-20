import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { REPORT_TYPE, getReportById, getStatusLabel } from '../data/reportMock';
import { sanitizeRichHtml } from '../../../shared/utils/sanitizeRichHtml';
import styles from './ReportDetail.module.css';

function formatWeekLabel(report) {
  const weekLabel = String(report?.weekLabel || '');
  const periodLabel = String(report?.periodLabel || '');
  const periodCode = String(report?.period || '');

  if (weekLabel) return weekLabel;
  if (periodLabel) return periodLabel;
  if (periodCode) return periodCode;
  return '-';
}

export function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = getReportById(id);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(report?.comments || []);

  const handleStatusChange = useCallback(() => {
    navigate('/sales/report');
  }, [navigate]);

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

  if (!report) {
    return (
      <PageShell path="/sales/report" title="보고서 상세">
        <p>보고서를 찾을 수 없습니다.</p>
        <Button variant="secondary" onClick={() => navigate('/sales/report')}>
          목록으로
        </Button>
      </PageShell>
    );
  }

  const isWeekly = report.type === REPORT_TYPE.WEEKLY;
  const thisWeekTasks = report.keyTasks || [];
  const nextWeekTasks = report.nextWeekTasks || [];
  const companions = Array.isArray(report.companions) ? report.companions.join(', ') : report.companions || '-';
  const sanitizedActivityResultHtml = sanitizeRichHtml(report.activityResultHtml || '');

  return (
    <PageShell path="/sales/report" title={isWeekly ? '주간보고 상세' : '출장보고 상세'}>
      <div className={styles.page}>
        {isWeekly ? (
          <Card title="주간보고" className={styles.sectionCard}>
            <CardBody>
              <div className={styles.metaRow}>
                <span className={styles.badge}>주간보고</span>
                <span className={styles.status}>{getStatusLabel(report.status)}</span>
                <span className={styles.author}>{report.author}</span>
              </div>

              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>주차</span>
                <span className={styles.weekValue}>{formatWeekLabel(report)}</span>
              </div>

              <section className={styles.weeklySplitSection} aria-label="주간보고 상세">
                <article className={styles.weeklyColumn}>
                  <h4 className={styles.weeklyColumnHeader}>이번 주</h4>
                  <div className={styles.readOnlyField}>
                    <span className={styles.readOnlyLabel}>중점 업무</span>
                    <ul className={styles.readOnlyList}>
                      {thisWeekTasks.length === 0
                        ? <li>-</li>
                        : thisWeekTasks.map((task, idx) => <li key={idx}>{typeof task === 'string' ? task : task.text}</li>)}
                    </ul>
                  </div>
                  <div className={styles.readOnlyField}>
                    <span className={styles.readOnlyLabel}>상세 내용</span>
                    <p className={styles.readOnlyValue}>{report.keyTaskDetail || '-'}</p>
                  </div>
                  <div className={styles.readOnlyField}>
                    <span className={styles.readOnlyLabel}>이슈 / 요청사항</span>
                    <p className={styles.readOnlyValue}>{report.issues || '-'}</p>
                  </div>
                </article>

                <article className={styles.weeklyColumn}>
                  <h4 className={styles.weeklyColumnHeader}>다음 주</h4>
                  <div className={styles.readOnlyField}>
                    <span className={styles.readOnlyLabel}>계획 업무</span>
                    <ul className={styles.readOnlyList}>
                      {nextWeekTasks.length === 0
                        ? <li>{report.nextPlan || '-'}</li>
                        : nextWeekTasks.map((task, idx) => <li key={idx}>{typeof task === 'string' ? task : task.text}</li>)}
                    </ul>
                  </div>
                  <div className={styles.readOnlyField}>
                    <span className={styles.readOnlyLabel}>상세 계획</span>
                    <p className={styles.readOnlyValue}>{report.nextWeekDetail || report.nextPlan || '-'}</p>
                  </div>
                  <div className={styles.readOnlyField}>
                    <span className={styles.readOnlyLabel}>예상 이슈</span>
                    <p className={styles.readOnlyValue}>{report.nextWeekIssues || '-'}</p>
                  </div>
                </article>
              </section>
            </CardBody>
          </Card>
        ) : (
          <>
            <Card title="출장보고" className={styles.sectionCard}>
              <CardBody>
                <div className={styles.metaRow}>
                  <span className={styles.badge}>출장보고</span>
                  <span className={styles.status}>{getStatusLabel(report.status)}</span>
                  <span className={styles.author}>{report.author}</span>
                </div>
              </CardBody>
            </Card>

            <Card title="출장 기본 정보" className={styles.sectionCard}>
              <CardBody>
                <section className={styles.tripInfoGrid}>
                  <div className={styles.readOnlyField}>
                    <span className={styles.readOnlyLabel}>출장기간</span>
                    <p className={styles.readOnlyValue}>
                      {report.tripFrom || '-'} ~ {report.tripTo || '-'}
                    </p>
                  </div>
                  <div className={styles.readOnlyField}>
                    <span className={styles.readOnlyLabel}>출장지</span>
                    <p className={styles.readOnlyValue}>{report.destination || '-'}</p>
                  </div>
                  <div className={styles.readOnlyField}>
                    <span className={styles.readOnlyLabel}>출장 목적</span>
                    <p className={styles.readOnlyValue}>{report.purpose || '-'}</p>
                  </div>
                  <div className={styles.readOnlyField}>
                    <span className={styles.readOnlyLabel}>동행자</span>
                    <p className={styles.readOnlyValue}>{companions}</p>
                  </div>
                </section>
              </CardBody>
            </Card>

            <Card title="출장 활동 & 결과" className={styles.sectionCard}>
              <CardBody>
                {sanitizedActivityResultHtml ? (
                  <div className={styles.richReadOnly} dangerouslySetInnerHTML={{ __html: sanitizedActivityResultHtml }} />
                ) : (
                  <ul className={styles.readOnlyList}>
                    {(report.activities || []).length === 0 ? (
                      <li>-</li>
                    ) : (
                      (report.activities || []).map((activity, idx) => (
                        <li key={idx}>
                          {activity.activity}: {activity.result}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </CardBody>
            </Card>

            <Card title="후속 조치" className={styles.sectionCard}>
              <CardBody>
                <p className={styles.readOnlyValue}>{report.followUp || '-'}</p>
              </CardBody>
            </Card>

            <Card title="첨부 파일" className={styles.sectionCard}>
              <CardBody>
                <ul className={styles.readOnlyList}>
                  {(report.attachments || []).length === 0 ? (
                    <li>-</li>
                  ) : (
                    (report.attachments || []).map((file, idx) => (
                      <li key={`${idx}-${typeof file === 'string' ? file : file.name || 'file'}`}>
                        {typeof file === 'string' ? file : file.name || '-'}
                      </li>
                    ))
                  )}
                </ul>
              </CardBody>
            </Card>
          </>
        )}

        <Card title="코멘트" className={styles.sectionCard}>
          <CardBody>
            <ul className={styles.commentList}>
              {comments.length === 0 ? (
                <li className={styles.commentEmpty}>코멘트가 없습니다.</li>
              ) : (
                comments.map((comment) => (
                  <li key={comment.id} className={styles.commentItem}>
                    <span className={styles.commentAuthor}>{comment.author}</span>
                    <span className={styles.commentText}>{comment.text}</span>
                    <span className={styles.commentDate}>{comment.createdAt}</span>
                  </li>
                ))
              )}
            </ul>
            <div className={styles.commentInputRow}>
              <textarea
                className={styles.commentInput}
                rows={2}
                placeholder="코멘트를 입력"
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
