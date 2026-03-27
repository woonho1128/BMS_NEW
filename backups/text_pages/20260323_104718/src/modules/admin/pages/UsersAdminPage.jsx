import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { ListFilter } from '../../../shared/components/ListFilter';
import { getUsersList } from '../data/adminMock';
import styles from './UsersAdminPage.module.css';

const USER_FILTER_FIELDS = [
  { id: 'name', label: '이름', type: 'text', placeholder: '이름 검색', wide: true, row: 0 },
  { id: 'loginId', label: '로그인ID', type: 'text', placeholder: '로그인ID 검색', row: 0 },
  {
    id: 'department',
    label: '부서',
    type: 'select',
    options: [
      { value: '', label: '전체' },
      { value: '영업팀', label: '영업팀' },
      { value: '물류팀', label: '물류팀' },
      { value: 'IT팀', label: 'IT팀' },
      { value: '재무팀', label: '재무팀' },
    ],
    row: 0,
  },
  {
    id: 'status',
    label: '상태',
    type: 'select',
    options: [
      { value: '', label: '전체' },
      { value: 'active', label: '활성' },
      { value: 'inactive', label: '비활성' },
    ],
    row: 0,
  },
];

const INITIAL_FILTER = {
  name: '',
  loginId: '',
  department: '',
  status: '',
};

const PAGE_SIZE = 20;

const emptyForm = {
  loginId: '',
  name: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  role: 'user',
  status: 'active',
};

export function UsersAdminPage() {
  const [filterValue, setFilterValue] = useState(INITIAL_FILTER);
  const [page, setPage] = useState(1);
  const [showDrawer, setShowDrawer] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);

  const list = useMemo(() => getUsersList(filterValue), [filterValue]);
  const totalCount = list.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedList = useMemo(
    () => list.slice(start, start + PAGE_SIZE),
    [list, start]
  );

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue(INITIAL_FILTER);
    setPage(1);
  }, []);

  const handleAdd = useCallback(() => {
    setFormData(emptyForm);
    setIsEdit(false);
    setShowDrawer(true);
  }, []);

  const handleEdit = useCallback((user) => {
    setFormData({
      id: user.id,
      loginId: user.loginId || '',
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      department: user.department || '',
      position: user.position || '',
      role: user.role || 'user',
      status: user.status || 'active',
    });
    setIsEdit(true);
    setShowDrawer(true);
  }, []);

  const handleDelete = useCallback((user) => {
    if (window.confirm(`정말 삭제하시겠습니까?\n사용자: ${user.name} (${user.loginId})`)) {
      // 실제로는 API 호출
      console.log('삭제:', user.id);
      alert('삭제되었습니다.');
    }
  }, []);

  const handleSave = useCallback(() => {
    // 실제로는 API 호출
    console.log('저장:', formData);
    alert(isEdit ? '수정되었습니다.' : '등록되었습니다.');
    setShowDrawer(false);
    setFormData(emptyForm);
  }, [formData, isEdit]);

  const handleCancel = useCallback(() => {
    setShowDrawer(false);
    setFormData(emptyForm);
  }, []);

  const updateForm = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  useEffect(() => {
    if (!showDrawer) return;
    const onEscape = (e) => {
      if (e.key === 'Escape') handleCancel();
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [showDrawer, handleCancel]);

  return (
    <PageShell
      path="/admin/users"
      title="사용자관리"
      description="시스템 사용자 조회 및 관리"
      actions={
        <Button variant="primary" onClick={handleAdd}>
          + 사용자 등록
        </Button>
      }
    >
      <div className={styles.page}>
        <ListFilter
          className={styles.toolbar}
          fields={USER_FILTER_FIELDS}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <section className={styles.section} aria-label="사용자 목록">
          <div className={styles.count}>
            전체 {totalCount}건
            {totalCount > 0 && (
              <span className={styles.countRange}>
                ({(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} 표시)
              </span>
            )}
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>로그인ID</th>
                  <th className={styles.th}>이름</th>
                  <th className={styles.th}>이메일</th>
                  <th className={styles.th}>부서</th>
                  <th className={styles.th}>직급</th>
                  <th className={styles.th}>권한</th>
                  <th className={styles.th}>상태</th>
                  <th className={styles.th}>최종로그인</th>
                  <th className={styles.thAction}>관리</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.empty}>
                      조건에 맞는 사용자가 없습니다.
                    </td>
                  </tr>
                ) : (
                  paginatedList.map((user) => (
                    <tr key={user.id}>
                      <td className={styles.td}>{user.loginId}</td>
                      <td className={styles.td}>{user.name}</td>
                      <td className={styles.td}>{user.email}</td>
                      <td className={styles.td}>{user.department}</td>
                      <td className={styles.td}>{user.position}</td>
                      <td className={styles.td}>
                        <span className={styles.badge}>{user.role === 'admin' ? '관리자' : '일반'}</span>
                      </td>
                      <td className={styles.td}>
                        <span
                          className={`${styles.statusBadge} ${
                            user.status === 'active' ? styles.active : styles.inactive
                          }`}
                        >
                          {user.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className={styles.td}>{user.lastLoginAt || '—'}</td>
                      <td className={styles.tdAction}>
                        <div className={styles.actions}>
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleEdit(user)}
                            aria-label="수정"
                          >
                            수정
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => handleDelete(user)}
                            aria-label="삭제"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="이전 페이지"
              >
                이전
              </button>
              <span className={styles.pageInfo}>
                {page} / {totalPages}
              </span>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="다음 페이지"
              >
                다음
              </button>
            </div>
          )}
        </section>

        {/* Side Drawer: 사용자 수정/등록 */}
        {showDrawer && (
          <>
            <div className={styles.drawerOverlay} onClick={handleCancel} aria-hidden />
            <div className={styles.drawer} role="dialog" aria-labelledby="drawer-title">
              <header className={styles.drawerHeader}>
                <h2 id="drawer-title" className={styles.drawerTitle}>
                  {isEdit ? '사용자 정보 수정' : '사용자 등록'}
                </h2>
                <button
                  type="button"
                  className={styles.drawerClose}
                  onClick={handleCancel}
                  aria-label="닫기"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </header>
              <div className={styles.drawerBody}>
                {/* 기본 정보 */}
                <div className={styles.drawerGroup}>
                  <span className={styles.drawerGroupLabel}>기본 정보</span>
                  <div className={styles.drawerFields}>
                    <div className={styles.field}>
                      <label className={styles.drawerLabel}>로그인ID *</label>
                      <input
                        type="text"
                        className={`${styles.drawerInput} ${isEdit ? styles.drawerInputReadOnly : ''}`}
                        value={formData.loginId}
                        onChange={(e) => updateForm('loginId', e.target.value)}
                        placeholder="로그인ID를 입력하세요"
                        disabled={isEdit}
                        readOnly={isEdit}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.drawerLabel}>이름 *</label>
                      <input
                        type="text"
                        className={styles.drawerInput}
                        value={formData.name}
                        onChange={(e) => updateForm('name', e.target.value)}
                        placeholder="이름을 입력하세요"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.drawerLabel}>이메일</label>
                      <input
                        type="email"
                        className={styles.drawerInput}
                        value={formData.email}
                        onChange={(e) => updateForm('email', e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.drawerLabel}>전화번호</label>
                      <input
                        type="tel"
                        className={styles.drawerInput}
                        value={formData.phone}
                        onChange={(e) => updateForm('phone', e.target.value)}
                        placeholder="010-1234-5678"
                      />
                    </div>
                  </div>
                </div>
                {/* 소속 및 권한 */}
                <div className={styles.drawerGroup}>
                  <span className={styles.drawerGroupLabel}>소속 및 권한</span>
                  <div className={styles.drawerFields}>
                    <div className={styles.field}>
                      <label className={styles.drawerLabel}>부서</label>
                      <select
                        className={styles.drawerSelect}
                        value={formData.department}
                        onChange={(e) => updateForm('department', e.target.value)}
                      >
                        <option value="">부서 선택</option>
                        <option value="영업팀">영업팀</option>
                        <option value="물류팀">물류팀</option>
                        <option value="IT팀">IT팀</option>
                        <option value="재무팀">재무팀</option>
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.drawerLabel}>직급</label>
                      <select
                        className={styles.drawerSelect}
                        value={formData.position}
                        onChange={(e) => updateForm('position', e.target.value)}
                      >
                        <option value="">직급 선택</option>
                        <option value="사원">사원</option>
                        <option value="대리">대리</option>
                        <option value="과장">과장</option>
                        <option value="팀장">팀장</option>
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.drawerLabel}>권한</label>
                      <select
                        className={styles.drawerSelect}
                        value={formData.role}
                        onChange={(e) => updateForm('role', e.target.value)}
                      >
                        <option value="user">일반</option>
                        <option value="admin">관리자</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* 상태 설정 */}
                <div className={styles.drawerGroup}>
                  <span className={styles.drawerGroupLabel}>상태 설정</span>
                  <div className={styles.drawerFields}>
                    <div className={styles.field}>
                      <label className={styles.drawerLabel}>상태</label>
                      <select
                        className={styles.drawerSelect}
                        value={formData.status}
                        onChange={(e) => updateForm('status', e.target.value)}
                      >
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <footer className={styles.drawerFooter}>
                <button type="button" className={styles.drawerBtnCancel} onClick={handleCancel}>
                  취소
                </button>
                <button type="button" className={styles.drawerBtnSave} onClick={handleSave}>
                  저장
                </button>
              </footer>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
