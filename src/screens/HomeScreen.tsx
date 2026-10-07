import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { POPULAR_CITIES, reverseGeocode } from '../api/geocodingApi';
import { fetchWeatherData } from '../api/weatherApi';
import { ErrorView } from '../components/common/ErrorView';
import { GradientBackground } from '../components/common/GradientBackground';
import { LoadingView } from '../components/common/LoadingView';
import { Header } from '../components/navigation/Header';
import { CurrentWeather } from '../components/weather/CurrentWeather';
import { DailyForecast } from '../components/weather/DailyForecast';
import { HourlyForecast } from '../components/weather/HourlyForecast';
import { WeatherMetricsGrid } from '../components/weather/WeatherMetricsGrid';
import {
  DailyForecastItem,
  HourlyForecastItem,
  LocationInfo,
  RootStackParamList,
  TemperatureUnit,
  WeatherData,
} from '../types/weather';
import {
  DEFAULT_COORDINATES,
  getCurrentGPSLocation,
  requestLocationPermission,
} from '../utils/locationPermission';
import { getWeatherTheme } from '../utils/weatherCode';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(
    POPULAR_CITIES[0], // Default Hà Nội
  );
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionDeniedBanner, setPermissionDeniedBanner] = useState<boolean>(false);

  const activeRequestId = React.useRef(0);
  const isUserSelectedCity = React.useRef(false);
  const currentLocationRef = React.useRef(currentLocation);

  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  // Hàm tải dữ liệu thời tiết từ location
  const loadWeather = useCallback(async (loc: LocationInfo) => {
    const reqId = ++activeRequestId.current;
    try {
      setErrorMessage(null);
      const data = await fetchWeatherData(loc);
      if (reqId !== activeRequestId.current) {
        // Có yêu cầu mới hơn, bỏ qua kết quả này
        return;
      }
      setWeatherData(data);
      setCurrentLocation(loc);
    } catch (err: any) {
      if (reqId !== activeRequestId.current) return;
      console.warn('loadWeather error:', err);
      setErrorMessage(
        err?.message || 'Không thể kết nối đến máy chủ thời tiết. Vui lòng thử lại.',
      );
    } finally {
      if (reqId === activeRequestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  // Hàm xin quyền và lấy vị trí GPS hiện tại
  const fetchCurrentLocationWeather = useCallback(
    async (isManualClick: boolean = false) => {
      // Nếu là chạy ngầm lúc mở app mà người dùng đã bấm chọn tỉnh khác thì bỏ qua
      if (!isManualClick && isUserSelectedCity.current) {
        return;
      }
      if (isManualClick) {
        isUserSelectedCity.current = false;
      }

      const reqId = ++activeRequestId.current;
      try {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          if (reqId !== activeRequestId.current) return;
          setPermissionDeniedBanner(true);
          // Chỉ fallback nếu chưa có dữ liệu thời tiết nào hiển thị
          setWeatherData(prev => {
            if (!prev) {
              loadWeather(currentLocationRef.current);
            }
            return prev;
          });
          return;
        }

        setPermissionDeniedBanner(false);
        setLoading(true);
        const coords = await getCurrentGPSLocation();
        if (reqId !== activeRequestId.current) return;

        const loc = await reverseGeocode(coords.latitude, coords.longitude);
        if (reqId !== activeRequestId.current) return;

        setCurrentLocation(loc);
        currentLocationRef.current = loc;
        await loadWeather(loc);
      } catch (err) {
        console.warn('GPS location fetch failed, using fallback:', err);
        if (reqId !== activeRequestId.current) return;
        setPermissionDeniedBanner(true);
        // Chỉ fallback nếu chưa có dữ liệu thời tiết nào
        setWeatherData(prev => {
          if (!prev) {
            loadWeather(currentLocationRef.current);
          }
          return prev;
        });
      }
    },
    [loadWeather],
  );

  // Khởi động ban đầu: thử lấy vị trí GPS
  useEffect(() => {
    fetchCurrentLocationWeather(false);
  }, [fetchCurrentLocationWeather]);

  // Lắng nghe khi người dùng chọn thành phố mới từ SearchCityScreen
  useEffect(() => {
    if (route.params?.selectedLocation) {
      const selected = route.params.selectedLocation;
      isUserSelectedCity.current = true; // Người dùng đã chủ động chọn thành phố
      setCurrentLocation(selected);
      currentLocationRef.current = selected;
      setPermissionDeniedBanner(false);
      setLoading(true);
      loadWeather(selected);
    }
  }, [route.params?.selectedLocation, loadWeather]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadWeather(currentLocationRef.current);
  }, [loadWeather]);

  // Toggle °C / °F
  const toggleUnit = () => {
    setUnit(prev => (prev === 'C' ? 'F' : 'C'));
  };

  // Điều hướng xem chi tiết giờ
  const handleSelectHour = (hourItem: HourlyForecastItem) => {
    navigation.navigate('Detail', {
      location: currentLocation,
      hourItem,
      unit,
    });
  };

  // Điều hướng xem chi tiết ngày
  const handleSelectDay = (dayItem: DailyForecastItem) => {
    navigation.navigate('Detail', {
      location: currentLocation,
      dayItem,
      unit,
    });
  };

  // Mở màn hình tìm kiếm thành phố
  const handleOpenSearch = () => {
    navigation.navigate('SearchCity', { currentLocation });
  };

  // Nếu đang tải lần đầu
  if (loading && !weatherData) {
    return <LoadingView message={`Đang tải thời tiết tại ${currentLocation.name}...`} />;
  }

  // Nếu bị lỗi và không có dữ liệu
  if (errorMessage && !weatherData) {
    return (
      <ErrorView
        message={errorMessage}
        onRetry={() => {
          setLoading(true);
          loadWeather(currentLocation);
        }}
        onSearchCity={handleOpenSearch}
      />
    );
  }

  if (!weatherData) return null;

  const theme = getWeatherTheme(
    weatherData.current.weatherCode,
    weatherData.current.isDay,
  );

  return (
    <GradientBackground colors={theme.colors}>
      <StatusBar barStyle={theme.statusBarStyle} />

      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header với tên địa điểm, chuyển đổi °C/°F, GPS, Tìm kiếm */}
        <Header
          location={currentLocation}
          unit={unit}
          onToggleUnit={toggleUnit}
          onSearchPress={handleOpenSearch}
          onRefreshPress={onRefresh}
          onGpsPress={() => fetchCurrentLocationWeather(true)}
          isRefreshing={refreshing}
        />

        {/* Banner thông báo khi người dùng chưa cấp quyền GPS */}
        {permissionDeniedBanner && (
          <View style={styles.permissionBanner}>
            <Text style={styles.permissionText}>
              Chưa có quyền vị trí GPS. Đang hiển thị dữ liệu tại {currentLocation.name}.
            </Text>
            <TouchableOpacity
              style={styles.permissionAction}
              onPress={() => fetchCurrentLocationWeather(true)}
            >
              <Text style={styles.permissionActionText}>Cấp quyền lại</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Nội dung cuộn chính */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              colors={['#1E88E5']}
            />
          }
        >
          {/* 1. Xem thời tiết hiện tại */}
          <CurrentWeather current={weatherData.current} unit={unit} />

          {/* 2. Dự báo theo giờ (24 giờ tiếp theo) */}
          <HourlyForecast
            hourlyList={weatherData.hourly24h}
            unit={unit}
            onSelectHour={handleSelectHour}
          />

          {/* 3. Dự báo nhiều ngày (7 ngày) */}
          <DailyForecast
            dailyList={weatherData.daily7Days}
            unit={unit}
            onSelectDay={handleSelectDay}
          />

          {/* 5. Theo dõi các chỉ số thời tiết chi tiết trực quan */}
          <WeatherMetricsGrid current={weatherData.current} unit={unit} />
        </ScrollView>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 179, 0, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 0, 0.4)',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  permissionText: {
    flex: 1,
    fontSize: 12,
    color: '#FFF8E1',
    fontWeight: '500',
    marginRight: 8,
  },
  permissionAction: {
    backgroundColor: '#FFB300',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  permissionActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
});
