import React, { useState, useCallback } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { Card, CardBody } from '../../../shared/components/Card';
import { getPermissionGroupsList } from '../data/adminMock';
import styles from './PermissionAdminPage.module.css';

export function PermissionAdminPage() {
  const [groups] = useState(getPermissionGroupsList());
  const [showForm, setShowForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleAdd = useCallback(() => {
    setSelectedGroup(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((group) => {
    setSelectedGroup(group);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((group) => {
    if (window.confirm(`정말 삭제하시겠습니까?\n권한그룹: ${group.name}`)) {
      console.log('삭제:', group.id);
      alert('삭제되었습니다.');
    }
  }, []);

  const handleSave = useCallback(() => {
    console.log('저장:', selectedGroup);
    alert(selectedGroup ? '수정되었습니다.' : '등록되었습니다.');
    setShowForm(false);
    setSelectedGroup(null);
  }, [selectedGroup]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setSelectedGroup(null);
  }, []);

  return (
    <PageShell
      path="/admin/permission"
      title="권한관리"
      description="권한 그룹 조회 및 관리"
      actions={
        <Button variant="primary" onClick={handleAdd}>
          + 권한그룹 등록
        </Button>
      }
    >
      <div className={styles.page}>
        <section className={styles.section} aria-label="권한 그룹 목록">
          <div className={styles.count}>{groups.length}건</div>
          <div className={styles.cardGrid}>
            {groups.length === 0 ? (
              <p className={styles.empty}>권한 그룹이 없습니다.</p>
            ) : (
              groups.map((group) => (
                <Card key={group.id} className={styles.groupCard}>
                  <CardBody>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.groupName}>{group.name}</h3>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleEdit(group)}
                          aria-label="수정"
                        >
                          수정
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDelete(group)}
                          aria-label="삭제"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    <p className={styles.description}>{group.description}</p>
                    <div className={styles.meta}>
                      <span className={styles.metaItem}>
                        사용자 수: <strong>{group.userCount}명</strong>
                      </span>
                    </div>
                    <div className={styles.permissions}>
                      <span className={styles.permissionsLabel}>권한:</span>
                      <div className={styles.permissionList}>
                        {group.permissions.map((perm, idx) => (
                          <span key={idx} className={styles.permissionTag}>
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </section>

        {showForm && (
          <Card title={selectedGroup ? '권한그룹 수정' : '권한그룹 등록'} className={styles.formCard}>
            <CardBody>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>그룹명 *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={selectedGroup?.name || ''}
                    placeholder="권한그룹명을 입력하세요"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>설명</label>
                  <textarea
                    className={styles.textarea}
                    value={selectedGroup?.description || ''}
                    placeholder="권한그룹 설명을 입력하세요"
                    rows={3}
                  />
                </div>
                <div className={styles.fieldFull}>
                  <label className={styles.label}>권한 선택</label>
                  <div className={styles.permissionCheckboxes}>
                    {['all', 'sales:read', 'sales:write', 'sales:approve', 'delivery:read', 'delivery:write', 'admin:read', 'admin:write'].map((perm) => (
                      <label key={perm} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={selectedGroup?.permissions?.includes(perm) || false}
                        />
                        <span>{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.formActions}>
                <Button variant="secondary" onClick={handleCancel}>
                  취소
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  {selectedGroup ? '수정' : '등록'}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
