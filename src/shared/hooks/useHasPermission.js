import { useMemo } from 'react';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { hasPermission } from '../constants/permissions';

/**
 * 현재 사용자가 요구 권한을 갖고 있는지 반환
 * @param {string | string[]} required - 단일 permission 또는 배열
 * @returns {boolean}
 */
export function useHasPermission(required) {
  const { user } = useAuth();
  return useMemo(() => hasPermission(user, required), [user, required]);
}
