export const PRICE_CATEGORY_TREE = [
  { major: '비데/양변기', middle: ['일체형비데', '일반양변기', '비데시트'] },
  { major: '세면/수전', middle: ['세면기', '샤워수전', '주방수전'] },
  { major: '배관/부속', middle: ['트랩', '밸브', '플랜지'] },
];

const COMPONENT_TEMPLATE = [
  { partName: '본체', codePrefix: 'BODY', ratio: 1 },
  { partName: '하부(도기)', codePrefix: 'BASE', ratio: 0.32 },
  { partName: '양부속', codePrefix: 'PART', ratio: 0.04 },
  { partName: '수로트랩', codePrefix: 'TRAP', ratio: 0.012 },
  { partName: '플랜지', codePrefix: 'FLNG', ratio: 0.004 },
  { partName: '앵글밸브', codePrefix: 'ANGL', ratio: 0.005 },
];

export function createProductComponents(seedCode, baseFactory) {
  return COMPONENT_TEMPLATE.map((template, index) => {
    const factoryPrice = Math.round(baseFactory * template.ratio);
    return {
      id: `${seedCode}-c-${index + 1}`,
      partName: template.partName,
      partCode: `${template.codePrefix}-${seedCode.slice(-4)}`,
      factoryPrice,
      consumerPrice: Math.round(factoryPrice * 1.3),
      packInfo: index < 2 ? (index === 0 ? '제천, 32' : '창원, 20') : '',
      remark: index === 2 || index === 3 ? '체결' : '',
    };
  });
}

export function buildPriceMockData(count = 4000) {
  const list = [];
  for (let index = 0; index < count; index += 1) {
    const category = PRICE_CATEGORY_TREE[index % PRICE_CATEGORY_TREE.length];
    const middle = category.middle[index % category.middle.length];
    const modelNo = 1000 + index;
    const seedCode = `DP${String(modelNo).padStart(4, '0')}`;
    const baseFactory = 900000 + (index % 27) * 45000;
    list.push({
      id: `P-${seedCode}`,
      majorCategory: category.major,
      middleCategory: middle,
      series: `${category.major} ${middle}`,
      modelName: `${middle} ${modelNo}`,
      itemCode: `${seedCode}`,
      weightKg: Number((20 + (index % 14) * 0.8).toFixed(1)),
      ksSpec: 'KS B 2361',
      packUnit: 'EA/PT',
      baseDate: '2025-06-01',
      note: index % 3 === 0 ? '주력 모델' : '',
      imageLabel: `IMG-${seedCode}`,
      components: createProductComponents(seedCode, baseFactory),
    });
  }
  return list;
}

export const PRICE_PRODUCT_DATA = buildPriceMockData(4000);
