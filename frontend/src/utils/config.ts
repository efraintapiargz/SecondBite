// Configuración de la aplicación
// NOTA: Usa tu IP local (no localhost) para probar en dispositivo físico
// Encuentra tu IP con: ipconfig (Windows) o ifconfig (Mac/Linux)
export const API_URL = 'http://172.27.64.1:3000/api';

export const CONFIG = {
  API_URL,
  DEFAULT_RADIUS_KM: 10,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  COLORS: {
    primary: '#F39C12',      // SecondBite brand orange
    primaryDark: '#E67E22',  // Darker orange
    primaryLight: '#F8B547', // Lighter orange
    secondary: '#3498DB',    // Blue accent
    success: '#27AE60',
    danger: '#E74C3C',
    warning: '#F39C12',
    info: '#3498DB',
    light: '#F5F6FA',
    dark: '#2C3E50',
    white: '#FFFFFF',
    text: '#2C3E50',
    textLight: '#7F8C8D',
    border: '#E1E8ED',
    background: '#F5F6FA',
    cardBackground: '#FFFFFF',
    accent: '#F39C12',
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
