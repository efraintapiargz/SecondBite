import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CONFIG } from '../utils/config';

type HeaderProps = {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  showBackButton?: boolean;
};

export default function AppHeader({ 
  title, 
  onBack, 
  rightComponent,
  showBackButton = true 
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBackButton && onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: CONFIG.COLORS.primary,
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  leftContainer: {
    width: 50,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 50,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 28,
    color: CONFIG.COLORS.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: CONFIG.COLORS.white,
    textAlign: 'center',
  },
});
