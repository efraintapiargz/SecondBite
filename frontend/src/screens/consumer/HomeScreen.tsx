import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { CONFIG } from '../../utils/config';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { getCartItemsCount } = useCart();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => {
    const discount = item.discount_percentage;
    const daysUntilExpiry = Math.ceil((new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    const handlePress = () => {
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate('ProductDetail', { productId: item.id });
      }
    };
    
    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={styles.productHeader}>
            <View style={styles.productTitleContainer}>
              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              {discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{discount}% OFF</Text>
                </View>
              )}
            </View>
            <Text style={styles.merchantName}>{item.business_name}</Text>
          </View>

          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <View style={styles.productFooter}>
            <View style={styles.priceContainer}>
              {discount > 0 && (
                <Text style={styles.originalPrice}>{formatPrice(Number(item.original_price))}</Text>
              )}
              <Text style={styles.discountPrice}>{formatPrice(Number(item.discounted_price))}</Text>
            </View>
            
            <View style={styles.metaInfo}>
              <Text style={styles.stockText}>{item.quantity_available} disponibles</Text>
              {daysUntilExpiry <= 2 && (
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentText}>¡Expira pronto!</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={CONFIG.COLORS.primary} />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>SecondBite</Text>
          <Text style={styles.headerSubtitle}>Productos disponibles cerca de ti</Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => {
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate('Cart');
            }
          }}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {getCartItemsCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getCartItemsCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[CONFIG.COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No hay productos disponibles</Text>
            <Text style={styles.emptySubtitle}>
              Vuelve a intentarlo más tarde
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONFIG.COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CONFIG.COLORS.background,
  },
  header: {
    backgroundColor: CONFIG.COLORS.primary,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: CONFIG.COLORS.white,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: CONFIG.COLORS.white,
    opacity: 0.85,
    fontWeight: '400',
  },
  cartButton: {
    position: 'relative',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cartIcon: {
    fontSize: 22,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: CONFIG.COLORS.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: CONFIG.COLORS.primary,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: CONFIG.COLORS.textLight,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  productCard: {
    backgroundColor: CONFIG.COLORS.cardBackground,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardContent: {
    padding: 16,
  },
  productHeader: {
    marginBottom: 8,
  },
  productTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  merchantName: {
    fontSize: 13,
    color: CONFIG.COLORS.textLight,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: CONFIG.COLORS.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  originalPrice: {
    fontSize: 14,
    color: CONFIG.COLORS.textLight,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: CONFIG.COLORS.primary,
  },
  discountBadge: {
    backgroundColor: CONFIG.COLORS.danger,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: CONFIG.COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaInfo: {
    alignItems: 'flex-end',
  },
  stockText: {
    fontSize: 12,
    color: CONFIG.COLORS.textLight,
    marginBottom: 4,
  },
  urgentBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: CONFIG.COLORS.warning,
  },
  urgentText: {
    color: CONFIG.COLORS.warning,
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: CONFIG.COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});
