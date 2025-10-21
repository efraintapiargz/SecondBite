import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { CONFIG } from '../../utils/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatPrice } from '../../utils/formatters';
import AppHeader from '../../components/AppHeader';
import api from '../../services/api';

type Props = {
  navigation: any;
};

export default function CheckoutScreen({ navigation }: Props) {
  const { cart, getCartTotal, clearCart, getMerchantId, getMerchantName } = useCart();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  // Modal de éxito removido para navegar directo al comprobante y evitar confusiones

  const total = getCartTotal();
  const merchantId = getMerchantId();
  const merchantName = getMerchantName();
  const getApiBase = () => {
    // CONFIG.API_URL suele terminar en /api
    try {
      if (CONFIG.API_URL.endsWith('/api')) return CONFIG.API_URL.slice(0, -4);
      return CONFIG.API_URL;
    } catch {
      return CONFIG.API_URL;
    }
  };
  
  // Generar hora de recogida automáticamente (1 hora después)
  const getPickupTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16).replace('T', ' '); // Formato: 2025-10-20 16:30
  };

  const handlePlaceOrder = async () => {
    console.log('📦 handlePlaceOrder called');
    console.log('merchantId:', merchantId);
    console.log('cart items:', cart.length);
    
    if (!merchantId) {
      Alert.alert('Error', 'El carrito está vacío');
      console.error('❌ No merchant ID');
      return;
    }
    
    const pickupTime = getPickupTime();
    console.log('⏰ Generated pickup time:', pickupTime);

    try {
      setLoading(true);
      console.log('🔄 Loading started');

      // Preflight de conectividad al backend
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 3000);
        const health = await fetch(`${getApiBase()}/health`, { signal: controller.signal });
        clearTimeout(id);
        if (!health.ok) {
          throw new Error(`Health check HTTP ${health.status}`);
        }
        console.log('🩺 Health check OK');
      } catch (e: any) {
        console.error('❌ Health check failed:', e?.message || e);
        Alert.alert(
          'Sin conexión con el servidor',
          `No pudimos conectar con el backend en ${getApiBase()}. Verifica que el servidor esté encendido y que tu dispositivo esté en la misma red.`
        );
        return;
      }

      // Preparar los items del pedido
      const items = cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: Number(item.product.discounted_price || item.product.original_price),
      }));
      console.log('📋 Order items prepared:', items);

  // Obtener token
  const token = await AsyncStorage.getItem('token');
      console.log('🔑 Token retrieved:', token ? 'Yes' : 'No');
      
      if (!token) {
        console.error('❌ No token found in storage');
        Alert.alert('Error', 'No has iniciado sesión. Por favor inicia sesión.');
        navigation.navigate('Login');
        return;
      }
      
      // Crear la orden (pasando header Authorization directo para evitar demoras del interceptor)
      const orderData = {
        merchant_id: merchantId,
        total_amount: total,
        payment_method: 'cash', // Pago en tienda (mapeado en DB)
        pickup_time: pickupTime,
        notes: notes?.trim() || undefined,
        items,
      };
      console.log('📤 Sending order data:', orderData);
      console.log('API URL:', `${CONFIG.API_URL}/orders`);
      const postPromise = api.post(`/orders`, orderData, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      // Salvaguarda por si algo queda colgado más allá del timeout de axios
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout de solicitud')), 12000));
      const response: any = await Promise.race([postPromise, timeoutPromise]);
      console.log('✅ Order created successfully:', response.data);

      // Limpiar carrito
      clearCart();
      console.log('🧹 Cart cleared');

      // Ir al comprobante con folio y resumen
  const receipt_number = response.data?.receipt_number;
  const order = response.data?.order;
  navigation.navigate('Receipt', { order, receipt_number });
    } catch (error: any) {
      console.error('❌ Error creating order:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      // Manejo específico para error de autenticación
      if (error.response?.status === 401) {
        console.log('🔒 Unauthorized - clearing token and redirecting to login');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        Alert.alert(
          'Sesión Expirada',
          'Tu sesión ha expirado. Por favor inicia sesión de nuevo.',
          [
            {
              text: 'Iniciar Sesión',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              },
            },
          ]
        );
        return;
      }
      
      // Mensaje más claro para errores de red o timeouts
      let errorMessage = error.response?.data?.error || error.message || 'No se pudo crear el pedido';
      if (!error.response && (error.message?.includes('Network Error') || error.code === 'ECONNABORTED')) {
        errorMessage = `No se pudo conectar con el servidor. Verifica que el backend esté corriendo y que API_URL sea accesible desde tu dispositivo: ${CONFIG.API_URL}`;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      console.log('🔄 Loading finished');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader 
        title="Confirmar Pedido" 
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Información del establecimiento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Establecimiento</Text>
          <View style={styles.merchantInfo}>
            <Text style={styles.merchantIcon}>🏪</Text>
            <Text style={styles.merchantText}>{merchantName}</Text>
          </View>
        </View>

        {/* Resumen del pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>
                {item.quantity}x {item.product.name}
              </Text>
              <Text style={styles.itemPrice}>
                {formatPrice(Number(item.product.discounted_price || item.product.original_price) * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total a pagar en tienda</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Información de pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pago</Text>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentIcon}>💵</Text>
            <View style={styles.paymentTextContainer}>
              <Text style={styles.paymentMainText}>Pago en tienda</Text>
              <Text style={styles.paymentSubtext}>
                Realizarás el pago al recoger tu pedido en el establecimiento
              </Text>
            </View>
          </View>
        </View>

        {/* Hora de recogida */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hora de Recogida</Text>
          <View style={styles.pickupTimeInfo}>
            <Text style={styles.pickupTimeIcon}>⏰</Text>
            <View style={styles.pickupTimeTextContainer}>
              <Text style={styles.pickupTimeMainText}>Recogida programada</Text>
              <Text style={styles.pickupTimeSubtext}>
                Tu pedido estará listo para recoger en aproximadamente 1 hora
              </Text>
            </View>
          </View>
        </View>

        {/* Notas adicionales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas Adicionales (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Instrucciones especiales para el comercio..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Información importante */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            El establecimiento confirmará tu pedido. Recibirás una notificación cuando esté listo para recoger. El pago se realizará en tienda al momento de recoger.
          </Text>
        </View>
      </ScrollView>

      {/* Botón de confirmar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
          onPress={() => {
            console.log('🔘 Button clicked!');
            handlePlaceOrder();
          }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.placeOrderButtonText}>Confirmar Pedido</Text>
              <Text style={styles.placeOrderButtonSubtext}>{formatPrice(total)}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Overlay de carga */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={CONFIG.COLORS.primary} />
            <Text style={styles.loadingLabel}>Confirmando pedido...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 16,
    color: CONFIG.COLORS.text,
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
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
  merchantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  merchantIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  merchantText: {
    fontSize: 16,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CONFIG.COLORS.primary,
  },
  paymentIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  paymentTextContainer: {
    flex: 1,
  },
  paymentMainText: {
    fontSize: 16,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
    marginBottom: 4,
  },
  paymentSubtext: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  pickupTimeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffa726',
  },
  pickupTimeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  pickupTimeTextContainer: {
    flex: 1,
  },
  pickupTimeMainText: {
    fontSize: 16,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
    marginBottom: 4,
  },
  pickupTimeSubtext: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  helperText: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 8,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  placeOrderButton: {
    backgroundColor: CONFIG.COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  placeOrderButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeOrderButtonSubtext: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  loadingLabel: {
    marginTop: 10,
    color: CONFIG.COLORS.text,
    fontWeight: '600',
  },
});
