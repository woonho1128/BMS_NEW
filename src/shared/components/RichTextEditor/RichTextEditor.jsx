import React, { useRef, useEffect, useState } from 'react';
import { classnames } from '../../utils/classnames';
import styles from './RichTextEditor.module.css';

/**
 * 공통 리치 텍스트 에디터 컴포넌트 (contentEditable 기반)
 * @param {{
 *   value?: string;
 *   onChange?: (html: string) => void;
 *   placeholder?: string;
 *   className?: string;
 *   label?: string;
 *   error?: string;
 *   disabled?: boolean;
 *   minHeight?: number;
 *   maxHeight?: number;
 * }}
 */
export function RichTextEditor({
  value = '',
  onChange,
  placeholder = '내용을 입력하세요',
  className,
  label,
  error,
  disabled = false,
  minHeight = 150,
  maxHeight = 400,
}) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFormat = (command, formatValue = null) => {
    if (disabled) return;
    document.execCommand(command, false, formatValue);
    editorRef.current?.focus();
    handleInput();
  };

  const handleLink = () => {
    if (disabled) return;
    const url = window.prompt('링크 URL을 입력하세요', 'https://');
    if (url) {
      document.execCommand('createLink', false, url);
      editorRef.current?.focus();
      handleInput();
    }
  };

  const handleImage = () => {
    if (disabled) return;
    const url = window.prompt('이미지 URL을 입력하세요', 'https://');
    if (url) {
      document.execCommand('insertImage', false, url);
      editorRef.current?.focus();
      handleInput();
    }
  };

  const handleTable = () => {
    if (disabled) return;
    const rows = parseInt(window.prompt('행 수', '3'), 10) || 3;
    const cols = parseInt(window.prompt('열 수', '3'), 10) || 3;
    const r = Math.min(Math.max(rows, 1), 10);
    const c = Math.min(Math.max(cols, 1), 10);
    let tableHtml = '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse;"><tbody>';
    for (let i = 0; i < r; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < c; j++) tableHtml += '<td>&nbsp;</td>';
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p></p>';
    document.execCommand('insertHTML', false, tableHtml);
    editorRef.current?.focus();
    handleInput();
  };

  const editorId = `rich-text-editor-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={classnames(styles.wrapper, className)}>
      {label && (
        <label htmlFor={editorId} className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={classnames(
          styles.editorWrapper,
          isFocused && styles.editorWrapperFocused,
          error && styles.editorWrapperError,
          disabled && styles.editorWrapperDisabled
        )}
      >
        {!disabled && (
          <div className={styles.toolbar}>
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={() => handleFormat('bold')}
              title="굵게"
              aria-label="굵게"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={() => handleFormat('italic')}
              title="기울임"
              aria-label="기울임"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={() => handleFormat('underline')}
              title="밑줄"
              aria-label="밑줄"
            >
              <u>U</u>
            </button>
            <div className={styles.toolbarDivider} />
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={() => handleFormat('insertUnorderedList')}
              title="글머리 기호"
              aria-label="글머리 기호"
            >
              •
            </button>
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={() => handleFormat('insertOrderedList')}
              title="번호 매기기"
              aria-label="번호 매기기"
            >
              1.
            </button>
            <div className={styles.toolbarDivider} />
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={() => handleFormat('formatBlock', '<p>')}
              title="일반"
              aria-label="일반"
            >
              P
            </button>
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={() => handleFormat('formatBlock', '<h3>')}
              title="제목"
              aria-label="제목"
            >
              H
            </button>
            <div className={styles.toolbarDivider} />
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={handleLink}
              title="링크"
              aria-label="링크"
            >
              🔗
            </button>
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={handleImage}
              title="이미지"
              aria-label="이미지"
            >
              🖼
            </button>
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={handleTable}
              title="표"
              aria-label="표 삽입"
            >
              ▦
            </button>
          </div>
        )}
        <div
          id={editorId}
          ref={editorRef}
          className={styles.editor}
          contentEditable={!disabled}
          onInput={handleInput}
          onBlur={() => {
            setIsFocused(false);
            handleInput();
          }}
          onFocus={() => setIsFocused(true)}
          data-placeholder={placeholder}
          suppressContentEditableWarning
          style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
        />
      </div>
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
