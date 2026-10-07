import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

interface GradientBackgroundProps {
  colors: [string, string, string];
  children?: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors,
  children,
}) => {
  return (
    <View style={styles.container}>
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors[0]} stopOpacity="1" />
            <Stop offset="55%" stopColor={colors[1]} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors[2]} stopOpacity="1" />
          </LinearGradient>
          <RadialGradient
            id="glow"
            cx="30%"
            cy="20%"
            rx="60%"
            ry="40%"
            fx="30%"
            fy="20%"
          >
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bgGrad)" />
        <Rect width="100%" height="100%" fill="url(#glow)" />
      </Svg>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
