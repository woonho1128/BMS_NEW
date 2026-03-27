import React, { useState, useMemo, useCallback } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { ListFilter } from '../../../shared/components/ListFilter';
import { Card, CardBody } from '../../../shared/components/Card';
import { getCodesList, getCodeById } from '../data/adminMock';
import styles from './CodesAdminPage.module.css';

const CODE_FILTER_FIELDS = [
  {
    id: 'groupCode',
    label: '코드그룹',
    type: 'select',
    options: [
      { value: '', label: '전체' },
      { value: 'PROGRESS', label: '진행상태' },
      { value: 'STATUS', label: '거래상태' },
    ],
    row: 0,
  },
  {
    id: 'codeName',
    label: '코드명',
    type: 'text',
    placeholder: '코드명 검색',
    wide: true,
    row: 0,
  },
];

const INITIAL_FILTER = {
  groupCode: '',
  codeName: '',
};

export function CodesAdminPage() {
  const [filterValue, setFilterValue] = useState(INITIAL_FILTER);
  const [selectedCode, setSelectedCode] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const list = useMemo(() => getCodesList(filterValue), [filterValue]);

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue(INITIAL_FILTER);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedCode(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((code) => {
    setSelectedCode(code);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((code) => {
    if (window.confirm(`정말 삭제하시겠습니까?\n코드: ${code.codeName} (${code.code})`)) {
      console.log('삭제:', code.id);
      alert('삭제되었습니다.');
    }
  }, []);

  const handleSave = useCallback(() => {
    console.log('저장:', selectedCode);
    alert(selectedCode ? '수정되었습니다.' : '등록되었습니다.');
    setShowForm(false);
    setSelectedCode(null);
  }, [selectedCode]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setSelectedCode(null);
  }, []);

  // 코드 그룹별로 그룹화
  const groupedCodes = useMemo(() => {
    const groups = {};
    list.forEach((code) => {
      if (!groups[code.groupCode]) {
        groups[code.groupCode] = {
          groupCode: code.groupCode,
          groupName: code.groupName,
          codes: [],
        };
      }
      groups[code.groupCode].codes.push(code);
    });
    return Object.values(groups);
  }, [list]);

  return (
    <PageShell
      path="/admin/code"
      title="코드관리"
      description="시스템 코드 조회 및 관리"
      actions={
        <Button variant="primary" onClick={handleAdd}>
          + 코드 등록
        </Button>
      }
    >
      <div className={styles.page}>
        <ListFilter
          className={styles.toolbar}
          fields={CODE_FILTER_FIELDS}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <section className={styles.section} aria-label="코드 목록">
          <div className={styles.count}>{list.length}건</div>
          {groupedCodes.map((group) => (
            <Card key={group.groupCode} title={group.groupName} className={styles.groupCard}>
              <CardBody>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>코드</th>
                        <th className={styles.th}>코드명</th>
                        <th className={styles.th}>정렬순서</th>
                        <th className={styles.th}>사용여부</th>
                        <th className={styles.thAction}>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.codes.map((code) => (
                        <tr key={code.id}>
                          <td className={styles.td}>{code.code}</td>
                          <td className={styles.td}>{code.codeName}</td>
                          <td className={styles.td}>{code.sortOrder}</td>
                          <td className={styles.td}>
                            <span
                              className={`${styles.useBadge} ${
                                code.useYn ? styles.use : styles.unuse
                              }`}
                            >
                              {code.useYn ? '사용' : '미사용'}
                            </span>
                          </td>
                          <td className={styles.tdAction}>
                            <div className={styles.actions}>
                              <button
                                className={styles.actionBtn}
                                onClick={() => handleEdit(code)}
                                aria-label="수정"
                              >
                                수정
                              </button>
                              <button
                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                onClick={() => handleDelete(code)}
                                aria-label="삭제"
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          ))}
        </section>

        {showForm && (
          <Card title={selectedCode ? '코드 수정' : '코드 등록'} className={styles.formCard}>
            <CardBody>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>코드그룹 *</label>
                  <select className={styles.select} value={selectedCode?.groupCode || ''}>
                    <option value="">코드그룹 선택</option>
                    <option value="PROGRESS">진행상태</option>
                    <option value="STATUS">거래상태</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>코드 *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={selectedCode?.code || ''}
                    placeholder="코드를 입력하세요"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>코드명 *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={selectedCode?.codeName || ''}
                    placeholder="코드명을 입력하세요"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>정렬순서</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={selectedCode?.sortOrder || 1}
                    min="1"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>사용여부</label>
                  <select className={styles.select} value={selectedCode?.useYn ? 'true' : 'false'}>
                    <option value="true">사용</option>
                    <option value="false">미사용</option>
                  </select>
                </div>
              </div>
              <div className={styles.formActions}>
                <Button variant="secondary" onClick={handleCancel}>
                  취소
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  {selectedCode ? '수정' : '등록'}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
