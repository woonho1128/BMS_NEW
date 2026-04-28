import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../shared/components/Button/Button';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ROUTES } from '../../../router/routePaths';
import {
  APPROVAL_CATEGORY,
  APPROVAL_STATUS,
  getApprovalById,
  getApprovalList,
  updateApprovalDecision,
} from '../data/salesApprovalMock';
import {
  ApprovalMetaCard,
  ApprovalOpinionCard,
} from './components/SalesApprovalSections';
import {
  ReportDetail,
  SalesInfoDetail,
  ShortProjectDetail,
} from './components/SalesApprovalDetailContent';
import styles from './SalesApprovalDetailPage.module.css';

export function SalesApprovalDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const item = useMemo(() => getApprovalById(id), [id]);
  const shortProjectGroupItems = useMemo(() => {
    if (!item || item.category !== APPROVAL_CATEGORY.SHORT_PROJECT || !item.submitGroupId) return [];
    return getApprovalList()
      .filter((entry) => entry.category === APPROVAL_CATEGORY.SHORT_PROJECT && entry.submitGroupId === item.submitGroupId)
      .sort((a, b) => String(a.site?.siteName || '').localeCompare(String(b.site?.siteName || '')));
  }, [item]);
  const [opinion, setOpinion] = useState('');

  if (!item) {
    return (
      <PageShell path={ROUTES.APPROVAL_SALES} title="영업 결재 상세">
        <section className={styles.card}>
          <p className={styles.bodyText}>결재 대상을 찾을 수 없습니다.</p>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => navigate(ROUTES.APPROVAL_SALES)}>목록으로</Button>
          </div>
        </section>
      </PageShell>
    );
  }

  const handleDecision = (nextStatus) => {
    if (item.status !== APPROVAL_STATUS.PENDING) return;
    updateApprovalDecision(item.id, nextStatus, opinion);
    navigate(ROUTES.APPROVAL_SALES);
  };

  return (
    <PageShell
      path={ROUTES.APPROVAL_SALES}
      title="영업 결재 상세"
      description="상세 내용을 확인하고 결재 의견을 입력한 뒤 승인/반려를 진행하세요."
      actions={<Button variant="secondary" onClick={() => navigate(ROUTES.APPROVAL_SALES)}>목록으로</Button>}
    >
      <div className={styles.page}>
        <ApprovalMetaCard item={item} />

        {item.category === APPROVAL_CATEGORY.SHORT_PROJECT && (
          <ShortProjectDetail item={item} groupItems={shortProjectGroupItems} />
        )}
        {item.category === APPROVAL_CATEGORY.SALES_INFO && <SalesInfoDetail item={item} navigate={navigate} />}
        {(item.category === APPROVAL_CATEGORY.WEEKLY || item.category === APPROVAL_CATEGORY.TRIP) && <ReportDetail item={item} />}

        <ApprovalOpinionCard
          item={item}
          opinion={opinion}
          setOpinion={setOpinion}
          onBack={() => navigate(ROUTES.APPROVAL_SALES)}
          onReject={() => handleDecision(APPROVAL_STATUS.REJECTED)}
          onApprove={() => handleDecision(APPROVAL_STATUS.APPROVED)}
        />
      </div>
    </PageShell>
  );
}

export default SalesApprovalDetailPage;


