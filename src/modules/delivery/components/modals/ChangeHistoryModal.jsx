import React, { useState } from 'react';
import styles from './Modal.module.css';

export const ChangeHistoryModal = ({ row, field, oldValue, newValue, onClose, onSave }) => {
    const [reason, setReason] = useState('');

    const handleSave = () => {
        if (!reason) return;
        onSave(row.id, field, newValue, reason);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>변경 이력 입력</h3>
                <div className={styles.content}>
                    <div className={styles.field}>
                        <span className={styles.label}>항목</span>
                        <div className={styles.info}>{field}</div>
                    </div>
                    <div className={styles.field}>
                        <span className={styles.label}>변경 전</span>
                        <div className={styles.info}>{oldValue}</div>
                    </div>
                    <div className={styles.field}>
                        <span className={styles.label}>변경 후</span>
                        <div className={styles.info}>{newValue}</div>
                    </div>
                    <div className={styles.field}>
                        <span className={styles.label}>변경 사유</span>
                        <textarea
                            className={styles.textarea}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="변경 사유를 입력하세요"
                        />
                    </div>
                </div>
                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>취소</button>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={!reason}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};
