/**
 * SecondBite Brand Colors
 * Based on the logo design with primary orange (#F39C12)
 */

export const Colors = {
  // Primary Brand Colors
  primary: '#F39C12',      // Main orange from logo
  primaryDark: '#E67E22',  // Darker orange for pressed states
  primaryLight: '#F8B547', // Lighter orange for highlights
  
  // Secondary Colors
  secondary: '#3498DB',    // Blue for accents
  secondaryDark: '#2980B9',
  
  // Semantic Colors
  success: '#27AE60',      // Green for success states
  warning: '#F39C12',      // Orange for warnings
  error: '#E74C3C',        // Red for errors
  info: '#3498DB',         // Blue for info
  
  // Neutral Colors
  background: '#F5F6FA',   // Light gray background
  surface: '#FFFFFF',      // White for cards and surfaces
  
  // Text Colors
  text: '#2C3E50',         // Dark blue-gray for primary text
  textSecondary: '#7F8C8D', // Medium gray for secondary text
  textLight: '#95A5A6',    // Light gray for disabled/placeholder
  textOnPrimary: '#FFFFFF', // White text on orange backgrounds
  
  // Borders and Dividers
  border: '#E1E8ED',       // Light gray borders
  divider: '#ECF0F1',      // Very light gray dividers
  
  // Status Colors
  expired: '#95A5A6',      // Gray for expired products
  available: '#27AE60',    // Green for available
  reserved: '#F39C12',     // Orange for reserved
  sold: '#7F8C8D',         // Dark gray for sold
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Gradient (for premium features)
  gradientStart: '#F39C12',
  gradientEnd: '#E67E22',
} as const;

export type ColorKeys = keyof typeof Colors;

export default Colors;
