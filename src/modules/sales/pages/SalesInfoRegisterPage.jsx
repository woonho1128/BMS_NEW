import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { notify } from '../../../shared/utils/notify';
import styles from './SalesInfoRegisterPage.module.css';

export function SalesInfoRegisterPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <PageShell path={ROUTES.SALES_INFO} title="영업정보 등록">
      <div className={styles.page}>
        <Card title="기본 정보">
          <CardBody className={styles.form}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="내용" />
          </CardBody>
        </Card>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => navigate(ROUTES.SALES_INFO)}>취소</Button>
          <Button
            onClick={() => {
              notify.success('영업정보가 저장되었습니다. (목업)');
              navigate(ROUTES.SALES_INFO);
            }}
          >
            저장
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
