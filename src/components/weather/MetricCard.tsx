import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  subValue?: string;
  description?: string;
  visualElement?: React.ReactNode;
  style?: ViewStyle;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  icon,
  value,
  subValue,
  description,
  visualElement,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      {/* Tiêu đề & Icon */}
      <View style={styles.header}>
        <View style={styles.iconWrapper}>{icon}</View>
        <Text style={styles.titleText}>{title.toUpperCase()}</Text>
      </View>

      {/* Giá trị chính */}
      <View style={styles.valueRow}>
        <Text style={styles.primaryValue}>{value}</Text>
        {subValue && <Text style={styles.subValue}>{subValue}</Text>}
      </View>

      {/* Phần tử trực quan (La bàn, Gauge bar...) */}
      {visualElement && <View style={styles.visualContainer}>{visualElement}</View>}

      {/* Mô tả / Đánh giá */}
      {description && <Text style={styles.descriptionText}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    padding: 16,
    flex: 1,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWrapper: {
    marginRight: 6,
  },
  titleText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  primaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subValue: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
    fontWeight: '500',
  },
  visualContainer: {
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 16,
  },
});
