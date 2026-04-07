/**
 * Monthly plan meeting mock utilities.
 * Keeps page component lean and allows reuse when API is introduced.
 */

export const METRIC_LABELS = ['도소매', '납품', '합계'];
export const CATEGORY_TYPES = ['S/W', 'OEM', '상품', '수전', '비데'];
export const PERSON_NAMES = ['유승식', '최윤한', '박진오', '김혜림', '박동현', '정하림', '김지훈', '이선희', '오현우', '강유진'];
export const ZERO_METRICS = { retail: 0, delivery: 0, total: 0 };

function createPlanBySeed(seed) {
  const retail = 8 + (seed * 9) % 140;
  const delivery = (seed * 13) % 420 < 180 ? 0 : 12 + (seed * 7) % 360;
  return { retail, delivery, total: retail + delivery };
}

export function createInitialRows() {
  const rows = [];
  PERSON_NAMES.forEach((name, personIndex) => {
    const personRows = CATEGORY_TYPES.map((type, typeIndex) => {
      const plan = createPlanBySeed((personIndex + 1) * 10 + typeIndex + 1);
      return {
        id: `p${personIndex + 1}-${typeIndex + 1}`,
        name: typeIndex === 0 ? name : '',
        type,
        isTotal: false,
        plan,
        actual: { ...ZERO_METRICS },
        rounds: {},
      };
    });

    const subtotal = personRows.reduce(
      (acc, row) => ({
        retail: acc.retail + row.plan.retail,
        delivery: acc.delivery + row.plan.delivery,
        total: acc.total + row.plan.total,
      }),
      { retail: 0, delivery: 0, total: 0 }
    );

    rows.push(...personRows);
    rows.push({
      id: `p${personIndex + 1}-sum`,
      name: '',
      type: '계',
      isTotal: true,
      plan: subtotal,
      actual: { ...ZERO_METRICS },
      rounds: {},
    });
  });
  return rows;
}

export function createRandomActual(plan, seed) {
  const retailRate = 0.68 + ((seed * 7) % 47) / 100;
  const deliveryRate = 0.62 + ((seed * 11) % 51) / 100;
  const retail = Math.round(plan.retail * retailRate);
  const delivery = Math.round(plan.delivery * deliveryRate);
  return { retail, delivery, total: retail + delivery };
}

export function toDateString(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
