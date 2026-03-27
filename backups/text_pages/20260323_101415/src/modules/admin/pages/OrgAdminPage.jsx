import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { Card, CardBody } from '../../../shared/components/Card';
import { OrgTree } from '../components/org/OrgTree';
import { OrgDetailPanel } from '../components/org/OrgDetailPanel';
import {
  getOrgsList,
  getOrgById,
  getChildOrgCount,
} from '../data/adminMock';
import styles from './OrgAdminPage.module.css';

export function OrgAdminPage() {
  const [orgs] = useState(getOrgsList());
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' | 'edit' | 'addChild'
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    parentId: '',
    level: 1,
    order: 1,
    isActive: true,
  });
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  const selectedOrg = useMemo(() => {
    return selectedOrgId ? getOrgById(selectedOrgId) : null;
  }, [selectedOrgId]);

  // 초기 진입 시 첫 번째 루트 조직 자동 선택
  useEffect(() => {
    if (!selectedOrgId && orgs.length > 0) {
      const rootOrg = orgs.find((o) => !o.parentId);
      if (rootOrg) {
        setSelectedOrgId(rootOrg.id);
      }
    }
  }, [orgs, selectedOrgId]);

  const handleSelect = useCallback((orgId) => {
    setSelectedOrgId(orgId);
    setShowForm(false);
    setShowMobilePanel(true);
  }, []);

  const handleAdd = useCallback(() => {
    setFormMode('add');
    setFormData({
      code: '',
      name: '',
      parentId: '',
      level: 1,
      order: 1,
      isActive: true,
    });
    setShowForm(true);
    setSelectedOrgId(null);
    setShowMobilePanel(true);
  }, []);

  const handleAddChild = useCallback(() => {
    if (!selectedOrg) return;
    setFormMode('addChild');
    setFormData({
      code: '',
      name: '',
      parentId: selectedOrg.id,
      level: selectedOrg.level + 1,
      order: 1,
      isActive: true,
    });
    setShowForm(true);
  }, [selectedOrg]);

  const handleEdit = useCallback(() => {
    if (!selectedOrg) return;
    setFormMode('edit');
    setFormData({
      code: selectedOrg.code || '',
      name: selectedOrg.name || '',
      parentId: selectedOrg.parentId || '',
      level: selectedOrg.level || 1,
      order: selectedOrg.order || 1,
      isActive: selectedOrg.isActive !== undefined ? selectedOrg.isActive : true,
    });
    setShowForm(true);
    setShowMobilePanel(true);
  }, [selectedOrg]);

  const handleDelete = useCallback((orgId) => {
    const org = getOrgById(orgId);
    if (!org) return;

    const hasChildren = getChildOrgCount(orgId, orgs) > 0;
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

    // 실제로는 API 호출
    console.log('삭제:', orgId);
    alert('삭제되었습니다.');
    setSelectedOrgId(null);
    setShowForm(false);
    setShowMobilePanel(false);
  }, [orgs]);

  const handleSave = useCallback(
    (data) => {
      // OrgDetailPanel에서 전달된 formData 사용
      const saveData = data || formData;
      // 실제로는 API 호출
      console.log('저장:', { mode: formMode, formData: saveData });
      alert(formMode === 'edit' ? '수정되었습니다.' : '등록되었습니다.');
      setShowForm(false);
      setShowMobilePanel(false);
      if (formMode === 'addChild' && selectedOrg) {
        setSelectedOrgId(selectedOrg.id);
      } else if (formMode === 'add' && saveData.parentId) {
        setSelectedOrgId(saveData.parentId);
      } else if (formMode === 'edit' && selectedOrg) {
        // 수정 후에도 선택 유지
      }
    },
    [formMode, formData, selectedOrg]
  );

  const handleCancel = useCallback(() => {
    setShowForm(false);
    if (!selectedOrg) {
      setShowMobilePanel(false);
    }
  }, [selectedOrg]);

  return (
    <PageShell
      path="/admin/org"
      title="조직관리"
      description="조직 구조 조회 및 관리"
      actions={
        <Button variant="primary" onClick={handleAdd}>
          + 조직 추가
        </Button>
      }
    >
      <div className={styles.page}>
        <div className={styles.layout}>
          {/* 좌측 트리 패널 */}
          <div className={styles.treePanel}>
            <Card className={styles.treeCard}>
              <CardBody>
                <div className={styles.treeHeader}>
                  <h3 className={styles.treeTitle}>조직 구조</h3>
                  <span className={styles.treeCount}>{orgs.length}개 조직</span>
                </div>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="조직 검색 (코드/명)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className={styles.treeWrapper}>
                  <OrgTree
                    orgs={orgs}
                    selectedOrgId={selectedOrgId}
                    onSelect={handleSelect}
                    searchQuery={searchQuery}
                    onAddChild={(org) => {
                      setFormMode('addChild');
                      setFormData({
                        code: '',
                        name: '',
                        parentId: org.id,
                        level: org.level + 1,
                        order: 1,
                        isActive: true,
                      });
                      setShowForm(true);
                      setShowMobilePanel(true);
                    }}
                    onEdit={(org) => {
                      setSelectedOrgId(org.id);
                      setFormMode('edit');
                      setFormData({
                        code: org.code || '',
                        name: org.name || '',
                        parentId: org.parentId || '',
                        level: org.level || 1,
                        order: org.order || 1,
                        isActive: org.isActive !== undefined ? org.isActive : true,
                      });
                      setShowForm(true);
                      setShowMobilePanel(true);
                    }}
                    onDelete={handleDelete}
                  />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* 우측 상세 패널 */}
          <div className={styles.detailPanel}>
            {showForm && (formMode === 'add' || formMode === 'addChild') ? (
              <Card
                title={formMode === 'addChild' ? '하위 조직 추가' : '조직 추가'}
                className={styles.formCard}
              >
                <CardBody>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.label}>조직코드 *</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.code}
                        onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
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
                        placeholder="조직명을 입력하세요"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>상위조직</label>
                      <select
                        className={styles.select}
                        value={formData.parentId}
                        onChange={(e) => {
                          const parentId = e.target.value;
                          const parent = parentId ? getOrgById(parentId) : null;
                          setFormData((prev) => ({
                            ...prev,
                            parentId,
                            level: parent ? parent.level + 1 : 1,
                          }));
                        }}
                        disabled={formMode === 'addChild'}
                      >
                        <option value="">상위조직 선택 (없음)</option>
                        {orgs.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                      {formMode === 'addChild' && (
                        <span className={styles.hint}>선택된 조직의 하위로 추가됩니다</span>
                      )}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>레벨</label>
                      <input
                        type="number"
                        className={styles.input}
                        value={formData.level}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, level: parseInt(e.target.value) || 1 }))
                        }
                        min="1"
                        max="10"
                        disabled={formMode === 'addChild'}
                      />
                      {formMode === 'addChild' && (
                        <span className={styles.hint}>상위 조직 레벨 + 1로 자동 설정</span>
                      )}
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
                      >
                        <option value="true">활성</option>
                        <option value="false">비활성</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <Button variant="secondary" onClick={handleCancel}>
                      취소
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                      등록
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <OrgDetailPanel
                org={selectedOrg}
                onAddChild={handleAddChild}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
          </div>
        </div>

        {/* 모바일 패널 오버레이 */}
        {showMobilePanel && (
          <>
            <div
              className={styles.mobileOverlay}
              onClick={() => setShowMobilePanel(false)}
            />
            <div className={styles.mobilePanel}>
              <div className={styles.mobilePanelHeader}>
                <button
                  className={styles.mobileCloseBtn}
                  onClick={() => setShowMobilePanel(false)}
                  aria-label="닫기"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className={styles.mobilePanelContent}>
                {showForm && formMode !== 'edit' ? (
                  <Card
                    title={formMode === 'addChild' ? '하위 조직 추가' : '조직 추가'}
                    className={styles.formCard}
                  >
                    <CardBody>
                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label className={styles.label}>조직코드 *</label>
                          <input
                            type="text"
                            className={styles.input}
                            value={formData.code}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, code: e.target.value }))
                            }
                            placeholder="조직코드를 입력하세요"
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>조직명 *</label>
                          <input
                            type="text"
                            className={styles.input}
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="조직명을 입력하세요"
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>상위조직</label>
                          <select
                            className={styles.select}
                            value={formData.parentId}
                            onChange={(e) => {
                              const parentId = e.target.value;
                              const parent = parentId ? getOrgById(parentId) : null;
                              setFormData((prev) => ({
                                ...prev,
                                parentId,
                                level: parent ? parent.level + 1 : 1,
                              }));
                            }}
                            disabled={formMode === 'addChild'}
                          >
                            <option value="">상위조직 선택 (없음)</option>
                            {orgs.map((org) => (
                              <option key={org.id} value={org.id}>
                                {org.name}
                              </option>
                            ))}
                          </select>
                          {formMode === 'addChild' && (
                            <span className={styles.hint}>선택된 조직의 하위로 추가됩니다</span>
                          )}
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>레벨</label>
                          <input
                            type="number"
                            className={styles.input}
                            value={formData.level}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                level: parseInt(e.target.value) || 1,
                              }))
                            }
                            min="1"
                            max="10"
                            disabled={formMode === 'addChild'}
                          />
                          {formMode === 'addChild' && (
                            <span className={styles.hint}>상위 조직 레벨 + 1로 자동 설정</span>
                          )}
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>정렬순서</label>
                          <input
                            type="number"
                            className={styles.input}
                            value={formData.order}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                order: parseInt(e.target.value) || 1,
                              }))
                            }
                            min="1"
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>사용여부</label>
                          <select
                            className={styles.select}
                            value={formData.isActive ? 'true' : 'false'}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                isActive: e.target.value === 'true',
                              }))
                            }
                          >
                            <option value="true">활성</option>
                            <option value="false">비활성</option>
                          </select>
                        </div>
                      </div>
                      <div className={styles.formActions}>
                        <Button variant="secondary" onClick={handleCancel}>
                          취소
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                          등록
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ) : (
                  <OrgDetailPanel
                    org={selectedOrg}
                    onAddChild={handleAddChild}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
