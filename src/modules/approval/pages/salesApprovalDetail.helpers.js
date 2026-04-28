import { formatNumber } from '../../../shared/utils/formatters';
import { APPROVAL_STATUS } from '../data/salesApprovalMock';

export const STATUS_LABEL = {
  [APPROVAL_STATUS.PENDING]: '결재 진행',
  [APPROVAL_STATUS.APPROVED]: '결재 완료',
  [APPROVAL_STATUS.REJECTED]: '결재 반려',
};

export function formatNum(value) {
  return formatNumber(value);
}

export function toMonthWeekLabel(report) {
  const weekLabel = String(report?.weekLabel || '');
  const alreadyKo = weekLabel.match(/(\d{4})년\s*(\d{1,2})월\s*(\d)주차/);
  if (alreadyKo) return `${alreadyKo[1]}년 ${Number(alreadyKo[2])}월 ${Number(alreadyKo[3])}주차`;

  const periodLabel = String(report?.periodLabel || '');
  const match = periodLabel.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const firstDayOffset = (new Date(year, month - 1, 1).getDay() + 6) % 7;
    const week = Math.floor((day + firstDayOffset - 1) / 7) + 1;
    return `${year}년 ${month}월 ${week}주차`;
  }

  const codeMatch = String(report?.period || '').match(/^(\d{4})-W(\d{1,2})$/);
  if (codeMatch) return `${codeMatch[1]}년 ${Number(codeMatch[2])}주차`;
  return report?.period || '-';
}
