import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { notificationService, NotificationItem } from '../services/notificationService';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CONFIG } from '../utils/config';

export default function NotificationsScreen() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const route = useRoute();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationService.list();
      setItems(data.notifications);
      setUnread(data.unread);
    } catch (e) {
      console.error('Error cargando notificaciones', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      load();
    });
    load();
    return unsubscribe;
  }, [navigation, load]);

  const onMarkRead = async (id: number) => {
    try {
      const res = await notificationService.markAsRead(id);
      setItems(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)));
      setUnread(res.unread);
    } catch (e) {
      console.error('Error marcando como leída', e);
    }
  };

  const onMarkAll = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      setItems(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnread(res.unread);
      // Si el dashboard escucha cambios, puede refrescar al volver
      // @ts-ignore
      navigation.setParams?.({ refreshed: Date.now() });
    } catch (e) {
      console.error('Error marcando todas como leídas', e);
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const read = item.is_read === true || item.is_read === 1;
    return (
      <View style={[styles.card, read ? styles.cardRead : styles.cardUnread]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.meta}>{new Date(item.created_at).toLocaleString()}</Text>
        </View>
        {!read && (
          <TouchableOpacity style={styles.readBtn} onPress={() => onMarkRead(item.id)}>
            <Text style={styles.readBtnText}>Marcar leído</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.headerTitle}>Notificaciones</Text>
            <Text style={styles.headerSubtitle}>{unread} sin leer</Text>
          </View>
          {items.length > 0 && unread > 0 && (
            <TouchableOpacity onPress={onMarkAll}>
              <Text style={{ color: CONFIG.COLORS.primary, fontWeight: '700' }}>Marcar todas</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={!loading ? (
          <Text style={styles.empty}>No tienes notificaciones</Text>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 12, paddingHorizontal: 16, paddingBottom: 8, borderBottomColor: '#eee', borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: CONFIG.COLORS.text },
  headerSubtitle: { fontSize: 14, color: CONFIG.COLORS.textLight, marginTop: 2 },
  card: { flexDirection: 'row', alignItems: 'flex-start', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1 },
  cardUnread: { backgroundColor: '#F1F8E9', borderColor: '#C5E1A5' },
  cardRead: { backgroundColor: '#FAFAFA', borderColor: '#eee' },
  title: { fontSize: 16, fontWeight: '700', color: CONFIG.COLORS.text },
  message: { marginTop: 4, fontSize: 14, color: CONFIG.COLORS.text },
  meta: { marginTop: 6, fontSize: 12, color: CONFIG.COLORS.textLight },
  readBtn: { marginLeft: 12, alignSelf: 'center', backgroundColor: CONFIG.COLORS.primary, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  readBtnText: { color: '#fff', fontWeight: '700' },
  empty: { textAlign: 'center', color: CONFIG.COLORS.textLight, marginTop: 24 },
});
