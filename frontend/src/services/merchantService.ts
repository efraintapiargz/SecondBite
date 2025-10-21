import api from './api';
import { Merchant } from '../types';

export const merchantService = {
  async getMyInfo(): Promise<{ merchant: Merchant }> {
    const response = await api.get('/merchants/me/info');
    return response.data;
  },

  async updateMyInfo(data: Partial<Merchant>): Promise<{ message: string; merchant: Merchant }> {
    const response = await api.put('/merchants/me/info', data);
    return response.data;
  },

  async getMyDashboard(): Promise<{ stats: { totalProducts: number; activeProducts: number; pendingOrders: number; todayRevenue: number } }> {
    const response = await api.get('/merchants/me/dashboard');
    return response.data;
  },
};

export default merchantService;
