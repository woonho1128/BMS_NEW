import React from 'react';
import { notify } from '../../../../shared/utils/notify';
import styles from './SpecRegistrationModal.module.css';

export const SpecRegistrationModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const handleSave = () => {
    notify.success('SPEC이 등록되었습니다. (목업)');
    onSave?.({ id: Date.now(), company: 'DL건설', site: '샘플 현장' });
    onClose?.();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>SPEC 등록</h3>
          <button onClick={onClose}>닫기</button>
        </div>
        <div className={styles.body}>SPEC 등록 모달(목업)</div>
        <div className={styles.footer}>
          <button onClick={onClose}>취소</button>
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};
