import React from 'react';
import { classnames } from '../../utils/classnames';
import styles from './ListFilter.module.css';

/**
 * 필터 필드 설정
 * @typedef {Object} FilterField
 * @property {string} id - 필드 키 (value[id])
 * @property {string} label - 라벨
 * @property {'text'|'select'|'date'|'checkbox'|'dateRange'|'radio'} type
 * @property {number} [row=0] - 행 인덱스 (0, 1, ...)
 * @property {string} [placeholder]
 * @property {boolean} [wide] - 입력 폭 넓게
 * @property {boolean} [disabled] - 입력 비활성화
 * @property {number|string} [width] - 입력 폭(px 또는 CSS width 값)
 * @property {Array<{value: string, label: string}>} [options] - select용
 * @property {string} [showWhen] - value[showWhen]이 있을 때만 표시
 * @property {string} [fromKey] - dateRange일 때 시작일 value 키
 * @property {string} [toKey] - dateRange일 때 종료일 value 키
 */

/**
 * 공통 목록 필터 UI. 설정(필드 목록)만 바꿔서 sales/info, profit 등에서 재사용.
 * @param {Object} props
 * @param {FilterField[]} props.fields - 필터 필드 설정
 * @param {Record<string, any>} props.value - 필드값 객체
 * @param {(id: string, value: any) => void} props.onChange
 * @param {() => void} props.onReset
 * @param {() => void} [props.onSearch] - 있으면 검색 버튼 표시
 * @param {string} [props.searchLabel] - 검색 버튼 라벨 (기본: '검색')
 * @param {boolean} [props.searchDisabled] - 검색 버튼 비활성화
 * @param {boolean} [props.showReset] - 초기화 버튼 표시 (기본: true)
 * @param {React.ReactNode} [props.actionsAddon] - 우측 액션 영역 추가 노드
 * @param {() => void} [props.onKeyDownEnter] - Enter 시 동작 (보통 검색/페이지 1)
 * @param {string} [props.className]
 */
export function ListFilter({
  fields,
  value,
  onChange,
  onReset,
  onSearch,
  searchLabel = '검색',
  searchDisabled = false,
  showReset = true,
  actionsAddon,
  onKeyDownEnter,
  className,
}) {
  const byRow = React.useMemo(() => {
    const map = new Map();
    fields.forEach((f) => {
      const row = f.row ?? 0;
      if (!map.has(row)) map.set(row, []);
      map.get(row).push(f);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [fields]);

  const renderField = (field) => {
    if (field.showWhen != null && !value[field.showWhen]) return null;
    const val = value[field.id];
    const widthStyle = field.width != null ? { width: typeof field.width === 'number' ? `${field.width}px` : field.width } : undefined;
    const commonInputProps = {
      'aria-label': field.label,
      className: classnames(
        field.type === 'text' || field.type === 'date' ? styles.filterInput : styles.filterSelect,
        field.wide && styles.filterInputWide
      ),
      disabled: Boolean(field.disabled),
      style: widthStyle,
    };

    if (field.type === 'text') {
      return (
        <input
          type="text"
          {...commonInputProps}
          placeholder={field.placeholder}
          value={val ?? ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          onKeyDown={onKeyDownEnter ? (e) => { if (e.key === 'Enter') onKeyDownEnter(); } : undefined}
        />
      );
    }
    if (field.type === 'select') {
      return (
        <select
          {...commonInputProps}
          value={val ?? ''}
          onChange={(e) => onChange(field.id, e.target.value)}
        >
          {(field.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }
    if (field.type === 'radio') {
      return (
        <div className={styles.radioGroup} style={widthStyle}>
          {(field.options || []).map((opt) => (
            <label key={opt.value} className={styles.radio}>
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                checked={String(val ?? '') === String(opt.value)}
                onChange={() => onChange(field.id, opt.value)}
                disabled={Boolean(field.disabled)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      );
    }
    if (field.type === 'date') {
      return (
        <input
          type="date"
          {...commonInputProps}
          value={val ?? ''}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      );
    }
    if (field.type === 'checkbox') {
      return (
        <label className={styles.filterItem}>
          <input
            type="checkbox"
            className={styles.filterCheckbox}
            checked={Boolean(val)}
            onChange={(e) => onChange(field.id, e.target.checked)}
            aria-label={field.label}
            disabled={Boolean(field.disabled)}
          />
          <span className={styles.filterLabel}>{field.label}</span>
        </label>
      );
    }
    if (field.type === 'dateRange' && field.showWhen != null && !value[field.showWhen]) return null;
    if (field.type === 'dateRange') {
      const fromKey = field.fromKey || 'dateFrom';
      const toKey = field.toKey || 'dateTo';
      return (
        <>
          <span className={styles.filterLabel}>{field.label || '기간'}</span>
          <input
            type="date"
            className={styles.filterInput}
            value={value[fromKey] ?? ''}
            onChange={(e) => onChange(fromKey, e.target.value)}
            aria-label="시작일"
          />
          <span className={styles.filterLabel}>~</span>
          <input
            type="date"
            className={styles.filterInput}
            value={value[toKey] ?? ''}
            onChange={(e) => onChange(toKey, e.target.value)}
            aria-label="종료일"
          />
        </>
      );
    }
    return null;
  };

  return (
    <div className={classnames(styles.toolbar, className)}>
      {byRow.map(([rowIndex, rowFields]) => (
        <div key={rowIndex} className={styles.filters}>
          {rowFields.map((field) => {
            if (field.type === 'checkbox') {
              return <React.Fragment key={field.id}>{renderField(field)}</React.Fragment>;
            }
            if (field.type === 'dateRange') {
              const visible = field.showWhen == null || value[field.showWhen];
              if (!visible) return null;
              return (
                <div key={field.id || 'dateRange'} className={styles.filterItem}>
                  {renderField(field)}
                </div>
              );
            }
            return (
              <div key={field.id} className={styles.filterItem}>
                <span className={styles.filterLabel}>{field.label}</span>
                {renderField(field)}
              </div>
            );
          })}
          {Number(rowIndex) === byRow.length - 1 && (
            <div className={styles.filterActions}>
              {onSearch && (
                <button type="button" className={styles.searchBtn} onClick={onSearch} disabled={searchDisabled}>
                  {searchLabel}
                </button>
              )}
              {showReset && (
                <button type="button" className={styles.resetBtn} onClick={onReset}>
                  초기화
                </button>
              )}
              {actionsAddon}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
