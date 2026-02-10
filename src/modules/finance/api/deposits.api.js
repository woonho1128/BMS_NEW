/**
 * 입금내역 API (Mock)
 */

import { DEPOSITS_MOCK } from '../data/depositsMock';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {{ partnerId: string; year: number; month: number }} params
 * @returns {Promise<{ rows: Array<any>; totalAmount: number; totalCount: number }>}
 */
export async function fetchDeposits({ partnerId, year, month }) {
  await delay(180);
  const pid = String(partnerId || '');
  if (!pid) return { rows: [], totalAmount: 0, totalCount: 0 };

  const yy = Number(year);
  const mm = Number(month);
  const rows = DEPOSITS_MOCK.filter((r) => r.partnerId === pid).filter((r) => r.year === yy && r.month === mm);
  const totalAmount = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  return { rows, totalAmount, totalCount: rows.length };
}

