export const INVENTORY_FILTER_OPTIONS = {
  plants: [
    { code: 'PC01', name: '창원 S/W공장' },
    { code: 'PC02', name: '부여 위생도기공장' },
    { code: 'PC03', name: '인천 물류센터' },
  ],
  warehouses: [
    { code: 'SC10', name: '창원S/W' },
    { code: 'SC20', name: '부여창고' },
    { code: 'SC30', name: '인천센터창고' },
  ],
  itemGroups: ['위생도기', '타일', '비데', '수전금구', '액세서리'],
  itemDetailGroups: ['원피스', '투피스', '세면기', '소변기', '수전', '비데'],
};

const ITEM_GROUP_SET = [
  { group: '위생도기', detail: '원피스', type: 'system' },
  { group: '타일', detail: '타일', type: 'recognized' },
  { group: '비데', detail: '비데', type: 'recognized' },
  { group: '수전금구', detail: '수전', type: 'system' },
  { group: '액세서리', detail: '액세서리', type: 'system' },
];

const SPECS = ['CC-214L(신형)', 'CC-213G4', 'CC-213G1', 'FT-1209', 'BD-1002', 'TL-600x600'];
const MAIN_CODES = ['CC-214', 'CC-213', 'FT-1209', 'BD-1002', 'TL-600', 'AC-300'];

function buildRow(index) {
  const plant = INVENTORY_FILTER_OPTIONS.plants[index % INVENTORY_FILTER_OPTIONS.plants.length];
  const warehouse = INVENTORY_FILTER_OPTIONS.warehouses[index % INVENTORY_FILTER_OPTIONS.warehouses.length];
  const groupMeta = ITEM_GROUP_SET[index % ITEM_GROUP_SET.length];

  const itemCodeNum = String(1000 + index).padStart(4, '0');
  const itemCode = `ITM${itemCodeNum}`;
  const itemName = `${groupMeta.group} 품목 ${index + 1}`;
  const spec = SPECS[index % SPECS.length];
  const mainItemCode = MAIN_CODES[index % MAIN_CODES.length];

  const goodQty = ((index * 17) % 500) + 1;
  const reservedQty = (index * 9) % 120;
  const salePrice = ((index % 25) + 1) * 10000;

  return {
    id: `inv-${index + 1}`,
    plantCode: plant.code,
    plantName: plant.name,
    warehouse: warehouse.code,
    warehouseName: warehouse.name,
    itemGroup: groupMeta.group,
    itemDetailGroup: groupMeta.detail,
    itemCode,
    itemName,
    spec,
    mainItemCode,
    goodQty,
    reservedQty,
    salePrice,
    itemType: groupMeta.type,
  };
}

export const INVENTORY_ROWS = Array.from({ length: 100 }, (_, index) => buildRow(index));
