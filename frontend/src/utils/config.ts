// Configuración de la aplicación
// NOTA: Usa tu IP local (no localhost) para probar en dispositivo físico
// Encuentra tu IP con: ipconfig (Windows) o ifconfig (Mac/Linux)
export const API_URL = 'http://192.168.1.125:3000/api';

export const CONFIG = {
  API_URL,
  DEFAULT_RADIUS_KM: 10,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  COLORS: {
    primary: '#2E7D32',      // Verde oscuro más elegante
    secondary: '#FF6F00',    // Naranja más sofisticado
    success: '#388E3C',
    danger: '#D32F2F',
    warning: '#F57C00',
    info: '#1976D2',
    light: '#F5F5F5',
    dark: '#212121',
    white: '#FFFFFF',
    text: '#212121',
    textLight: '#757575',
    border: '#E0E0E0',
    background: '#FAFAFA',
    cardBackground: '#FFFFFF',
    accent: '#00C853',
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
