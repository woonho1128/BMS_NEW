import React from 'react';
import { formatNumber } from './discountPromotionManage.helpers';

export function NumericInput({ value, onChange, className, disabled = false }) {
  return (
    <input
      className={className}
      value={formatNumber(value)}
      disabled={disabled}
      onChange={(e) => {
        if (disabled) return;
        const next = Number(String(e.target.value).replaceAll(',', '')) || 0;
        onChange(next);
      }}
    />
  );
}

export default NumericInput;
