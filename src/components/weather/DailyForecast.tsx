import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DailyForecastItem, TemperatureUnit } from '../../types/weather';
import { formatTemperature } from '../../utils/formatters';
import { getWeatherCodeInfo } from '../../utils/weatherCode';
import { CalendarIcon, ChevronRightIcon, DropletIcon } from '../common/AppIcons';
import { Card } from '../common/Card';
import { WeatherIcon } from '../common/WeatherIcon';

interface DailyForecastProps {
  dailyList: DailyForecastItem[];
  unit: TemperatureUnit;
  onSelectDay: (item: DailyForecastItem) => void;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  dailyList,
  unit,
  onSelectDay,
}) => {
  // Tìm min và max toàn bộ 7 ngày để vẽ dải nhiệt độ tương đối
  const allMins = dailyList.map(d => d.tempMin);
  const allMaxs = dailyList.map(d => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(globalMax - globalMin, 1);

  return (
    <Card
      title="Dự báo 7 ngày"
      icon={<CalendarIcon size={16} color="rgba(255, 255, 255, 0.85)" />}
    >
      <View style={styles.listContainer}>
        {dailyList.map((day, index) => {
          const info = getWeatherCodeInfo(day.weatherCode);

          // Tính toán vị trí bar nhiệt độ
          const leftPercent = ((day.tempMin - globalMin) / tempRange) * 100;
          const widthPercent =
            Math.max(((day.tempMax - day.tempMin) / tempRange) * 100, 15);

          return (
            <TouchableOpacity
              key={`${day.date}-${index}`}
              style={[
                styles.dayRow,
                index === dailyList.length - 1 && styles.lastDayRow,
              ]}
              onPress={() => onSelectDay(day)}
              activeOpacity={0.7}
            >
              {/* Ngày */}
              <View style={styles.dayNameCol}>
                <Text style={styles.dayLabel}>{day.dayLabel}</Text>
                <Text style={styles.conditionShort} numberOfLines={1}>
                  {info.description}
                </Text>
              </View>

              {/* Icon & Khả năng mưa */}
              <View style={styles.iconCol}>
                <WeatherIcon
                  weatherCode={day.weatherCode}
                  isDay={true}
                  size={28}
                />
                {day.precipitationProbability > 0 && (
                  <View style={styles.rainBadge}>
                    <DropletIcon size={10} color="#00E5FF" />
                    <Text style={styles.rainPercentText}>
                      {day.precipitationProbability}%
                    </Text>
                  </View>
                )}
              </View>

              {/* Dải nhiệt độ Min - Max */}
              <View style={styles.tempCol}>
                <Text style={styles.minTempText}>
                  {formatTemperature(day.tempMin, unit)}
                </Text>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        left: `${Math.min(Math.max(leftPercent, 0), 85)}%`,
                        width: `${Math.min(widthPercent, 100)}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.maxTempText}>
                  {formatTemperature(day.tempMax, unit)}
                </Text>
              </View>

              {/* Mũi tên xem chi tiết */}
              <View style={styles.chevronCol}>
                <ChevronRightIcon size={16} color="rgba(255, 255, 255, 0.5)" />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 4,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  lastDayRow: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  dayNameCol: {
    width: 95,
  },
  dayLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  conditionShort: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  iconCol: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  rainPercentText: {
    fontSize: 10,
    color: '#00E5FF',
    fontWeight: '600',
  },
  tempCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  minTempText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500',
    width: 32,
    textAlign: 'right',
  },
  barTrack: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    marginHorizontal: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  barFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 3,
    backgroundColor: '#FFB300',
  },
  maxTempText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
    width: 32,
    textAlign: 'left',
  },
  chevronCol: {
    paddingLeft: 4,
  },
});
