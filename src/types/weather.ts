export type TemperatureUnit = 'C' | 'F';

export interface LocationInfo {
  name: string;
  country?: string;
  region?: string;
  latitude: number;
  longitude: number;
  isCurrentLocation?: boolean;
}

export interface RawOpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    weather_code: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    surface_pressure: number[];
    visibility: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    uv_index: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
}

export interface HourlyForecastItem {
  time: string; // ISO or formatted
  rawTime: string;
  hour: number;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  precipitationProbability: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Hôm nay", "T2", "T3"...
  fullDateLabel: string; // "Thứ Tư, 07/10"
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  uvIndexMax: number;
  windSpeedMax: number;
  windDirection: number;
  sunrise: string;
  sunset: string;
  hourlyList?: HourlyForecastItem[];
}

export interface CurrentWeatherData {
  location: LocationInfo;
  temperature: number;
  apparentTemperature: number;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  isDay: boolean;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  precipitation: number;
  sunrise: string;
  sunset: string;
  updateTime: string;
}

export interface WeatherData {
  current: CurrentWeatherData;
  hourly24h: HourlyForecastItem[];
  daily7Days: DailyForecastItem[];
}

export interface GeocodingResultItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string; // Tỉnh / Bang
  admin2?: string; // Quận / Huyện
  timezone?: string;
}

export type RootStackParamList = {
  Home: { selectedLocation?: LocationInfo };
  Detail: {
    location: LocationInfo;
    dayItem?: DailyForecastItem;
    hourItem?: HourlyForecastItem;
    unit: TemperatureUnit;
  };
  SearchCity: {
    currentLocation?: LocationInfo;
  };
};
