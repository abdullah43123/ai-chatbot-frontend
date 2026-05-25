import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'abdai_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((userData) => {
    const userWithId = { ...userData, id: Date.now().toString(), avatar: userData.username.charAt(0).toUpperCase() };
    setUser(userWithId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithId));
  }, []);

  const register = useCallback((userData) => {
    const userWithId = { ...userData, id: Date.now().toString(), avatar: userData.username.charAt(0).toUpperCase() };
    setUser(userWithId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithId));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
