import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { tokenManager } from '../lib/api';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthContextType,
  AuthResponse,
} from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getAccessToken();
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify token is still valid by fetching current user
          await refreshUser();
        } catch (error) {
          console.error('Failed to restore session:', error);
          tokenManager.clearTokens();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post<{ success: boolean; data: AuthResponse }>(
        '/auth/login',
        credentials
      );
      const { user, accessToken, refreshToken } = response.data.data;

      tokenManager.setTokens(accessToken, refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post<{ success: boolean; data: AuthResponse }>(
        '/auth/register',
        data
      );
      const { user, accessToken, refreshToken } = response.data.data;

      tokenManager.setTokens(accessToken, refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get<{ success: boolean; data: { user: User } }>('/auth/me');
      const { user } = response.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
