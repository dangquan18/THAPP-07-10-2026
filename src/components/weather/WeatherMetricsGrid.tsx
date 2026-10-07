import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CurrentWeatherData, TemperatureUnit } from '../../types/weather';
import { formatTemperature, formatVisibility } from '../../utils/formatters';
import {
  getHumidityEvaluation,
  getPressureEvaluation,
  getUVLevel,
  getVisibilityEvaluation,
  getWindDirectionLabel,
  getWindSpeedLevel,
} from '../../utils/weatherCode';
import {
  CompassIcon,
  DropletIcon,
  EyeIcon,
  PressureIcon,
  SunriseIcon,
  SunsetIcon,
  ThermometerIcon,
  UVIcon,
  WindIcon,
} from '../common/AppIcons';
import { MetricCard } from './MetricCard';

interface WeatherMetricsGridProps {
  current: CurrentWeatherData;
  unit: TemperatureUnit;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({
  current,
  unit,
}) => {
  const uvInfo = getUVLevel(current.uvIndex);
  const windDirLabel = getWindDirectionLabel(current.windDirection);
  const windLevel = getWindSpeedLevel(current.windSpeed);
  const pressureEval = getPressureEvaluation(current.pressure);
  const visibilityEval = getVisibilityEvaluation(current.visibility / 1000);
  const humidityEval = getHumidityEvaluation(current.humidity);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>CHỈ SỐ THỜI TIẾT CHI TIẾT</Text>

      {/* Hàng 1: Nhiệt độ cảm nhận & Độ ẩm */}
      <View style={styles.row}>
        <MetricCard
          title="Cảm giác như"
          icon={<ThermometerIcon size={16} color="#FF8A65" />}
          value={formatTemperature(current.apparentTemperature, unit)}
          subValue={
            current.apparentTemperature > current.temperature
              ? 'Ấm hơn'
              : current.apparentTemperature < current.temperature
              ? 'Lạnh hơn'
              : 'Tương đương'
          }
          description={`Nhiệt độ thực tế là ${formatTemperature(
            current.temperature,
            unit,
          )}`}
        />

        <MetricCard
          title="Độ ẩm"
          icon={<DropletIcon size={16} color="#4FC3F7" />}
          value={`${Math.round(current.humidity)}%`}
          visualElement={
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(current.humidity, 100)}%` },
                ]}
              />
            </View>
          }
          description={humidityEval}
        />
      </View>

      {/* Hàng 2: Tốc độ gió & Hướng gió */}
      <View style={styles.row}>
        <MetricCard
          title="Tốc độ gió"
          icon={<WindIcon size={16} color="#81D4FA" />}
          value={`${Math.round(current.windSpeed)}`}
          subValue="km/h"
          description={windLevel}
        />

        <MetricCard
          title="Hướng gió"
          icon={<WindIcon size={16} color="#80DEEA" />}
          value={windDirLabel}
          visualElement={
            <CompassIcon size={48} degrees={current.windDirection} />
          }
          description={`${Math.round(current.windDirection)}°`}
        />
      </View>

      {/* Hàng 3: Chỉ số UV & Lượng mưa */}
      <View style={styles.row}>
        <MetricCard
          title="Chỉ số UV"
          icon={<UVIcon size={16} color="#FFB74D" />}
          value={`${Math.round(current.uvIndex * 10) / 10}`}
          subValue={uvInfo.level}
          visualElement={
            <View style={styles.uvTrack}>
              <View
                style={[
                  styles.uvThumb,
                  {
                    left: `${Math.min(
                      Math.max(uvInfo.percent * 100 - 4, 0),
                      92,
                    )}%`,
                    backgroundColor: uvInfo.color,
                  },
                ]}
              />
            </View>
          }
          description={uvInfo.advice}
        />

        <MetricCard
          title="Lượng mưa"
          icon={<DropletIcon size={16} color="#29B6F6" />}
          value={`${current.precipitation.toFixed(1)}`}
          subValue="mm"
          description={
            current.precipitation > 0
              ? 'Đang có mưa tại khu vực'
              : 'Không có mưa dự kiến'
          }
        />
      </View>

      {/* Hàng 4: Áp suất & Tầm nhìn */}
      <View style={styles.row}>
        <MetricCard
          title="Áp suất khí quyển"
          icon={<PressureIcon size={16} color="#CE93D8" />}
          value={`${Math.round(current.pressure)}`}
          subValue="hPa"
          description={pressureEval}
        />

        <MetricCard
          title="Tầm nhìn"
          icon={<EyeIcon size={16} color="#80CBC4" />}
          value={formatVisibility(current.visibility)}
          description={visibilityEval}
        />
      </View>

      {/* Hàng 5: Mặt trời mọc & Mặt trời lặn */}
      <View style={styles.row}>
        <MetricCard
          title="Bình minh"
          icon={<SunriseIcon size={16} color="#FFE082" />}
          value={current.sunrise || '--:--'}
          description="Thời điểm mặt trời mọc"
        />

        <MetricCard
          title="Hoàng hôn"
          icon={<SunsetIcon size={16} color="#FFAB91" />}
          value={current.sunset || '--:--'}
          description="Thời điểm mặt trời lặn"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00E5FF',
    borderRadius: 3,
  },
  uvTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    position: 'relative',
  },
  uvThumb: {
    position: 'absolute',
    top: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
