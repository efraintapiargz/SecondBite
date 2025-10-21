import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList, ConsumerTabParamList, MerchantTabParamList } from '../types';
import { CONFIG } from '../utils/config';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/consumer/HomeScreen';
import SearchScreen from '../screens/consumer/SearchScreen';
import OrdersScreen from '../screens/consumer/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CartScreen from '../screens/consumer/CartScreen';
import CheckoutScreen from '../screens/consumer/CheckoutScreen';
import ReceiptScreen from '../screens/consumer/ReceiptScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

// Merchant Screens
import DashboardScreen from '../screens/merchant/DashboardScreen';
import ProductsScreen from '../screens/merchant/ProductsScreen';
import MerchantOrdersScreen from '../screens/merchant/MerchantOrdersScreen';
import ProductFormScreen from '../screens/merchant/ProductFormScreen';

const Stack = createStackNavigator<RootStackParamList>();
const ConsumerTab = createBottomTabNavigator<ConsumerTabParamList>();
const MerchantTab = createBottomTabNavigator<MerchantTabParamList>();

function ConsumerTabs() {
  return (
    <ConsumerTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false, // Mantener headers personalizados
      }}
    >
      <ConsumerTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text>,
        }}
      />
      <ConsumerTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🔍</Text>,
        }}
      />
      <ConsumerTab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📦</Text>,
        }}
      />
      <ConsumerTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text>,
        }}
      />
    </ConsumerTab.Navigator>
  );
}

function MerchantTabs() {
  return (
    <MerchantTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false, // Mantener headers personalizados
      }}
    >
      <MerchantTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📊</Text>,
        }}
      />
      <MerchantTab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          title: 'Productos',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📦</Text>,
        }}
      />
      <MerchantTab.Screen
        name="Orders"
        component={MerchantOrdersScreen}
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🛍️</Text>,
        }}
      />
      <MerchantTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text>,
        }}
      />
    </MerchantTab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={CONFIG.COLORS.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user.user_type === 'merchant' ? (
          <>
            <Stack.Screen name="MainTabs" component={MerchantTabs} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
            <Stack.Screen 
              name="ProductForm" 
              component={ProductFormScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={ConsumerTabs} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Receipt" component={ReceiptScreen} options={{ headerShown: false }} />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Cart" 
              component={CartScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Checkout" 
              component={CheckoutScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CONFIG.COLORS.white,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: CONFIG.COLORS.textLight,
  },
});
