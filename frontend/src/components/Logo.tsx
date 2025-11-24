import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';
import Colors from '../utils/colors';

type LogoProps = {
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  showText?: boolean;
};

const sizeConfig = {
  small: { number: 40, dot: 18, spacing: 1, textSize: 16 },
  medium: { number: 70, dot: 30, spacing: 2, textSize: 24 },
  large: { number: 90, dot: 40, spacing: 2, textSize: 32 },
};

export default function Logo({ size = 'medium', style, showText = true }: LogoProps) {
  const config = sizeConfig[size];

  const imageSize = size === 'large' ? 120 : size === 'medium' ? 80 : 50;

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require('../../assets/2BiteLogo.png')} 
        style={[styles.logoImage, { width: imageSize, height: imageSize }]}
        resizeMode="contain"
      />
      {showText && (
        <Text
          style={[
            styles.brandText,
            {
              fontSize: config.textSize,
            },
          ]}
        >
          SecondBite
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoImage: {
    marginBottom: 5,
  },
  brandText: {
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 5,
  },
});
