import React, { useMemo, useState } from 'react';
import { SummaryModal } from '../modals/SummaryModal';
import { SummaryTable } from '../table/SummaryTable';
import styles from './YearSummary.module.css';

const YEAR_OPTIONS = ['2026', '2025', '2024', '2023', '2022'];

const AMOUNT_CATEGORIES = [
  { key: 'sanitary', label: '위생도기', values: [2988, 2967, 2069, 3465, 3305, 2810, 1129, 2668, 1638, 1037, 290, 1958] },
  { key: 'oem', label: 'OEM', values: [568, 850, 464, 489, 307, 409, 394, 597, 401, 255, 97, 165] },
  { key: 'faucet', label: '수전', values: [2070, 1655, 1774, 1088, 747, 1050, 481, 1869, 410, 739, 867, 712] },
  { key: 'bidet', label: '비데', values: [473, 789, 129, 1168, 471, 3184, 67, 252, 214, 257, 100, 623] },
  { key: 'goods-h1', label: '상품 (반다리, 하부장)', values: [447, 141, 68, 167, 309, 46, 7, 751, 445, 36, 0, 99] },
  { key: 'goods-h2', label: '상품 (양부속, 트랩)', values: [642, 822, 502, 791, 722, 644, 304, 653, 408, 258, 77, 425] },
];

const WEIGHT_CATEGORIES = [
  { key: 'sanitary', label: '위생도기', values: [642, 674, 454, 656, 648, 585, 242, 579, 290, 197, 49, 415] },
  { key: 'oem', label: 'OEM', values: [223, 385, 168, 161, 124, 179, 186, 253, 158, 113, 70, 73] },
  { key: 'faucet', label: '수전', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { key: 'bidet', label: '비데', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { key: 'goods-h1', label: '상품 (반다리, 하부장)', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { key: 'goods-h2', label: '상품 (양부속, 트랩)', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
];

const getYearFactor = (year) => {
  const diff = 2026 - Number(year);
  return Math.max(0.76, 1 - diff * 0.06);
};

const normalizeZero = (value) => (value === 0 ? '0' : value);

const buildColumns = (year, firstLabel, totalUnitLabel) => {
  const months = Array.from({ length: 12 }, (_, idx) => ({
    key: `m${idx + 1}`,
    label: `'${year}.${String(idx + 1).padStart(2, '0')} (실적)`,
    width: 100,
    align: 'right',
  }));

  return [
    { key: 'label', label: firstLabel, width: 190, fixed: 'left', align: 'center' },
    ...months,
    { key: 'total', label: `${String(year).slice(2)}년 합계 (${totalUnitLabel})`, width: 130, align: 'right', isTotal: true },
  ];
};

const buildRows = (categories, selectedKeys, year) => {
  const factor = getYearFactor(year);
  const visible = categories.filter((category) => selectedKeys.includes(category.key));

  const rows = visible.map((category) => {
    const adjusted = category.values.map((value) => Math.round(value * factor));
    const row = {
      id: `${category.key}-${year}`,
      label: category.label,
      total: normalizeZero(adjusted.reduce((sum, value) => sum + value, 0)),
    };

    adjusted.forEach((value, idx) => {
      row[`m${idx + 1}`] = normalizeZero(value);
    });

    return row;
  });

  const totalValues = Array.from({ length: 12 }, (_, idx) =>
    rows.reduce((sum, row) => sum + Number(row[`m${idx + 1}`] || 0), 0),
  );

  const totalRow = {
    id: `total-${year}`,
    label: '합계',
    isTotalRow: true,
    total: normalizeZero(totalValues.reduce((sum, value) => sum + value, 0)),
  };

  totalValues.forEach((value, idx) => {
    totalRow[`m${idx + 1}`] = normalizeZero(value);
  });

  return [...rows, totalRow];
};

const CategoryFilter = ({ title, categories, selectedKeys, onToggle }) => {
  const allSelected = selectedKeys.length === categories.length;

  return (
    <div className={styles.filterWrap}>
      <span className={styles.filterTitle}>{title}</span>
      <div className={styles.filterList}>
        <label className={styles.filterItem}>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => {
              if (allSelected) {
                onToggle([]);
              } else {
                onToggle(categories.map((category) => category.key));
              }
            }}
          />
          전체
        </label>
        {categories.map((category) => (
          <label key={category.key} className={styles.filterItem}>
            <input
              type="checkbox"
              checked={selectedKeys.includes(category.key)}
              onChange={() => {
                if (selectedKeys.includes(category.key)) {
                  onToggle(selectedKeys.filter((key) => key !== category.key));
                } else {
                  onToggle([...selectedKeys, category.key]);
                }
              }}
            />
            {category.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export const YearSummary = () => {
  const [year, setYear] = useState('2026');
  const [isItemCodeModalOpen, setIsItemCodeModalOpen] = useState(false);
  const [amountCategoryKeys, setAmountCategoryKeys] = useState(AMOUNT_CATEGORIES.map((category) => category.key));
  const [weightCategoryKeys, setWeightCategoryKeys] = useState(WEIGHT_CATEGORIES.map((category) => category.key));

  const amountColumns = useMemo(() => buildColumns(year, '금액', '백만원'), [year]);
  const weightColumns = useMemo(() => buildColumns(year, '중량', 'TON'), [year]);

  const amountRows = useMemo(() => buildRows(AMOUNT_CATEGORIES, amountCategoryKeys, year), [amountCategoryKeys, year]);
  const weightRows = useMemo(() => buildRows(WEIGHT_CATEGORIES, weightCategoryKeys, year), [weightCategoryKeys, year]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>연도 요약</h3>
        <div className={styles.headerControls}>
          <div className={styles.yearControlGroup}>
            <span className={styles.controlLabel}>조회 연도</span>
            <select className={styles.yearSelect} value={year} onChange={(e) => setYear(e.target.value)}>
              {YEAR_OPTIONS.map((optionYear) => (
                <option key={optionYear} value={optionYear}>
                  {optionYear}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className={styles.itemSearchButton}
            onClick={() => setIsItemCodeModalOpen(true)}
          >
            품번 요약 검색
          </button>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <strong>[1] 카테고리별 요약(금액)</strong>
          <span>(단위 : 백만원, TON)</span>
        </div>
        <CategoryFilter
          title="카테고리"
          categories={AMOUNT_CATEGORIES}
          selectedKeys={amountCategoryKeys}
          onToggle={setAmountCategoryKeys}
        />
        <SummaryTable columns={amountColumns} rows={amountRows} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <strong>[2] 카테고리별 요약(중량)</strong>
        </div>
        <CategoryFilter
          title="카테고리"
          categories={WEIGHT_CATEGORIES}
          selectedKeys={weightCategoryKeys}
          onToggle={setWeightCategoryKeys}
        />
        <SummaryTable columns={weightColumns} rows={weightRows} />
      </section>

      {isItemCodeModalOpen && (
        <SummaryModal
          isOpen={isItemCodeModalOpen}
          type="itemCode"
          onClose={() => setIsItemCodeModalOpen(false)}
        />
      )}
    </div>
  );
};
