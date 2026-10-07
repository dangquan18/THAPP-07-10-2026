import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { POPULAR_CITIES, reverseGeocode, searchCities } from '../api/geocodingApi';
import {
  BackIcon,
  ChevronRightIcon,
  LocationPinIcon,
  NavigationGpsIcon,
  SearchIcon,
} from '../components/common/AppIcons';
import { GradientBackground } from '../components/common/GradientBackground';
import { LocationInfo, RootStackParamList } from '../types/weather';
import {
  getCurrentGPSLocation,
  requestLocationPermission,
} from '../utils/locationPermission';

type SearchCityScreenProps = NativeStackScreenProps<RootStackParamList, 'SearchCity'>;

export const SearchCityScreen: React.FC<SearchCityScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = await searchCities(text);
      setResults(data);
    } catch (err) {
      console.warn('Search failed:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (loc: LocationInfo) => {
    Keyboard.dismiss();
    navigation.navigate('Home', { selectedLocation: loc });
  };

  const handleUseCurrentGPS = async () => {
    setGpsLoading(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Quyền vị trí',
          'Không thể lấy vị trí do chưa được cấp quyền. Vui lòng cấp quyền vị trí trong Cài đặt thiết bị.',
        );
        setGpsLoading(false);
        return;
      }
      const coords = await getCurrentGPSLocation();
      const loc = await reverseGeocode(coords.latitude, coords.longitude);
      handleSelectLocation(loc);
    } catch (error: any) {
      Alert.alert(
        'Lỗi GPS',
        `Không thể xác định vị trí GPS: ${error?.message || 'Vui lòng bật định vị trên máy'}`,
      );
    } finally {
      setGpsLoading(false);
    }
  };

  return (
    <GradientBackground colors={['#141E30', '#243B55', '#0F2027']}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header với thanh tìm kiếm */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <BackIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.searchBarContainer}>
            <SearchIcon size={18} color="rgba(255, 255, 255, 0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Nhập tên thành phố (Hà Nội, Tokyo...)"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={query}
              onChangeText={handleSearch}
              autoFocus={true}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {isSearching && (
              <ActivityIndicator size="small" color="#FFFFFF" style={styles.searchSpinner} />
            )}
          </View>
        </View>

        {/* Nút sử dụng GPS hiện tại */}
        <TouchableOpacity
          style={styles.gpsBanner}
          onPress={handleUseCurrentGPS}
          activeOpacity={0.8}
          disabled={gpsLoading}
        >
          <View style={styles.gpsIconCircle}>
            {gpsLoading ? (
              <ActivityIndicator size="small" color="#00E5FF" />
            ) : (
              <NavigationGpsIcon size={18} color="#00E5FF" />
            )}
          </View>
          <View style={styles.gpsTextWrapper}>
            <Text style={styles.gpsTitle}>Sử dụng vị trí hiện tại</Text>
            <Text style={styles.gpsSubtitle}>Định vị GPS chính xác nơi bạn đang ở</Text>
          </View>
          <ChevronRightIcon size={18} color="rgba(255, 255, 255, 0.6)" />
        </TouchableOpacity>

        {/* Danh sách kết quả tìm kiếm HOẶC Thành phố gợi ý */}
        {query.trim().length >= 2 ? (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>KẾT QUẢ TÌM KIẾM ({results.length})</Text>
            {results.length === 0 && hasSearched && !isSearching ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Không tìm thấy địa điểm phù hợp</Text>
                <Text style={styles.emptySubtitle}>
                  Thử tìm kiếm với tên không dấu hoặc tên quốc tế (e.g. Hanoi, Danang, Tokyo...)
                </Text>
              </View>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(item, index) =>
                  `${item.name}-${item.latitude}-${item.longitude}-${index}`
                }
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.cityItem}
                    onPress={() => handleSelectLocation(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cityItemIcon}>
                      <LocationPinIcon size={18} color="#FF7043" />
                    </View>
                    <View style={styles.cityInfo}>
                      <Text style={styles.cityName}>{item.name}</Text>
                      <Text style={styles.cityDetails}>
                        {item.region ? `${item.region}, ` : ''}
                        {item.country || 'Quốc tế'}
                      </Text>
                    </View>
                    <ChevronRightIcon size={16} color="rgba(255, 255, 255, 0.4)" />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        ) : (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>THÀNH PHỐ PHỔ BIẾN</Text>
            <FlatList
              data={POPULAR_CITIES}
              keyExtractor={item => `${item.name}-${item.latitude}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityItem}
                  onPress={() => handleSelectLocation(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cityItemIcon}>
                    <LocationPinIcon size={18} color="#42A5F5" />
                  </View>
                  <View style={styles.cityInfo}>
                    <Text style={styles.cityName}>{item.name}</Text>
                    <Text style={styles.cityDetails}>
                      {item.region ? `${item.region} • ` : ''}
                      {item.country}
                    </Text>
                  </View>
                  <ChevronRightIcon size={16} color="rgba(255, 255, 255, 0.4)" />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#FFFFFF',
    fontSize: 15,
    paddingHorizontal: 8,
  },
  searchSpinner: {
    marginLeft: 6,
  },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  gpsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gpsTextWrapper: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  gpsSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cityItemIcon: {
    marginRight: 12,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cityDetails: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
