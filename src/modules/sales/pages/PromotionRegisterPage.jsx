import React, { useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ROUTES } from '../../../router/routePaths';
import { notify } from '../../../shared/utils/notify';
import DiscountPromotionManageTab from './components/DiscountPromotionManageTab';
import { DEFAULT_PROMOTION_LABEL, DEFAULT_PROMOTION_ROWS } from './components/discountPromotionManage.helpers';
import styles from './DiscountPromotionPage.module.css';

const cloneRows = (rows = []) => rows.map((row) => ({ ...row }));

export function PromotionRegisterPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [viewRows, setViewRows] = useState(() => cloneRows(DEFAULT_PROMOTION_ROWS));
  const [viewPromoLabel, setViewPromoLabel] = useState(DEFAULT_PROMOTION_LABEL);
  const [editRows, setEditRows] = useState(() => cloneRows(DEFAULT_PROMOTION_ROWS));
  const [editPromoLabel, setEditPromoLabel] = useState(DEFAULT_PROMOTION_LABEL);

  const enterRegisterMode = () => {
    setEditRows(cloneRows(viewRows));
    setEditPromoLabel(viewPromoLabel);
    setIsRegisterMode(true);
  };

  const exitToViewMode = () => {
    setEditRows(cloneRows(viewRows));
    setEditPromoLabel(viewPromoLabel);
    setIsRegisterMode(false);
  };

  const handleSave = ({ rows, promoLabel }) => {
    setViewRows(cloneRows(rows));
    setViewPromoLabel(promoLabel);
    setEditRows(cloneRows(rows));
    setEditPromoLabel(promoLabel);
    setIsRegisterMode(false);
    notify.success('프로모션이 저장되었습니다.');
  };

  const handleTempSave = ({ rows, promoLabel }) => {
    setEditRows(cloneRows(rows));
    setEditPromoLabel(promoLabel);
    notify.success('임시저장되었습니다.');
  };

  return (
    <PageShell
      path={ROUTES.SALES_PROMOTION_REGISTER}
      className={`${styles.shellWide} ${styles.shellWideReport}`}
    >
      <div className={styles.page}>
        <div className={styles.promotionRegisterActions}>
          {isRegisterMode ? (
            <button type="button" className={styles.promoActionSecondary} onClick={exitToViewMode}>
              조회로 전환
            </button>
          ) : (
            <button type="button" className={styles.promoActionPrimary} onClick={enterRegisterMode}>
              등록
            </button>
          )}
        </div>

        <DiscountPromotionManageTab
          styles={styles}
          readOnly={!isRegisterMode}
          rows={isRegisterMode ? editRows : viewRows}
          promoLabel={isRegisterMode ? editPromoLabel : viewPromoLabel}
          onRowsChange={isRegisterMode ? setEditRows : undefined}
          onPromoLabelChange={isRegisterMode ? setEditPromoLabel : undefined}
          onSave={isRegisterMode ? handleSave : undefined}
          onCancel={isRegisterMode ? exitToViewMode : undefined}
          onTempSave={isRegisterMode ? handleTempSave : undefined}
        />
      </div>
    </PageShell>
  );
}
