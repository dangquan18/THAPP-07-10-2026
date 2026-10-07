import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HourlyForecastItem, TemperatureUnit } from '../../types/weather';
import { formatTemperature } from '../../utils/formatters';
import { ClockIcon, DropletIcon } from '../common/AppIcons';
import { Card } from '../common/Card';
import { WeatherIcon } from '../common/WeatherIcon';

interface HourlyForecastProps {
  hourlyList: HourlyForecastItem[];
  unit: TemperatureUnit;
  onSelectHour: (item: HourlyForecastItem) => void;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourlyList,
  unit,
  onSelectHour,
}) => {
  return (
    <Card
      title="Dự báo 24 giờ tới"
      icon={<ClockIcon size={16} color="rgba(255, 255, 255, 0.85)" />}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourlyList.map((item, index) => {
          const isNow = index === 0;
          return (
            <TouchableOpacity
              key={`${item.rawTime}-${index}`}
              style={[styles.hourItem, isNow && styles.hourItemActive]}
              onPress={() => onSelectHour(item)}
              activeOpacity={0.7}
            >
              {/* Giờ */}
              <Text style={[styles.timeText, isNow && styles.timeTextActive]}>
                {item.time}
              </Text>

              {/* Biểu tượng thời tiết */}
              <View style={styles.iconWrapper}>
                <WeatherIcon
                  weatherCode={item.weatherCode}
                  isDay={item.isDay}
                  size={36}
                />
              </View>

              {/* Nhiệt độ */}
              <Text style={styles.tempText}>
                {formatTemperature(item.temperature, unit)}
              </Text>

              {/* Khả năng mưa */}
              <View style={styles.rainChanceRow}>
                <DropletIcon size={12} color="#00E5FF" />
                <Text style={styles.rainChanceText}>
                  {item.precipitationProbability}%
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 4,
    gap: 8,
  },
  hourItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    minWidth: 70,
  },
  hourItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 8,
  },
  timeTextActive: {
    color: '#00E5FF',
    fontWeight: '700',
  },
  iconWrapper: {
    marginVertical: 4,
  },
  tempText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 6,
    marginBottom: 6,
  },
  rainChanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rainChanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00E5FF',
  },
});
