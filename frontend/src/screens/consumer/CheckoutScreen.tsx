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

type Props = {
  navigation: any;
};

export default function CheckoutScreen({ navigation }: Props) {
  const { cart, getCartTotal, clearCart, getMerchantId, getMerchantName } = useCart();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const total = getCartTotal();
  const merchantId = getMerchantId();
  const merchantName = getMerchantName();
  
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
      
      // Crear la orden
      const orderData = {
        merchant_id: merchantId,
        total_amount: total,
        payment_method: 'store', // Pago en tienda
        pickup_time: pickupTime,
        notes: notes?.trim() || undefined,
        items,
      };
      console.log('📤 Sending order data:', orderData);
      console.log('API URL:', `${CONFIG.API_URL}/orders`);

      const response = await axios.post(`${CONFIG.API_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('✅ Order created successfully:', response.data);

      // Limpiar carrito
      clearCart();
      console.log('🧹 Cart cleared');

      // Mostrar mensaje de éxito
      Alert.alert(
        '¡Pedido realizado!',
        `Tu pedido en ${merchantName} ha sido enviado. Pagarás ${formatPrice(total)} al recogerlo.`
      );
      
      // Redirigir a pedidos
      console.log('🔄 Navigating to orders');
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs', params: { screen: 'Orders' } }],
        });
      }, 100);
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
      
      const errorMessage = error.response?.data?.error || error.message || 'No se pudo crear el pedido';
      
      Alert.alert(
        'Error',
        errorMessage
      );
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
});
