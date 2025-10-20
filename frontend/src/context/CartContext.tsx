import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getMerchantId: () => number | null;
  getMerchantName: () => string | null;
  canAddProduct: (product: Product) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = '@secondbite_cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito desde AsyncStorage al iniciar
  useEffect(() => {
    loadCart();
  }, []);

  // Guardar carrito en AsyncStorage cada vez que cambie
  useEffect(() => {
    if (isLoaded) {
      saveCart();
    }
  }, [cart, isLoaded]);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        setCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      // Verificar si el carrito tiene productos de otro establecimiento
      if (prevCart.length > 0) {
        const currentMerchantId = prevCart[0].product.merchant_id;
        if (product.merchant_id !== currentMerchantId) {
          // No agregar producto de diferente establecimiento
          throw new Error('Solo puedes agregar productos del mismo establecimiento');
        }
      }

      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevCart.findIndex(
        (item) => Number(item.product.id) === Number(product.id)
      );

      if (existingItemIndex !== -1) {
        // Si ya existe, actualizar la cantidad
        const newCart = [...prevCart];
        const newQuantity = newCart[existingItemIndex].quantity + quantity;
        
        // No exceder el stock disponible
        if (newQuantity <= product.quantity_available) {
          newCart[existingItemIndex].quantity = newQuantity;
        } else {
          newCart[existingItemIndex].quantity = product.quantity_available;
        }
        
        return newCart;
      } else {
        // Si no existe, agregar nuevo item
        return [
          ...prevCart,
          {
            id: `${product.id}-${Date.now()}`,
            product,
            quantity: Math.min(quantity, product.quantity_available),
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    console.log('🗑️ Removing product from cart:', productId, 'Type:', typeof productId);
    setCart((prevCart) => {
      console.log('Current cart before remove:', prevCart.map(item => ({ id: item.product.id, type: typeof item.product.id })));
      const newCart = prevCart.filter((item) => {
        // Comparación más robusta que maneja strings y números
        const itemId = Number(item.product.id);
        const targetId = Number(productId);
        const shouldKeep = itemId !== targetId;
        console.log(`Item ${itemId} ${shouldKeep ? 'kept' : 'removed'}`);
        return shouldKeep;
      });
      console.log('Cart after remove:', newCart.length, 'items');
      return newCart;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        // Comparación más robusta
        if (Number(item.product.id) === Number(productId)) {
          // No exceder el stock disponible
          const newQuantity = Math.min(quantity, item.product.quantity_available);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    console.log('🧹 Clearing entire cart');
    setCart([]);
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => {
      const price = item.product.discounted_price || item.product.original_price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemsCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getMerchantId = (): number | null => {
    if (cart.length === 0) return null;
    return cart[0].product.merchant_id;
  };

  const getMerchantName = (): string | null => {
    if (cart.length === 0) return null;
    return cart[0].product.business_name || 'Establecimiento';
  };

  const canAddProduct = (product: Product): boolean => {
    if (cart.length === 0) return true;
    return cart[0].product.merchant_id === product.merchant_id;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        getMerchantId,
        getMerchantName,
        canAddProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export type { CartItem };
