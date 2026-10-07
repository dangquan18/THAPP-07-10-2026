import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GradientBackground } from './GradientBackground';
import { WeatherIcon } from './WeatherIcon';

interface LoadingViewProps {
  message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({
  message = 'Đang lấy dữ liệu thời tiết...',
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  return (
    <GradientBackground colors={['#1E88E5', '#42A5F5', '#90CAF9']}>
      <View style={styles.centerContainer}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }], marginBottom: 24 }}>
          <WeatherIcon iconType="clear" isDay={true} size={84} />
        </Animated.View>
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />
        <Text style={styles.messageText}>{message}</Text>
        <Text style={styles.subText}>Kết nối dữ liệu vệ tinh khí tượng Open-Meteo</Text>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  spinner: {
    marginBottom: 16,
  },
  messageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
  },
});
