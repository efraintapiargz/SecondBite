import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { CONFIG } from '../utils/config';

export default function RegisterScreen({ navigation }: any) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState<'consumer' | 'merchant'>('consumer');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validaciones
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        full_name: fullName,
        email,
        password,
        phone: phone || undefined,
        user_type: userType,
      });
      Alert.alert('Éxito', '¡Cuenta creada exitosamente!');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Error al registrarse'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        scrollEnabled={true}
      >
        <View style={styles.content}>
          <Text style={styles.logo}>🍽️</Text>
          <Text style={styles.title}>SecondBite</Text>
          <Text style={styles.subtitle}>Crear cuenta nueva</Text>

          {/* Campo Nombre Completo */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre Completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre completo"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Campo Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo Electrónico *</Text>
            <TextInput
              style={styles.input}
              placeholder="ejemplo@correo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Campo Teléfono */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu número de teléfono"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Campo Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña *</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Campo Confirmar Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Contraseña *</Text>
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Selector de Tipo de Usuario */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de Usuario *</Text>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'consumer' && styles.userTypeButtonActive,
                ]}
                onPress={() => setUserType('consumer')}
              >
                <Text
                  style={[
                    styles.userTypeText,
                    userType === 'consumer' && styles.userTypeTextActive,
                  ]}
                >
                  🛒 Consumidor
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'merchant' && styles.userTypeButtonActive,
                ]}
                onPress={() => setUserType('merchant')}
              >
                <Text
                  style={[
                    styles.userTypeText,
                    userType === 'merchant' && styles.userTypeTextActive,
                  ]}
                >
                  🏪 Comercio
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Botón de Registro */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={CONFIG.COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>

          {/* Link a Login */}
          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta?{' '}
              <Text style={styles.linkTextBold}>Inicia Sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONFIG.COLORS.white,
    height: '100vh',
  } as any,
  scrollView: {
    flex: 1,
    width: '100%',
    height: '100%',
  } as any,
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  content: {
    padding: 20,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  logo: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: CONFIG.COLORS.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: CONFIG.COLORS.textLight,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
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
  userTypeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  userTypeButton: {
    flex: 1,
    backgroundColor: CONFIG.COLORS.white,
    borderWidth: 2,
    borderColor: CONFIG.COLORS.border,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    borderColor: CONFIG.COLORS.primary,
    backgroundColor: `${CONFIG.COLORS.primary}10`,
  },
  userTypeText: {
    fontSize: 16,
    color: CONFIG.COLORS.textLight,
    fontWeight: '500',
  },
  userTypeTextActive: {
    color: CONFIG.COLORS.primary,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: CONFIG.COLORS.primary,
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: CONFIG.COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: CONFIG.COLORS.textLight,
  },
  linkTextBold: {
    color: CONFIG.COLORS.primary,
    fontWeight: 'bold',
  },
});
