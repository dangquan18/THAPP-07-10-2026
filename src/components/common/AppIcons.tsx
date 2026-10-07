import React from 'react';
import Svg, {
  Circle,
  Path,
  Rect,
  G,
  Line,
  Polygon,
} from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const DropletIcon: React.FC<IconProps> = ({ size = 20, color = '#29B6F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2.69L6.64 8.5C4.54 10.78 4 13.06 4 15.2C4 19.5 7.58 23 12 23C16.42 23 20 19.5 20 15.2C20 13.06 19.46 10.78 17.36 8.5L12 2.69Z"
      fill={color}
    />
  </Svg>
);

export const WindIcon: React.FC<IconProps> = ({ size = 20, color = '#81D4FA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.59 4.59A2 2 0 1 1 11 8H2M12.59 19.41A2 2 0 1 0 14 16H2M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CompassIcon: React.FC<{ size?: number; degrees?: number; color?: string }> = ({
  size = 40,
  degrees = 0,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Circle cx="20" cy="20" r="18" stroke={color} strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
    <Circle cx="20" cy="20" r="2" fill={color} />
    {/* Vạch chỉ hướng */}
    <Line x1="20" y1="4" x2="20" y2="7" stroke={color} strokeWidth="2" />
    <Line x1="20" y1="33" x2="20" y2="36" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
    <Line x1="4" y1="20" x2="7" y2="20" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
    <Line x1="33" y1="20" x2="36" y2="20" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
    {/* Kim la bàn xoay theo độ gió */}
    <G transform={`rotate(${degrees} 20 20)`}>
      <Polygon points="20,7 23,20 17,20" fill="#FF5252" />
      <Polygon points="20,33 23,20 17,20" fill="#B0BEC5" />
    </G>
  </Svg>
);

export const ThermometerIcon: React.FC<IconProps> = ({ size = 20, color = '#FF7043' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 14.76V3.5C14 2.4 13.1 1.5 12 1.5C10.9 1.5 10 2.4 10 3.5V14.76C8.78 15.68 8 17.25 8 19C8 21.21 9.79 23 12 23C14.21 23 16 21.21 16 19C16 17.25 15.22 15.68 14 14.76Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="19" r="2" fill={color} />
  </Svg>
);

export const UVIcon: React.FC<IconProps> = ({ size = 20, color = '#FFA726' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const PressureIcon: React.FC<IconProps> = ({ size = 20, color = '#AB47BC' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 7V12L15 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const EyeIcon: React.FC<IconProps> = ({ size = 20, color = '#26A69A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

export const SunriseIcon: React.FC<IconProps> = ({ size = 20, color = '#FFB74D' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 18A5 5 0 0 0 7 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="12" y1="2" x2="12" y2="9" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="4.22" y1="10.22" x2="5.64" y2="11.64" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="1" y1="18" x2="3" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="21" y1="18" x2="23" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="18.36" y1="11.64" x2="19.78" y2="10.22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="23" y1="22" x2="1" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Polyline points="8 6 12 2 16 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const Polyline = ({ points, stroke, strokeWidth, strokeLinecap, strokeLinejoin }: any) => (
  <Path
    d="M8 6L12 2L16 6"
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap={strokeLinecap}
    strokeLinejoin={strokeLinejoin}
  />
);

export const SunsetIcon: React.FC<IconProps> = ({ size = 20, color = '#FF7043' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 18A5 5 0 0 0 7 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="12" y1="9" x2="12" y2="2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="4.22" y1="10.22" x2="5.64" y2="11.64" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="1" y1="18" x2="3" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="21" y1="18" x2="23" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="18.36" y1="11.64" x2="19.78" y2="10.22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="23" y1="22" x2="1" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M8 5L12 9L16 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const LocationPinIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
      fill={color}
    />
    <Circle cx="12" cy="9" r="3" fill="#1E88E5" />
  </Svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
    <Line x1="16.5" y1="16.5" x2="22" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.5 2V8H15.5M2.5 22V16H8.5M20.49 15A9 9 0 0 1 5.64 19.36L2.5 16M3.51 9A9 9 0 0 1 18.36 4.64L21.5 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BackIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19L5 12L12 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const NavigationGpsIcon: React.FC<IconProps> = ({ size = 20, color = '#29B6F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="12 2 19 21 12 17 5 21" fill={color} />
  </Svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="2" />
    <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 7V12L15 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
