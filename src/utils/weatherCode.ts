export interface WeatherCodeInfo {
  code: number;
  description: string;
  iconType:
    | 'clear'
    | 'partly-cloudy'
    | 'cloudy'
    | 'overcast'
    | 'fog'
    | 'drizzle'
    | 'rain'
    | 'heavy-rain'
    | 'snow'
    | 'thunderstorm';
}

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  switch (code) {
    case 0:
      return { code, description: 'Trời quang đãng', iconType: 'clear' };
    case 1:
      return { code, description: 'Trời ít mây', iconType: 'partly-cloudy' };
    case 2:
      return { code, description: 'Mây rải rác', iconType: 'partly-cloudy' };
    case 3:
      return { code, description: 'Nhiều mây, u ám', iconType: 'overcast' };
    case 45:
      return { code, description: 'Sương mù', iconType: 'fog' };
    case 48:
      return { code, description: 'Sương mù đóng băng', iconType: 'fog' };
    case 51:
      return { code, description: 'Mưa phùn nhẹ', iconType: 'drizzle' };
    case 53:
      return { code, description: 'Mưa phùn vừa', iconType: 'drizzle' };
    case 55:
      return { code, description: 'Mưa phùn dày hạt', iconType: 'drizzle' };
    case 56:
    case 57:
      return { code, description: 'Mưa phùn buốt giá', iconType: 'drizzle' };
    case 61:
      return { code, description: 'Mưa nhỏ rải rác', iconType: 'rain' };
    case 63:
      return { code, description: 'Mưa vừa', iconType: 'rain' };
    case 65:
      return { code, description: 'Mưa to xối xả', iconType: 'heavy-rain' };
    case 66:
    case 67:
      return { code, description: 'Mưa đá lạnh buốt', iconType: 'heavy-rain' };
    case 71:
      return { code, description: 'Tuyết rơi nhẹ', iconType: 'snow' };
    case 73:
      return { code, description: 'Tuyết rơi vừa', iconType: 'snow' };
    case 75:
      return { code, description: 'Tuyết rơi dày', iconType: 'snow' };
    case 77:
      return { code, description: 'Tuyết hạt', iconType: 'snow' };
    case 80:
      return { code, description: 'Mưa rào nhẹ', iconType: 'rain' };
    case 81:
      return { code, description: 'Mưa rào vừa', iconType: 'rain' };
    case 82:
      return { code, description: 'Mưa rào dữ dội', iconType: 'heavy-rain' };
    case 85:
    case 86:
      return { code, description: 'Mưa tuyết rào', iconType: 'snow' };
    case 95:
      return { code, description: 'Dông bão sấm sét', iconType: 'thunderstorm' };
    case 96:
    case 99:
      return { code, description: 'Dông bão kèm mưa đá', iconType: 'thunderstorm' };
    default:
      return { code, description: 'Có mây', iconType: 'partly-cloudy' };
  }
}

export interface GradientTheme {
  colors: [string, string, string];
  statusBarStyle: 'light-content' | 'dark-content';
}

export function getWeatherTheme(code: number, isDay: boolean = true): GradientTheme {
  const info = getWeatherCodeInfo(code);

  if (!isDay) {
    // Ban đêm
    switch (info.iconType) {
      case 'clear':
        return {
          colors: ['#0B1021', '#141E30', '#243B55'],
          statusBarStyle: 'light-content',
        };
      case 'thunderstorm':
        return {
          colors: ['#1A0B2E', '#20163B', '#111827'],
          statusBarStyle: 'light-content',
        };
      case 'rain':
      case 'heavy-rain':
      case 'drizzle':
        return {
          colors: ['#0F2027', '#203A43', '#2C5364'],
          statusBarStyle: 'light-content',
        };
      default:
        return {
          colors: ['#0A1128', '#1C2541', '#3A506B'],
          statusBarStyle: 'light-content',
        };
    }
  }

  // Ban ngày
  switch (info.iconType) {
    case 'clear':
      // Nắng vàng rực rỡ, trời xanh biếc
      return {
        colors: ['#1E88E5', '#42A5F5', '#90CAF9'],
        statusBarStyle: 'light-content',
      };
    case 'partly-cloudy':
      return {
        colors: ['#1976D2', '#3F8EFC', '#74B9FF'],
        statusBarStyle: 'light-content',
      };
    case 'cloudy':
    case 'overcast':
      return {
        colors: ['#3A6073', '#5D737E', '#8FA3AD'],
        statusBarStyle: 'light-content',
      };
    case 'fog':
      return {
        colors: ['#495867', '#62727B', '#90A4AE'],
        statusBarStyle: 'light-content',
      };
    case 'rain':
    case 'drizzle':
      return {
        colors: ['#2C3E50', '#3498DB', '#5DADE2'],
        statusBarStyle: 'light-content',
      };
    case 'heavy-rain':
      return {
        colors: ['#1F2937', '#374151', '#4B5563'],
        statusBarStyle: 'light-content',
      };
    case 'thunderstorm':
      return {
        colors: ['#281E5D', '#3B2F7D', '#54428E'],
        statusBarStyle: 'light-content',
      };
    case 'snow':
      return {
        colors: ['#536976', '#8898AA', '#B0BEC5'],
        statusBarStyle: 'light-content',
      };
    default:
      return {
        colors: ['#1E88E5', '#42A5F5', '#90CAF9'],
        statusBarStyle: 'light-content',
      };
  }
}

export function getUVLevel(uv: number): {
  level: string;
  color: string;
  advice: string;
  percent: number;
} {
  const rounded = Math.round(uv * 10) / 10;
  if (rounded <= 2) {
    return {
      level: 'Thấp',
      color: '#4CAF50',
      advice: 'An toàn khi hoạt động ngoài trời.',
      percent: Math.min(rounded / 12, 1),
    };
  } else if (rounded <= 5) {
    return {
      level: 'Trung bình',
      color: '#FFB300',
      advice: 'Nên đeo kính râm và đội mũ khi ra nắng.',
      percent: Math.min(rounded / 12, 1),
    };
  } else if (rounded <= 7) {
    return {
      level: 'Cao',
      color: '#FB8C00',
      advice: 'Thoa kem chống nắng, che chắn cẩn thận.',
      percent: Math.min(rounded / 12, 1),
    };
  } else if (rounded <= 10) {
    return {
      level: 'Rất cao',
      color: '#E53935',
      advice: 'Hạn chế ra ngoài vào buổi trưa 11h - 15h.',
      percent: Math.min(rounded / 12, 1),
    };
  } else {
    return {
      level: 'Nguy hại',
      color: '#8E24AA',
      advice: 'Cực kỳ nguy hiểm, tránh tiếp xúc trực tiếp ánh nắng!',
      percent: 1,
    };
  }
}

export function getWindDirectionLabel(degrees: number): string {
  const directions = [
    'Bắc',
    'Bắc Đông Bắc',
    'Đông Bắc',
    'Đông Đông Bắc',
    'Đông',
    'Đông Đông Nam',
    'Đông Nam',
    'Nam Đông Nam',
    'Nam',
    'Nam Tây Nam',
    'Tây Nam',
    'Tây Tây Nam',
    'Tây',
    'Tây Tây Bắc',
    'Tây Bắc',
    'Bắc Tây Bắc',
  ];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function getWindSpeedLevel(speedKmH: number): string {
  if (speedKmH < 5) return 'Gió lặng';
  if (speedKmH <= 19) return 'Gió nhẹ';
  if (speedKmH <= 29) return 'Gió vừa';
  if (speedKmH <= 39) return 'Gió khá mạnh';
  if (speedKmH <= 61) return 'Gió mạnh';
  return 'Gió bão nguy hiểm';
}

export function getVisibilityEvaluation(km: number): string {
  if (km >= 10) return 'Tầm nhìn tuyệt hảo (>10 km)';
  if (km >= 5) return 'Tầm nhìn tốt';
  if (km >= 2) return 'Tầm nhìn trung bình';
  if (km >= 1) return 'Tầm nhìn hạn chế, có sương mù';
  return 'Sương mù dày đặc';
}

export function getPressureEvaluation(hPa: number): string {
  if (hPa > 1020) return 'Áp suất cao';
  if (hPa >= 1005) return 'Áp suất ổn định bình thường';
  return 'Áp suất thấp (dễ có mưa/bão)';
}

export function getHumidityEvaluation(humidity: number): string {
  if (humidity < 35) return 'Khô hanh, uống thêm nước';
  if (humidity <= 65) return 'Độ ẩm lý tưởng, dễ chịu';
  if (humidity <= 80) return 'Độ ẩm cao, hơi oi bức';
  return 'Rất ẩm ướt, dễ nồm ẩm';
}
