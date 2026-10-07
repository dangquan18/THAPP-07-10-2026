import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BackIcon,
  CompassIcon,
  DropletIcon,
  EyeIcon,
  PressureIcon,
  SunriseIcon,
  SunsetIcon,
  ThermometerIcon,
  UVIcon,
  WindIcon,
} from '../components/common/AppIcons';
import { Card } from '../components/common/Card';
import { GradientBackground } from '../components/common/GradientBackground';
import { WeatherIcon } from '../components/common/WeatherIcon';
import { MetricCard } from '../components/weather/MetricCard';
import { RootStackParamList } from '../types/weather';
import { formatTemperature, formatVisibility } from '../utils/formatters';
import {
  getHumidityEvaluation,
  getPressureEvaluation,
  getUVLevel,
  getVisibilityEvaluation,
  getWeatherCodeInfo,
  getWeatherTheme,
  getWindDirectionLabel,
  getWindSpeedLevel,
} from '../utils/weatherCode';

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { location, dayItem, hourItem, unit } = route.params;

  // Quyết định xem chi tiết ngày hay chi tiết giờ
  const isDayView = !!dayItem;
  const weatherCode = isDayView ? dayItem!.weatherCode : hourItem!.weatherCode;
  const isDayTime = isDayView ? true : hourItem!.isDay;
  const theme = getWeatherTheme(weatherCode, isDayTime);
  const codeInfo = getWeatherCodeInfo(weatherCode);

  const uv = isDayView ? dayItem!.uvIndexMax : hourItem!.uvIndex;
  const uvInfo = getUVLevel(uv);
  const windSpeed = isDayView ? dayItem!.windSpeedMax : hourItem!.windSpeed;
  const windDir = isDayView ? dayItem!.windDirection : hourItem!.windDirection;
  const windDirLabel = getWindDirectionLabel(windDir);
  const windLevel = getWindSpeedLevel(windSpeed);
  const rainProb = isDayView
    ? dayItem!.precipitationProbability
    : hourItem!.precipitationProbability;
  const rainAmount = isDayView ? dayItem!.precipitationSum : hourItem!.precipitation;
  const humidity = isDayView
    ? dayItem!.hourlyList?.[12]?.humidity ?? 65
    : hourItem!.humidity;
  const pressure = isDayView
    ? dayItem!.hourlyList?.[12]?.pressure ?? 1013
    : hourItem!.pressure;
  const visibility = hourItem ? hourItem.visibility : 10000;

  return (
    <GradientBackground colors={theme.colors}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header với nút quay lại */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <BackIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {isDayView ? dayItem!.fullDateLabel : `Chi tiết ${hourItem!.time}`}
            </Text>
            <Text style={styles.headerSubtitle}>{location.name}</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Banner tổng quan */}
          <Card style={styles.heroCard}>
            <View style={styles.heroRow}>
              <WeatherIcon
                weatherCode={weatherCode}
                isDay={isDayTime}
                size={80}
              />
              <View style={styles.heroInfo}>
                <Text style={styles.heroCondition}>{codeInfo.description}</Text>
                {isDayView ? (
                  <View style={styles.tempRangeRow}>
                    <Text style={styles.heroTempMax}>
                      {formatTemperature(dayItem!.tempMax, unit)}
                    </Text>
                    <Text style={styles.heroTempSeparator}>/</Text>
                    <Text style={styles.heroTempMin}>
                      {formatTemperature(dayItem!.tempMin, unit)}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.heroSingleTemp}>
                    {formatTemperature(hourItem!.temperature, unit)}
                  </Text>
                )}

                <View style={styles.rainBadgeRow}>
                  <DropletIcon size={14} color="#00E5FF" />
                  <Text style={styles.rainBadgeText}>
                    Xác suất mưa: {rainProb}%
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Nếu là chi tiết ngày: Hiển thị 24 giờ của riêng ngày đó */}
          {isDayView && dayItem!.hourlyList && dayItem!.hourlyList.length > 0 && (
            <Card title={`Diễn biến thời tiết trong ngày (${dayItem!.dayLabel})`}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dayHourlyScroll}
              >
                {dayItem!.hourlyList.map((h, i) => (
                  <View key={i} style={styles.miniHourCard}>
                    <Text style={styles.miniHourTime}>{h.time}</Text>
                    <WeatherIcon
                      weatherCode={h.weatherCode}
                      isDay={h.isDay}
                      size={28}
                    />
                    <Text style={styles.miniHourTemp}>
                      {formatTemperature(h.temperature, unit)}
                    </Text>
                    <View style={styles.miniRainRow}>
                      <DropletIcon size={10} color="#00E5FF" />
                      <Text style={styles.miniRainText}>
                        {h.precipitationProbability}%
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </Card>
          )}

          {/* Lưới các chỉ số chi tiết */}
          <Text style={styles.sectionHeader}>PHÂN TÍCH CHỈ SỐ MÔI TRƯỜNG</Text>

          <View style={styles.metricsGrid}>
            {/* Hàng 1: Nhiệt độ cảm nhận / Điểm sương & Độ ẩm */}
            <View style={styles.metricRow}>
              <MetricCard
                title="Cảm giác thực tế"
                icon={<ThermometerIcon size={16} color="#FF8A65" />}
                value={
                  isDayView
                    ? formatTemperature(dayItem!.apparentTempMax, unit)
                    : formatTemperature(hourItem!.apparentTemperature, unit)
                }
                subValue={isDayView ? 'Tối đa' : undefined}
                description="Cảm nhận nhiệt độ dưới tác động của gió và độ ẩm"
              />

              <MetricCard
                title="Độ ẩm không khí"
                icon={<DropletIcon size={16} color="#4FC3F7" />}
                value={`${Math.round(humidity)}%`}
                description={getHumidityEvaluation(humidity)}
              />
            </View>

            {/* Hàng 2: Gió & Hướng gió */}
            <View style={styles.metricRow}>
              <MetricCard
                title={isDayView ? 'Gió mạnh nhất' : 'Tốc độ gió'}
                icon={<WindIcon size={16} color="#81D4FA" />}
                value={`${Math.round(windSpeed)}`}
                subValue="km/h"
                description={windLevel}
              />

              <MetricCard
                title="Hướng gió"
                icon={<WindIcon size={16} color="#80DEEA" />}
                value={windDirLabel}
                visualElement={<CompassIcon size={44} degrees={windDir} />}
                description={`Góc ${Math.round(windDir)}°`}
              />
            </View>

            {/* Hàng 3: Chỉ số UV & Lượng mưa */}
            <View style={styles.metricRow}>
              <MetricCard
                title="Chỉ số tia UV"
                icon={<UVIcon size={16} color="#FFB74D" />}
                value={`${(Math.round(uv * 10) / 10).toFixed(1)}`}
                subValue={uvInfo.level}
                description={uvInfo.advice}
              />

              <MetricCard
                title="Lượng mưa"
                icon={<DropletIcon size={16} color="#29B6F6" />}
                value={`${rainAmount.toFixed(1)}`}
                subValue="mm"
                description={
                  rainAmount > 0
                    ? `Dự kiến tổng lượng mưa ${rainAmount} mm`
                    : 'Không ghi nhận mưa đáng kể'
                }
              />
            </View>

            {/* Hàng 4: Áp suất & Tầm nhìn (hoặc Bình minh / Hoàng hôn) */}
            <View style={styles.metricRow}>
              <MetricCard
                title="Áp suất khí quyển"
                icon={<PressureIcon size={16} color="#CE93D8" />}
                value={`${Math.round(pressure)}`}
                subValue="hPa"
                description={getPressureEvaluation(pressure)}
              />

              {isDayView ? (
                <MetricCard
                  title="Bình minh & Hoàng hôn"
                  icon={<SunriseIcon size={16} color="#FFE082" />}
                  value={dayItem!.sunrise || '--:--'}
                  subValue={`• Lặn ${dayItem!.sunset || '--:--'}`}
                  description="Chu kỳ ánh sáng mặt trời trong ngày"
                />
              ) : (
                <MetricCard
                  title="Tầm nhìn xa"
                  icon={<EyeIcon size={16} color="#80CBC4" />}
                  value={formatVisibility(visibility)}
                  description={getVisibilityEvaluation(visibility / 1000)}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  heroCard: {
    paddingVertical: 20,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  heroInfo: {
    justifyContent: 'center',
  },
  heroCondition: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  tempRangeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 6,
  },
  heroTempMax: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroTempSeparator: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  heroTempMin: {
    fontSize: 24,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  heroSingleTemp: {
    fontSize: 40,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  rainBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rainBadgeText: {
    fontSize: 13,
    color: '#00E5FF',
    fontWeight: '600',
  },
  dayHourlyScroll: {
    paddingVertical: 6,
    gap: 10,
  },
  miniHourCard: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    minWidth: 62,
  },
  miniHourTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
    fontWeight: '500',
  },
  miniHourTemp: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 4,
  },
  miniRainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  miniRainText: {
    fontSize: 10,
    color: '#00E5FF',
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 1,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  metricsGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
