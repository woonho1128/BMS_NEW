import React, { useCallback, useMemo, useState } from 'react';
import { PageShell } from '../../../../../../shared/components/PageShell/PageShell';
import { CostTable } from './CostTable';
import { FilterBar } from './FilterBar';
import { KpiSummary } from './KpiSummary';
import styles from './CostPage.module.css';
import '../../StandardCostPage.css';

export const COST_COLUMNS = [
  { key: 'division', label: '구분', width: 90, align: 'center' },
  { key: 'sub1', label: '하위1', width: 110 },
  { key: 'sub2', label: '하위2', width: 110 },
  { key: 'sub3', label: '하위3', width: 110 },
  { key: 'setPartNo', label: 'SET품번', width: 100 },
  { key: 'childPartNo', label: '자품번', width: 110 },
  { key: 'partNo', label: '품번', width: 100 },
  { key: 'partName', label: '품명', width: 180 },
  { key: 'weight', label: '중량', width: 80, align: 'right' },
  { key: 'factoryPrice', label: '공장도가', width: 100, align: 'right' },
  { key: 'standardCost', label: '표준원가', width: 100, align: 'right' },
  { key: 'stdVsPurchase', label: '표준원가/매입단가', width: 130, align: 'right' },
  { key: 'totalCost', label: '총원가', width: 100, align: 'right' },
  { key: 'otherCost', label: '기타원가', width: 100, align: 'right' },
  { key: 'salePrice', label: '판매가', width: 100, align: 'right' },
  { key: 'marginPercent', label: '%', width: 80, align: 'right' },
  { key: 'note', label: '비고', width: 180 },
];

const NUMERIC_KEYS = new Set([
  'weight',
  'factoryPrice',
  'standardCost',
  'stdVsPurchase',
  'totalCost',
  'otherCost',
  'salePrice',
  'marginPercent',
]);

const STATUS_POOL = ['요청', '공장 입력 완료', 'ERP 반영 완료'];
const DIVISION_POOL = ['OEM', 'S/W', '상품', '수전금구', '비데', '타일', 'BK', '케어', '기타'];

function makeRows() {
  return Array.from({ length: 48 }, (_, idx) => {
    const i = idx + 1;
    const division = DIVISION_POOL[idx % DIVISION_POOL.length];
    const factoryPrice = 8000 + (i % 11) * 1700;
    const otherCost = [24.6, 14.6, 10.8, 35.9, 23.2, 15.4][idx % 6];
    const standardCost = Math.round(factoryPrice * 1.12);
    const totalCost = Math.round(standardCost + (factoryPrice * otherCost) / 100);
    const salePrice = Math.round(totalCost * (1.06 + (idx % 8) * 0.03));
    const marginPercent = Number((((salePrice - totalCost) / salePrice) * 100).toFixed(1));

    return {
      id: i,
      year: '2026',
      project: idx % 2 === 0 ? '2026 상반기 프로젝트' : '2026 하반기 프로젝트',
      status: STATUS_POOL[idx % STATUS_POOL.length],
      division,
      sub1: ['Harmony', 'Batra', 'Opus2', '부속류'][idx % 4],
      sub2: ['샤워수전', '욕실수전', '부속'][idx % 3],
      sub3: ['독립형', '수동팝업', '4" 세면기수전'][idx % 3],
      setPartNo: `SET${1000 + i}`,
      childPartNo: `CHILD${2000 + i}`,
      partNo: `P${3000 + i}`,
      partName: `표준품목-${i}`,
      weight: Number((0.5 + (idx % 9) * 0.8).toFixed(1)),
      factoryPrice,
      standardCost,
      stdVsPurchase: Math.round(standardCost * 0.95),
      totalCost,
      otherCost,
      salePrice,
      marginPercent,
      note: '',
    };
  });
}

function toCellId(rowId, colKey) {
  return `${rowId}:${colKey}`;
}

export function CostPage() {
  const [rows, setRows] = useState(makeRows);
  const [otherCostRates, setOtherCostRates] = useState({
    'S/W': 11.2,
    OEM: 24.6,
    상품: 14.4,
    수전금구: 14.6,
    비데: 21.8,
    타일: 15.4,
    BK: 35.9,
    케어: 23.2,
    기타: 10.8,
  });
  const [filter, setFilter] = useState({
    year: '2026',
    project: 'ALL',
    keyword: '',
    status: 'ALL',
    ratio: 'ALL',
  });
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeCell, setActiveCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [anchorCell, setAnchorCell] = useState(null);

  const years = useMemo(() => [...new Set(rows.map((row) => row.year))], [rows]);
  const projects = useMemo(() => [...new Set(rows.map((row) => row.project))], [rows]);

  const filteredRows = useMemo(() => {
    const kw = filter.keyword.trim();
    return rows.filter((row) => {
      if (filter.year !== 'ALL' && row.year !== filter.year) return false;
      if (filter.project !== 'ALL' && row.project !== filter.project) return false;
      if (filter.status !== 'ALL' && row.status !== filter.status) return false;
      if (filter.ratio !== 'ALL' && row.division !== filter.ratio) return false;
      if (!kw) return true;
      return (
        row.partNo.includes(kw) ||
        row.partName.includes(kw) ||
        row.childPartNo.includes(kw) ||
        row.setPartNo.includes(kw)
      );
    });
  }, [rows, filter]);

  const rowIndexById = useMemo(() => {
    const map = new Map();
    filteredRows.forEach((row, index) => map.set(row.id, index));
    return map;
  }, [filteredRows]);

  const colIndexByKey = useMemo(() => {
    const map = new Map();
    COST_COLUMNS.forEach((col, index) => map.set(col.key, index));
    return map;
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilter = useCallback(() => {
    setFilter({ year: '2026', project: 'ALL', keyword: '', status: 'ALL', ratio: 'ALL' });
  }, []);

  const onRatioFilter = useCallback((ratio) => {
    setFilter((prev) => ({ ...prev, ratio }));
  }, []);

  const onOtherCostRateChange = useCallback((key, value) => {
    const parsed = Number(value);
    const nextValue = Number.isNaN(parsed) ? 0 : parsed;
    setOtherCostRates((prev) => ({ ...prev, [key]: nextValue }));
  }, []);

  const onRowClick = useCallback((id) => {
    setSelectedRowId(id);
    setSelectedRows([id]);
    setExpandedRowId((prev) => (prev === id ? null : id));
  }, []);

  const onToggleExpand = useCallback((id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  }, []);

  const onCellSelect = useCallback((rowId, colKey, withRange) => {
    const next = { rowId, colKey };
    if (withRange && anchorCell) {
      const rowStart = rowIndexById.get(anchorCell.rowId);
      const rowEnd = rowIndexById.get(rowId);
      const colStart = colIndexByKey.get(anchorCell.colKey);
      const colEnd = colIndexByKey.get(colKey);

      if (rowStart != null && rowEnd != null && colStart != null && colEnd != null) {
        const minRow = Math.min(rowStart, rowEnd);
        const maxRow = Math.max(rowStart, rowEnd);
        const minCol = Math.min(colStart, colEnd);
        const maxCol = Math.max(colStart, colEnd);
        const rowIds = filteredRows.slice(minRow, maxRow + 1).map((r) => r.id);
        setSelectedRows([...new Set(rowIds)]);
      }
    } else {
      setSelectedRows([rowId]);
      setAnchorCell(next);
    }

    setSelectedRowId(rowId);
    setActiveCell(next);
  }, [anchorCell, colIndexByKey, filteredRows, rowIndexById]);

  const onCellStartEdit = useCallback((rowId, colKey) => {
    setEditingCell({ rowId, colKey });
    setActiveCell({ rowId, colKey });
  }, []);

  const onCellStopEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  const onCellChange = useCallback((rowId, colKey, nextValue) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        if (!NUMERIC_KEYS.has(colKey)) return { ...row, [colKey]: nextValue };
        const numeric = Number(String(nextValue).replace(/,/g, ''));
        return { ...row, [colKey]: Number.isNaN(numeric) ? 0 : numeric };
      })
    );
  }, []);

  const applyToSelected = useCallback((colKey, nextValue, sourceRowId, selection) => {
    const targets = (selection || []).filter((id) => id !== sourceRowId);
    if (targets.length === 0) return;

    setRows((prev) =>
      prev.map((row) => {
        if (!targets.includes(row.id)) return row;
        if (!NUMERIC_KEYS.has(colKey)) return { ...row, [colKey]: nextValue };
        const numeric = Number(String(nextValue).replace(/,/g, ''));
        return { ...row, [colKey]: Number.isNaN(numeric) ? 0 : numeric };
      })
    );
  }, []);

  const onCellMove = useCallback((direction, rowId, colKey) => {
    const rowIdx = rowIndexById.get(rowId);
    const colIdx = colIndexByKey.get(colKey);
    if (rowIdx == null || colIdx == null) return;

    let nextRow = rowIdx;
    let nextCol = colIdx;

    if (direction === 'down') nextRow += 1;
    if (direction === 'up') nextRow -= 1;
    if (direction === 'right') nextCol += 1;
    if (direction === 'left') nextCol -= 1;

    if (nextRow < 0 || nextRow >= filteredRows.length) return;
    if (nextCol < 0 || nextCol >= COST_COLUMNS.length) return;

    const nextRowId = filteredRows[nextRow].id;
    const nextColKey = COST_COLUMNS[nextCol].key;
    setActiveCell({ rowId: nextRowId, colKey: nextColKey });
    setEditingCell({ rowId: nextRowId, colKey: nextColKey });
    setSelectedRows([nextRowId]);
    setSelectedRowId(nextRowId);
  }, [colIndexByKey, filteredRows, rowIndexById]);

  return (
    <PageShell title="표준원가 관리" path="/master/standard-cost" className="std-cost-shell-wide">
      <div className={styles.page}>
        <FilterBar
          filter={filter}
          years={years}
          projects={projects}
          onChange={updateFilter}
          onResetSearch={resetFilter}
        />

        <KpiSummary
          rows={filteredRows}
          ratioFilter={filter.ratio}
          onRatioFilter={onRatioFilter}
          otherCostRates={otherCostRates}
          onOtherCostRateChange={onOtherCostRateChange}
        />

        <CostTable
          rows={filteredRows}
          columns={COST_COLUMNS}
          expandedRowId={expandedRowId}
          selectedRowId={selectedRowId}
          activeCell={activeCell}
          editingCell={editingCell}
          selectedRows={selectedRows}
          onRowClick={onRowClick}
          onToggleExpand={onToggleExpand}
          onCellSelect={onCellSelect}
          onCellStartEdit={onCellStartEdit}
          onCellStopEdit={onCellStopEdit}
          onCellChange={onCellChange}
          onCellMove={onCellMove}
          applyToSelected={applyToSelected}
        />
      </div>
    </PageShell>
  );
}
