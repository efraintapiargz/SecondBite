import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { productService } from '../../services/productService';
import { CONFIG } from '../../utils/config';
import { Product } from '../../types';
import AppHeader from '../../components/AppHeader';

type Props = {
  navigation: any;
  route: any;
};

export default function ProductFormScreen({ navigation, route }: Props) {
  const editingProduct: Product | undefined = route.params?.product;
  const isEditing = !!editingProduct;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(editingProduct?.name || '');
  const [description, setDescription] = useState(editingProduct?.description || '');
  const [category, setCategory] = useState<string>(editingProduct?.category || 'other');
  const [originalPrice, setOriginalPrice] = useState(editingProduct?.original_price?.toString() || '');
  const [discountedPrice, setDiscountedPrice] = useState(editingProduct?.discounted_price?.toString() || '');
  const [quantity, setQuantity] = useState(editingProduct?.quantity_available?.toString() || '');
  const [expiryDate, setExpiryDate] = useState(editingProduct?.expiry_date?.split('T')[0] || '');
  const [imageUrl, setImageUrl] = useState(editingProduct?.image_url || '');

  const categories = [
    { value: 'fruits', label: '🍎 Frutas' },
    { value: 'vegetables', label: '🥬 Verduras' },
    { value: 'bakery', label: '🍞 Panadería' },
    { value: 'dairy', label: '🧀 Lácteos' },
    { value: 'meat', label: '🥩 Carnes' },
    { value: 'prepared_food', label: '🍽️ Comida preparada' },
    { value: 'beverages', label: '🥤 Bebidas' },
    { value: 'other', label: '📦 Otro' },
  ];

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre del producto es obligatorio');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return false;
    }
    if (!originalPrice || parseFloat(originalPrice) <= 0) {
      Alert.alert('Error', 'El precio original debe ser mayor a 0');
      return false;
    }
    if (!discountedPrice || parseFloat(discountedPrice) <= 0) {
      Alert.alert('Error', 'El precio con descuento debe ser mayor a 0');
      return false;
    }
    if (parseFloat(discountedPrice) >= parseFloat(originalPrice)) {
      Alert.alert('Error', 'El precio con descuento debe ser menor al precio original');
      return false;
    }
    if (!quantity || parseInt(quantity) <= 0) {
      Alert.alert('Error', 'La cantidad disponible debe ser mayor a 0');
      return false;
    }
    if (!expiryDate) {
      Alert.alert('Error', 'La fecha de vencimiento es obligatoria');
      return false;
    }

    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (expiry < today) {
      Alert.alert('Error', 'La fecha de vencimiento no puede ser en el pasado');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const productData = {
        name: name.trim(),
        description: description.trim(),
        category,
        original_price: originalPrice,
        discounted_price: discountedPrice,
        quantity_available: quantity,
        expiry_date: expiryDate,
        image_url: imageUrl.trim() || undefined,
      };

      if (isEditing) {
        await productService.update(editingProduct.id, productData as any);
        Alert.alert('Éxito', 'Producto actualizado correctamente');
      } else {
        await productService.create(productData as any);
        Alert.alert('Éxito', 'Producto creado correctamente');
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.error || `Error al ${isEditing ? 'actualizar' : 'crear'} el producto`
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = () => {
    if (originalPrice && discountedPrice) {
      const original = parseFloat(originalPrice);
      const discounted = parseFloat(discountedPrice);
      if (original > 0 && discounted > 0 && discounted < original) {
        const discount = Math.round(((original - discounted) / original) * 100);
        return `${discount}% de descuento`;
      }
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title={isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
        <View style={styles.form}>
          {/* Nombre */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre del Producto *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Pan integral del día"
              value={name}
              onChangeText={setName}
              maxLength={100}
            />
          </View>

          {/* Descripción */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe tu producto..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          {/* Categoría */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Categoría *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryButton,
                    category === cat.value && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat.value)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat.value && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Precios */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Precio Original *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={originalPrice}
                onChangeText={setOriginalPrice}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Precio con Descuento *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={discountedPrice}
                onChangeText={setDiscountedPrice}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {calculateDiscount() ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>💰 {calculateDiscount()}</Text>
            </View>
          ) : null}

          {/* Cantidad y Fecha */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Cantidad Disponible *</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Fecha de Vencimiento *</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                value={expiryDate}
                onChangeText={setExpiryDate}
              />
            </View>
          </View>

          <Text style={styles.helperText}>
            💡 Formato de fecha: 2025-12-31 (Año-Mes-Día)
          </Text>

          {/* URL de Imagen */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>URL de Imagen (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://ejemplo.com/imagen.jpg"
              value={imageUrl}
              onChangeText={setImageUrl}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          {/* Botón de Guardar */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={CONFIG.COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditing ? '💾 Guardar Cambios' : '➕ Crear Producto'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONFIG.COLORS.light,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: CONFIG.COLORS.white,
    borderWidth: 1,
    borderColor: CONFIG.COLORS.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: CONFIG.COLORS.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryButton: {
    backgroundColor: CONFIG.COLORS.white,
    borderWidth: 2,
    borderColor: CONFIG.COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
  },
  categoryButtonActive: {
    borderColor: CONFIG.COLORS.primary,
    backgroundColor: `${CONFIG.COLORS.primary}10`,
  },
  categoryButtonText: {
    fontSize: 14,
    color: CONFIG.COLORS.textLight,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: CONFIG.COLORS.primary,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  halfWidth: {
    flex: 1,
  },
  discountBadge: {
    backgroundColor: CONFIG.COLORS.success,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  discountText: {
    color: CONFIG.COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperText: {
    fontSize: 13,
    color: CONFIG.COLORS.textLight,
    marginTop: -10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: CONFIG.COLORS.primary,
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: CONFIG.COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
