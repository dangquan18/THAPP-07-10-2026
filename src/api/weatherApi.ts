import {
  CurrentWeatherData,
  DailyForecastItem,
  HourlyForecastItem,
  LocationInfo,
  RawOpenMeteoResponse,
  WeatherData,
} from '../types/weather';
import { formatDayName, formatHour, formatTimeOnly } from '../utils/formatters';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeatherData(location: LocationInfo): Promise<WeatherData> {
  const { latitude, longitude } = location;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'visibility',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_direction_10m_dominant',
    ].join(','),
    timezone: 'auto',
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Thời tiết API trả về mã lỗi: ${response.status}`);
  }

  const raw: RawOpenMeteoResponse = await response.json();

  // 1. Phân tích 24 giờ tiếp theo bắt đầu từ giờ hiện tại
  const now = new Date();
  const currentHourTimeStr = now.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"

  let startIndex = raw.hourly.time.findIndex(t => t.startsWith(currentHourTimeStr));
  if (startIndex === -1) {
    startIndex = 0;
  }

  const hourly24h: HourlyForecastItem[] = [];
  const totalHourly = raw.hourly.time.length;

  for (let i = startIndex; i < Math.min(startIndex + 24, totalHourly); i++) {
    const rawTime = raw.hourly.time[i];
    const hourDate = new Date(rawTime);
    const hourNum = hourDate.getHours();

    hourly24h.push({
      time: i === startIndex ? 'Bây giờ' : formatHour(rawTime),
      rawTime,
      hour: hourNum,
      temperature: raw.hourly.temperature_2m[i],
      apparentTemperature: raw.hourly.apparent_temperature[i],
      weatherCode: raw.hourly.weather_code[i],
      precipitationProbability: raw.hourly.precipitation_probability[i] ?? 0,
      precipitation: raw.hourly.precipitation[i] ?? 0,
      humidity: raw.hourly.relative_humidity_2m[i],
      windSpeed: raw.hourly.wind_speed_10m[i],
      windDirection: raw.hourly.wind_direction_10m[i],
      uvIndex: raw.hourly.uv_index[i] ?? 0,
      visibility: raw.hourly.visibility[i] ?? 10000,
      pressure: raw.hourly.surface_pressure[i],
      isDay: hourNum >= 6 && hourNum < 18,
    });
  }

  // 2. Phân tích 7 ngày dự báo
  const daily7Days: DailyForecastItem[] = [];
  const dailyCount = Math.min(raw.daily.time.length, 7);

  for (let d = 0; d < dailyCount; d++) {
    const dateStr = raw.daily.time[d];
    const { dayLabel, fullDateLabel } = formatDayName(dateStr);

    // Thu thập 24 giờ của ngày tương ứng
    const dayHourlyList: HourlyForecastItem[] = [];
    for (let h = 0; h < raw.hourly.time.length; h++) {
      if (raw.hourly.time[h].startsWith(dateStr)) {
        const rawTime = raw.hourly.time[h];
        const hourNum = new Date(rawTime).getHours();
        dayHourlyList.push({
          time: formatHour(rawTime),
          rawTime,
          hour: hourNum,
          temperature: raw.hourly.temperature_2m[h],
          apparentTemperature: raw.hourly.apparent_temperature[h],
          weatherCode: raw.hourly.weather_code[h],
          precipitationProbability: raw.hourly.precipitation_probability[h] ?? 0,
          precipitation: raw.hourly.precipitation[h] ?? 0,
          humidity: raw.hourly.relative_humidity_2m[h],
          windSpeed: raw.hourly.wind_speed_10m[h],
          windDirection: raw.hourly.wind_direction_10m[h],
          uvIndex: raw.hourly.uv_index[h] ?? 0,
          visibility: raw.hourly.visibility[h] ?? 10000,
          pressure: raw.hourly.surface_pressure[h],
          isDay: hourNum >= 6 && hourNum < 18,
        });
      }
    }

    daily7Days.push({
      date: dateStr,
      dayLabel: d === 0 ? 'Hôm nay' : dayLabel,
      fullDateLabel,
      weatherCode: raw.daily.weather_code[d],
      tempMax: raw.daily.temperature_2m_max[d],
      tempMin: raw.daily.temperature_2m_min[d],
      apparentTempMax: raw.daily.apparent_temperature_max[d],
      apparentTempMin: raw.daily.apparent_temperature_min[d],
      precipitationProbability: raw.daily.precipitation_probability_max[d] ?? 0,
      precipitationSum: raw.daily.precipitation_sum[d] ?? 0,
      uvIndexMax: raw.daily.uv_index_max[d] ?? 0,
      windSpeedMax: raw.daily.wind_speed_10m_max[d] ?? 0,
      windDirection: raw.daily.wind_direction_10m_dominant[d] ?? 0,
      sunrise: formatTimeOnly(raw.daily.sunrise[d]),
      sunset: formatTimeOnly(raw.daily.sunset[d]),
      hourlyList: dayHourlyList,
    });
  }

  // 3. Phân tích dữ liệu thời tiết hiện tại
  const currentDayIndex = 0;
  const currentTempMax = raw.daily.temperature_2m_max[currentDayIndex] ?? raw.current.temperature_2m;
  const currentTempMin = raw.daily.temperature_2m_min[currentDayIndex] ?? raw.current.temperature_2m;
  const currentUV =
    hourly24h[0]?.uvIndex ?? raw.daily.uv_index_max[currentDayIndex] ?? 0;
  const currentVisibility = hourly24h[0]?.visibility ?? 10000;

  const current: CurrentWeatherData = {
    location,
    temperature: raw.current.temperature_2m,
    apparentTemperature: raw.current.apparent_temperature,
    tempMax: currentTempMax,
    tempMin: currentTempMin,
    weatherCode: raw.current.weather_code,
    isDay: raw.current.is_day === 1,
    humidity: raw.current.relative_humidity_2m,
    windSpeed: raw.current.wind_speed_10m,
    windDirection: raw.current.wind_direction_10m,
    pressure: raw.current.surface_pressure,
    visibility: currentVisibility,
    uvIndex: currentUV,
    precipitation: raw.current.precipitation ?? 0,
    sunrise: formatTimeOnly(raw.daily.sunrise[0] ?? ''),
    sunset: formatTimeOnly(raw.daily.sunset[0] ?? ''),
    updateTime: formatTimeOnly(new Date().toISOString()),
  };

  return {
    current,
    hourly24h,
    daily7Days,
  };
}
