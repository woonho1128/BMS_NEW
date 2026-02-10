import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { REPORT_TYPE, getReportById, getStatusLabel } from '../data/reportMock';
import styles from './ReportDetail.module.css';

export function ReportDetailPage() {
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
    setComments((prev) => [...prev, { id: `c-${Date.now()}`, author: '현재사용자', text: commentText.trim(), createdAt: new Date().toISOString().slice(0, 10) }]);
    setCommentText('');
  }, [commentText]);

  if (!report) {
    return (
      <PageShell path="/sales/report" title="보고 상세">
        <p>보고를 찾을 수 없습니다.</p>
        <Button variant="secondary" onClick={() => navigate('/sales/report')}>목록으로</Button>
      </PageShell>
    );
  }

  const isWeekly = report.type === REPORT_TYPE.WEEKLY;

  return (
    <PageShell path="/sales/report" title={isWeekly ? '주간보고 상세' : '출장보고 상세'}>
      <div className={styles.page}>
        <Card title={isWeekly ? '주간보고' : '출장보고'} className={styles.sectionCard}>
          <CardBody>
            <div className={styles.metaRow}>
              <span className={styles.badge}>{isWeekly ? '주간보고' : '출장보고'}</span>
              <span className={styles.status}>{getStatusLabel(report.status)}</span>
              <span className={styles.author}>{report.author}</span>
            </div>

            {isWeekly ? (
              <>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>주차</span>
                  <span className={styles.readOnlyValue}>{report.weekLabel || report.period}</span>
                </div>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>이번 주 핵심 업무</span>
                  <ul className={styles.readOnlyList}>
                    {(report.keyTasks || []).map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>다음 주 계획</span>
                  <span className={styles.readOnlyValue}>{report.nextPlan || '—'}</span>
                </div>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>이슈 / 요청사항</span>
                  <span className={styles.readOnlyValue}>{report.issues || '—'}</span>
                </div>
              </>
            ) : (
              <>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>출장기간</span>
                  <span className={styles.readOnlyValue}>{report.tripFrom} ~ {report.tripTo}</span>
                </div>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>출장지 / 목적 / 동행자</span>
                  <span className={styles.readOnlyValue}>{report.destination} / {report.purpose} / {report.companions || '—'}</span>
                </div>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>출장 활동 & 결과</span>
                  <ul className={styles.readOnlyList}>
                    {(report.activities || []).map((a, i) => (
                      <li key={i}>{a.activity}: {a.result}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.readOnlyField}>
                  <span className={styles.readOnlyLabel}>후속 액션</span>
                  <span className={styles.readOnlyValue}>{report.followUp || '—'}</span>
                </div>
                {report.costSummary && (
                  <div className={styles.readOnlyField}>
                    <span className={styles.readOnlyLabel}>비용 정보</span>
                    <span className={styles.readOnlyValue}>{report.costSummary}</span>
                  </div>
                )}
              </>
            )}
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
            <div className={styles.commentInputRow}>
              <textarea
                className={styles.commentInput}
                rows={2}
                placeholder="코멘트 입력"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                aria-label="코멘트"
              />
              <Button variant="primary" onClick={handleAddComment}>등록</Button>
            </div>
          </CardBody>
        </Card>

        <div className={styles.footer}>
          <Button variant="secondary" onClick={() => navigate('/sales/report')}>목록</Button>
          <Button variant="primary" onClick={handleStatusChange}>상태 변경</Button>
        </div>
      </div>
    </PageShell>
  );
}
