import React, { useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Drawer } from '../../../shared/components/Drawer/Drawer';
import { Pagination } from '../../../shared/components/Pagination/Pagination';
import { usePagination } from '../../../shared/hooks/usePagination';
import { confirmAction, notify } from '../../../shared/utils/notify';
import { ROUTES } from '../../../router/routePaths';

const COLUMNS = [
  { key: 'no', label: '번호', width: 76 },
  { key: 'region1', label: '지역1', width: 120 },
  { key: 'region2', label: '지역2', width: 140 },
  { key: 'unionName', label: '조합명', width: 220 },
  { key: 'grade', label: '등급', width: 90 },
  { key: 'businessType', label: '사업구분', width: 120 },
  { key: 'progressStage', label: '진행단계', width: 150 },
  { key: 'stageAssignedAt', label: '단계 지정일(년, 월)', width: 170 },
  { key: 'completionExpectedAt', label: '준공 예정일', width: 130 },
  { key: 'constructor', label: '시공사', width: 170 },
  { key: 'householdsUnion', label: '세대수(조합)', width: 130 },
  { key: 'householdsTotal', label: '세대수(전체)', width: 130 },
  { key: 'manager1', label: '담당자1(지역)', width: 150 },
  { key: 'manager2', label: '담당자2', width: 120 },
  { key: 'unionOffice', label: '조합사무실', width: 170 },
  { key: 'note', label: '비고', width: 240 },
];

const STAGES = ['추진위원회', '조합설립인가', '사업시행인가', '관리처분인가', '철거', '준공'];
const BUSINESS_TYPES = ['재개발', '재건축', '가로주택정비', '소규모재건축'];
const REGION1_OPTIONS = ['서울', '경기', '인천', '부산', '대구', '경북', '경남', '충북', '충남', '전북', '전남'];
const GRADE_OPTIONS = ['A', 'B', 'C', 'D', 'E'];
const GRADE_LABELS = {
  A: '영업 중',
  B: '제안 및 견적 송부',
  C: '방문',
  D: '미방문',
  E: '타사유력',
};

const REGION2_MAP = {
  서울: ['강남구', '서초구', '송파구', '영등포구', '강동구', '성동구'],
  경기: ['수원시', '성남시', '용인시', '고양시', '화성시'],
  인천: ['연수구', '남동구', '부평구', '서구', '미추홀구'],
  부산: ['해운대구', '수영구', '동래구', '중구', '사하구'],
  대구: ['수성구', '달서구', '북구', '중구', '동구'],
  경북: ['포항시', '구미시', '경주시', '안동시', '김천시'],
  경남: ['창원시', '김해시', '진주시', '양산시', '거제시'],
  충북: ['청주시', '충주시', '제천시', '음성군', '진천군'],
  충남: ['천안시', '아산시', '서산시', '당진시', '공주시'],
  전북: ['전주시', '군산시', '익산시', '정읍시', '남원시'],
  전남: ['순천시', '여수시', '목포시', '광양시', '나주시'],
};

const stageBadgeClass = {
  추진위원회: 'badge-gray',
  조합설립인가: 'badge-blue',
  사업시행인가: 'badge-cyan',
  관리처분인가: 'badge-purple',
  철거: 'badge-red',
  준공: 'badge-green',
};

const constructors = ['현대건설', '삼성물산', 'GS건설', '대우건설', '포스코이앤씨', '롯데건설', 'DL이앤씨', '호반건설'];
const managers = ['김민수', '박서준', '최유진', '정현우', '이지은', '한지훈', '윤수빈', '오세훈'];
const unionNames = [
  '둔촌동 재건축 조합', '옥수관리 재개발 조합', '영통1구역 재개발 조합', '송도 생활권 정비조합',
  '우동 재건축 조합', '범어동 주택재건축 조합', '역삼 재건축 추진위원회', '문래 도시정비 조합',
  '죽도동 재개발 조합', '불당2지구 재건축 조합',
];

const formatThousands = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const toDigitsOnly = (value) => String(value || '').replace(/[^0-9]/g, '');
const toNumber = (value) => Number(String(value || '0').replace(/,/g, '')) || 0;
const formatNow = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

function makeInitialRow(no) {
  const idx = no - 1;
  const region1 = REGION1_OPTIONS[idx % REGION1_OPTIONS.length];
  const region2List = REGION2_MAP[region1] || [''];
  const householdsUnion = 600 + (no * 47 % 5200);
  const householdsTotal = householdsUnion + 120 + (no * 19 % 640);
  return {
    id: `r${no}`,
    no,
    region1,
    region2: region2List[idx % region2List.length],
    unionName: `${unionNames[idx % unionNames.length]} ${Math.ceil(no / 2)}차`,
    grade: GRADE_OPTIONS[idx % GRADE_OPTIONS.length],
    businessType: BUSINESS_TYPES[idx % BUSINESS_TYPES.length],
    progressStage: STAGES[idx % STAGES.length],
    stageAssignedAt: `202${5 + (no % 2)}-${String((no % 12) + 1).padStart(2, '0')}`,
    completionExpectedAt: `203${(no % 3)}-${String(((no + 5) % 12) + 1).padStart(2, '0')}`,
    constructor: constructors[idx % constructors.length],
    householdsUnion: formatThousands(householdsUnion),
    householdsTotal: formatThousands(householdsTotal),
    manager1: managers[idx % managers.length],
    manager2: managers[(idx + 3) % managers.length],
    unionOffice: `0${2 + (no % 8)}-${String(2000 + (no * 29 % 7000)).padStart(4, '0')}-${String(1000 + (no * 17 % 9000)).padStart(4, '0')}`,
    note: no % 3 === 0 ? '추가 협의 필요' : '정기 업데이트 진행',
  };
}

const initialRows = Array.from({ length: 40 }, (_, i) => makeInitialRow(i + 1));

const EMPTY_ROW = {
  no: '',
  region1: '서울',
  region2: REGION2_MAP.서울[0],
  unionName: '',
  grade: 'A',
  businessType: BUSINESS_TYPES[0],
  progressStage: STAGES[0],
  stageAssignedAt: '',
  completionExpectedAt: '',
  constructor: '',
  householdsUnion: '',
  householdsTotal: '',
  manager1: '',
  manager2: '',
  unionOffice: '',
  note: '',
};

export function CombinationDailyLogPage() {
  const [rows, setRows] = useState(initialRows);
  const [deletedRows, setDeletedRows] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterBusinessType, setFilterBusinessType] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [sort, setSort] = useState({ key: 'no', order: 'asc' });
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [drawerMode, setDrawerMode] = useState('view');
  const [draftRow, setDraftRow] = useState(EMPTY_ROW);
  const [gradeGuideOpen, setGradeGuideOpen] = useState(false);
  const [deletedListOpen, setDeletedListOpen] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(formatNow());

  const selectedRow = useMemo(() => rows.find((r) => r.id === selectedRowId) || null, [rows, selectedRowId]);

  const filteredRows = useMemo(() => rows.filter((row) => {
    const keyword = searchKeyword.trim().toLowerCase();
    const hitKeyword = !keyword || [row.unionName, row.constructor, row.manager1, row.manager2].some((v) => String(v || '').toLowerCase().includes(keyword));
    if (!hitKeyword) return false;
    if (filterStage && row.progressStage !== filterStage) return false;
    if (filterBusinessType && row.businessType !== filterBusinessType) return false;
    if (filterRegion && row.region1 !== filterRegion) return false;
    return true;
  }), [rows, searchKeyword, filterStage, filterBusinessType, filterRegion]);

  const sortedRows = useMemo(() => {
    const next = [...filteredRows];
    next.sort((a, b) => {
      const av = a[sort.key] || '';
      const bv = b[sort.key] || '';
      if (sort.key === 'no' || sort.key === 'householdsUnion' || sort.key === 'householdsTotal') {
        const result = toNumber(av) - toNumber(bv);
        return sort.order === 'asc' ? result : -result;
      }
      const result = String(av).localeCompare(String(bv), 'ko');
      return sort.order === 'asc' ? result : -result;
    });
    return next;
  }, [filteredRows, sort]);

  const {
    currentPage,
    pageSize,
    pagedData: pagedRows,
    setPage,
    setPageSize,
    resetPage,
  } = usePagination(sortedRows, { initialPageSize: 10 });

  const onSort = (key) => {
    setSort((prev) => (prev.key === key ? { key, order: prev.order === 'asc' ? 'desc' : 'asc' } : { key, order: 'asc' }));
  };

  const openCreateDrawer = () => {
    setDraftRow({ ...EMPTY_ROW, no: rows.length + 1 });
    setDrawerMode('create');
    setSelectedRowId('__new__');
  };

  const openViewDrawer = (rowId) => {
    setSelectedRowId(rowId);
    setDrawerMode('view');
  };

  const startEditSelectedRow = () => {
    if (!selectedRow) return;
    setDraftRow({ ...selectedRow });
    setDrawerMode('edit');
  };

  const closeDrawer = () => {
    setSelectedRowId(null);
    setDrawerMode('view');
  };

  const onChangeRegion1 = (target, value) => {
    const firstRegion2 = (REGION2_MAP[value] || [''])[0];
    target((prev) => ({ ...prev, region1: value, region2: firstRegion2 }));
  };

  const saveDraftRow = () => {
    if (!draftRow.region1 || !draftRow.region2 || !draftRow.unionName.trim()) {
      notify.warning('지역1, 지역2, 조합명은 필수 입력값입니다.');
      return;
    }

    const payload = {
      ...draftRow,
      householdsUnion: formatThousands(toDigitsOnly(draftRow.householdsUnion)),
      householdsTotal: formatThousands(toDigitsOnly(draftRow.householdsTotal)),
    };

    if (drawerMode === 'create') {
      const id = `r${Date.now()}`;
      setRows((prev) => [...prev, { ...payload, id, no: prev.length + 1 }]);
      notify.success('새 프로젝트가 추가되었습니다.');
    }

    if (drawerMode === 'edit' && selectedRow) {
      setRows((prev) => prev.map((r) => (r.id === selectedRow.id ? { ...r, ...payload } : r)));
      notify.success('프로젝트가 수정되었습니다.');
    }

    setLastUpdatedAt(formatNow());
    closeDrawer();
  };

  const handleDeleteRow = (rowId) => {
    const target = rows.find((r) => r.id === rowId);
    if (!target) return;
    const ok = confirmAction(`[삭제 확인]\n${target.unionName || `No.${target.no}`} 항목을 삭제하시겠습니까?`);
    if (!ok) return;

    setDeletedRows((prev) => [{ ...target, deletedAt: formatNow(), deletedBy: '관리자' }, ...prev]);
    setRows((prev) => prev.filter((r) => r.id !== rowId).map((r, i) => ({ ...r, no: i + 1 })));
    setLastUpdatedAt(formatNow());
    notify.success('항목이 삭제되었습니다.');
  };

  const handleSave = () => {
    setLastUpdatedAt(formatNow());
    notify.success('변경사항이 저장되었습니다.');
  };

  const resetFilters = () => {
    setSearchKeyword('');
    setFilterStage('');
    setFilterBusinessType('');
    setFilterRegion('');
    setPage(1);
    resetPage();
  };

  const currentRegion2Options = REGION2_MAP[draftRow.region1] || [];

  return (
    <PageShell
      path={ROUTES.SALES_COMBINATION_DAILY_LOG}
      title="조합영업일지관리"
      description="재개발/재건축 프로젝트 정보를 조회하고 수정할 수 있습니다."
    >
      <div className="cdl-wrap">
        <div className="cdl-head-actions">
          <Button variant="secondary" onClick={() => notify.info('엑셀 업로드 기능은 추후 연동 예정입니다.')}>엑셀 업로드</Button>
          <Button variant="secondary" onClick={() => notify.info('엑셀 다운로드 기능은 추후 연동 예정입니다.')}>엑셀 다운로드</Button>
          <Button variant="secondary" onClick={openCreateDrawer}>새 프로젝트 추가</Button>
          <Button onClick={handleSave}>저장</Button>
        </div>

        <div className="cdl-toolbar">
          <div className="cdl-filter-item cdl-filter-search">
            <Input
              value={searchKeyword}
              onChange={(e) => { setSearchKeyword(e.target.value); setPage(1); }}
              placeholder="조합명 / 시공사 / 담당자 검색"
              className="cdl-search-input"
            />
          </div>
          <div className="cdl-filter-item">
            <select value={filterStage} onChange={(e) => { setFilterStage(e.target.value); setPage(1); }}>
              <option value="">진행단계 전체</option>
              {STAGES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="cdl-filter-item">
            <select value={filterBusinessType} onChange={(e) => { setFilterBusinessType(e.target.value); setPage(1); }}>
              <option value="">사업구분 전체</option>
              {BUSINESS_TYPES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="cdl-filter-item">
            <select value={filterRegion} onChange={(e) => { setFilterRegion(e.target.value); setPage(1); }}>
              <option value="">지역 전체</option>
              {REGION1_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <Button variant="secondary" onClick={resetFilters}>필터 초기화</Button>
          <Button variant="secondary" onClick={() => setDeletedListOpen(true)}>삭제 리스트</Button>
        </div>

        <div className="cdl-summary">
          <strong>총 {sortedRows.length}건</strong>
          <span>최근 업데이트: {lastUpdatedAt}</span>
        </div>

        <div className="cdl-table-wrap">
          <table className="cdl-table">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col.key} style={{ width: `${col.width}px`, minWidth: `${col.width}px` }} onClick={() => onSort(col.key)}>
                    {col.label}{sort.key === col.key ? (sort.order === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                ))}
                <th style={{ width: '86px', minWidth: '86px' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 ? (
                <tr><td className="cdl-empty" colSpan={COLUMNS.length + 1}>조회된 데이터가 없습니다.</td></tr>
              ) : (
                pagedRows.map((row) => (
                  <tr key={row.id} onClick={() => openViewDrawer(row.id)}>
                    {COLUMNS.map((col) => {
                      const isNote = col.key === 'note';
                      const isStage = col.key === 'progressStage';
                      return (
                        <td key={col.key} className={isNote ? 'is-note' : ''}>
                          <div className={`cdl-cell-view ${isNote ? 'is-note' : ''}`}>
                            {isStage ? <span className={`cdl-badge ${stageBadgeClass[row[col.key]] || 'badge-gray'}`}>{row[col.key]}</span> : row[col.key] || '-'}
                          </div>
                        </td>
                      );
                    })}
                    <td>
                      <button type="button" className="cdl-delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteRow(row.id); }}>삭제</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={sortedRows.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <Drawer
        open={selectedRowId !== null}
        onClose={closeDrawer}
        title={drawerMode === 'create' ? '새 프로젝트 추가' : `프로젝트 상세: ${selectedRow?.unionName || ''}`}
      >
        {(drawerMode === 'create' || drawerMode === 'edit') ? (
          <>
            <div className="cdl-form-grid">
              <div className="cdl-form-group">
                <label className="cdl-form-label">지역1</label>
                <select className="cdl-form-select" value={draftRow.region1} onChange={(e) => onChangeRegion1(setDraftRow, e.target.value)}>
                  {REGION1_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="cdl-form-group">
                <label className="cdl-form-label">지역2</label>
                <select className="cdl-form-select" value={draftRow.region2} onChange={(e) => setDraftRow((prev) => ({ ...prev, region2: e.target.value }))}>
                  {currentRegion2Options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="cdl-form-group cdl-form-full">
                <label className="cdl-form-label">조합명</label>
                <input className="cdl-form-input" value={draftRow.unionName} onChange={(e) => setDraftRow((prev) => ({ ...prev, unionName: e.target.value }))} />
              </div>
              <div className="cdl-form-group">
                <label className="cdl-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>등급</span>
                  <button type="button" className="cdl-link-btn" onClick={() => setGradeGuideOpen(true)}>등급표</button>
                </label>
                <select className="cdl-form-select" value={draftRow.grade} onChange={(e) => setDraftRow((prev) => ({ ...prev, grade: e.target.value }))}>
                  {GRADE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="cdl-form-group">
                <label className="cdl-form-label">사업구분</label>
                <select className="cdl-form-select" value={draftRow.businessType} onChange={(e) => setDraftRow((prev) => ({ ...prev, businessType: e.target.value }))}>
                  {BUSINESS_TYPES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="cdl-form-group">
                <label className="cdl-form-label">진행단계</label>
                <select className="cdl-form-select" value={draftRow.progressStage} onChange={(e) => setDraftRow((prev) => ({ ...prev, progressStage: e.target.value }))}>
                  {STAGES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="cdl-form-group">
                <label className="cdl-form-label">단계 지정일(년, 월)</label>
                <input className="cdl-form-input" type="month" value={draftRow.stageAssignedAt} onChange={(e) => setDraftRow((prev) => ({ ...prev, stageAssignedAt: e.target.value }))} placeholder="예: 2026-05" />
              </div>
              <div className="cdl-form-group">
                <label className="cdl-form-label">준공 예정일</label>
                <input className="cdl-form-input" type="month" value={draftRow.completionExpectedAt} onChange={(e) => setDraftRow((prev) => ({ ...prev, completionExpectedAt: e.target.value }))} placeholder="예: 2029-12" />
              </div>
              <div className="cdl-form-group">
                <label className="cdl-form-label">시공사</label>
                <input className="cdl-form-input" value={draftRow.constructor} onChange={(e) => setDraftRow((prev) => ({ ...prev, constructor: e.target.value }))} />
              </div>
              <div className="cdl-form-group">
                <label className="cdl-form-label">세대수(조합)</label>
                <input className="cdl-form-input" inputMode="numeric" value={draftRow.householdsUnion} onChange={(e) => setDraftRow((prev) => ({ ...prev, householdsUnion: toDigitsOnly(e.target.value) }))} />
              </div>
              <div className="cdl-form-group">
                <label className="cdl-form-label">세대수(전체)</label>
                <input className="cdl-form-input" inputMode="numeric" value={draftRow.householdsTotal} onChange={(e) => setDraftRow((prev) => ({ ...prev, householdsTotal: toDigitsOnly(e.target.value) }))} />
              </div>
              <div className="cdl-form-group">
                <label className="cdl-form-label">담당자1(지역)</label>
                <input className="cdl-form-input" value={draftRow.manager1} onChange={(e) => setDraftRow((prev) => ({ ...prev, manager1: e.target.value }))} />
              </div>
              <div className="cdl-form-group">
                <label className="cdl-form-label">담당자2</label>
                <input className="cdl-form-input" value={draftRow.manager2} onChange={(e) => setDraftRow((prev) => ({ ...prev, manager2: e.target.value }))} />
              </div>
              <div className="cdl-form-group">
                <label className="cdl-form-label">조합사무실</label>
                <input className="cdl-form-input" value={draftRow.unionOffice} onChange={(e) => setDraftRow((prev) => ({ ...prev, unionOffice: e.target.value }))} />
              </div>
              <div className="cdl-form-group cdl-form-full">
                <label className="cdl-form-label">비고</label>
                <textarea className="cdl-form-textarea" value={draftRow.note} onChange={(e) => setDraftRow((prev) => ({ ...prev, note: e.target.value }))} />
              </div>
            </div>
            <div className="cdl-drawer-foot">
              <Button variant="secondary" onClick={closeDrawer}>취소</Button>
              <Button onClick={saveDraftRow}>저장</Button>
            </div>
          </>
        ) : selectedRow ? (
          <>
            <div className="cdl-detail-grid">
              {COLUMNS.map((col) => (
                <div key={col.key} className="cdl-detail-item">
                  <div className="cdl-detail-label">{col.label}</div>
                  <div className="cdl-detail-value">{selectedRow[col.key] || '-'}</div>
                </div>
              ))}
            </div>
            <div className="cdl-drawer-foot">
              <Button variant="secondary" onClick={() => { handleDeleteRow(selectedRow.id); closeDrawer(); }}>행 삭제</Button>
              <Button variant="secondary" onClick={startEditSelectedRow}>수정</Button>
              <Button onClick={() => { handleSave(); closeDrawer(); }}>저장 후 닫기</Button>
            </div>
          </>
        ) : null}
      </Drawer>

      {gradeGuideOpen && (
        <div className="cdl-guide-overlay" role="dialog" aria-modal="true" onClick={() => setGradeGuideOpen(false)}>
          <div className="cdl-guide-popup" onClick={(e) => e.stopPropagation()}>
            <div className="cdl-guide-head">
              <h3 className="cdl-guide-title">등급표</h3>
              <button type="button" className="cdl-guide-close" onClick={() => setGradeGuideOpen(false)}>×</button>
            </div>
            <div className="cdl-guide-body">
              <ul className="cdl-guide-list">
                {GRADE_OPTIONS.map((g) => (
                  <li key={g} className="cdl-guide-item"><strong>{g}</strong><span>{GRADE_LABELS[g]}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {deletedListOpen && (
        <div className="cdl-guide-overlay" role="dialog" aria-modal="true" onClick={() => setDeletedListOpen(false)}>
          <div className="cdl-guide-popup" style={{ width: '980px', maxWidth: '96vw' }} onClick={(e) => e.stopPropagation()}>
            <div className="cdl-guide-head">
              <h3 className="cdl-guide-title">삭제 리스트</h3>
              <button type="button" className="cdl-guide-close" onClick={() => setDeletedListOpen(false)}>×</button>
            </div>
            <div className="cdl-guide-body" style={{ fontSize: '14px' }}>
              {deletedRows.length === 0 ? (
                <div style={{ fontSize: '14px', color: '#64748b' }}>삭제된 항목이 없습니다.</div>
              ) : (
                <div className="cdl-del-table-wrap">
                  <table className="cdl-del-table">
                    <thead>
                      <tr>
                        <th>삭제일시</th>
                        <th>삭제한 사람</th>
                        <th>번호</th>
                        <th>지역1</th>
                        <th>지역2</th>
                        <th>조합명</th>
                        <th>담당자1(지역)</th>
                        <th>시공사</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deletedRows.map((row) => (
                        <tr key={`${row.id}-${row.deletedAt}`}>
                          <td>{row.deletedAt}</td>
                          <td>{row.deletedBy || '-'}</td>
                          <td>{row.no}</td>
                          <td>{row.region1}</td>
                          <td>{row.region2}</td>
                          <td>{row.unionName}</td>
                          <td>{row.manager1}</td>
                          <td>{row.constructor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cdl-wrap { display:flex; flex-direction:column; gap:12px; }
        .cdl-head-actions { display:flex; justify-content:flex-end; gap:8px; }
        .cdl-toolbar { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .cdl-filter-item select { height:36px; min-width:140px; border:1px solid #d1d5db; border-radius:8px; padding:0 10px; background:#fff; }
        .cdl-filter-search { min-width:260px; }
        .cdl-search-input, .cdl-filter-search input { height:36px !important; }
        .cdl-summary { display:flex; justify-content:space-between; color:#475569; font-size:13px; }
        .cdl-table-wrap { background:#fff; border:1px solid #e5e7eb; border-radius:10px; overflow:auto; max-height:60vh; }
        .cdl-table { width:max-content; min-width:100%; border-collapse:separate; border-spacing:0; font-size:14px; }
        .cdl-table thead th { position:sticky; top:0; z-index:2; background:#f8fafc; border-bottom:1px solid #e5e7eb; border-right:1px solid #e5e7eb; padding:10px 8px; text-align:center; font-weight:600; cursor:pointer; white-space:nowrap; }
        .cdl-table tbody td { border-bottom:1px solid #eef2f7; border-right:1px solid #eef2f7; padding:8px 8px; text-align:center; white-space:nowrap; }
        .cdl-table tbody tr:nth-child(even) { background:#fbfdff; }
        .cdl-table tbody tr:hover { background:#eef5ff; }
        .cdl-cell-view { display:flex; justify-content:center; align-items:center; min-height:24px; }
        .cdl-table td.is-note, .cdl-cell-view.is-note { text-align:left; justify-content:flex-start; white-space:normal; }
        .cdl-empty { text-align:center; color:#94a3b8; padding:24px !important; }
        .cdl-badge { display:inline-flex; align-items:center; justify-content:center; min-width:88px; height:28px; border-radius:999px; font-size:12px; font-weight:600; }
        .badge-gray { background:#e5e7eb; color:#334155; }
        .badge-blue { background:#dbeafe; color:#1d4ed8; }
        .badge-cyan { background:#cffafe; color:#0e7490; }
        .badge-purple { background:#ede9fe; color:#6d28d9; }
        .badge-red { background:#fee2e2; color:#b91c1c; }
        .badge-green { background:#dcfce7; color:#15803d; }
        .cdl-delete-btn { background:#fff; border:1px solid #fca5a5; color:#dc2626; border-radius:8px; height:30px; padding:0 10px; cursor:pointer; }
        .cdl-delete-btn:hover { background:#fee2e2; }
        .cdl-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .cdl-form-group { display:flex; flex-direction:column; gap:6px; }
        .cdl-form-full { grid-column:1 / -1; }
        .cdl-form-label { font-size:13px; color:#475569; font-weight:600; }
        .cdl-form-input, .cdl-form-select, .cdl-form-textarea { width:100%; border:1px solid #d1d5db; border-radius:8px; padding:8px 10px; font-size:14px; }
        .cdl-form-textarea { min-height:84px; resize:vertical; }
        .cdl-drawer-foot { display:flex; justify-content:flex-end; gap:8px; margin-top:14px; }
        .cdl-detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .cdl-detail-item { border:1px solid #e5e7eb; border-radius:8px; background:#fff; overflow:hidden; }
        .cdl-detail-label { padding:7px 10px; background:#f8fafc; font-size:12px; color:#64748b; }
        .cdl-detail-value { padding:9px 10px; font-size:14px; }
        .cdl-link-btn { border:0; background:transparent; color:#2563eb; text-decoration:underline; padding:0; cursor:pointer; font-size:12px; }
        .cdl-guide-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.35); display:flex; align-items:center; justify-content:center; z-index:2000; }
        .cdl-guide-popup { width:420px; max-width:92vw; background:#fff; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 24px 60px rgba(15,23,42,0.22); }
        .cdl-guide-head { display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-bottom:1px solid #e5e7eb; }
        .cdl-guide-title { margin:0; font-size:16px; }
        .cdl-guide-close { width:28px; height:28px; border:0; border-radius:8px; background:#f1f5f9; cursor:pointer; }
        .cdl-guide-body { padding:14px 16px; }
        .cdl-guide-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px; }
        .cdl-guide-item { display:flex; justify-content:space-between; align-items:center; border:1px solid #e5e7eb; border-radius:8px; padding:8px 10px; }
        .cdl-del-table-wrap { max-height:420px; overflow:auto; border:1px solid #e5e7eb; border-radius:8px; }
        .cdl-del-table { width:100%; border-collapse:collapse; }
        .cdl-del-table th, .cdl-del-table td { border-bottom:1px solid #eef2f7; padding:10px 8px; text-align:center; font-size:14px; }
        .cdl-del-table th { background:#f8fafc; position:sticky; top:0; }
      `}</style>
    </PageShell>
  );
}
