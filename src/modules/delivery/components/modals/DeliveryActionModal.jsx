import React from 'react';
import styles from './DeliveryActionModal.module.css';

export const DeliveryActionModal = ({ row, onClose, onPartial, onComplete }) => {
    if (!row) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>납품 처리 선택</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.content}>
                    <p className={styles.description}>
                        <strong>{row.site}</strong> 현장의 <strong>{row.item1}</strong> 품목에 대해 어떤 처리를 하시겠습니까?
                    </p>

                    <div className={styles.buttonGroup}>
                        <button
                            className={`${styles.actionButton} ${styles.partialButton}`}
                            onClick={() => {
                                onPartial(row);
                                onClose();
                            }}
                        >
                            <div className={styles.icon}>📦</div>
                            <div className={styles.btnText}>
                                <span className={styles.btnTitle}>부분 납품</span>
                                <span className={styles.btnDesc}>수량과 날짜를 입력하여<br />일부 물량만 납품 처리합니다.</span>
                            </div>
                        </button>

                        <button
                            className={`${styles.actionButton} ${styles.completeButton}`}
                            onClick={() => {
                                onComplete(row);
                                onClose();
                            }}
                        >
                            <div className={styles.icon}>✅</div>
                            <div className={styles.btnText}>
                                <span className={styles.btnTitle}>납품 완료</span>
                                <span className={styles.btnDesc}>모든 물량이 납품되었음을<br />확인하고 완료 처리합니다.</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
