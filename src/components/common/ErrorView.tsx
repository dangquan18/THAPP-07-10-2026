import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientBackground } from './GradientBackground';
import { WeatherIcon } from './WeatherIcon';
import { RefreshIcon, SearchIcon } from './AppIcons';

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
  onSearchCity?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  message,
  onRetry,
  onSearchCity,
}) => {
  return (
    <GradientBackground colors={['#2C3E50', '#34495E', '#1F2937']}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <WeatherIcon iconType="overcast" isDay={false} size={72} />
          </View>
          <Text style={styles.title}>Không thể tải dữ liệu thời tiết</Text>
          <Text style={styles.errorMessage}>{message}</Text>
          <Text style={styles.hintText}>
            Vui lòng kiểm tra kết nối mạng Internet hoặc thử chọn một vị trí khác.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={onRetry} activeOpacity={0.8}>
              <RefreshIcon size={18} color="#1E88E5" />
              <Text style={styles.primaryButtonText}>Thử lại ngay</Text>
            </TouchableOpacity>

            {onSearchCity && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onSearchCity}
                activeOpacity={0.8}
              >
                <SearchIcon size={18} color="#FFFFFF" />
                <Text style={styles.secondaryButtonText}>Tìm thành phố</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    padding: 24,
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#FFCDD2',
    textAlign: 'center',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E88E5',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
