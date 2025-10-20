import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useCart, CartItem } from '../../context/CartContext';
import { CONFIG } from '../../utils/config';
import { formatPrice } from '../../utils/formatters';
import AppHeader from '../../components/AppHeader';

type Props = {
  navigation: any;
};

export default function CartScreen({ navigation }: Props) {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartItemsCount,
    getMerchantName,
  } = useCart();

  const handleRemoveItem = (productId: number, productName: string) => {
    console.log('🗑️ handleRemoveItem called with:', { productId, productName, type: typeof productId });
    
    // Para web, usar confirm nativo que es más confiable
    if (Platform.OS === 'web') {
      // @ts-ignore - window está disponible en web
      const confirmed = typeof window !== 'undefined' && window.confirm(`¿Deseas eliminar "${productName}" del carrito?`);
      console.log('User response (web):', confirmed);
      if (confirmed) {
        console.log('User confirmed removal (web), ID:', productId);
        try {
          removeFromCart(productId);
          console.log('removeFromCart executed successfully');
        } catch (error) {
          console.error('Error in removeFromCart:', error);
        }
      }
      return;
    }
    
    // Para móvil, usar Alert nativo
    Alert.alert(
      'Eliminar producto',
      `¿Deseas eliminar "${productName}" del carrito?`,
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
          onPress: () => console.log('User cancelled removal')
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            console.log('User confirmed removal, ID:', productId);
            try {
              removeFromCart(productId);
              console.log('removeFromCart executed successfully');
            } catch (error) {
              console.error('Error in removeFromCart:', error);
            }
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    console.log('🧹 handleClearCart called');
    
    // Para web, usar confirm nativo
    if (Platform.OS === 'web') {
      // @ts-ignore - window está disponible en web
      const confirmed = typeof window !== 'undefined' && window.confirm('¿Estás seguro de que deseas vaciar el carrito?');
      console.log('User response (web):', confirmed);
      if (confirmed) {
        console.log('User confirmed clear cart (web)');
        try {
          clearCart();
          console.log('clearCart executed successfully');
        } catch (error) {
          console.error('Error in clearCart:', error);
        }
      }
      return;
    }
    
    // Para móvil, usar Alert nativo
    Alert.alert(
      'Vaciar carrito',
      '¿Estás seguro de que deseas vaciar el carrito?',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
          onPress: () => console.log('User cancelled clear')
        },
        {
          text: 'Vaciar',
          style: 'destructive',
          onPress: () => {
            console.log('User confirmed clear cart');
            try {
              clearCart();
              console.log('clearCart executed successfully');
            } catch (error) {
              console.error('Error in clearCart:', error);
            }
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de continuar');
      return;
    }
    navigation.navigate('Checkout');
  };

  const incrementQuantity = (item: CartItem) => {
    if (item.quantity < item.product.quantity_available) {
      updateQuantity(item.product.id, item.quantity + 1);
    } else {
      Alert.alert('Stock limitado', `Solo hay ${item.product.quantity_available} unidades disponibles`);
    }
  };

  const decrementQuantity = (item: CartItem) => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    } else {
      handleRemoveItem(item.product.id, item.product.name);
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const price = Number(item.product.discounted_price || item.product.original_price);
    const subtotal = price * item.quantity;

    return (
      <View style={styles.cartItem}>
        {/* Imagen del producto */}
        {item.product.image_url ? (
          <Image source={{ uri: item.product.image_url }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}

        {/* Información del producto */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.product.name}
          </Text>
          <Text style={styles.merchantName}>{item.product.business_name || 'Comercio'}</Text>
          
          {/* Precio */}
          <View style={styles.priceRow}>
            {item.product.discounted_price && Number(item.product.discounted_price) < Number(item.product.original_price) && (
              <Text style={styles.originalPrice}>{formatPrice(Number(item.product.original_price))}</Text>
            )}
            <Text style={styles.price}>{formatPrice(price)}</Text>
          </View>

          {/* Controles de cantidad */}
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => decrementQuantity(item)}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => incrementQuantity(item)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subtotal y eliminar */}
        <View style={styles.rightColumn}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.product.id, item.product.name)}
          >
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.subtotal}>{formatPrice(subtotal)}</Text>
        </View>
      </View>
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptyText}>Agrega productos para empezar tu pedido</Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopButtonText}>Ir a comprar</Text>
      </TouchableOpacity>
    </View>
  );

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader 
          title="Mi Carrito" 
          onBack={() => navigation.goBack()}
        />
        {renderEmptyCart()}
      </View>
    );
  }

  const total = getCartTotal();
  const itemsCount = getCartItemsCount();
  const merchantName = getMerchantName();

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader 
        title="Mi Carrito" 
        onBack={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearButton}>Vaciar</Text>
          </TouchableOpacity>
        }
      />

      {/* Información del establecimiento */}
      {merchantName && (
        <View style={styles.merchantBanner}>
          <Text style={styles.merchantBannerIcon}>🏪</Text>
          <View style={styles.merchantBannerContent}>
            <Text style={styles.merchantBannerLabel}>Pedido de:</Text>
            <Text style={styles.merchantBannerName}>{merchantName}</Text>
          </View>
        </View>
      )}

      {/* Lista de productos */}
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer con totales */}
      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Productos ({itemsCount})</Text>
          <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Continuar con el pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  clearButton: {
    fontSize: 14,
    color: CONFIG.COLORS.white,
    fontWeight: '600',
  },
  merchantBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  merchantBannerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  merchantBannerContent: {
    flex: 1,
  },
  merchantBannerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  merchantBannerName: {
    fontSize: 16,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
  },
  listContent: {
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
    marginBottom: 4,
  },
  merchantName: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CONFIG.COLORS.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: CONFIG.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 20,
    color: CONFIG.COLORS.danger,
    fontWeight: 'bold',
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: CONFIG.COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CONFIG.COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: CONFIG.COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
