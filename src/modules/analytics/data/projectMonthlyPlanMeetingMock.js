export const MONTH_KEYS = Array.from({ length: 12 }, (_, idx) => `m${idx + 1}`);

export const CATEGORY_TYPES = [
  '국내S/W',
  'OEM',
  '상품',
  '수전',
  '비데(금액)-일체형',
  '비데(금액)-분리형',
  '비데(수량)-일체형',
  '비데(수량)-분리형',
];

export const PERSON_NAMES = ['김현우', '박소연', '이동건', '최지현', '정하린', '강유진'];

function monthSeed(personIndex, typeIndex, monthIndex) {
  return (personIndex + 1) * 97 + (typeIndex + 1) * 41 + (monthIndex + 1) * 19;
}

function createMonthlyPlan(personIndex, typeIndex) {
  const plan = {};
  let total = 0;
  MONTH_KEYS.forEach((monthKey, monthIndex) => {
    const seed = monthSeed(personIndex, typeIndex, monthIndex);
    let value = 0;
    if (typeIndex <= 3) {
      value = 800 + (seed % 4200);
    } else if (typeIndex <= 5) {
      value = 300 + (seed % 2200);
    } else {
      value = 15 + (seed % 85);
    }
    plan[monthKey] = value;
    total += value;
  });
  plan.total = total;
  return plan;
}

function sumPlans(rows) {
  const summed = { total: 0 };
  MONTH_KEYS.forEach((key) => {
    summed[key] = rows.reduce((acc, row) => acc + Number(row.plan[key] || 0), 0);
  });
  summed.total = rows.reduce((acc, row) => acc + Number(row.plan.total || 0), 0);
  return summed;
}

export function createProjectMonthlyPlanRows() {
  const rows = [];
  PERSON_NAMES.forEach((name, personIndex) => {
    const personRows = CATEGORY_TYPES.map((type, typeIndex) => ({
      id: `p${personIndex + 1}-${typeIndex + 1}`,
      name: typeIndex === 0 ? name : '',
      type,
      isTotal: false,
      plan: createMonthlyPlan(personIndex, typeIndex),
    }));

    rows.push(...personRows);
    rows.push({
      id: `p${personIndex + 1}-sum`,
      name: '',
      type: '합계',
      isTotal: true,
      plan: sumPlans(personRows),
    });
  });
  return rows;
}
