import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { CONFIG } from '../utils/config';
import merchantService from '../services/merchantService';

export default function EditProfileScreen({ navigation }: any) {
  const { user, updateUser } = useAuth();
  const isMerchant = user?.user_type === 'merchant';

  // User fields
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [latitude, setLatitude] = useState(user?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(user?.longitude?.toString() || '');

  // Merchant fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<'restaurant' | 'supermarket' | 'bakery' | 'cafe' | 'grocery' | 'other'>('other');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (isMerchant) {
          const { merchant } = await merchantService.getMyInfo();
          setBusinessName(merchant.business_name || '');
          setBusinessType((merchant.business_type as any) || 'other');
          setDescription(merchant.description || '');
          // Prefill address/coords from user side if present
          if (merchant.address && !address) setAddress(merchant.address);
          if (merchant.latitude && !latitude) setLatitude(String(merchant.latitude));
          if (merchant.longitude && !longitude) setLongitude(String(merchant.longitude));
        }
      } catch (e: any) {
        console.error('Error loading merchant info', e?.response?.data || e?.message);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    // basic validations
    if (!fullName.trim()) {
      Alert.alert('Validación', 'El nombre es obligatorio');
      return;
    }

    const lat = latitude ? Number(latitude) : undefined;
    const lng = longitude ? Number(longitude) : undefined;
    if ((latitude && isNaN(lat!)) || (longitude && isNaN(lng!))) {
      Alert.alert('Validación', 'Latitud y Longitud deben ser numéricos');
      return;
    }

    setSaving(true);
    try {
      // Update user profile
      await updateUser({
        full_name: fullName,
        phone: phone || undefined,
        address: address || undefined,
        latitude: lat,
        longitude: lng,
      } as any);

      // Update merchant details if applicable
      if (isMerchant) {
        await merchantService.updateMyInfo({
          business_name: businessName,
          business_type: businessType as any,
          description: description,
        });
      }

      Alert.alert('Éxito', 'Perfil actualizado');
      navigation.goBack();
    } catch (e: any) {
      console.error('Error saving profile', e?.response?.data || e?.message);
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={CONFIG.COLORS.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Datos de Usuario</Text>

          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <Text style={styles.label}>Dirección</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Latitud</Text>
              <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} keyboardType="decimal-pad" />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Longitud</Text>
              <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} keyboardType="decimal-pad" />
            </View>
          </View>
        </View>

        {isMerchant && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Datos del Comercio</Text>

            <Text style={styles.label}>Nombre del Negocio</Text>
            <TextInput style={styles.input} value={businessName} onChangeText={setBusinessName} />

            <Text style={styles.label}>Tipo de Negocio</Text>
            <TextInput style={styles.input} value={businessType} onChangeText={(t) => setBusinessType((t as any) || 'other')} />

            <Text style={styles.label}>Descripción</Text>
            <TextInput style={[styles.input, { height: 100 }]} multiline value={description} onChangeText={setDescription} />
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color={CONFIG.COLORS.white} /> : <Text style={styles.saveText}>Guardar Cambios</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CONFIG.COLORS.light },
  header: { backgroundColor: CONFIG.COLORS.primary, padding: 20, paddingTop: 40 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: CONFIG.COLORS.white },
  content: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 8, color: CONFIG.COLORS.textLight },
  card: { backgroundColor: CONFIG.COLORS.white, padding: 16, marginVertical: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: CONFIG.COLORS.text },
  label: { marginTop: 10, marginBottom: 6, color: CONFIG.COLORS.textLight, fontWeight: '600' },
  input: { backgroundColor: CONFIG.COLORS.white, borderWidth: 1, borderColor: CONFIG.COLORS.border, borderRadius: 10, padding: 12, color: CONFIG.COLORS.text },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  saveButton: { backgroundColor: CONFIG.COLORS.primary, margin: 16, padding: 16, borderRadius: 10, alignItems: 'center' },
  saveText: { color: CONFIG.COLORS.white, fontWeight: 'bold', fontSize: 16 },
});
