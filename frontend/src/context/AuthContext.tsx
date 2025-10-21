import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User, LoginForm, RegisterForm } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (data: LoginForm) => Promise<void>;
  signUp: (data: RegisterForm) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const storedUser = await authService.getStoredUser();
      const token = await authService.getStoredToken();

      if (storedUser && token) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(data: LoginForm) {
    try {
      const response = await authService.login(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  }

  async function signUp(data: RegisterForm) {
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      throw error;
    }
  }

  async function updateUser(data: Partial<User>) {
    try {
      const response = await authService.updateProfile(data);
      // Fetch latest profile to keep in sync (includes merchant info if applicable)
      const profile = await authService.getProfile();
      setUser(profile.user);
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
