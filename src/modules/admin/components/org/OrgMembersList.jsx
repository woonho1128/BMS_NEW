import React, { useState, useMemo } from 'react';
import { EmptyState } from './EmptyState';
import { Badge } from './Badge';
import styles from './OrgMembersList.module.css';

function getInitials(name) {
  if (!name) return '?';
  const match = name.match(/[가-힣]/g);
  if (match && match.length > 0) {
    return match.length >= 2 ? match[0] + match[match.length - 1] : match[0];
  }
  return name.charAt(0).toUpperCase();
}

export function OrgMembersList({ members, searchQuery = '' }) {
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const query = searchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.title.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  if (members.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.notice}>
          <p className={styles.noticeText}>
            조직원 추가/이동/비활성화는 사용자관리에서 수행합니다.
          </p>
        </div>
        <EmptyState message="조직원이 없습니다." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.notice}>
        <p className={styles.noticeText}>
          조직원 추가/이동/비활성화는 사용자관리에서 수행합니다.
        </p>
      </div>
      {filteredMembers.length === 0 ? (
        <EmptyState message="조건에 맞는 조직원이 없습니다." />
      ) : (
        <div className={styles.memberList}>
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className={styles.memberCard}
              onClick={() => {
                // 실제로는 사용자 상세로 이동
                console.log('사용자 상세:', member.id);
              }}
            >
              <div className={styles.memberAvatar}>
                <span>{getInitials(member.name)}</span>
              </div>
              <div className={styles.memberInfo}>
                <div className={styles.memberNameRow}>
                  <span className={styles.memberName}>{member.name}</span>
                  <Badge variant={member.status === 'active' ? 'status' : 'status inactive'}>
                    {member.status === 'active' ? '재직' : '비활성'}
                  </Badge>
                </div>
                <div className={styles.memberMeta}>
                  <span className={styles.memberTitle}>{member.title}</span>
                  <span className={styles.memberEmail}>{member.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
