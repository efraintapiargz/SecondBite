# 🎨 SecondBite - Guía de Marca

## Logo

El logo de SecondBite consiste en un numeral "2" estilizado con un punto decorativo, representando la "segunda oportunidad" para los alimentos.

### Uso del Logo

```tsx
import { Logo } from '../components';

// Tamaño grande (pantallas de bienvenida)
<Logo size="large" showText={true} />

// Tamaño mediano (headers, formularios)
<Logo size="medium" showText={true} />

// Tamaño pequeño (navegación, badges)
<Logo size="small" showText={false} />
```

### Archivos del Logo

- **SVG**: `frontend/assets/logo.svg` - Versión vectorial escalable
- **Componente React**: `frontend/src/components/Logo.tsx` - Componente reutilizable

---

## Paleta de Colores

### Colores Primarios

| Color | Hex | Uso |
|-------|-----|-----|
| **Primary Orange** | `#F39C12` | Botones principales, links, elementos destacados |
| **Primary Dark** | `#E67E22` | Estados hover/pressed de botones |
| **Primary Light** | `#F8B547` | Backgrounds sutiles, highlights |

### Colores Secundarios

| Color | Hex | Uso |
|-------|-----|-----|
| **Secondary Blue** | `#3498DB` | Información, elementos secundarios |
| **Secondary Dark** | `#2980B9` | Hover de elementos secundarios |

### Colores Semánticos

| Color | Hex | Uso |
|-------|-----|-----|
| **Success** | `#27AE60` | Confirmaciones, estados positivos |
| **Warning** | `#F39C12` | Alertas, productos próximos a expirar |
| **Error** | `#E74C3C` | Errores, validaciones fallidas |
| **Info** | `#3498DB` | Mensajes informativos |

### Colores Neutrales

| Color | Hex | Uso |
|-------|-----|-----|
| **Background** | `#F5F6FA` | Fondo general de la app |
| **Surface** | `#FFFFFF` | Tarjetas, modales, superficies |
| **Text** | `#2C3E50` | Texto principal |
| **Text Secondary** | `#7F8C8D` | Texto secundario, subtítulos |
| **Text Light** | `#95A5A6` | Placeholders, texto deshabilitado |
| **Border** | `#E1E8ED` | Bordes de inputs, tarjetas |
| **Divider** | `#ECF0F1` | Separadores, líneas divisorias |

---

## Uso en Código

### Importar Colores

```tsx
import Colors from '../utils/colors';
// o
import { CONFIG } from '../utils/config';

// Usar
backgroundColor: Colors.primary
// o
backgroundColor: CONFIG.COLORS.primary
```

### Ejemplo de Componente

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../utils/colors';

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SecondBite</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Comenzar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

---

## Tipografía

### Pesos de Fuente

- **Regular (400)**: Texto general
- **Semibold (600)**: Subtítulos, labels
- **Bold (700)**: Títulos, botones, énfasis
- **Black (900)**: Logo, headings principales

### Tamaños Recomendados

- **Display**: 32px - Títulos principales
- **Heading**: 24px - Secciones
- **Subheading**: 18px - Subtítulos
- **Body**: 16px - Texto principal
- **Caption**: 14px - Texto secundario
- **Small**: 12px - Labels, badges

---

## Componentes de Marca

### Header de App

```tsx
import { AppHeader } from '../components';

<AppHeader 
  title="SecondBite"
  showBackButton={false}
/>
```

El header usa automáticamente el color primario naranja (`#F39C12`) y texto blanco.

### Botones

**Botón Primario (Orange)**
```tsx
<TouchableOpacity style={styles.primaryButton}>
  <Text style={styles.primaryButtonText}>Acción Principal</Text>
</TouchableOpacity>

// styles
primaryButton: {
  backgroundColor: Colors.primary,
  padding: 15,
  borderRadius: 10,
},
primaryButtonText: {
  color: Colors.textOnPrimary,
  fontWeight: 'bold',
}
```

**Botón Secundario (Outlined)**
```tsx
<TouchableOpacity style={styles.secondaryButton}>
  <Text style={styles.secondaryButtonText}>Acción Secundaria</Text>
</TouchableOpacity>

// styles
secondaryButton: {
  borderWidth: 2,
  borderColor: Colors.primary,
  padding: 15,
  borderRadius: 10,
  backgroundColor: 'transparent',
},
secondaryButtonText: {
  color: Colors.primary,
  fontWeight: 'bold',
}
```

---

## Iconografía

SecondBite utiliza emojis nativos para iconos donde sea apropiado:

- 🏠 Home
- 🔍 Buscar
- 📦 Productos/Pedidos
- 👤 Perfil
- 🛒 Carrito
- 📊 Dashboard
- 🔔 Notificaciones
- 🍽️ Alimentos

Para iconos más específicos, se recomienda usar `@expo/vector-icons` con la familia **Ionicons** en el color primario de la marca.

---

## Espaciado

Usa múltiplos de 4 para espaciado consistente:

- **4px**: Espaciado mínimo
- **8px**: Espaciado entre elementos relacionados
- **12px**: Espaciado en labels
- **16px**: Padding interno de cards
- **20px**: Padding de pantallas
- **24px**: Separación entre secciones
- **32px**: Espaciado entre bloques grandes

---

## Actualización de Marca

**Última actualización**: Noviembre 2025

- Logo: Diseño "2·" con naranja `#F39C12`
- Paleta: Migrada de verde a naranja como color primario
- Componentes actualizados: Login, Register, Navigator, Headers, Dashboard

**Archivos modificados**:
- `frontend/src/utils/colors.ts` ✅
- `frontend/src/utils/config.ts` ✅
- `frontend/src/components/Logo.tsx` ✅
- `frontend/src/screens/LoginScreen.tsx` ✅
- `frontend/src/screens/RegisterScreen.tsx` ✅
- `frontend/src/navigation/AppNavigator.tsx` ✅
- `frontend/app.json` ✅

---

## Recursos Adicionales

- **Archivo SVG del Logo**: `frontend/assets/logo.svg`
- **Archivo de Colores**: `frontend/src/utils/colors.ts`
- **Componente Logo**: `frontend/src/components/Logo.tsx`

---

**SecondBite** - Reduciendo el desperdicio alimenticio 🍽️
