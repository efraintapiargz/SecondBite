import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Declaración global para document
declare const document: any;

export default function App() {
  useEffect(() => {
    // Inyectar estilos CSS para web
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        body {
          overflow: auto !important;
          height: 100vh !important;
        }
        #root {
          height: 100vh !important;
          display: flex;
          flex-direction: column;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}
