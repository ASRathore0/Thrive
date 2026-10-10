import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { apiRequest, clearAuthToken, getAuthToken, isMockAuthEnabled, setAuthToken } from '../lib/api';

export type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};

export type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mockUser: User = {
  id: 1,
  name: 'Demo User',
  email: 'demo@travelomate.in',
  role: 'admin',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = getAuthToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiRequest<{ user: User }>('/me');
        setUser(response.user ?? null);
      } catch {
        clearAuthToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiRequest<LoginResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      setAuthToken(response.token);
      setUser(response.user);
      return;
    } catch (error) {
      if (!isMockAuthEnabled()) {
        throw error;
      }

      // Fallback for local development without the Laravel API running yet.
      setAuthToken('mock-token');
      setUser({
        ...mockUser,
        email: credentials.email,
        name: credentials.email.split('@')[0] || mockUser.name,
      });
    }
  };

  const logout = async () => {
    try {
      const token = getAuthToken();
      if (token && !isMockAuthEnabled()) {
        await apiRequest('/logout', { method: 'POST' });
      }
    } catch {
      // Ignore logout errors and clear local session anyway.
    } finally {
      clearAuthToken();
      setUser(null);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
