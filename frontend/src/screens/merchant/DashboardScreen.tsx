import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { CONFIG } from '../../utils/config';
import { formatPrice } from '../../utils/formatters';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    pendingOrders: 0,
    todayRevenue: 0,
  });

  const loadDashboard = async () => {
    try {
      setLoading(true);
      // TODO: Load dashboard data
      setStats({
        totalProducts: 0,
        activeProducts: 0,
        pendingOrders: 0,
        todayRevenue: 0,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={CONFIG.COLORS.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[CONFIG.COLORS.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Dashboard</Text>
        <Text style={styles.headerSubtitle}>Panel de control</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: CONFIG.COLORS.primary }]}>
          <Text style={styles.statNumber}>{stats.totalProducts}</Text>
          <Text style={styles.statLabel}>Productos Totales</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: CONFIG.COLORS.success }]}>
          <Text style={styles.statNumber}>{stats.activeProducts}</Text>
          <Text style={styles.statLabel}>Productos Activos</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: CONFIG.COLORS.warning }]}>
          <Text style={styles.statNumber}>{stats.pendingOrders}</Text>
          <Text style={styles.statLabel}>Pedidos Pendientes</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: CONFIG.COLORS.info }]}>
          <Text style={styles.statNumber}>{formatPrice(stats.todayRevenue)}</Text>
          <Text style={styles.statLabel}>Ventas Hoy</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>➕</Text>
          <Text style={styles.actionText}>Nuevo Producto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📦</Text>
          <Text style={styles.actionText}>Ver Pedidos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  statsContainer: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: CONFIG.COLORS.white,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: CONFIG.COLORS.white,
    opacity: 0.9,
  },
  actionsContainer: {
    padding: 15,
  },
  actionButton: {
    backgroundColor: CONFIG.COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  actionText: {
    fontSize: 18,
    fontWeight: '600',
    color: CONFIG.COLORS.text,
  },
});
