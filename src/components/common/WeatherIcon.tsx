import React from 'react';
import Svg, {
  Circle,
  Path,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { getWeatherCodeInfo } from '../../utils/weatherCode';

interface WeatherIconProps {
  weatherCode?: number;
  iconType?:
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
  isDay?: boolean;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  weatherCode,
  iconType,
  isDay = true,
  size = 48,
}) => {
  const type =
    iconType ||
    (weatherCode !== undefined ? getWeatherCodeInfo(weatherCode).iconType : 'clear');

  const renderIcon = () => {
    switch (type) {
      case 'clear':
        if (!isDay) {
          // Trăng khuyết ban đêm + ngôi sao
          return (
            <G>
              <Defs>
                <LinearGradient id="moonGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#FFF9C4" />
                  <Stop offset="1" stopColor="#FBC02D" />
                </LinearGradient>
              </Defs>
              <Path
                d="M32 8C23.16 8 16 15.16 16 24C16 32.84 23.16 40 32 40C34.2 40 36.3 39.55 38.2 38.74C34.02 36.63 31.14 32.22 31.14 27.14C31.14 20.24 36.74 14.64 43.64 14.64C45.24 14.64 46.77 14.94 48.18 15.5C45.2 11 39 8 32 8Z"
                fill="url(#moonGrad)"
              />
              {/* Sao lấp lánh */}
              <Circle cx="12" cy="14" r="1.5" fill="#FFF9C4" opacity="0.9" />
              <Circle cx="20" cy="8" r="1" fill="#FFF9C4" opacity="0.8" />
              <Circle cx="8" cy="28" r="1.2" fill="#FFF9C4" opacity="0.7" />
            </G>
          );
        }
        // Mặt trời rực rỡ ban ngày
        return (
          <G>
            <Defs>
              <LinearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FFF176" />
                <Stop offset="1" stopColor="#FFA000" />
              </LinearGradient>
            </Defs>
            <Circle cx="24" cy="24" r="11" fill="url(#sunGrad)" />
            {/* Tia nắng */}
            <Rect x="22" y="3" width="4" height="6" rx="2" fill="#FFB300" />
            <Rect x="22" y="39" width="4" height="6" rx="2" fill="#FFB300" />
            <Rect x="3" y="22" width="6" height="4" rx="2" fill="#FFB300" />
            <Rect x="39" y="22" width="6" height="4" rx="2" fill="#FFB300" />
            <Rect
              x="8.5"
              y="8.5"
              width="4"
              height="6"
              rx="2"
              fill="#FFB300"
              transform="rotate(-45 10.5 11.5)"
            />
            <Rect
              x="35.5"
              y="35.5"
              width="4"
              height="6"
              rx="2"
              fill="#FFB300"
              transform="rotate(-45 37.5 38.5)"
            />
            <Rect
              x="35.5"
              y="8.5"
              width="4"
              height="6"
              rx="2"
              fill="#FFB300"
              transform="rotate(45 37.5 11.5)"
            />
            <Rect
              x="8.5"
              y="35.5"
              width="4"
              height="6"
              rx="2"
              fill="#FFB300"
              transform="rotate(45 10.5 38.5)"
            />
          </G>
        );

      case 'partly-cloudy':
        return (
          <G>
            <Defs>
              <LinearGradient id="pcSun" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FFF176" />
                <Stop offset="1" stopColor="#FFA000" />
              </LinearGradient>
              <LinearGradient id="pcCloud" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FFFFFF" />
                <Stop offset="1" stopColor="#CFD8DC" />
              </LinearGradient>
            </Defs>
            {/* Mặt trời góc trên phải */}
            <Circle cx="32" cy="16" r="9" fill="url(#pcSun)" />
            {/* Đám mây */}
            <Path
              d="M14 38C9.58 38 6 34.42 6 30C6 26.04 8.87 22.75 12.67 22.1C13.88 16.38 18.94 12 25 12C31.7 12 37.23 17.15 37.88 23.7C41.34 24.32 44 27.35 44 31C44 35.14 40.64 38.5 36.5 38.5L14 38Z"
              fill="url(#pcCloud)"
            />
          </G>
        );

      case 'cloudy':
      case 'overcast':
        return (
          <G>
            <Defs>
              <LinearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#ECEFF1" />
                <Stop offset="1" stopColor="#90A4AE" />
              </LinearGradient>
            </Defs>
            {/* Mây sau */}
            <Path
              d="M12 28C8.68 28 6 25.32 6 22C6 19.03 8.15 16.56 11 16.07C11.91 11.78 15.7 8.5 20.25 8.5C25.27 8.5 29.42 12.36 29.91 17.27C32.5 17.74 34.5 19.98 34.5 22.75C34.5 25.65 31.98 28 29 28L12 28Z"
              fill="#78909C"
              opacity="0.8"
            />
            {/* Mây trước */}
            <Path
              d="M14 40C9.58 40 6 36.42 6 32C6 28.04 8.87 24.75 12.67 24.1C13.88 18.38 18.94 14 25 14C31.7 14 37.23 19.15 37.88 25.7C41.34 26.32 44 29.35 44 33C44 37.14 40.64 40.5 36.5 40.5L14 40Z"
              fill="url(#cloudGrad)"
            />
          </G>
        );

      case 'fog':
        return (
          <G>
            <Defs>
              <LinearGradient id="fogCloud" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#CFD8DC" />
                <Stop offset="1" stopColor="#90A4AE" />
              </LinearGradient>
            </Defs>
            <Path
              d="M13 22C10.24 22 8 19.76 8 17C8 14.52 9.8 12.47 12.18 12.06C12.94 8.49 16.1 5.75 19.9 5.75C24.1 5.75 27.56 8.97 27.97 13.06C30.13 13.45 31.8 15.35 31.8 17.65C31.8 20.24 29.7 22.35 27.2 22.35L13 22Z"
              fill="url(#fogCloud)"
            />
            {/* Các lớp sương mù */}
            <Rect x="8" y="27" width="32" height="3" rx="1.5" fill="#B0BEC5" />
            <Rect x="12" y="33" width="24" height="3" rx="1.5" fill="#B0BEC5" />
            <Rect x="6" y="39" width="36" height="3" rx="1.5" fill="#B0BEC5" />
          </G>
        );

      case 'drizzle':
        return (
          <G>
            <Defs>
              <LinearGradient id="drizzleCloud" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#ECEFF1" />
                <Stop offset="1" stopColor="#78909C" />
              </LinearGradient>
            </Defs>
            <Path
              d="M14 26C9.58 26 6 22.42 6 18C6 14.04 8.87 10.75 12.67 10.1C13.88 4.38 18.94 0 25 0C31.7 0 37.23 5.15 37.88 11.7C41.34 12.32 44 15.35 44 19C44 23.14 40.64 26.5 36.5 26.5L14 26Z"
              fill="url(#drizzleCloud)"
              transform="translate(0, 4)"
            />
            {/* Hạt mưa phùn */}
            <Circle cx="16" cy="36" r="2" fill="#4FC3F7" />
            <Circle cx="24" cy="40" r="2" fill="#4FC3F7" />
            <Circle cx="32" cy="35" r="2" fill="#4FC3F7" />
          </G>
        );

      case 'rain':
        return (
          <G>
            <Defs>
              <LinearGradient id="rainCloud" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#CFD8DC" />
                <Stop offset="1" stopColor="#546E7A" />
              </LinearGradient>
              <LinearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#29B6F6" />
                <Stop offset="1" stopColor="#0288D1" />
              </LinearGradient>
            </Defs>
            <Path
              d="M14 26C9.58 26 6 22.42 6 18C6 14.04 8.87 10.75 12.67 10.1C13.88 4.38 18.94 0 25 0C31.7 0 37.23 5.15 37.88 11.7C41.34 12.32 44 15.35 44 19C44 23.14 40.64 26.5 36.5 26.5L14 26Z"
              fill="url(#rainCloud)"
              transform="translate(0, 2)"
            />
            {/* Giọt mưa rơi nghiêng */}
            <Path
              d="M15 32L12 40"
              stroke="url(#dropGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <Path
              d="M23 33L20 42"
              stroke="url(#dropGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <Path
              d="M31 31L28 40"
              stroke="url(#dropGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </G>
        );

      case 'heavy-rain':
        return (
          <G>
            <Defs>
              <LinearGradient id="hRainCloud" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#78909C" />
                <Stop offset="1" stopColor="#37474F" />
              </LinearGradient>
              <LinearGradient id="hDropGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#00E5FF" />
                <Stop offset="1" stopColor="#0091EA" />
              </LinearGradient>
            </Defs>
            <Path
              d="M14 26C9.58 26 6 22.42 6 18C6 14.04 8.87 10.75 12.67 10.1C13.88 4.38 18.94 0 25 0C31.7 0 37.23 5.15 37.88 11.7C41.34 12.32 44 15.35 44 19C44 23.14 40.64 26.5 36.5 26.5L14 26Z"
              fill="url(#hRainCloud)"
              transform="translate(0, 2)"
            />
            {/* Mưa xối xả */}
            <Path
              d="M13 30L9 43"
              stroke="url(#hDropGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Path
              d="M21 31L17 44"
              stroke="url(#hDropGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Path
              d="M29 30L25 43"
              stroke="url(#hDropGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Path
              d="M36 32L33 41"
              stroke="url(#hDropGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </G>
        );

      case 'thunderstorm':
        return (
          <G>
            <Defs>
              <LinearGradient id="stormCloud" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#546E7A" />
                <Stop offset="1" stopColor="#212121" />
              </LinearGradient>
              <LinearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FFF59D" />
                <Stop offset="1" stopColor="#FFD600" />
              </LinearGradient>
            </Defs>
            <Path
              d="M14 26C9.58 26 6 22.42 6 18C6 14.04 8.87 10.75 12.67 10.1C13.88 4.38 18.94 0 25 0C31.7 0 37.23 5.15 37.88 11.7C41.34 12.32 44 15.35 44 19C44 23.14 40.64 26.5 36.5 26.5L14 26Z"
              fill="url(#stormCloud)"
            />
            {/* Tia sét */}
            <Path
              d="M26 22L20 32H25L21 44L31 31H26L29 22H26Z"
              fill="url(#boltGrad)"
            />
          </G>
        );

      case 'snow':
        return (
          <G>
            <Defs>
              <LinearGradient id="snowCloud" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#ECEFF1" />
                <Stop offset="1" stopColor="#B0BEC5" />
              </LinearGradient>
            </Defs>
            <Path
              d="M14 26C9.58 26 6 22.42 6 18C6 14.04 8.87 10.75 12.67 10.1C13.88 4.38 18.94 0 25 0C31.7 0 37.23 5.15 37.88 11.7C41.34 12.32 44 15.35 44 19C44 23.14 40.64 26.5 36.5 26.5L14 26Z"
              fill="url(#snowCloud)"
            />
            {/* Bông tuyết */}
            <Circle cx="15" cy="35" r="2.5" fill="#E0F7FA" />
            <Circle cx="24" cy="40" r="2.5" fill="#E0F7FA" />
            <Circle cx="33" cy="36" r="2.5" fill="#E0F7FA" />
          </G>
        );

      default:
        return (
          <Circle cx="24" cy="24" r="14" fill="#FFA000" />
        );
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {renderIcon()}
    </Svg>
  );
};
