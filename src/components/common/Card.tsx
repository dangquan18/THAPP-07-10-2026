import React from 'react';
import { StyleSheet, View, ViewStyle, Text } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  title,
  icon,
  rightAction,
}) => {
  return (
    <View style={[styles.card, style]}>
      {(title || icon || rightAction) && (
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            {title && <Text style={styles.titleText}>{title.toUpperCase()}</Text>}
          </View>
          {rightAction && <View>{rightAction}</View>}
        </View>
      )}
      {children}
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
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
  },
});
