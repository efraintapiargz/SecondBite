import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { CONFIG } from '../utils/config';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 Perfil</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.full_name?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.full_name || 'Usuario'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>
              {user?.user_type === 'consumer' ? '🛒 Consumidor' : '🏪 Comercio'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.menuIcon}>📝</Text>
            <Text style={styles.menuText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Notifications')}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuText}>Notificaciones</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>❓</Text>
            <Text style={styles.menuText}>Ayuda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>ℹ️</Text>
            <Text style={styles.menuText}>Acerca de</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: CONFIG.COLORS.white,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: CONFIG.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: CONFIG.COLORS.white,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: CONFIG.COLORS.textLight,
    marginBottom: 15,
  },
  typeBadge: {
    backgroundColor: CONFIG.COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    color: CONFIG.COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: CONFIG.COLORS.white,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: CONFIG.COLORS.border,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: CONFIG.COLORS.text,
  },
  logoutButton: {
    backgroundColor: CONFIG.COLORS.danger,
    margin: 20,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: CONFIG.COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
