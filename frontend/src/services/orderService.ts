import api from './api';

export interface CreateOrderItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderPayload {
  merchant_id: number;
  total_amount: number;
  payment_method: 'store' | 'cash' | 'card' | 'transfer' | string;
  pickup_time?: string;
  notes?: string;
  items: CreateOrderItem[];
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload) {
    const res = await api.post('/orders', payload);
    return res.data as { message: string; order: any; receipt_number?: string };
  },

  async getMyOrders(params?: { status?: string; limit?: number }) {
    const res = await api.get('/orders/my-orders', { params });
    return res.data as { orders: any[]; count: number };
  },
};

export default orderService;
