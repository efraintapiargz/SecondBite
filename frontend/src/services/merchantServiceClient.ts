import api from './api';

export const merchantService = {
  async getMyDashboard(): Promise<{ stats: { totalProducts: number; activeProducts: number; pendingOrders: number; todayRevenue: number } }> {
    const response = await api.get('/merchants/me/dashboard');
    return response.data;
  },
};

export default merchantService;
