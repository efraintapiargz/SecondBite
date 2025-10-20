// Tipos de usuario
export type UserType = 'consumer' | 'merchant';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  user_type: UserType;
  profile_image?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  merchant?: Merchant;
}

// Comercio
export interface Merchant {
  id: number;
  user_id: number;
  business_name: string;
  business_type: 'restaurant' | 'supermarket' | 'bakery' | 'cafe' | 'grocery' | 'other';
  description?: string;
  business_hours?: Record<string, string>;
  logo_image?: string;
  banner_image?: string;
  rating: number;
  total_reviews: number;
  total_products_sold: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  available_products?: number;
}

// Producto
export interface Product {
  id: number;
  merchant_id: number;
  name: string;
  description?: string;
  category: 'fruits' | 'vegetables' | 'bakery' | 'dairy' | 'meat' | 'prepared_food' | 'beverages' | 'other';
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  quantity_available: number;
  expiry_date: string;
  image_url?: string;
  status: 'available' | 'reserved' | 'sold' | 'expired';
  created_at: string;
  business_name?: string;
  business_type?: string;
  merchant_rating?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

// Pedido
export interface Order {
  id: number;
  consumer_id: number;
  merchant_id: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  payment_method: 'cash' | 'card' | 'transfer';
  pickup_time?: string;
  notes?: string;
  created_at: string;
  consumer_name?: string;
  consumer_phone?: string;
  merchant_name?: string;
  business_name?: string;
  merchant_phone?: string;
  address?: string;
  logo_image?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product_name?: string;
  image_url?: string;
}

// Formularios
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  user_type: UserType;
  address?: string;
  latitude?: number;
  longitude?: number;
  // Campos adicionales para comerciantes
  business_name?: string;
  business_type?: string;
  description?: string;
}

export interface ProductForm {
  name: string;
  description?: string;
  category: string;
  original_price: string;
  discounted_price: string;
  quantity_available: string;
  expiry_date: string;
  image_url?: string;
}

// Respuestas de API
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
  details?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ProductsResponse {
  products: Product[];
  count: number;
}

export interface MerchantsResponse {
  merchants: Merchant[];
  count: number;
}

export interface OrdersResponse {
  orders: Order[];
  count: number;
}

// Navegación
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ProductDetail: { productId: number };
  ProductForm: { product?: Product };
  Cart: undefined;
  Checkout: undefined;
  MerchantDetail: { merchantId: number };
  OrderDetail: { orderId: number };
  CreateProduct: undefined;
  EditProduct: { productId: number };
};

export type ConsumerTabParamList = {
  Home: undefined;
  Search: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type MerchantTabParamList = {
  Dashboard: undefined;
  Products: undefined;
  Orders: undefined;
  Profile: undefined;
};
