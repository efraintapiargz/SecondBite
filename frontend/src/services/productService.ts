import api from './api';
import { Product, ProductsResponse, ProductForm } from '../types';

export const productService = {
  // Obtener todos los productos
  async getAll(filters?: {
    category?: string;
    max_price?: number;
    min_discount?: number;
    search?: string;
    sort_by?: string;
    limit?: number;
  }): Promise<ProductsResponse> {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  // Obtener producto por ID
  async getById(id: number): Promise<{ product: Product }> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Buscar productos cercanos
  async getNearby(
    latitude: number,
    longitude: number,
    radius?: number,
    filters?: any
  ): Promise<ProductsResponse> {
    const response = await api.get('/products/nearby', {
      params: { latitude, longitude, radius, ...filters },
    });
    return response.data;
  },

  // Crear producto (solo comerciantes)
  async create(data: ProductForm): Promise<{ message: string; product: Product }> {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Actualizar producto
  async update(id: number, data: Partial<ProductForm>): Promise<{ message: string; product: Product }> {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Eliminar producto
  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Obtener mis productos (comerciante)
  async getMyProducts(includeAll?: boolean): Promise<ProductsResponse> {
    const response = await api.get('/products/merchant/my-products', {
      params: { include_all: includeAll },
    });
    return response.data;
  },
};
