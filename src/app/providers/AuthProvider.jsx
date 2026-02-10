import React, { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import { login as loginApi } from '../../modules/auth/api/auth.api';

const TOKEN_KEY = 'bms-token';
const USER_KEY = 'bms-user';

export const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useLocalStorage(TOKEN_KEY, null);
  const [userJson, setUserJson] = useLocalStorage(USER_KEY, null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useMemo(() => {
    if (!token) return null;
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }, [token, userJson]);

  const login = useCallback(async (userId, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi({ userId, password });
      if (res.success && res.token) {
        setToken(res.token);
        if (res.user) {
          setUserJson(JSON.stringify(res.user));
        }
        return { success: true };
      }
      setError(res.message || '로그인에 실패했습니다.');
      return { success: false, message: res.message };
    } catch (e) {
      setError('로그인 중 오류가 발생했습니다.');
      return { success: false, message: '로그인 중 오류가 발생했습니다.' };
    } finally {
      setLoading(false);
    }
  }, [setToken, setUserJson]);

  const logout = useCallback(() => {
    setToken(null);
    setUserJson(null);
    setError(null);
  }, [setToken, setUserJson]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      login,
      logout,
      loading,
      error,
    }),
    [token, user, login, logout, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
