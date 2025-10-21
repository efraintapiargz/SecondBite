import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Animated, Easing } from 'react-native';
import { CONFIG } from '../../utils/config';
import { formatPrice } from '../../utils/formatters';

import { merchantService } from '../../services/merchantService';
import { notificationService } from '../../services/notificationService';
import { useFocusEffect } from '@react-navigation/native';

type Props = { navigation: any };

export default function DashboardScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    unreadNotifications: 0,
  });
  const [latestNotification, setLatestNotification] = useState<{ title: string; created_at: string } | null>(null);
  const lastUnreadRef = useRef(0);
  const badgeScale = useRef(new Animated.Value(1)).current;

  // Animar la campana cuando suben no leídas
  useEffect(() => {
    const current = stats.unreadNotifications || 0;
    const prev = lastUnreadRef.current || 0;
    if (current > prev) {
      Animated.sequence([
        Animated.timing(badgeScale, { toValue: 1.2, duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(badgeScale, { toValue: 1, duration: 150, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]).start();
    }
    lastUnreadRef.current = current;
  }, [stats.unreadNotifications]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const dashboard = await merchantService.getMyDashboard();
      // Notificaciones no leídas
      let unread = 0;
      try {
        // Traer 1 más reciente (leída o no) para mostrar preview
        const latest = await notificationService.list({ limit: 1 });
        if (latest.notifications?.length) {
          const n = latest.notifications[0];
          setLatestNotification({ title: n.title, created_at: n.created_at });
        } else {
          setLatestNotification(null);
        }
        // Y contar no leídas
        const unreadRes = await notificationService.list({ onlyUnread: true, limit: 1 });
        unread = unreadRes.unread || 0;
      } catch (e) {
        unread = 0;
        setLatestNotification(null);
      }
      setStats({ ...dashboard.stats, unreadNotifications: unread });
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

  // Refrescar cuando la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      loadDashboard();
      // Polling cada 15s mientras la pantalla está enfocada
      const id = setInterval(() => {
        // Solo actualizar contador de notificaciones para no sobrecargar
        notificationService
          .list({ onlyUnread: true, limit: 1 })
          .then((res) => setStats((prev) => ({ ...prev, unreadNotifications: res.unread || 0 })))
          .catch(() => {});
      }, 15000);
      return () => clearInterval(id);
    }, [])
  );

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.headerTitle}>📊 Dashboard</Text>
            <Text style={styles.headerSubtitle}>Panel de control</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <View style={{ paddingHorizontal: 6 }}>
              <Text style={{ fontSize: 24 }}>🔔</Text>
              {stats.unreadNotifications > 0 && (
                <Animated.View
                  style={{
                    position: 'absolute',
                    right: -2,
                    top: -2,
                    backgroundColor: '#D32F2F',
                    borderRadius: 10,
                    minWidth: 18,
                    height: 18,
                    paddingHorizontal: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ scale: badgeScale }],
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
                    {stats.unreadNotifications > 99 ? '99+' : String(stats.unreadNotifications)}
                  </Text>
                </Animated.View>
              )}
            </View>
          </TouchableOpacity>
        </View>
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

        <View style={[styles.statCard, { backgroundColor: CONFIG.COLORS.secondary }]}>
          <Text style={styles.statNumber}>{stats.unreadNotifications}</Text>
          <Text style={styles.statLabel}>Notificaciones</Text>
        </View>
      </View>

      {/* Preview de última notificación */}
      <View style={{ paddingHorizontal: 15 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#eee' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: CONFIG.COLORS.text }}>🔔 Notificaciones</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={{ color: CONFIG.COLORS.primary, fontWeight: '700' }}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          {latestNotification ? (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 14, color: CONFIG.COLORS.text }}>{latestNotification.title}</Text>
              <Text style={{ fontSize: 12, color: CONFIG.COLORS.textLight, marginTop: 2 }}>
                {new Date(latestNotification.created_at).toLocaleString()}
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 14, color: CONFIG.COLORS.textLight, marginTop: 8 }}>Sin notificaciones recientes</Text>
          )}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ProductForm')}>
          <Text style={styles.actionIcon}>➕</Text>
          <Text style={styles.actionText}>Nuevo Producto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Orders')}>
          <Text style={styles.actionIcon}>📦</Text>
          <Text style={styles.actionText}>Ver Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.actionIcon}>🔔</Text>
          <Text style={styles.actionText}>Notificaciones</Text>
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
