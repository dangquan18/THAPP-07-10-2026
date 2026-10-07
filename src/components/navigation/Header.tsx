import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LocationInfo, TemperatureUnit } from '../../types/weather';
import { LocationPinIcon, NavigationGpsIcon, RefreshIcon, SearchIcon } from '../common/AppIcons';

interface HeaderProps {
  location: LocationInfo;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onSearchPress: () => void;
  onRefreshPress: () => void;
  onGpsPress: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  location,
  unit,
  onToggleUnit,
  onSearchPress,
  onRefreshPress,
  onGpsPress,
  isRefreshing = false,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onGpsPress}
          activeOpacity={0.7}
          accessibilityLabel="Vị trí GPS hiện tại"
        >
          <NavigationGpsIcon size={18} color={location.isCurrentLocation ? '#00E5FF' : '#FFFFFF'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.unitBtn}
          onPress={onToggleUnit}
          activeOpacity={0.7}
          accessibilityLabel="Đổi đơn vị nhiệt độ"
        >
          <Text style={styles.unitText}>°{unit}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.locationWrapper}
        onPress={onSearchPress}
        activeOpacity={0.8}
      >
        <View style={styles.locationTitleRow}>
          <LocationPinIcon size={16} color="#FFFFFF" />
          <Text style={styles.cityName} numberOfLines={1}>
            {location.name}
          </Text>
        </View>
        {location.region && (
          <Text style={styles.regionName} numberOfLines={1}>
            {location.region}
            {location.country ? ` • ${location.country}` : ''}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onSearchPress}
          activeOpacity={0.7}
          accessibilityLabel="Tìm kiếm thành phố"
        >
          <SearchIcon size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, isRefreshing && styles.actionBtnSpinning]}
          onPress={onRefreshPress}
          activeOpacity={0.7}
          accessibilityLabel="Làm mới thời tiết"
        >
          <RefreshIcon size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  actionBtnSpinning: {
    opacity: 0.5,
  },
  unitBtn: {
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  locationWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  regionName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
});
