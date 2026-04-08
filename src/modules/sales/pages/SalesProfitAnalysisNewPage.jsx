import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { notify } from '../../../shared/utils/notify';
import styles from './SalesProfitAnalysisNewPage.module.css';

export function SalesProfitAnalysisNewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = useMemo(() => Boolean(id), [id]);
  const [form, setForm] = useState({ title: '', siteName: '', partnerName: '', remark: '' });

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    notify.success(isEditMode ? '수정 저장이 완료되었습니다. (목업)' : '결재상신이 완료되었습니다. (목업)');
    navigate(ROUTES.PROFIT);
  };

  const handleTempSave = () => {
    notify.info('임시저장이 완료되었습니다. (목업)');
    navigate(ROUTES.PROFIT);
  };

  return (
    <PageShell path={ROUTES.PROFIT} title={isEditMode ? '수익 분석 수정' : '수익 분석 등록'}>
      <div className={styles.page}>
        <Card title="기본 정보">
          <CardBody className={styles.formGrid}>
            <input value={form.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="제목" />
            <input value={form.siteName} onChange={(e) => handleChange('siteName', e.target.value)} placeholder="현장명" />
            <input value={form.partnerName} onChange={(e) => handleChange('partnerName', e.target.value)} placeholder="거래처" />
            <textarea value={form.remark} onChange={(e) => handleChange('remark', e.target.value)} placeholder="비고" rows={4} />
          </CardBody>
        </Card>
        <div className={styles.footerActions}>
          <Button variant="secondary" onClick={() => navigate(ROUTES.PROFIT)}>취소</Button>
          <Button variant="secondary" onClick={handleTempSave}>임시저장</Button>
          <Button onClick={handleSubmit}>저장/상신</Button>
        </div>
      </div>
    </PageShell>
  );
}
