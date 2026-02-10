/**
 * 어음 조회 API (Mock)
 */

import { BILLS_MOCK } from '../data/billsMock';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function inRange(date, from, to) {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

/**
 * @param {{ partnerId: string; criteria: 'issueDate'|'dueDate'; from?: string; to?: string }} params
 * @returns {Promise<{ rows: Array<any>; totalCount: number; totalAmount: number }>}
 */
export async function fetchBills({ partnerId, criteria, from, to }) {
  await delay(180);
  const pid = String(partnerId || '');
  if (!pid) return { rows: [], totalCount: 0, totalAmount: 0 };

  const key = criteria === 'dueDate' ? 'dueDate' : 'issueDate';
  const rows = BILLS_MOCK.filter((r) => r.partnerId === pid).filter((r) => inRange(r[key], from, to));
  const totalAmount = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  return { rows, totalCount: rows.length, totalAmount };
}

