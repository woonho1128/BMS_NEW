import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { ListFilter } from '../../../shared/components/ListFilter';
import { Card, CardBody } from '../../../shared/components/Card';
import {
  MOCK_MANAGER_OPTIONS,
  MOCK_DEPARTMENT_OPTIONS,
  MOCK_TAG_OPTIONS,
  MOCK_TEAM_OPTIONS,
  getBusinessCardsList,
  getInitials,
} from '../data/businessCardMock';
import styles from './BusinessCardPage.module.css';

const ENHANCEMENT_OPTIONS = [
  { id: 'favoriteToggle', title: '즐겨찾기 즉시 토글', desc: '목록에서 별 클릭으로 즐겨찾기 상태를 즉시 저장' },
  { id: 'quickActions', title: '빠른 액션(전화/메일/메모)', desc: '카드에서 바로 연락/메모 실행' },
  { id: 'duplicateDetect', title: '중복 감지', desc: '이름+회사+전화 기준 유사 명함 등록 경고' },
  { id: 'teamAccordion', title: '팀 명함첩 그룹 보기', desc: '팀별 접기/펼치기 + 팀 요약 제공' },
  { id: 'smartSort', title: '스마트 정렬', desc: '오래 연락 안 한 순, 재접촉 필요 우선 정렬' },
  { id: 'tagSystem', title: '태그 체계화', desc: '태그 색상 규칙/다중 필터/추천 태그' },
  { id: 'reminder', title: '리마인더 배지', desc: '30일 이상 미접촉 고객 자동 표시' },
  { id: 'detailHistory', title: '상세 활동 이력', desc: '수정 이력/연락 로그/메모 이력 노출' },
  { id: 'excelBulk', title: '엑셀 입출력', desc: '팀 명함첩 기준 대량 업로드/다운로드' },
  { id: 'performanceUx', title: '성능/UX 고도화', desc: '가상 스크롤 + 검색 디바운스 + URL 필터 유지' },
];

const CARD_FILTER_FIELDS_BASE = [
  { id: 'company', label: '회사명', type: 'text', placeholder: '회사명 검색', wide: true, row: 0 },
  { id: 'name', label: '이름', type: 'text', placeholder: '이름 검색', row: 0 },
  { id: 'department', label: '부서', type: 'select', options: MOCK_DEPARTMENT_OPTIONS, row: 0 },
  { id: 'manager', label: '담당자', type: 'select', options: MOCK_MANAGER_OPTIONS, row: 0 },
  { id: 'tag', label: '태그', type: 'select', options: MOCK_TAG_OPTIONS, row: 0 },
  { id: 'dateRange', label: '등록일', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 },
  { id: 'myCardsOnly', label: '내 담당만', type: 'checkbox', row: 0 },
];

const INITIAL_FILTER = {
  company: '',
  name: '',
  department: '',
  manager: '',
  team: '',
  tag: '',
  dateFrom: '',
  dateTo: '',
  myCardsOnly: false,
};

const SORT_OPTIONS = [
  { key: 'lastContact', label: '최근 연락순' },
  { key: 'favorite', label: '즐겨찾기순' },
  { key: 'registered', label: '최신 등록순' },
];

function formatRelativeDate(dateString) {
  if (!dateString) return '-';
  const target = new Date(dateString);
  const today = new Date();
  const diff = Math.floor((today - target) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return '오늘';
  if (diff === 1) return '어제';
  if (diff < 7) return `${diff}일 전`;
  return dateString;
}

export function BusinessCardPage() {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(INITIAL_FILTER);
  const [sortKey, setSortKey] = useState('lastContact');
  const [notebookType, setNotebookType] = useState('MY');
  const [selectedEnhancements, setSelectedEnhancements] = useState(() => ({
    favoriteToggle: true,
    quickActions: true,
    duplicateDetect: true,
    teamAccordion: true,
    smartSort: true,
    tagSystem: true,
    reminder: true,
    detailHistory: false,
    excelBulk: false,
    performanceUx: false,
  }));

  const filterFields = useMemo(() => {
    if (notebookType === 'TEAM') {
      const base = CARD_FILTER_FIELDS_BASE.filter((f) => f.id !== 'myCardsOnly' && f.id !== 'department');
      const managerIndex = base.findIndex((f) => f.id === 'manager');
      const teamField = { id: 'team', label: '팀', type: 'select', options: MOCK_TEAM_OPTIONS, row: 0 };
      if (managerIndex < 0) return [...base, teamField];
      return [...base.slice(0, managerIndex + 1), teamField, ...base.slice(managerIndex + 1)];
    }
    return CARD_FILTER_FIELDS_BASE;
  }, [notebookType]);

  const scopedFilter = useMemo(
    () => ({
      ...filterValue,
      myCardsOnly: notebookType === 'MY' ? true : filterValue.myCardsOnly,
    }),
    [filterValue, notebookType]
  );

  const baseList = useMemo(() => getBusinessCardsList(scopedFilter), [scopedFilter]);

  const list = useMemo(() => {
    const copied = [...baseList];
    if (sortKey === 'favorite') {
      copied.sort(
        (a, b) =>
          Number(Boolean(b.isFavorite)) - Number(Boolean(a.isFavorite)) || b.registeredAt.localeCompare(a.registeredAt)
      );
      return copied;
    }
    if (sortKey === 'registered') {
      copied.sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
      return copied;
    }
    copied.sort((a, b) => (b.lastContactAt || '').localeCompare(a.lastContactAt || ''));
    return copied;
  }, [baseList, sortKey]);

  const summary = useMemo(() => {
    const myCount = list.filter((card) => card.manager === '홍길동').length;
    const favoriteCount = list.filter((card) => Boolean(card.isFavorite)).length;
    const imageCount = list.filter((card) => Boolean(card.imageFront || card.imageBack)).length;
    return {
      total: list.length,
      myCount,
      favoriteCount,
      imageCount,
    };
  }, [list]);

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue(INITIAL_FILTER);
  }, []);

  const handleEnhancementToggle = useCallback((id) => {
    setSelectedEnhancements((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleCardClick = useCallback(
    (id) => {
      navigate(`/sales/card/${id}`);
    },
    [navigate]
  );

  const handleAdd = useCallback(() => {
    navigate('/sales/card/new');
  }, [navigate]);

  return (
    <PageShell
      path="/sales/card"
      title="명함 관리"
      description="명함 목록 조회 및 관리"
      actions={
        <Button variant="primary" onClick={handleAdd}>
          + 명함 등록
        </Button>
      }
    >
      <div className={styles.page}>
        <div className={styles.notebookTabs} role="tablist" aria-label="명함첩 유형">
          <button
            type="button"
            className={notebookType === 'MY' ? styles.notebookTabActive : styles.notebookTab}
            onClick={() => setNotebookType('MY')}
          >
            내 명함첩
          </button>
          <button
            type="button"
            className={notebookType === 'TEAM' ? styles.notebookTabActive : styles.notebookTab}
            onClick={() => setNotebookType('TEAM')}
          >
            팀 명함첩
          </button>
        </div>

        <section className={styles.optionSection} aria-label="추가 기능 선택">
          <div className={styles.optionHeader}>
            <div>
              <p className={styles.optionTitle}>추가 기능 선택</p>
              <p className={styles.optionDesc}>백엔드 개발 협의용으로 기능 범위를 체크해서 공유할 수 있습니다.</p>
            </div>
            <span className={styles.optionCount}>
              선택 {Object.values(selectedEnhancements).filter(Boolean).length} / {ENHANCEMENT_OPTIONS.length}
            </span>
          </div>
          <div className={styles.optionGrid}>
            {ENHANCEMENT_OPTIONS.map((option) => (
              <label key={option.id} className={selectedEnhancements[option.id] ? styles.optionItemActive : styles.optionItem}>
                <input
                  type="checkbox"
                  checked={Boolean(selectedEnhancements[option.id])}
                  onChange={() => handleEnhancementToggle(option.id)}
                />
                <div>
                  <p className={styles.optionItemTitle}>{option.title}</p>
                  <p className={styles.optionItemDesc}>{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        <ListFilter
          className={styles.toolbar}
          fields={filterFields}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
          singleLine
        />

        <section className={styles.section} aria-label="명함 목록">
          <div className={styles.summaryBar}>
            <strong className={styles.summaryTitle}>
              {notebookType === 'TEAM' ? `팀 명함첩 ${summary.total}건` : `내 명함첩 ${summary.total}건`}
            </strong>
            <div className={styles.chips}>
              <span className={styles.chip}>내 담당 {summary.myCount}건</span>
              <span className={styles.chip}>즐겨찾기 {summary.favoriteCount}건</span>
              <span className={styles.chip}>이미지 등록 {summary.imageCount}건</span>
            </div>
          </div>

          <div className={styles.sortTabs} role="tablist" aria-label="정렬 옵션">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={sortKey === option.key ? styles.sortTabActive : styles.sortTab}
                onClick={() => setSortKey(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className={styles.listWrap}>
            {list.length === 0 ? (
              <p className={styles.empty}>조건에 맞는 명함이 없습니다.</p>
            ) : (
              list.map((card) => (
                <Card key={card.id} className={styles.itemCard} hoverable clickable onClick={() => handleCardClick(card.id)}>
                  <CardBody className={styles.itemBody}>
                    <div className={styles.leftBlock}>
                      {card.imageFront ? (
                        <div className={styles.thumb}>
                          <img src={card.imageFront} alt={`${card.name} 명함`} />
                        </div>
                      ) : (
                        <div className={styles.avatar}>{getInitials(card.name)}</div>
                      )}

                      <div className={styles.mainInfo}>
                        <div className={styles.titleLine}>
                          <h3 className={styles.name}>{card.name}</h3>
                          <span className={styles.role}>{card.title}</span>
                          <span className={styles.company}>{card.company}</span>
                        </div>

                        <div className={styles.metaLine}>
                          <span>{card.team}</span>
                          <span>{card.department}</span>
                          <span>{card.phone}</span>
                          {card.email ? <span>{card.email}</span> : null}
                        </div>

                        <div className={styles.tagLine}>
                          {(card.tags || []).map((tag) => (
                            <span key={`${card.id}-${tag}`} className={styles.tagChip}>
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {card.memo ? <p className={styles.memo}>{card.memo}</p> : null}
                      </div>
                    </div>

                    <div className={styles.rightBlock}>
                      <span className={card.isFavorite ? styles.favoriteOn : styles.favoriteOff}>
                        {card.isFavorite ? '★ 즐겨찾기' : '☆ 일반'}
                      </span>
                      <span className={styles.manager}>{card.manager}</span>
                      <span className={styles.date}>최근 연락 {formatRelativeDate(card.lastContactAt)}</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(card.id);
                        }}
                      >
                        상세보기
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
