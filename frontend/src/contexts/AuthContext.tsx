import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';

const API_BASE = 'http://localhost:5000/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for stored token on app load
    const token = localStorage.getItem('auth_token');
    const userString = localStorage.getItem('auth_user');
    
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    const { user, token } = data.data;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    setAuthState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_BASE}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    const { user, token } = data.data;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    setAuthState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};