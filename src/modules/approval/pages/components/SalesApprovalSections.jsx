import React from 'react';
import { Button } from '../../../../shared/components/Button/Button';
import { APPROVAL_CATEGORY_LABEL, APPROVAL_STATUS } from '../../data/salesApprovalMock';
import { STATUS_LABEL } from '../salesApprovalDetail.helpers';
import styles from '../SalesApprovalDetailPage.module.css';

export function ApprovalMetaCard({ item }) {
  return (
    <section className={styles.card}>
      <div className={styles.metaRow}>
        <span className={styles.badge}>{APPROVAL_CATEGORY_LABEL[item.category] || item.category}</span>
        <span className={styles.status}>{STATUS_LABEL[item.status] || item.status}</span>
      </div>
      <h2 className={styles.title}>{item.title}</h2>
      <p className={styles.metaText}>기안자 {item.drafter} / {item.date}</p>
      <p className={styles.bodyText}>{item.body || '-'}</p>
    </section>
  );
}

export function ApprovalOpinionCard({ item, opinion, setOpinion, onBack, onReject, onApprove }) {
  return (
    <section className={styles.card}>
      <h3 className={styles.sectionTitle}>결재 의견</h3>
      <textarea
        className={styles.textarea}
        rows={4}
        placeholder="승인/반려 의견을 입력하세요."
        value={opinion}
        onChange={(e) => setOpinion(e.target.value)}
        disabled={item.status !== APPROVAL_STATUS.PENDING}
      />
      {item.status !== APPROVAL_STATUS.PENDING && (
        <p className={styles.bodyText}>처리 의견: {item.comment || '(의견 없음)'}</p>
      )}
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onBack}>목록으로</Button>
        <Button variant="secondary" onClick={onReject} disabled={item.status !== APPROVAL_STATUS.PENDING}>
          반려
        </Button>
        <Button variant="primary" onClick={onApprove} disabled={item.status !== APPROVAL_STATUS.PENDING}>
          승인
        </Button>
      </div>
    </section>
  );
}
