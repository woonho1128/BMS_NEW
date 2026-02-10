import React, { useState, useMemo, useCallback } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter';
import { getLogsList } from '../data/adminMock';
import styles from './LogsAdminPage.module.css';

const LOG_FILTER_FIELDS = [
  { id: 'userName', label: '사용자명', type: 'text', placeholder: '사용자명 검색', wide: true, row: 0 },
  {
    id: 'action',
    label: '작업',
    type: 'select',
    options: [
      { value: '', label: '전체' },
      { value: 'LOGIN', label: '로그인' },
      { value: 'LOGOUT', label: '로그아웃' },
      { value: 'VIEW', label: '조회' },
      { value: 'CREATE', label: '등록' },
      { value: 'UPDATE', label: '수정' },
      { value: 'DELETE', label: '삭제' },
    ],
    row: 0,
  },
  { id: 'dateRange', label: '일시', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 1 },
];

const INITIAL_FILTER = {
  userName: '',
  action: '',
  dateFrom: '',
  dateTo: '',
};

const ACTION_LABELS = {
  LOGIN: '로그인',
  LOGOUT: '로그아웃',
  VIEW: '조회',
  CREATE: '등록',
  UPDATE: '수정',
  DELETE: '삭제',
};

const ACTION_COLORS = {
  LOGIN: '#166534',
  LOGOUT: '#991b1b',
  VIEW: '#1e40af',
  CREATE: '#059669',
  UPDATE: '#d97706',
  DELETE: '#dc2626',
};

export function LogsAdminPage() {
  const [filterValue, setFilterValue] = useState(INITIAL_FILTER);

  const list = useMemo(() => getLogsList(filterValue), [filterValue]);

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue(INITIAL_FILTER);
  }, []);

  return (
    <PageShell path="/admin/log" title="로그/사용내역" description="시스템 사용 로그 조회">
      <div className={styles.page}>
        <ListFilter
          className={styles.toolbar}
          fields={LOG_FILTER_FIELDS}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <section className={styles.section} aria-label="로그 목록">
          <div className={styles.count}>{list.length}건</div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>일시</th>
                  <th className={styles.th}>사용자</th>
                  <th className={styles.th}>작업</th>
                  <th className={styles.th}>리소스</th>
                  <th className={styles.th}>IP주소</th>
                  <th className={styles.th}>User Agent</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.empty}>
                      조건에 맞는 로그가 없습니다.
                    </td>
                  </tr>
                ) : (
                  list.map((log) => (
                    <tr key={log.id}>
                      <td className={styles.td}>{log.createdAt}</td>
                      <td className={styles.td}>
                        <div className={styles.userInfo}>
                          <span className={styles.userId}>{log.userId}</span>
                          <span className={styles.userName}>({log.userName})</span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span
                          className={styles.actionBadge}
                          style={{ color: ACTION_COLORS[log.action] || '#666' }}
                        >
                          {log.actionName || ACTION_LABELS[log.action] || log.action}
                        </span>
                      </td>
                      <td className={styles.td}>
                        {log.resourceName ? (
                          <div className={styles.resourceInfo}>
                            <span className={styles.resourceName}>{log.resourceName}</span>
                            <span className={styles.resourcePath}>{log.resource}</span>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className={styles.td}>{log.ip}</td>
                      <td className={styles.td}>{log.userAgent}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
