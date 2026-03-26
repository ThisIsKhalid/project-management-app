import React from 'react';
import { View, Text } from 'react-native';
import { ProjectStatus, STATUS_LABELS } from '../types';
import { colors } from '../theme/colors';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string }> = {
  not_started: { bg: '#32324A', text: '#A0A0B8' },
  in_progress: { bg: '#1A3A5C', text: '#4DA6FF' },
  review: { bg: '#3D2E00', text: '#FFC048' },
  delivered: { bg: '#003D32', text: '#00C9A7' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const color = STATUS_COLORS[status];
  const isSmall = size === 'sm';

  return (
    <View
      style={{
        backgroundColor: color.bg,
        paddingHorizontal: isSmall ? 8 : 12,
        paddingVertical: isSmall ? 2 : 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          color: color.text,
          fontSize: isSmall ? 10 : 12,
          fontWeight: '600',
          letterSpacing: 0.5,
        }}
      >
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
};
