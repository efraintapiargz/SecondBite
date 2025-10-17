// Configuración de la aplicación
export const API_URL = 'http://localhost:3000/api';

export const CONFIG = {
  API_URL,
  DEFAULT_RADIUS_KM: 10,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  COLORS: {
    primary: '#4CAF50',
    secondary: '#FF9800',
    success: '#4CAF50',
    danger: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    light: '#F5F5F5',
    dark: '#212121',
    white: '#FFFFFF',
    text: '#212121',
    textLight: '#757575',
    border: '#E0E0E0',
  },
  BUSINESS_TYPES: {
    restaurant: 'Restaurante',
    supermarket: 'Supermercado',
    bakery: 'Panadería',
    cafe: 'Cafetería',
    grocery: 'Tienda de abarrotes',
    other: 'Otro'
  },
  PRODUCT_CATEGORIES: {
    fruits: 'Frutas',
    vegetables: 'Verduras',
    bakery: 'Panadería',
    dairy: 'Lácteos',
    meat: 'Carnes',
    prepared_food: 'Comida preparada',
    beverages: 'Bebidas',
    other: 'Otro'
  },
  ORDER_STATUS: {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    ready: 'Listo',
    completed: 'Completado',
    cancelled: 'Cancelado'
  }
};

export default CONFIG;
