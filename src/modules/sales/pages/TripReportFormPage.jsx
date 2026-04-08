import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { notify } from '../../../shared/utils/notify';
import tripStyles from './TripReportFormPage.module.css';

export function TripReportFormPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <PageShell path={ROUTES.SALES_REPORT} title="출장보고 등록">
      <div className={tripStyles.page}>
        <Card title="출장 기본 정보" className={tripStyles.basicInfoCard}>
          <CardBody className={tripStyles.basicInfoGrid}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="출장 내용" />
          </CardBody>
        </Card>
        <div className={tripStyles.footerActions}>
          <Button variant="secondary" onClick={() => navigate(ROUTES.SALES_REPORT)}>취소</Button>
          <Button
            variant="secondary"
            onClick={() => {
              notify.info('출장보고가 임시저장되었습니다. (목업)');
              navigate(ROUTES.SALES_REPORT);
            }}
          >
            임시저장
          </Button>
          <Button onClick={() => notify.success('결재요청이 등록되었습니다. (목업)')}>결재요청</Button>
        </div>
      </div>
    </PageShell>
  );
}
