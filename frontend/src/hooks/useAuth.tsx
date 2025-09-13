'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiService, User, LoginRequest, RegisterRequest } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const profile = await apiService.getProfile();
          setUser(profile);
        } catch (error) {
          try {
            await apiService.refreshToken();
            const profile = await apiService.getProfile();
            setUser(profile);
          } catch (refreshError) {
            localStorage.removeItem('access_token');
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(credentials);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await apiService.register(userData);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updatedUser = await apiService.updateProfile(updates);
      setUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
