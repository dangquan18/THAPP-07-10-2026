import { TemperatureUnit } from '../types/weather';

export function formatTemperature(celsius: number, unit: TemperatureUnit = 'C'): string {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return '--°';
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatHour(isoString: string): string {
  try {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    return `${hours}:00`;
  } catch {
    return isoString;
  }
}

export function formatDayName(dateString: string): { dayLabel: string; fullDateLabel: string } {
  try {
    const date = new Date(dateString);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const dayOfWeek = date.getDay();
    const daysVietnamese = [
      'Chủ Nhật',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy',
    ];

    const dayName = daysVietnamese[dayOfWeek];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    return {
      dayLabel: isToday ? 'Hôm nay' : dayName,
      fullDateLabel: `${dayName}, ${day}/${month}`,
    };
  } catch {
    return { dayLabel: dateString, fullDateLabel: dateString };
  }
}

export function formatTimeOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return isoString;
  }
}

export function formatVisibility(meters: number): string {
  if (!meters && meters !== 0) return '-- km';
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}
