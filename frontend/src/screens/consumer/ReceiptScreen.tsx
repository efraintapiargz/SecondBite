import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CONFIG } from '../../utils/config';
import { formatDate, formatPrice } from '../../utils/formatters';
import AppHeader from '../../components/AppHeader';

export default function ReceiptScreen({ route, navigation }: any) {
  const { order, receipt_number } = route.params || {};

  return (
    <View style={styles.container}>
      <AppHeader title="Comprobante" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.receipt}>Folio: {receipt_number || order?.receipt_number}</Text>
          <Text style={styles.title}>Pedido realizado</Text>
          <Text style={styles.subtitle}>Presenta este folio al recoger</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <Text>Establecimiento: {order?.business_name || '—'}</Text>
          <Text>Fecha: {order?.created_at ? formatDate(order.created_at) : '—'}</Text>
          <Text>Total: {formatPrice(Number(order?.total_amount || 0))}</Text>
        </View>

        {order?.items?.length ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Artículos</Text>
            {order.items.map((it: any) => (
              <View key={it.id || `${it.product_id}-${it.quantity}-${it.unit_price}`} style={styles.row}>
                <Text style={{ flex: 1 }}>{it.quantity}x {it.product_name || it.product_id}</Text>
                <Text>{formatPrice(Number(it.subtotal || 0))}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('MainTabs', { screen: 'Orders' })}>
          <Text style={styles.primaryBtnText}>Ver mis pedidos</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CONFIG.COLORS.light },
  content: { flex: 1 },
  card: { backgroundColor: '#fff', margin: 16, padding: 16, borderRadius: 10 },
  receipt: { fontWeight: 'bold', color: CONFIG.COLORS.primary, marginBottom: 6 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 4, color: CONFIG.COLORS.text },
  subtitle: { color: CONFIG.COLORS.textLight },
  sectionTitle: { fontWeight: 'bold', marginBottom: 8, color: CONFIG.COLORS.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  primaryBtn: { backgroundColor: CONFIG.COLORS.primary, margin: 16, padding: 14, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: 'bold' },
});
