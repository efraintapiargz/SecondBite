import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { productService } from '../services/productService';
import { Product } from '../types';
import { CONFIG } from '../utils/config';
import { useCart } from '../context/CartContext';
import { formatDate, formatPrice } from '../utils/formatters';
import AppHeader from '../components/AppHeader';

type Props = {
  navigation: any;
  route: any;
};

export default function ProductDetailScreen({ navigation, route }: Props) {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, canAddProduct, getMerchantName } = useCart();

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getById(productId);
      setProduct(response.product);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el producto');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Validar si se puede agregar producto de este merchant
    if (!canAddProduct(product)) {
      const currentMerchantName = getMerchantName();
      Alert.alert(
        'Establecimiento diferente',
        `Tu carrito tiene productos de "${currentMerchantName}". Solo puedes hacer pedidos de un mismo establecimiento.\n\n¿Deseas vaciar el carrito y agregar este producto?`,
        [
          { 
            text: 'Cancelar', 
            style: 'cancel'
          },
          { 
            text: 'Vaciar y agregar', 
            style: 'destructive',
            onPress: () => {
              // Importar clearCart si no está disponible
              navigation.navigate('Cart');
            }
          },
        ]
      );
      return;
    }
    
    setAddingToCart(true);
    
    try {
      addToCart(product, quantity);
      
      // Pequeño delay para que el usuario vea el feedback
      setTimeout(() => {
        setAddingToCart(false);
        
        const price = Number(product.discounted_price || product.original_price);
        
        // Mostrar feedback visual
        Alert.alert(
          '✅ Producto Agregado',
          `${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${product.name}\n\nSubtotal: ${formatPrice(price * quantity)}`,
          [
            { 
              text: 'Continuar comprando', 
              style: 'cancel'
            },
            { 
              text: 'Ver carrito', 
              onPress: () => {
                navigation.navigate('Cart');
              }
            },
          ]
        );
        
        // Resetear cantidad
        setQuantity(1);
      }, 300);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      setAddingToCart(false);
      
      // Mostrar error específico
      Alert.alert('Error', error.message || 'No se pudo agregar al carrito');
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.quantity_available) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={CONFIG.COLORS.primary} />
      </View>
    );
  }

  if (!product) {
    return null;
  }

  const expiryDate = new Date(product.expiry_date);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysUntilExpiry <= 2;

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader 
        title="Detalle del Producto" 
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
        {/* Imagen del Producto */}
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📦</Text>
            <Text style={styles.placeholderSubtext}>Sin imagen</Text>
          </View>
        )}

        {/* Info Principal */}
        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            
            {/* Badges */}
            <View style={styles.badgesContainer}>
              <View style={[styles.badge, styles.discountBadge]}>
                <Text style={styles.badgeText}>-{product.discount_percentage}%</Text>
              </View>
              {isExpiringSoon && (
                <View style={[styles.badge, styles.urgentBadge]}>
                  <Text style={styles.badgeText}>⏰ ¡Expira pronto!</Text>
                </View>
              )}
            </View>

            {/* Precios */}
            <View style={styles.pricesContainer}>
              <Text style={styles.originalPrice}>
                {formatPrice(Number(product.original_price))}
              </Text>
              <Text style={styles.discountedPrice}>
                {formatPrice(Number(product.discounted_price))}
              </Text>
            </View>

            <Text style={styles.savings}>
              Ahorras {formatPrice(Number(product.original_price) - Number(product.discounted_price))}
            </Text>
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{product.description || 'Sin descripción'}</Text>
          </View>

          {/* Detalles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Categoría:</Text>
              <Text style={styles.detailValue}>{getCategoryName(product.category)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Disponibles:</Text>
              <Text style={styles.detailValue}>{product.quantity_available} unidades</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vence:</Text>
              <Text style={[styles.detailValue, isExpiringSoon && styles.urgentText]}>
                {formatDate(expiryDate)} ({daysUntilExpiry} días)
              </Text>
            </View>
          </View>

          {/* Info del Comercio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información del Comercio</Text>
            
            <View style={styles.merchantCard}>
              <View style={styles.merchantInfo}>
                <Text style={styles.merchantName}>{product.business_name || 'Comercio'}</Text>
                {product.merchant_rating && typeof product.merchant_rating === 'number' && (
                  <Text style={styles.merchantRating}>
                    ★ {product.merchant_rating.toFixed(1)}
                  </Text>
                )}
              </View>
              
              {product.address && (
                <Text style={styles.merchantAddress}>{product.address}</Text>
              )}

              {product.distance && typeof product.distance === 'number' && (
                <Text style={styles.merchantDistance}>
                  {product.distance.toFixed(1)} km de distancia
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer con acciones */}
      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={decrementQuantity}
            disabled={quantity <= 1}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={incrementQuantity}
            disabled={quantity >= product.quantity_available}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.addToCartButton, addingToCart && styles.addToCartButtonDisabled]}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <View style={styles.addingIndicator}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={[styles.addToCartButtonText, { marginLeft: 10 }]}>
                Agregando...
              </Text>
            </View>
          ) : (
            <Text style={styles.addToCartButtonText}>
              Agregar al carrito • {formatPrice(Number(product.discounted_price) * quantity)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getCategoryName(category: string): string {
  const categories: Record<string, string> = {
    fruits: 'Frutas',
    vegetables: 'Verduras',
    bakery: 'Panadería',
    dairy: 'Lácteos',
    meat: 'Carnes',
    prepared_food: 'Comida preparada',
    beverages: 'Bebidas',
    other: 'Otro',
  };
  return categories[category] || category;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONFIG.COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CONFIG.COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 300,
    backgroundColor: CONFIG.COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: CONFIG.COLORS.textLight,
    marginTop: 10,
  },
  content: {
    padding: 20,
  },
  mainInfo: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
    marginBottom: 10,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountBadge: {
    backgroundColor: CONFIG.COLORS.danger,
  },
  urgentBadge: {
    backgroundColor: CONFIG.COLORS.warning,
  },
  badgeText: {
    color: CONFIG.COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  pricesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 20,
    color: CONFIG.COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: CONFIG.COLORS.primary,
  },
  savings: {
    fontSize: 16,
    color: CONFIG.COLORS.success,
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: CONFIG.COLORS.text,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CONFIG.COLORS.border,
  },
  detailLabel: {
    fontSize: 15,
    color: CONFIG.COLORS.textLight,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
  },
  urgentText: {
    color: CONFIG.COLORS.danger,
  },
  merchantCard: {
    backgroundColor: CONFIG.COLORS.light,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CONFIG.COLORS.border,
  },
  merchantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  merchantName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
  },
  merchantRating: {
    fontSize: 15,
    fontWeight: '600',
    color: CONFIG.COLORS.warning,
  },
  merchantAddress: {
    fontSize: 14,
    color: CONFIG.COLORS.textLight,
    marginTop: 5,
  },
  merchantDistance: {
    fontSize: 14,
    color: CONFIG.COLORS.primary,
    fontWeight: '600',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: CONFIG.COLORS.white,
    borderTopWidth: 1,
    borderTopColor: CONFIG.COLORS.border,
    gap: 15,
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CONFIG.COLORS.light,
    borderRadius: 10,
    padding: 5,
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: CONFIG.COLORS.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: CONFIG.COLORS.primary,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
    paddingHorizontal: 20,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: CONFIG.COLORS.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  addToCartButtonDisabled: {
    opacity: 0.6,
  },
  addingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: CONFIG.COLORS.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
});
