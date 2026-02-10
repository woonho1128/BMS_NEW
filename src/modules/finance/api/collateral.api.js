/**
 * 담보 조회 API (Mock)
 */

import { COLLATERAL_MOCK } from '../data/collateralMock';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {{ partnerId: string; year: number; status?: string }} params
 * @returns {Promise<{ rows: Array<any>; totalCount: number }>}
 */
export async function fetchCollateral({ partnerId, year, status }) {
  await delay(180);
  const pid = String(partnerId || '');
  if (!pid) return { rows: [], totalCount: 0 };

  const yy = Number(year);
  const rows = COLLATERAL_MOCK
    .filter((r) => r.partnerId === pid)
    .filter((r) => (Number.isFinite(yy) ? r.year === yy : true))
    .filter((r) => (!status || status === '전체' ? true : r.status === status));

  return { rows, totalCount: rows.length };
}

