import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { CONFIG } from '../../utils/config';
import { formatPrice } from '../../utils/formatters';

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('');

  const categories = [
    { value: '', label: 'Todos' },
    { value: 'fruits', label: 'Frutas' },
    { value: 'vegetables', label: 'Verduras' },
    { value: 'bakery', label: 'Panadería' },
    { value: 'dairy', label: 'Lácteos' },
    { value: 'meat', label: 'Carnes' },
    { value: 'prepared_food', label: 'Preparados' },
    { value: 'beverages', label: 'Bebidas' },
  ];

  const sortOptions = [
    { value: '', label: 'Relevancia' },
    { value: 'discount', label: 'Mayor descuento' },
    { value: 'price_asc', label: 'Menor precio' },
    { value: 'price_desc', label: 'Mayor precio' },
    { value: 'expiry', label: 'Próximo a vencer' },
  ];

  useEffect(() => {
    // Debounce para la búsqueda
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() || selectedCategory) {
        searchProducts();
      } else {
        setProducts([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, sortBy]);

  const searchProducts = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      
      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }
      
      if (selectedCategory) {
        filters.category = selectedCategory;
      }
      
      if (sortBy) {
        filters.sort_by = sortBy;
      }

      const response = await productService.getAll(filters);
      setProducts(response.products);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const handlePress = () => {
      // Navegar al Stack parent desde el Tab Navigator
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate('ProductDetail', { productId: item.id });
      }
    };

    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={handlePress}
      >
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.merchantName}>🏪 {item.business_name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.originalPrice}>{formatPrice(Number(item.original_price))}</Text>
          <Text style={styles.discountPrice}>{formatPrice(Number(item.discounted_price))}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount_percentage}%</Text>
          </View>
        </View>
        <Text style={styles.quantity}>Stock: {item.quantity_available}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buscar Productos</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={CONFIG.COLORS.textLight}
          autoCorrect={false}
        />
      </View>

      {/* Categories */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Categorías</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryChip,
                selectedCategory === cat.value && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.value || null)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.value && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.filterTitle}>Ordenar por:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.sortScroll}
        >
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.sortChip,
                sortBy === option.value && styles.sortChipActive,
              ]}
              onPress={() => setSortBy(option.value)}
            >
              <Text
                style={[
                  styles.sortChipText,
                  sortBy === option.value && styles.sortChipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={CONFIG.COLORS.primary} />
        </View>
      ) : products.length > 0 ? (
        <FlatList
          style={{ flex: 1 }}
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={() => (
            <Text style={styles.resultsCount}>
              {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
            </Text>
          )}
        />
      ) : searchQuery.trim() || selectedCategory ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>😔</Text>
          <Text style={styles.emptyTitle}>No se encontraron productos</Text>
          <Text style={styles.emptySubtitle}>
            Intenta con otros términos de búsqueda
          </Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🔎</Text>
          <Text style={styles.emptyTitle}>Busca productos</Text>
          <Text style={styles.emptySubtitle}>
            Encuentra productos cerca de ti con descuento
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  searchContainer: {
    padding: 15,
    backgroundColor: CONFIG.COLORS.white,
    elevation: 2,
  },
  searchInput: {
    backgroundColor: CONFIG.COLORS.light,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: CONFIG.COLORS.text,
  },
  filtersContainer: {
    backgroundColor: CONFIG.COLORS.white,
    padding: 15,
    paddingTop: 10,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
    marginBottom: 10,
  },
  categoriesScroll: {
    marginBottom: 5,
  },
  categoryChip: {
    backgroundColor: CONFIG.COLORS.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: CONFIG.COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: CONFIG.COLORS.primary,
    borderColor: CONFIG.COLORS.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: CONFIG.COLORS.text,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: CONFIG.COLORS.white,
    fontWeight: 'bold',
  },
  sortContainer: {
    backgroundColor: CONFIG.COLORS.white,
    padding: 15,
    paddingTop: 10,
    marginBottom: 10,
  },
  sortScroll: {
    marginBottom: 5,
  },
  sortChip: {
    backgroundColor: CONFIG.COLORS.light,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: CONFIG.COLORS.border,
  },
  sortChipActive: {
    backgroundColor: `${CONFIG.COLORS.secondary}20`,
    borderColor: CONFIG.COLORS.secondary,
  },
  sortChipText: {
    fontSize: 13,
    color: CONFIG.COLORS.textLight,
  },
  sortChipTextActive: {
    color: CONFIG.COLORS.secondary,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
    flexGrow: 1,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: CONFIG.COLORS.textLight,
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: CONFIG.COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  productName: {
    fontSize: 17,
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
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 15,
    color: CONFIG.COLORS.textLight,
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountPrice: {
    fontSize: 20,
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
    fontSize: 13,
    color: CONFIG.COLORS.textLight,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
