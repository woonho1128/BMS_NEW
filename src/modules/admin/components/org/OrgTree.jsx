import React, { useState, useCallback, useMemo } from 'react';
import { getMembersByOrgId } from '../../data/adminMock';
import styles from './OrgTree.module.css';

function FolderIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function TeamIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ChevronIcon({ expanded, className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {expanded ? <polyline points="6 9 12 15 18 9" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

export function OrgTree({ orgs, selectedOrgId, onSelect, searchQuery = '', onAddChild = null, onEdit = null, onDelete = null }) {
  const [expandedIds, setExpandedIds] = useState(new Set(['1']));
  const [contextMenu, setContextMenu] = useState(null);

  const treeData = useMemo(() => {
    const orgMap = new Map();
    const rootOrgs = [];

    orgs.forEach((org) => {
      orgMap.set(org.id, { ...org, children: [] });
    });

    orgs.forEach((org) => {
      const node = orgMap.get(org.id);
      if (org.parentId) {
        const parent = orgMap.get(org.parentId);
        if (parent) parent.children.push(node);
      } else {
        rootOrgs.push(node);
      }
    });

    const sortByOrder = (nodes) => {
      nodes.sort((a, b) => a.order - b.order);
      nodes.forEach((node) => node.children.length > 0 && sortByOrder(node.children));
    };

    sortByOrder(rootOrgs);
    return rootOrgs;
  }, [orgs]);

  const filteredTreeData = useMemo(() => {
    if (!searchQuery.trim()) return treeData;
    const query = searchQuery.toLowerCase();
    const filterNode = (node) => {
      const matches = node.code.toLowerCase().includes(query) || node.name.toLowerCase().includes(query);
      const filteredChildren = node.children.map(filterNode).filter(Boolean);
      if (matches || filteredChildren.length > 0) return { ...node, children: filteredChildren };
      return null;
    };
    return treeData.map(filterNode).filter(Boolean);
  }, [treeData, searchQuery]);

  const toggleExpand = useCallback((id, event) => {
    event.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleNodeClick = useCallback(
    (org) => {
      onSelect(org.id);
      setContextMenu(null);
    },
    [onSelect]
  );

  const handleContextMenu = useCallback((event, org) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, orgId: org.id });
  }, []);

  const handleMenuAction = useCallback(
    (action, orgId) => {
      setContextMenu(null);
      const org = orgs.find((o) => o.id === orgId);
      if (!org) return;
      if (action === 'addChild') onAddChild && onAddChild(org);
      if (action === 'edit') onEdit && onEdit(org);
      if (action === 'delete') onDelete && onDelete(orgId);
    },
    [orgs, onAddChild, onEdit, onDelete]
  );

  const getMemberCount = useCallback((orgId) => getMembersByOrgId(orgId).length, []);

  const renderTreeNode = (node, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedOrgId === node.id;
    const indent = level * 20;
    const memberCount = getMemberCount(node.id);

    return (
      <React.Fragment key={node.id}>
        <div
          className={`${styles.treeNode} ${isSelected ? styles.selected : ''} ${level > 0 ? styles.treeNodeChild : ''}`}
          style={{ paddingLeft: `${indent}px` }}
          onClick={() => handleNodeClick(node)}
          onContextMenu={(event) => handleContextMenu(event, node)}
        >
          <div className={styles.treeNodeContent}>
            {hasChildren ? (
              <button type="button" className={styles.chevronBtn} onClick={(event) => toggleExpand(node.id, event)} aria-label={isExpanded ? '접기' : '펼치기'}>
                <ChevronIcon expanded={isExpanded} className={styles.chevronIcon} />
              </button>
            ) : (
              <span className={styles.chevronSpacer} />
            )}
            <span className={styles.nodeIcon}>{hasChildren ? <FolderIcon className={styles.folderIcon} /> : <TeamIcon className={styles.teamIcon} />}</span>
            <div className={styles.orgInfo}>
              <span className={styles.orgName}>{node.name}</span>
            </div>
            {memberCount > 0 && <span className={styles.memberCount}>{memberCount}명</span>}
            <button
              type="button"
              className={styles.menuBtn}
              onClick={(event) => {
                event.stopPropagation();
                handleContextMenu(event, node);
              }}
              aria-label="메뉴"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && <div className={styles.treeChildren}>{node.children.map((child) => renderTreeNode(child, level + 1))}</div>}
      </React.Fragment>
    );
  };

  return (
    <div className={styles.treeContainer}>
      {contextMenu && (
        <>
          <div className={styles.contextMenuOverlay} onClick={() => setContextMenu(null)} />
          <div className={styles.contextMenu} style={{ left: contextMenu.x, top: contextMenu.y }}>
            <button className={styles.menuItem} onClick={() => handleMenuAction('addChild', contextMenu.orgId)}>
              하위 조직 추가
            </button>
            <button className={styles.menuItem} onClick={() => handleMenuAction('edit', contextMenu.orgId)}>
              조직 수정
            </button>
            <button className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={() => handleMenuAction('delete', contextMenu.orgId)}>
              삭제
            </button>
          </div>
        </>
      )}

      {filteredTreeData.length === 0 ? <div className={styles.empty}>조직을 찾을 수 없습니다.</div> : filteredTreeData.map((root) => renderTreeNode(root, 0))}
    </div>
  );
}
