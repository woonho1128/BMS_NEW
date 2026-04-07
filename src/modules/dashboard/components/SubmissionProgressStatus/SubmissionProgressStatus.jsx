import React, { useMemo } from 'react';
import { Card } from '../../../../shared/components/Card';
import styles from './SubmissionProgressStatus.module.css';

const DATA_BY_SCOPE = {
  PROJECT_MENU: [
    { id: 'REQ-PJ-041', title: '제주 신선고 기숙사 1', stage: '2차 결재 진행', updatedAt: '오늘 09:10' },
    { id: 'REQ-PJ-037', title: '제주 미지정 현장 2', stage: '1차 승인 완료', updatedAt: '오늘 08:25' },
    { id: 'REQ-PJ-033', title: '제주 신선고 기숙사 3', stage: '상신 완료', updatedAt: '어제 16:40' },
  ],
  RETAIL_MENU: [
    { id: 'REQ-RT-021', title: '단납 현장 등록 상신', stage: '1차 결재 진행', updatedAt: '오늘 10:02' },
    { id: 'REQ-RT-018', title: '여신/수금 조건 변경 요청', stage: '상신 완료', updatedAt: '오늘 08:51' },
    { id: 'REQ-RT-013', title: 'KPI 계획 대비 실적 조정', stage: '반려 후 재상신', updatedAt: '어제 17:22' },
  ],
};

export function SubmissionProgressStatus({ scope = 'RETAIL_MENU' }) {
  const items = useMemo(() => DATA_BY_SCOPE[scope] || DATA_BY_SCOPE.RETAIL_MENU, [scope]);
  const title = scope === 'PROJECT_MENU' ? '프로젝트 상신 진행 상태' : '리테일 상신 진행 상태';

  return (
    <Card title={title} indicatorColor="primary" variant="highlight">
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.main}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.meta}>{item.id}</p>
            </div>
            <div className={styles.right}>
              <span className={styles.badge}>{item.stage}</span>
              <span className={styles.date}>{item.updatedAt}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
