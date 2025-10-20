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
import { CONFIG } from '../../utils/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatPrice } from '../../utils/formatters';

interface Order {
  id: number;
  consumer_name: string;
  consumer_email: string;
  total_amount: number;
  status: string;
  pickup_time: string;
  created_at: string;
  notes?: string;
  items: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
  }>;
}

export default function MerchantOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        setOrders([]);
        return;
      }

      console.log('📦 Loading merchant orders...');
      const response = await axios.get(`${CONFIG.API_URL}/orders/merchant/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Merchant orders loaded:', response.data);
      setOrders(response.data.orders || []);
    } catch (error: any) {
      console.error('❌ Error loading merchant orders:', error);
      if (error.response?.status !== 401) {
        Alert.alert('Error', 'No se pudieron cargar los pedidos');
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'ready': return '#4CAF50';
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#999';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'ready': return 'Listo';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      await axios.put(
        `${CONFIG.API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Éxito', 'Estado del pedido actualizado');
      loadOrders(); // Recargar pedidos
    } catch (error: any) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del pedido');
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <Text style={styles.customerName}>👤 {item.consumer_name}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.created_at).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        <Text style={styles.itemsTitle}>Productos:</Text>
        {item.items.map((orderItem, index) => (
          <Text key={index} style={styles.orderItemText}>
            • {orderItem.quantity}x {orderItem.product_name}
          </Text>
        ))}
      </View>

      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>📝 Notas:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}

      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.pickupLabel}>Recoger:</Text>
          <Text style={styles.pickupTime}>
            {new Date(item.pickup_time).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatPrice(item.total_amount)}</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => updateOrderStatus(item.id, 'confirmed')}
          >
            <Text style={styles.actionButtonText}>✓ Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => updateOrderStatus(item.id, 'cancelled')}
          >
            <Text style={styles.actionButtonText}>✗ Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'confirmed' && (
        <TouchableOpacity
          style={[styles.actionButton, styles.readyButton]}
          onPress={() => updateOrderStatus(item.id, 'ready')}
        >
          <Text style={styles.actionButtonText}>✓ Marcar como Listo</Text>
        </TouchableOpacity>
      )}

      {item.status === 'ready' && (
        <TouchableOpacity
          style={[styles.actionButton, styles.completeButton]}
          onPress={() => updateOrderStatus(item.id, 'completed')}
        >
          <Text style={styles.actionButtonText}>✓ Marcar como Entregado</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={CONFIG.COLORS.primary} />
        <Text style={styles.loadingText}>Cargando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📦 Pedidos</Text>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={orders}
        renderItem={renderOrder}
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
            <Text style={styles.emptyText}>📭</Text>
            <Text style={styles.emptyTitle}>No hay pedidos</Text>
            <Text style={styles.emptySubtitle}>
              Los pedidos de tus clientes aparecerán aquí
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
  listContainer: {
    padding: 15,
    flexGrow: 1,
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
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: CONFIG.COLORS.textLight,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
    marginBottom: 6,
  },
  orderItemText: {
    fontSize: 14,
    color: CONFIG.COLORS.text,
    marginBottom: 4,
    marginLeft: 8,
  },
  notesContainer: {
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: CONFIG.COLORS.text,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 12,
  },
  pickupLabel: {
    fontSize: 12,
    color: CONFIG.COLORS.textLight,
    marginBottom: 4,
  },
  pickupTime: {
    fontSize: 14,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    color: CONFIG.COLORS.textLight,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CONFIG.COLORS.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  readyButton: {
    backgroundColor: '#2196F3',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
