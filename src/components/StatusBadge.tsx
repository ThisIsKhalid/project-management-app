import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProjectStatus, STATUS_LABELS } from '../types';
import { colors } from '../theme/colors';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string; dot: string }> = {
  not_started: { bg: colors.dark[600], text: colors.text.secondary, dot: colors.text.muted },
  in_progress: { bg: colors.info + '20', text: colors.info, dot: colors.info },
  review: { bg: colors.warning + '20', text: colors.warning, dot: colors.warning },
  delivered: { bg: colors.success + '20', text: colors.success, dot: colors.success },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const color = STATUS_COLORS[status];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color.bg,
          paddingHorizontal: isSmall ? 8 : 12,
          paddingVertical: isSmall ? 4 : 6,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color.dot }]} />
      <Text
        style={[
          styles.text,
          {
            color: color.text,
            fontSize: isSmall ? 10 : 12,
          },
        ]}
      >
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
