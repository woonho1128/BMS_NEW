import React from 'react';
import styles from './WidgetCatalog.module.css';

/**
 * 위젯 카탈로그 — 우측에서 슬라이드인 패널
 * 대시보드에 아직 추가되지 않은 위젯 목록을 보여줌
 */
export function WidgetCatalog({ isOpen, availableWidgets, onAdd, onClose }) {
    return (
        <>
            {/* 배경 딤 */}
            {isOpen && <div className={styles.backdrop} onClick={onClose} />}

            {/* 슬라이드 패널 */}
            <aside className={`${styles.panel} ${isOpen ? styles.open : ''}`} aria-label="위젯 카탈로그">
                <div className={styles.header}>
                    <span className={styles.title}>위젯 추가</span>
                    <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">✕</button>
                </div>

                <div className={styles.body}>
                    {availableWidgets.length === 0 ? (
                        <p className={styles.empty}>추가할 수 있는 위젯이 없습니다.<br />모든 위젯이 대시보드에 배치되었습니다.</p>
                    ) : (
                        <ul className={styles.list}>
                            {availableWidgets.map((w) => (
                                <li key={w.id} className={styles.item}>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemIcon}>{w.icon}</span>
                                        <div>
                                            <div className={styles.itemLabel}>{w.label}</div>
                                            <div className={styles.itemDesc}>{w.description}</div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.addBtn}
                                        onClick={() => { onAdd(w.id); }}
                                    >
                                        + 추가
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>
        </>
    );
}
