import React, { useEffect, useMemo, useState } from 'react';
import './SettingsPage.css';

export function SettingsPage({
  canManage,
  editWindow,
  onSave,
  dateEditors,
  editorOptions,
  onSaveDateEditors,
  enabledRoles,
  onSaveEnabledRoles,
  systemSettings,
  onSaveSystemSettings,
}) {
  const [from, setFrom] = useState(editWindow?.from || '');
  const [to, setTo] = useState(editWindow?.to || '');
  const [rangeMsg, setRangeMsg] = useState('');

  const [localEditors, setLocalEditors] = useState(dateEditors || []);
  const [editorsMsg, setEditorsMsg] = useState('');

  const [localRoles, setLocalRoles] = useState(enabledRoles && enabledRoles.length ? enabledRoles : ['admin']);
  const [rolesMsg, setRolesMsg] = useState('');

  const [localSystem, setLocalSystem] = useState(systemSettings || { autoSave: true, historyLogging: true, notifications: true });
  const [systemMsg, setSystemMsg] = useState('');

  useEffect(() => { setLocalEditors(dateEditors || []); }, [dateEditors]);
  useEffect(() => { setLocalRoles(enabledRoles && enabledRoles.length ? enabledRoles : ['admin']); }, [enabledRoles]);
  useEffect(() => { setLocalSystem(systemSettings || { autoSave: true, historyLogging: true, notifications: true }); }, [systemSettings]);

  const error = useMemo(() => {
    if (from && to && from > to) return '시작일은 종료일보다 늦을 수 없습니다.';
    return '';
  }, [from, to]);

  const canSubmit = canManage && !error;
  const canEditorsSubmit = canManage;

  const roleError = useMemo(() => {
    if (!localRoles || localRoles.length === 0) return '최소 한 개 이상의 역할을 선택해야 합니다.';
    return '';
  }, [localRoles]);

  const canRolesSubmit = canManage && !roleError;

  /* ── 조직도 트리 데이터 ── */
  const orgTree = {
    root: { key: 'admin', title: 'Admin', icon: '👑', desc: '모든 권한 보유', level: 0 },
    children: [
      { key: 'manager', title: '결정권', icon: '📋', desc: '승인 및 검토 권한', level: 1 },
      { key: 'operator', title: '관리자', icon: '🔑', desc: '입력 및 수정 권한', level: 1 },
    ],
    leaf: { key: 'viewer', title: '담당자', icon: '👀', desc: '조회만 가능', level: 2 },
  };

  const toggleRole = (key, next) => {
    setLocalRoles((prev) => {
      const set = new Set(prev || []);
      if (next) set.add(key);
      else set.delete(key);
      return Array.from(set);
    });
  };

  const isRoleOn = (key) => (localRoles || []).includes(key);

  /* ── 트리 노드 렌더 ── */
  const TreeNode = ({ node }) => {
    const checked = isRoleOn(node.key);
    return (
      <label className={`orgNode orgNode--lv${node.level} ${checked ? 'orgNode--on' : ''}`}>
        <input
          type="checkbox"
          checked={checked}
          disabled={!canManage}
          onChange={(e) => toggleRole(node.key, e.target.checked)}
        />
        <div className="orgNode__badge" aria-hidden="true">{node.icon}</div>
        <div className="orgNode__body">
          <div className="orgNode__title">{node.title}</div>
          <div className="orgNode__desc">{node.desc}</div>
        </div>
        <div className={`orgNode__check ${checked ? 'orgNode__check--on' : ''}`} aria-hidden="true" />
      </label>
    );
  };

  return (
    <div className="settings2">
      <div className="settings2__header">
        <div className="settings2__title">⚙️ 설정</div>
        <div className="settings2__desc">비대칭 레이아웃으로 핵심 설정을 한 화면에 정리합니다.</div>
      </div>

      <div className="settings2__container">
        {/* ═══════ Left (big): 사용자 역할 — 조직도 트리 ═══════ */}
        <section className="settingsCard settingsCard--roles">
          <div className="settingsCard__head">
            <div className="settingsCard__headTitle">👤 사용자 역할 설정</div>
            <div className="settingsCard__headDesc">조직도 트리에서 사용할 역할을 선택하세요. 체크된 역할만 시스템에서 활성화됩니다.</div>
          </div>

          {!canManage && <div className="settingsCard__notice">관리자만 변경할 수 있습니다.</div>}

          {/* 조직도 트리 */}
          <div className="orgTree">
            {/* Level 0 - root */}
            <div className="orgTree__row orgTree__row--root">
              <TreeNode node={orgTree.root} />
            </div>

            {/* 연결선 (root → children) */}
            <div className="orgTree__connector orgTree__connector--down" aria-hidden="true">
              <div className="orgTree__vline" />
              <div className="orgTree__hline" />
              <div className="orgTree__vlineBranchL" />
              <div className="orgTree__vlineBranchR" />
            </div>

            {/* Level 1 - children */}
            <div className="orgTree__row orgTree__row--children">
              {orgTree.children.map((c) => (
                <TreeNode key={c.key} node={c} />
              ))}
            </div>

            {/* 연결선 (children → leaf) */}
            <div className="orgTree__connector orgTree__connector--up" aria-hidden="true">
              <div className="orgTree__vlineBranchL" />
              <div className="orgTree__vlineBranchR" />
              <div className="orgTree__hline" />
              <div className="orgTree__vline" />
            </div>

            {/* Level 2 - leaf */}
            <div className="orgTree__row orgTree__row--leaf">
              <TreeNode node={orgTree.leaf} />
            </div>
          </div>

          {roleError && <div className="settingsCard__error">{roleError}</div>}
          {rolesMsg && <div className="settingsCard__ok">{rolesMsg}</div>}

          <div className="settingsCard__actions">
            <button
              type="button"
              className="sBtn sBtn--primary"
              disabled={!canRolesSubmit}
              onClick={() => {
                onSaveEnabledRoles?.(localRoles);
                setRolesMsg('저장되었습니다.');
                setTimeout(() => setRolesMsg(''), 1500);
              }}
            >
              <span className="sBtn__icon" aria-hidden="true">💾</span>저장하기
            </button>
            <button
              type="button"
              className="sBtn sBtn--secondary"
              onClick={() => {
                setLocalRoles(enabledRoles && enabledRoles.length ? enabledRoles : ['admin']);
                setRolesMsg('취소되었습니다.');
                setTimeout(() => setRolesMsg(''), 1500);
              }}
            >
              <span className="sBtn__icon" aria-hidden="true">↩️</span>취소
            </button>
          </div>
        </section>

        {/* ═══════ Right-top: 기간 설정 ═══════ */}
        <section className="settingsCard settingsCard--date">
          <div className="settingsCard__head">
            <div className="settingsCard__headTitle">📅 수정 가능 기간</div>
            <div className="settingsCard__headDesc">기간 외에는 수정이 불가능합니다.</div>
          </div>

          {!canManage && <div className="settingsCard__notice">관리자만 변경할 수 있습니다.</div>}

          <div className="settingsDateInputs">
            <label className="settingsField">
              <div className="settingsField__label">시작</div>
              <input className="settingsField__input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} disabled={!canManage} />
            </label>
            <div className="settingsDateInputs__tilde" aria-hidden="true">~</div>
            <label className="settingsField">
              <div className="settingsField__label">종료</div>
              <input className="settingsField__input" type="date" value={to} onChange={(e) => setTo(e.target.value)} disabled={!canManage} />
            </label>
          </div>

          {error && <div className="settingsCard__error">{error}</div>}

          <div className="settingsRangePreview">
            <div className="settingsRangePreview__label">현재 설정</div>
            <div className="settingsRangePreview__value">
              {from || to ? (
                <b>{from || '—'} ~ {to || '—'}</b>
              ) : (
                <b>제한 없음</b>
              )}
            </div>
            <div className="settingsRangePreview__bar" aria-hidden="true">
              <div className="settingsRangePreview__fill" style={{ width: from || to ? '72%' : '100%' }} />
            </div>
          </div>

          {rangeMsg && <div className="settingsCard__ok">{rangeMsg}</div>}

          <div className="settingsCard__actions settingsCard__actions--compact">
            <button
              type="button"
              className="sBtn sBtn--primary"
              disabled={!canSubmit}
              onClick={() => {
                onSave?.({ from, to });
                setRangeMsg('저장되었습니다.');
                setTimeout(() => setRangeMsg(''), 1500);
              }}
            >
              <span className="sBtn__icon" aria-hidden="true">💾</span>저장
            </button>
            <button
              type="button"
              className="sBtn sBtn--secondary"
              onClick={() => {
                setFrom(editWindow?.from || '');
                setTo(editWindow?.to || '');
                setRangeMsg('취소되었습니다.');
                setTimeout(() => setRangeMsg(''), 1500);
              }}
            >
              <span className="sBtn__icon" aria-hidden="true">↩️</span>취소
            </button>
          </div>
        </section>

        {/* ═══════ Right-bottom: 시스템 설정 ═══════ */}
        <section className="settingsCard settingsCard--system">
          <div className="settingsCard__head">
            <div className="settingsCard__headTitle">🔐 시스템 설정</div>
          </div>

          {!canManage && <div className="settingsCard__notice">관리자만 변경할 수 있습니다.</div>}

          <div className="systemToggles">
            <label className="systemToggle">
              <div className="systemToggle__left">
                <div className="systemToggle__icon" aria-hidden="true">💾</div>
                <div className="systemToggle__text">
                  <div className="systemToggle__title">자동 저장</div>
                  <div className="systemToggle__meta">{localSystem.autoSave ? 'ON' : 'OFF'}</div>
                </div>
              </div>
              <span className={`switch ${localSystem.autoSave ? 'switch--on' : ''}`}>
                <input type="checkbox" checked={!!localSystem.autoSave} disabled={!canManage} onChange={(e) => setLocalSystem((p) => ({ ...p, autoSave: e.target.checked }))} />
                <span className="switch__track" aria-hidden="true" />
                <span className="switch__thumb" aria-hidden="true" />
              </span>
            </label>

            <label className="systemToggle">
              <div className="systemToggle__left">
                <div className="systemToggle__icon" aria-hidden="true">🧾</div>
                <div className="systemToggle__text">
                  <div className="systemToggle__title">변경 기록</div>
                  <div className="systemToggle__meta">{localSystem.historyLogging ? 'ON' : 'OFF'}</div>
                </div>
              </div>
              <span className={`switch ${localSystem.historyLogging ? 'switch--on' : ''}`}>
                <input type="checkbox" checked={!!localSystem.historyLogging} disabled={!canManage} onChange={(e) => setLocalSystem((p) => ({ ...p, historyLogging: e.target.checked }))} />
                <span className="switch__track" aria-hidden="true" />
                <span className="switch__thumb" aria-hidden="true" />
              </span>
            </label>

            <label className="systemToggle">
              <div className="systemToggle__left">
                <div className="systemToggle__icon" aria-hidden="true">🔔</div>
                <div className="systemToggle__text">
                  <div className="systemToggle__title">알림</div>
                  <div className="systemToggle__meta">{localSystem.notifications ? 'ON' : 'OFF'}</div>
                </div>
              </div>
              <span className={`switch ${localSystem.notifications ? 'switch--on' : ''}`}>
                <input type="checkbox" checked={!!localSystem.notifications} disabled={!canManage} onChange={(e) => setLocalSystem((p) => ({ ...p, notifications: e.target.checked }))} />
                <span className="switch__track" aria-hidden="true" />
                <span className="switch__thumb" aria-hidden="true" />
              </span>
            </label>
          </div>

          <div className="dateEditorsCompact">
            <div className="dateEditorsCompact__title">🗓️ 날짜 변경 가능 인원</div>
            <div className="dateEditorsCompact__chips">
              {(editorOptions || []).map((name) => {
                const checked = (localEditors || []).includes(name);
                return (
                  <label key={name} className={`chip ${checked ? 'chip--on' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!canManage}
                      onChange={(e) => {
                        const next = e.target.checked;
                        setLocalEditors((prev) => {
                          const set = new Set(prev || []);
                          if (next) set.add(name);
                          else set.delete(name);
                          return Array.from(set);
                        });
                      }}
                    />
                    <span>{name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {editorsMsg && <div className="settingsCard__ok">{editorsMsg}</div>}
          {systemMsg && <div className="settingsCard__ok">{systemMsg}</div>}

          <div className="settingsCard__actions settingsCard__actions--compact">
            <button
              type="button"
              className="sBtn sBtn--primary"
              disabled={!canEditorsSubmit}
              onClick={() => {
                onSaveDateEditors?.(localEditors);
                onSaveSystemSettings?.(localSystem);
                setEditorsMsg('저장되었습니다.');
                setSystemMsg('저장되었습니다.');
                setTimeout(() => { setEditorsMsg(''); setSystemMsg(''); }, 1500);
              }}
            >
              <span className="sBtn__icon" aria-hidden="true">💾</span>저장
            </button>
            <button
              type="button"
              className="sBtn sBtn--secondary"
              onClick={() => {
                setLocalEditors(dateEditors || []);
                setLocalSystem(systemSettings || { autoSave: true, historyLogging: true, notifications: true });
                setEditorsMsg('취소되었습니다.');
                setSystemMsg('취소되었습니다.');
                setTimeout(() => { setEditorsMsg(''); setSystemMsg(''); }, 1500);
              }}
            >
              <span className="sBtn__icon" aria-hidden="true">↩️</span>취소
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
