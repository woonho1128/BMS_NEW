import { Suspense } from 'react';
import { Button } from '../../../../shared/components/Button/Button';
import { Modal } from '../../../../shared/components/Modal/Modal';
import { classnames } from '../../../../shared/utils/classnames';
import styles from '../PartnerRegisterPage.module.css';

export function PartnerRegisterFooterActions({
  isDetailMode,
  isEditMode,
  handleStartEditMode,
  handleOpenHistory,
  navigate,
  handleReset,
  handleSubmit,
}) {
  return (
    <div className={styles.footer}>
      {isDetailMode && !isEditMode && (
        <Button
          variant="primary"
          className={classnames(styles.allowAction, styles.editModeButton)}
          onClick={handleStartEditMode}
        >
          수정하기
        </Button>
      )}
      {isDetailMode && (
        <Button variant="secondary" className={styles.allowAction} onClick={handleOpenHistory}>
          수정 이력
        </Button>
      )}
      <Button variant="secondary" className={isDetailMode ? styles.allowAction : undefined} onClick={() => navigate('/master/partners')}>
        목록
      </Button>
      {(!isDetailMode || isEditMode) && <Button variant="secondary" onClick={handleReset}>초기화</Button>}
      {(!isDetailMode || isEditMode) && (
        <Button variant="primary" className={isDetailMode ? styles.saveEditButton : undefined} onClick={handleSubmit}>
          등록
        </Button>
      )}
    </div>
  );
}

export function PartnerRegisterHistoryModal({
  isDetailMode,
  historyModalOpen,
  setHistoryModalOpen,
  selectedPartnerDetail,
  formData,
  editHistoryRows,
  EditHistoryModalContent,
}) {
  if (!isDetailMode) return null;
  return (
    <Modal
      open={historyModalOpen}
      onClose={() => setHistoryModalOpen(false)}
      title={`${selectedPartnerDetail?.name || formData.basic.companyName || '대리점'} 전체 수정 이력`}
      size="xl"
    >
      <Suspense fallback={<div style={{ padding: 12 }}>이력 불러오는 중...</div>}>
        <EditHistoryModalContent editHistoryRows={editHistoryRows} />
      </Suspense>
    </Modal>
  );
}
