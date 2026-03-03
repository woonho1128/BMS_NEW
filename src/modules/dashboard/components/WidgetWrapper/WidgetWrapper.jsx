import React from 'react';
import styles from './WidgetWrapper.module.css';

/**
 * 위젯 래퍼 — 편집 모드일 때 드래그 핸들, 크기 토글, 제거 버튼 오버레이
 * @param {string} id
 * @param {'half'|'full'} size
 * @param {boolean} isEditing
 * @param {boolean} isDragOver  - 다른 위젯이 이 위젯 위로 드래그 중
 * @param {boolean} isDragging  - 이 위젯이 드래그 중
 * @param {function} onResize
 * @param {function} onRemove
 * @param {function} onDragStart
 * @param {function} onDragOver
 * @param {function} onDragLeave
 * @param {function} onDrop
 */
export function WidgetWrapper({
    id,
    size,
    isEditing,
    isDragOver,
    isDragging,
    onResize,
    onRemove,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    children,
}) {
    const cls = [
        styles.wrapper,
        size === 'full' ? styles.full : styles.half,
        isEditing ? styles.editing : '',
        isDragOver ? styles.dragOver : '',
        isDragging ? styles.dragging : '',
    ].filter(Boolean).join(' ');

    return (
        <div
            className={cls}
            draggable={isEditing}
            onDragStart={isEditing ? onDragStart : undefined}
            onDragOver={isEditing ? onDragOver : undefined}
            onDragLeave={isEditing ? onDragLeave : undefined}
            onDrop={isEditing ? onDrop : undefined}
        >
            {/* 편집 모드 컨트롤 오버레이 */}
            {isEditing && (
                <div className={styles.controls}>
                    {/* 드래그 핸들 */}
                    <span className={styles.handle} title="드래그하여 이동">⠿</span>

                    {/* 위젯 크기 토글 */}
                    <button
                        type="button"
                        className={styles.ctrlBtn}
                        onClick={onResize}
                        title={size === 'full' ? '절반 너비로 변경' : '전체 너비로 변경'}
                    >
                        {size === 'full' ? '½' : '⬛'}
                    </button>

                    {/* 위젯 제거 */}
                    <button
                        type="button"
                        className={`${styles.ctrlBtn} ${styles.removeBtn}`}
                        onClick={onRemove}
                        title="위젯 제거"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* 위젯 콘텐츠 */}
            <div className={isEditing ? styles.content : undefined}>
                {children}
            </div>
        </div>
    );
}
