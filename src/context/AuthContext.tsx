import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  login: (email: string, pass?: string) => Promise<UserProfile>;
  register: (name: string, email: string, phone?: string) => Promise<UserProfile>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());

  useEffect(() => {
    const current = authService.getCurrentUser();
    setUser(current);
  }, []);

  const login = async (email: string, pass?: string) => {
    const logged = await authService.login(email, pass);
    setUser(logged);
    return logged;
  };

  const register = async (name: string, email: string, phone?: string) => {
    const registered = await authService.register(name, email, phone);
    setUser(registered);
    return registered;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    const updated = authService.switchRole(newRole);
    setUser(updated);
  };

  const role = user?.role || 'customer';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider value={{ user, role, isAdmin, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
