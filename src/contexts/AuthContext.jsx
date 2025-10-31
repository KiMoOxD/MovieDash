import React, { createContext, useContext, useEffect, useState } from 'react';
import authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken); else localStorage.removeItem('refreshToken');
  }, [refreshToken]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [user]);

  const login = async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    const data = res?.data ?? res;
    // accept various shapes
    const newToken = data.token ?? data.accessToken ?? data.Token;
    const newRefresh = data.refreshToken ?? data.refresh ?? data.RefreshToken;
    const userObj = data.user ?? data.userInfo ?? data.userData ?? data;

    if (newToken) setToken(newToken);
    if (newRefresh) setRefreshToken(newRefresh);
    if (userObj && typeof userObj === 'object') setUser(userObj);

    return { token: newToken, refreshToken: newRefresh, user: userObj };
  };

  const logout = async () => {
    try {
      // inform backend
      const rt = refreshToken;
      if (rt) {
        await authApi.logout({ refreshToken: rt });
      }
    } catch (err) {
      // ignore errors
    }
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const refresh = async () => {
    try {
      const res = await authApi.refresh({ token, refreshToken });
      const data = res?.data ?? res;
      const newToken = data.token ?? data.accessToken ?? data.Token;
      const newRefresh = data.refreshToken ?? data.refresh ?? data.RefreshToken;
      if (newToken) setToken(newToken);
      if (newRefresh) setRefreshToken(newRefresh);
      return { token: newToken, refreshToken: newRefresh };
    } catch (err) {
      // failed to refresh
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, login, logout, refresh, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
