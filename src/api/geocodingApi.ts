import { GeocodingResultItem, LocationInfo } from '../types/weather';

export const POPULAR_CITIES: LocationInfo[] = [
  {
    name: 'Hà Nội',
    region: 'Thủ đô',
    country: 'Việt Nam',
    latitude: 21.0285,
    longitude: 105.8542,
  },
  {
    name: 'TP. Hồ Chí Minh',
    region: 'Miền Nam',
    country: 'Việt Nam',
    latitude: 10.8231,
    longitude: 106.6297,
  },
  {
    name: 'Đà Nẵng',
    region: 'Miền Trung',
    country: 'Việt Nam',
    latitude: 16.0544,
    longitude: 108.2022,
  },
  {
    name: 'Hải Phòng',
    region: 'Miền Bắc',
    country: 'Việt Nam',
    latitude: 20.8449,
    longitude: 106.6881,
  },
  {
    name: 'Cần Thơ',
    region: 'Đồng bằng Sông Cửu Long',
    country: 'Việt Nam',
    latitude: 10.0452,
    longitude: 105.7469,
  },
  {
    name: 'Nha Trang',
    region: 'Khánh Hòa',
    country: 'Việt Nam',
    latitude: 12.2388,
    longitude: 109.1967,
  },
  {
    name: 'Đà Lạt',
    region: 'Lâm Đồng',
    country: 'Việt Nam',
    latitude: 11.9404,
    longitude: 108.4583,
  },
  {
    name: 'Huế',
    region: 'Thừa Thiên Huế',
    country: 'Việt Nam',
    latitude: 16.4637,
    longitude: 107.5909,
  },
  {
    name: 'Tokyo',
    region: 'Kanto',
    country: 'Nhật Bản',
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    name: 'Seoul',
    region: 'Seoul',
    country: 'Hàn Quốc',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    name: 'Bangkok',
    region: 'Central',
    country: 'Thái Lan',
    latitude: 13.7563,
    longitude: 100.5018,
  },
  {
    name: 'Singapore',
    region: 'Singapore',
    country: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
  },
  {
    name: 'Paris',
    region: 'Île-de-France',
    country: 'Pháp',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    name: 'London',
    region: 'England',
    country: 'Anh',
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    name: 'New York',
    region: 'New York',
    country: 'Hoa Kỳ',
    latitude: 40.7128,
    longitude: -74.006,
  },
];

export async function searchCities(query: string): Promise<LocationInfo[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmed,
    )}&count=10&language=vi&format=json`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding HTTP error: ${res.status}`);
    }
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: GeocodingResultItem) => {
      let displayName = item.name;
      const parts: string[] = [];
      if (item.admin2) parts.push(item.admin2);
      if (item.admin1 && item.admin1 !== item.name) parts.push(item.admin1);
      const region = parts.join(', ');

      return {
        name: displayName,
        region: region || undefined,
        country: item.country || '',
        latitude: item.latitude,
        longitude: item.longitude,
      };
    });
  } catch (error) {
    console.warn('searchCities error:', error);
    // Fallback locally filter popular cities
    return POPULAR_CITIES.filter(
      c =>
        c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        (c.region && c.region.toLowerCase().includes(trimmed.toLowerCase())) ||
        (c.country && c.country.toLowerCase().includes(trimmed.toLowerCase())),
    );
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationInfo> {
  try {
    // 1. Thử BigDataCloud API (nhanh, hỗ trợ tiếng Việt)
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`;
    const res = await fetch(bdcUrl);
    if (res.ok) {
      const data = await res.json();
      const city =
        data.locality ||
        data.city ||
        data.principalSubdivision ||
        `Vĩ độ: ${latitude.toFixed(2)}`;
      const region = data.principalSubdivision || data.localityInfo?.administrative?.[1]?.name || '';
      const country = data.countryName || '';

      return {
        name: city,
        region: region !== city ? region : undefined,
        country: country,
        latitude,
        longitude,
        isCurrentLocation: true,
      };
    }
  } catch (e) {
    console.warn('BigDataCloud reverse geocode failed, falling back:', e);
  }

  try {
    // 2. Thử Nominatim API
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=vi`;
    const res = await fetch(nominatimUrl, {
      headers: { 'User-Agent': 'RNWeatherApp/1.0' },
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city =
        addr.city ||
        addr.town ||
        addr.suburb ||
        addr.district ||
        addr.state ||
        `Tọa độ ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

      return {
        name: city,
        region: addr.state || addr.county || undefined,
        country: addr.country || '',
        latitude,
        longitude,
        isCurrentLocation: true,
      };
    }
  } catch (e) {
    console.warn('Nominatim reverse geocode failed:', e);
  }

  // Fallback mặc định
  return {
    name: 'Vị trí hiện tại',
    region: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
    latitude,
    longitude,
    isCurrentLocation: true,
  };
}
