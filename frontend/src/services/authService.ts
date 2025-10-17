import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginForm, RegisterForm, AuthResponse, User } from '../types';

export const authService = {
  // Registro
  async register(data: RegisterForm): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login
  async login(data: LoginForm): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  // Obtener perfil
  async getProfile(): Promise<{ user: User }> {
    const response = await api.get('/auth/profile');
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  // Actualizar perfil
  async updateProfile(data: Partial<User>): Promise<{ message: string; user: User }> {
    const response = await api.put('/auth/profile', data);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  // Cambiar contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.put('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  // Obtener usuario guardado
  async getStoredUser(): Promise<User | null> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Obtener token guardado
  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  },
};
