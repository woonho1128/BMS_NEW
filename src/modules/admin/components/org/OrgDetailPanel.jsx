import React, { useState, useCallback } from 'react';
import { Card, CardBody } from '../../../../shared/components/Card';
import { Button } from '../../../../shared/components/Button/Button';
import { Badge } from './Badge';
import { OrgMembersList } from './OrgMembersList';
import { OrgHistoryList } from './OrgHistoryList';
import { getMembersByOrgId, getOrgHistoryByOrgId, getOrgsList } from '../../data/adminMock';
import styles from './OrgDetailPanel.module.css';

const TABS = [
  { id: 'info', label: '조직 정보' },
  { id: 'members', label: '조직원' },
  { id: 'history', label: '변경 이력' },
];

export function OrgDetailPanel({ org, onAddChild, onEdit, onDelete, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    parentId: '',
    order: 1,
    isActive: true,
  });
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  const members = org ? getMembersByOrgId(org.id) : [];
  const history = org ? getOrgHistoryByOrgId(org.id) : [];
  const allOrgs = getOrgsList();

  React.useEffect(() => {
    if (org) {
      setFormData({
        code: org.code || '',
        name: org.name || '',
        parentId: org.parentId || '',
        order: org.order || 1,
        isActive: org.isActive !== undefined ? org.isActive : true,
      });
      setIsEditing(false);
    }
  }, [org]);

  const getParentName = useCallback(
    (parentId) => {
      if (!parentId) return null;
      const parent = allOrgs.find((o) => o.id === parentId);
      return parent ? parent.name : null;
    },
    [allOrgs]
  );

  const getBreadcrumb = useCallback(() => {
    if (!org) return [];
    const breadcrumb = [];
    let current = org;
    while (current) {
      breadcrumb.unshift(current.name);
      if (current.parentId) {
        current = allOrgs.find((o) => o.id === current.parentId);
      } else {
        current = null;
      }
    }
    return breadcrumb;
  }, [org, allOrgs]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    if (onEdit) {
      onEdit(org);
    }
  }, [onEdit, org]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(formData);
    } else {
      setIsEditing(false);
    }
  }, [formData, onSave]);

  const handleCancel = useCallback(() => {
    if (org) {
      setFormData({
        code: org.code || '',
        name: org.name || '',
        parentId: org.parentId || '',
        order: org.order || 1,
        isActive: org.isActive !== undefined ? org.isActive : true,
      });
    }
    setIsEditing(false);
    if (onCancel) {
      onCancel();
    }
  }, [org, onCancel]);

  const handleDelete = useCallback(() => {
    if (!org) return;
    const hasChildren = allOrgs.some((o) => o.parentId === org.id);
    if (hasChildren) {
      if (
        !window.confirm(
          `하위 조직이 존재합니다. 정말 삭제하시겠습니까?\n조직: ${org.name} (${org.code})`
        )
      ) {
        return;
      }
    } else {
      if (!window.confirm(`정말 삭제하시겠습니까?\n조직: ${org.name} (${org.code})`)) {
        return;
      }
    }
    onDelete && onDelete(org.id);
  }, [org, allOrgs, onDelete]);

  if (!org) {
    return (
      <Card className={styles.emptyCard}>
        <CardBody>
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>좌측에서 조직을 선택하거나</p>
            <p className={styles.emptyText}>상단의 [+ 조직 추가] 버튼을 클릭하세요</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const breadcrumb = getBreadcrumb();

  return (
    <Card className={styles.detailCard}>
      <CardBody>
        {/* 탭 헤더 */}
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 조직 정보 탭 */}
        {activeTab === 'info' && (
          <div className={styles.tabContent}>
            {/* 상단 요약 카드 */}
            <div className={styles.summaryCard}>
              <h2 className={styles.orgTitle}>{org.name}</h2>
              <div className={styles.breadcrumb}>
                {breadcrumb.map((name, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className={styles.breadcrumbSeparator}> &gt; </span>}
                    <span className={styles.breadcrumbItem}>{name}</span>
                  </React.Fragment>
                ))}
              </div>
              <div className={styles.summaryMeta}>
                <Badge variant="level">LEVEL {org.level}</Badge>
                <span className={styles.memberCount}>조직원 {members.length}명</span>
              </div>
            </div>

            {/* 폼 카드 */}
            <div className={styles.formCard}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>조직코드 *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.code}
                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="조직코드를 입력하세요"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>조직명 *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="조직명을 입력하세요"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>상위조직</label>
                  <select
                    className={styles.select}
                    value={formData.parentId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
                    disabled={!isEditing}
                  >
                    <option value="">상위조직 선택 (없음)</option>
                    {allOrgs
                      .filter((o) => o.id !== org.id)
                      .map((orgOption) => (
                        <option key={orgOption.id} value={orgOption.id}>
                          {orgOption.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>정렬순서</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={formData.order}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 1 }))
                    }
                    disabled={!isEditing}
                    min="1"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>사용여부</label>
                  <select
                    className={styles.select}
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isActive: e.target.value === 'true' }))
                    }
                    disabled={!isEditing}
                  >
                    <option value="true">활성</option>
                    <option value="false">비활성</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className={styles.actions}>
              {isEditing ? (
                <>
                  <Button variant="secondary" onClick={handleCancel}>
                    취소
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
                    저장
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => onAddChild && onAddChild()}>
                    하위 조직 추가
                  </Button>
                  <Button variant="primary" onClick={handleEdit}>
                    수정
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    삭제
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* 조직원 탭 */}
        {activeTab === 'members' && (
          <div className={styles.tabContent}>
            <div className={styles.searchBox}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="조직원 검색"
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
              />
            </div>
            <OrgMembersList members={members} searchQuery={memberSearchQuery} />
          </div>
        )}

        {/* 변경 이력 탭 */}
        {activeTab === 'history' && (
          <div className={styles.tabContent}>
            <OrgHistoryList history={history} />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
