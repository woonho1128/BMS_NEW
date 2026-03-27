import React, { useEffect, useRef, useState } from 'react';
import styles from './CostPage.module.css';

export function EditableCell({
  value,
  rowId,
  colKey,
  isSelected,
  isEditing,
  align,
  formatter,
  onSelect,
  onChange,
  onStartEdit,
  onStopEdit,
  onMove,
  applyToSelected,
}) {
  const [draft, setDraft] = useState(value ?? '');
  const inputRef = useRef(null);

  useEffect(() => {
    setDraft(value ?? '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commit = () => {
    onChange(rowId, colKey, draft);
    onStopEdit();
  };

  const cancel = () => {
    setDraft(value ?? '');
    onStopEdit();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onChange(rowId, colKey, draft);
      if (e.ctrlKey || e.metaKey) {
        applyToSelected(colKey, draft, rowId);
      }
      onMove('down', rowId, colKey);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      onChange(rowId, colKey, draft);
      onMove(e.shiftKey ? 'left' : 'right', rowId, colKey);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      commit();
      onMove('up', rowId, colKey);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      commit();
      onMove('down', rowId, colKey);
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      commit();
      onMove('left', rowId, colKey);
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      commit();
      onMove('right', rowId, colKey);
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  const displayText = formatter ? formatter(value) : value;

  return (
    <div
      className={`${styles.editableDisplay} ${isSelected ? styles.cellSelected : ''} ${align === 'right' ? styles.alignRight : ''} ${align === 'center' ? styles.alignCenter : ''}`}
      onClick={() => onSelect(rowId, colKey)}
      onDoubleClick={() => onStartEdit(rowId, colKey)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isEditing && (e.key === 'Enter' || e.key === 'F2')) {
          e.preventDefault();
          onStartEdit(rowId, colKey);
        }
      }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className={`${styles.editInput} ${align === 'right' ? styles.alignRight : ''}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        displayText
      )}
    </div>
  );
}
