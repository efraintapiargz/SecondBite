import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { CONFIG } from '../../utils/config';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔍 Buscar</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos, comercios..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={CONFIG.COLORS.textLight}
        />
      </View>

      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>🔎</Text>
        <Text style={styles.emptyTitle}>Busca productos</Text>
        <Text style={styles.emptySubtitle}>
          Encuentra productos cerca de ti con descuento
        </Text>
      </View>
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
  searchContainer: {
    padding: 15,
    backgroundColor: CONFIG.COLORS.white,
    elevation: 2,
  },
  searchInput: {
    backgroundColor: CONFIG.COLORS.light,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: CONFIG.COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
});
