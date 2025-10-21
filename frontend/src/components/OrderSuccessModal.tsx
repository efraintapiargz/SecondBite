import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CONFIG } from '../utils/config';

type Props = {
  visible: boolean;
  receipt?: string;
  onClose: () => void;
  onViewReceipt: () => void;
};

export default function OrderSuccessModal({ visible, receipt, onClose, onViewReceipt }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.icon}>✅</Text>
          <Text style={styles.title}>Pedido confirmado</Text>
          {receipt ? <Text style={styles.subtitle}>Folio: {receipt}</Text> : null}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={onClose}>
              <Text style={styles.btnTextSecondary}>Seguir comprando</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.primary]} onPress={onViewReceipt}>
              <Text style={styles.btnTextPrimary}>Ver comprobante</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  icon: { fontSize: 40, marginBottom: 6 },
  title: { fontSize: 20, fontWeight: '700', color: CONFIG.COLORS.text },
  subtitle: { fontSize: 14, color: CONFIG.COLORS.textLight, marginTop: 4 },
  actions: { flexDirection: 'row', marginTop: 16 },
  btn: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, marginHorizontal: 6 },
  primary: { backgroundColor: CONFIG.COLORS.primary },
  secondary: { backgroundColor: '#eee' },
  btnTextPrimary: { color: '#fff', fontWeight: '700' },
  btnTextSecondary: { color: CONFIG.COLORS.text, fontWeight: '700' },
});
