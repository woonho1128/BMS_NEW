const BASE_ROWS = [
  { itemCode: 'CC420PW', itemName: '원피스 양변기', currentStock: 620, avgMonthlySales: 180, qualitativeFactor: 1.0 },
  { itemCode: 'TFC420', itemName: '세면기 세트', currentStock: 310, avgMonthlySales: 140, qualitativeFactor: 1.1 },
  { itemCode: 'TSC417D', itemName: '비데 일체형', currentStock: 120, avgMonthlySales: 95, qualitativeFactor: 1.2 },
  { itemCode: 'BC110', itemName: '바트라 수전', currentStock: 980, avgMonthlySales: 210, qualitativeFactor: 0.9 },
  { itemCode: 'BC201V', itemName: '바트라 액세서리', currentStock: 440, avgMonthlySales: 130, qualitativeFactor: 1.0 },
  { itemCode: 'BC310', itemName: '수전 액세서리', currentStock: 90, avgMonthlySales: 80, qualitativeFactor: 1.3 },
  { itemCode: 'CCS213G1WHW', itemName: '원피스 절수형 양변기', currentStock: 260, avgMonthlySales: 72, qualitativeFactor: 1.0 },
  { itemCode: 'CCS213G4VHW', itemName: '원피스 절수형 양변기 V', currentStock: 180, avgMonthlySales: 64, qualitativeFactor: 1.1 },
  { itemCode: 'CCS214LZWHW', itemName: '원피스 양변기 L', currentStock: 55, avgMonthlySales: 48, qualitativeFactor: 1.4 },
  { itemCode: 'FT1209', itemName: '샤워 수전', currentStock: 420, avgMonthlySales: 90, qualitativeFactor: 1.0 },
];

export const DEMAND_FORECAST_ROWS = Array.from({ length: 30 }, (_, index) => {
  const base = BASE_ROWS[index % BASE_ROWS.length];
  const cycle = Math.floor(index / BASE_ROWS.length);
  return {
    id: `DF-${String(index + 1).padStart(3, '0')}`,
    itemCode: `${base.itemCode}-${cycle + 1}`,
    itemName: `${base.itemName} ${cycle + 1}`,
    currentStock: Math.max(20, Math.round(base.currentStock * (1 - cycle * 0.08) + (index % 5) * 12)),
    avgMonthlySales: Math.max(20, Math.round(base.avgMonthlySales * (1 + cycle * 0.06) + (index % 4) * 4)),
    qualitativeFactor: Number((base.qualitativeFactor + cycle * 0.05).toFixed(1)),
  };
});
