import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CurrentWeatherData, TemperatureUnit } from '../../types/weather';
import { formatTemperature } from '../../utils/formatters';
import { getWeatherCodeInfo } from '../../utils/weatherCode';
import { WeatherIcon } from '../common/WeatherIcon';

interface CurrentWeatherProps {
  current: CurrentWeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ current, unit }) => {
  const codeInfo = getWeatherCodeInfo(current.weatherCode);

  return (
    <View style={styles.container}>
      {/* Icon thời tiết lớn & nhiệt độ */}
      <View style={styles.weatherHeroRow}>
        <View style={styles.iconContainer}>
          <WeatherIcon
            weatherCode={current.weatherCode}
            isDay={current.isDay}
            size={100}
          />
        </View>

        <View style={styles.tempContainer}>
          <Text style={styles.temperature}>
            {formatTemperature(current.temperature, unit)}
          </Text>
        </View>
      </View>

      {/* Trạng thái thời tiết */}
      <Text style={styles.conditionText}>{codeInfo.description}</Text>

      {/* Nhiệt độ cao nhất / thấp nhất & Cảm giác thực tế */}
      <View style={styles.infoRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Cao</Text>
          <Text style={styles.badgeValue}>
            {formatTemperature(current.tempMax, unit)}
          </Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Thấp</Text>
          <Text style={styles.badgeValue}>
            {formatTemperature(current.tempMin, unit)}
          </Text>
        </View>

        <View style={[styles.badge, styles.badgeHighlight]}>
          <Text style={styles.badgeLabel}>Cảm nhận</Text>
          <Text style={styles.badgeValue}>
            {formatTemperature(current.apparentTemperature, unit)}
          </Text>
        </View>
      </View>

      <Text style={styles.updateText}>
        Cập nhật lúc {current.updateTime} • Dữ liệu Open-Meteo
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  weatherHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  tempContainer: {
    justifyContent: 'center',
  },
  temperature: {
    fontSize: 72,
    fontWeight: '200',
    color: '#FFFFFF',
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  conditionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 14,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    gap: 6,
  },
  badgeHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  badgeValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  updateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
});
