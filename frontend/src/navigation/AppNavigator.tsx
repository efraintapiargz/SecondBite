import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList, ConsumerTabParamList, MerchantTabParamList } from '../types';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/consumer/HomeScreen';
import SearchScreen from '../screens/consumer/SearchScreen';
import OrdersScreen from '../screens/consumer/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Merchant Screens
import DashboardScreen from '../screens/merchant/DashboardScreen';
import ProductsScreen from '../screens/merchant/ProductsScreen';
import MerchantOrdersScreen from '../screens/merchant/MerchantOrdersScreen';

const Stack = createStackNavigator<RootStackParamList>();
const ConsumerTab = createBottomTabNavigator<ConsumerTabParamList>();
const MerchantTab = createBottomTabNavigator<MerchantTabParamList>();

function ConsumerTabs() {
  return (
    <ConsumerTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
      }}
    >
      <ConsumerTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>🏠</span>,
        }}
      />
      <ConsumerTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>🔍</span>,
        }}
      />
      <ConsumerTab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>📦</span>,
        }}
      />
      <ConsumerTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>👤</span>,
        }}
      />
    </ConsumerTab.Navigator>
  );
}

function MerchantTabs() {
  return (
    <MerchantTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
      }}
    >
      <MerchantTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>📊</span>,
        }}
      />
      <MerchantTab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          title: 'Productos',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>🛒</span>,
        }}
      />
      <MerchantTab.Screen
        name="Orders"
        component={MerchantOrdersScreen}
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>📦</span>,
        }}
      />
      <MerchantTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>👤</span>,
        }}
      />
    </MerchantTab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // o un componente de carga
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user.user_type === 'merchant' ? (
          <Stack.Screen name="MainTabs" component={MerchantTabs} />
        ) : (
          <Stack.Screen name="MainTabs" component={ConsumerTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
