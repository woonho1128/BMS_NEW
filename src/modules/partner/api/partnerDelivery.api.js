/**
 * 대리점 출고정보 API (Mock)
 */

import { PARTNER_SHIPMENTS_MOCK } from '../data/partnerDeliveryMock';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function inRange(date, from, to) {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function computeVatType(shipment) {
  // Mock 규칙: 직송=과세, 택배=면세 (필요 시 실제 모델로 교체)
  if (shipment?.shipType === '직송') return '과세';
  return '면세';
}

function computeAmount(shipment) {
  // Mock 규칙: 품목/수량 기반 임의 금액 산출
  const qty = Number(shipment?.qty) || 0;
  const unit = shipment?.item?.includes('타일') ? 12000 : shipment?.item?.includes('벽지') ? 8000 : 10000;
  return qty * unit;
}

function computeSalesGroup(shipment) {
  // Mock 규칙: partnerId 기준 임의 그룹
  if (String(shipment?.partnerId) === '1') return '영업1그룹';
  if (String(shipment?.partnerId) === '2') return '영업2그룹';
  return '영업그룹';
}

/**
 * @param {{ partnerId: string; year: number }} params
 * @returns {Promise<{ rows: Array<{ shipYm: string; partnerName: string; shipType: string; vatType: string; amount: number; vat: number; total: number }>; totalCount: number; totalAmount: number; totalVat: number; totalSum: number }>}
 */
export async function fetchPartnerMonthlyDelivery({ partnerId, year }) {
  await delay(160);
  const pid = String(partnerId || '');
  const yy = Number(year);
  if (!pid || !Number.isFinite(yy)) return { rows: [], totalCount: 0, totalAmount: 0, totalVat: 0, totalSum: 0 };

  const shipments = PARTNER_SHIPMENTS_MOCK.filter((s) => s.partnerId === pid).filter((s) => s.date?.startsWith(`${yy}-`));
  const byKey = new Map();
  shipments.forEach((s) => {
    const shipYm = s.date.slice(0, 7); // YYYY-MM
    const shipType = s.shipType || '-';
    const vatType = computeVatType(s);
    const key = `${shipYm}__${shipType}__${vatType}`;
    const amount = computeAmount(s);
    const vat = vatType === '과세' ? Math.round(amount * 0.1) : 0;
    const total = amount + vat;
    const prev =
      byKey.get(key) || {
        shipYm,
        partnerName: '', // 페이지에서 주입
        shipType,
        vatType,
        amount: 0,
        vat: 0,
        total: 0,
      };
    prev.amount += amount;
    prev.vat += vat;
    prev.total += total;
    byKey.set(key, prev);
  });

  const rows = Array.from(byKey.values()).sort((a, b) => (a.shipYm < b.shipYm ? 1 : a.shipYm > b.shipYm ? -1 : 0));
  const totalCount = rows.length;
  const totalAmount = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalVat = rows.reduce((sum, r) => sum + (Number(r.vat) || 0), 0);
  const totalSum = rows.reduce((sum, r) => sum + (Number(r.total) || 0), 0);
  return { rows, totalCount, totalAmount, totalVat, totalSum };
}

/**
 * @param {{
 *   partnerId: string;
 *   factory?: string;
 *   shipType?: string;
 *   shipStatus?: string;
 *   from?: string;
 *   to?: string;
 * }} params
 * @returns {Promise<{ rows: Array<any>; totalCount: number; totalQty: number; totalAmount: number }>}
 */
export async function fetchPartnerShipmentStatus({ partnerId, factory, shipType, shipStatus, from, to }) {
  await delay(180);
  const pid = String(partnerId || '');
  if (!pid) return { rows: [], totalCount: 0, totalQty: 0, totalAmount: 0 };

  let rows = PARTNER_SHIPMENTS_MOCK.filter((s) => s.partnerId === pid);
  if (factory) rows = rows.filter((s) => s.factory === factory);
  if (shipType) rows = rows.filter((s) => s.shipType === shipType);
  if (shipStatus && shipStatus !== '전체') rows = rows.filter((s) => s.status === shipStatus);
  rows = rows.filter((s) => inRange(s.date, from, to));

  rows = rows.map((r) => ({
    ...r,
    salesGroup: computeSalesGroup(r),
    factoryCategory: r.factory, // 요구 컬럼: 공장구분
    amount: computeAmount(r),
  }));

  const totalCount = rows.length;
  const totalQty = rows.reduce((sum, s) => sum + (Number(s.qty) || 0), 0);
  const totalAmount = rows.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  return { rows, totalCount, totalQty, totalAmount };
}

