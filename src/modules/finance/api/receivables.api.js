/**
 * 채권/채무 현황 API (Mock)
 * - 실제 연동 시 GET /api/finance/receivables 등으로 교체
 */

import { RECEIVABLES_MOCK } from '../data/receivablesMock';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function ymString(year, month) {
  const mm = String(month).padStart(2, '0');
  return `${year}-${mm}`;
}

function computeRow(raw) {
  const receivableThisMonth = (raw.prevReceivable ?? 0) + (raw.salesThisMonth ?? 0) - (raw.depositThisMonth ?? 0);
  const creditLimit = (raw.tradeLimit ?? 0) - receivableThisMonth - (raw.unpaidBill ?? 0);
  return {
    ...raw,
    receivableThisMonth,
    creditLimit,
  };
}

/**
 * @param {{ partnerId: string; year: number; month: number }} params
 * @returns {Promise<{ partnerId: string; baseYm: string; carryOver: number; rows: Array<any> }>}
 */
export async function fetchReceivablesStatus({ partnerId, year, month }) {
  await delay(220);

  const entry = RECEIVABLES_MOCK.find((e) => e.partnerId === String(partnerId) && e.year === Number(year) && e.month === Number(month));
  const baseYm = ymString(year, month);

  if (!entry) {
    return { partnerId: String(partnerId), baseYm, carryOver: 0, rows: [] };
  }

  return {
    partnerId: String(partnerId),
    baseYm,
    carryOver: entry.carryOver ?? 0,
    rows: (entry.rows || []).map((r) => computeRow({ ...r, baseYm })),
  };
}

