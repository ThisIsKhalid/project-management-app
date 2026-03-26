import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ProjectStatus, STATUS_ORDER, STATUS_LABELS } from '../types';
import { colors } from '../theme/colors';

interface StatusStepperProps {
  currentStatus: ProjectStatus;
  onStatusChange: (status: ProjectStatus) => void;
}

export const StatusStepper: React.FC<StatusStepperProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <View style={{ flexDirection: 'column', gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {STATUS_ORDER.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          const isLast = index === STATUS_ORDER.length - 1;

          return (
            <React.Fragment key={status}>
              <Pressable
                onPress={() => onStatusChange(status)}
                style={{
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: isActive ? 32 : 24,
                    height: isActive ? 32 : 24,
                    borderRadius: 16,
                    backgroundColor: isCompleted
                      ? status === 'delivered'
                        ? colors.success
                        : colors.accent.primary
                      : colors.dark[600],
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: isActive ? 3 : 0,
                    borderColor: isActive
                      ? status === 'delivered'
                        ? '#00C9A730'
                        : '#6C5CE730'
                      : 'transparent',
                  }}
                >
                  {isCompleted && (
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    color: isActive ? colors.text.primary : colors.text.muted,
                    fontSize: 9,
                    fontWeight: isActive ? '700' : '400',
                    marginTop: 4,
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                >
                  {STATUS_LABELS[status]}
                </Text>
              </Pressable>
              {!isLast && (
                <View
                  style={{
                    height: 2,
                    flex: 0.5,
                    backgroundColor:
                      index < currentIndex ? colors.accent.primary : colors.dark[600],
                    marginBottom: 18,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};
