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
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { CONFIG } from '../../utils/config';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    
    return (
      <TouchableOpacity style={styles.productCard}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.merchantName}>🏪 {item.business_name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>${item.original_price}</Text>
            <Text style={styles.discountPrice}>${item.discounted_price}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          </View>
          <Text style={styles.quantity}>Disponibles: {item.quantity_available}</Text>
          <Text style={styles.expiry}>
            ⏰ Vence: {new Date(item.expiry_date).toLocaleDateString()}
          </Text>
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
        <Text style={styles.headerTitle}>🍽️ SecondBite</Text>
        <Text style={styles.headerSubtitle}>Productos cerca de ti</Text>
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
            <Text style={styles.emptyText}>😔</Text>
            <Text style={styles.emptyTitle}>No hay productos disponibles</Text>
            <Text style={styles.emptySubtitle}>
              Intenta más tarde o cambia tu ubicación
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
    backgroundColor: CONFIG.COLORS.light,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CONFIG.COLORS.light,
  },
  header: {
    backgroundColor: CONFIG.COLORS.primary,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: CONFIG.COLORS.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: CONFIG.COLORS.white,
    opacity: 0.9,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: CONFIG.COLORS.textLight,
  },
  listContainer: {
    padding: 15,
    flexGrow: 1,
  },
  productCard: {
    backgroundColor: CONFIG.COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
    marginBottom: 5,
  },
  merchantName: {
    fontSize: 14,
    color: CONFIG.COLORS.textLight,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: CONFIG.COLORS.textLight,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: CONFIG.COLORS.textLight,
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: CONFIG.COLORS.primary,
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: CONFIG.COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: CONFIG.COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 14,
    color: CONFIG.COLORS.textLight,
    marginBottom: 5,
  },
  expiry: {
    fontSize: 14,
    color: CONFIG.COLORS.warning,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: CONFIG.COLORS.textLight,
    textAlign: 'center',
  },
});
