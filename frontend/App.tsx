import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

// Declaración global para document
declare const document: any;

export default function App() {
  useEffect(() => {
    // Configurar UTF-8 y estilos CSS para web
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Asegurar charset UTF-8
      const charset = document.querySelector('meta[charset]');
      if (!charset) {
        const meta = document.createElement('meta');
        meta.setAttribute('charset', 'utf-8');
        document.head.insertBefore(meta, document.head.firstChild);
      }

      // Inyectar estilos CSS
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
      <CartProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}
