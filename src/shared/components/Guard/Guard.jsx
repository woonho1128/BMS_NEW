import React from 'react';
import { useAuth } from '../../../modules/auth/hooks/useAuth';
import { hasPermission } from '../../constants/permissions';

/**
 * Permission 기반 Guard — 권한 없으면 children 미렌더, fallback 또는 null
 * - Role 하드코딩 금지, permission만 사용
 * - "보이는데 클릭 안 됨" UX 금지 → 통과 시에만 children 표시
 *
 * @param {{
 *   permission: string | string[];
 *   fallback?: React.ReactNode;
 *   children: React.ReactNode;
 * }} props
 */
export function Guard({ permission, fallback = null, children }) {
  const { user } = useAuth();
  const allowed = hasPermission(user, permission);

  if (!allowed) return fallback;
  return <>{children}</>;
}
