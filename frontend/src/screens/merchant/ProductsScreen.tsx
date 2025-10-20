import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { CONFIG } from '../../utils/config';
import { useFocusEffect } from '@react-navigation/native';
import { formatDate, formatPrice } from '../../utils/formatters';

type Props = {
  navigation: any;
};

export default function ProductsScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getMyProducts(true);
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

  // Recargar cuando la pantalla vuelve a tener foco
  useFocusEffect(
    React.useCallback(() => {
      loadProducts();
    }, [])
  );

  const handleAddProduct = () => {
    navigation.navigate('ProductForm');
  };

  const handleEditProduct = (product: Product) => {
    navigation.navigate('ProductForm', { product });
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que deseas eliminar "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.delete(product.id);
              Alert.alert('Éxito', 'Producto eliminado correctamente');
              loadProducts();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.error || 'Error al eliminar el producto');
            }
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <TouchableOpacity 
        style={styles.productContent}
        onPress={() => handleEditProduct(item)}
      >
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'available' ? CONFIG.COLORS.success : CONFIG.COLORS.textLight },
            ]}
          >
            <Text style={styles.statusText}>
              {item.status === 'available' ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.label}>Precio original:</Text>
          <Text style={styles.value}>{formatPrice(Number(item.original_price))}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.label}>Precio con descuento:</Text>
          <Text style={[styles.value, { color: CONFIG.COLORS.primary }]}>
            {formatPrice(Number(item.discounted_price))} (-{item.discount_percentage}%)
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.label}>Cantidad:</Text>
          <Text style={styles.value}>{item.quantity_available}</Text>
        </View>
        <Text style={styles.expiry}>
          ⏰ Vence: {formatDate(item.expiry_date)}
        </Text>
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditProduct(item)}
        >
          <Text style={styles.actionButtonText}>✏️ Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProduct(item)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>🛍️ Mis Productos</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>➕ Agregar Producto</Text>
      </TouchableOpacity>

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
            <Text style={styles.emptyText}>📦</Text>
            <Text style={styles.emptyTitle}>No tienes productos</Text>
            <Text style={styles.emptySubtitle}>
              Agrega tu primer producto para empezar
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: CONFIG.COLORS.textLight,
  },
  addButton: {
    backgroundColor: CONFIG.COLORS.primary,
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: CONFIG.COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
    paddingTop: 0,
    flexGrow: 1,
  },
  productCard: {
    backgroundColor: CONFIG.COLORS.white,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productContent: {
    padding: 15,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: CONFIG.COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: CONFIG.COLORS.textLight,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: CONFIG.COLORS.textLight,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
  },
  expiry: {
    fontSize: 14,
    color: CONFIG.COLORS.warning,
    marginTop: 5,
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
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: CONFIG.COLORS.border,
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: CONFIG.COLORS.light,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CONFIG.COLORS.border,
  },
  deleteButton: {
    backgroundColor: `${CONFIG.COLORS.danger}10`,
    borderColor: CONFIG.COLORS.danger,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
  },
  deleteButtonText: {
    color: CONFIG.COLORS.danger,
  },
});
