import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ProjectStatus, STATUS_ORDER, STATUS_LABELS } from '../types';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

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
    <View style={styles.container}>
      <View style={styles.stepperRow}>
        {STATUS_ORDER.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          const isLast = index === STATUS_ORDER.length - 1;

          return (
            <React.Fragment key={status}>
              <Pressable
                onPress={() => onStatusChange(status)}
                style={styles.step}
              >
                <View
                  style={[
                    styles.circle,
                    isCompleted && styles.circleCompleted,
                    isActive && styles.circleActive,
                    status === 'delivered' && isCompleted && { backgroundColor: colors.success },
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={isActive ? 16 : 14} color="#fff" />
                  ) : (
                    <View style={styles.dot} />
                  )}
                </View>
                <Text
                  style={[
                    styles.label,
                    isActive && styles.labelActive,
                    isCompleted && !isActive && styles.labelCompleted,
                  ]}
                  numberOfLines={1}
                >
                  {STATUS_LABELS[status]}
                </Text>
              </Pressable>
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    index < currentIndex && styles.connectorCompleted,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  step: {
    alignItems: 'center',
    flex: 1,
    zIndex: 1,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.dark[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  circleCompleted: {
    backgroundColor: colors.accent.primary,
  },
  circleActive: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    transform: [{ scale: 1.15 }],
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.muted,
  },
  connector: {
    height: 2,
    flex: 0.8,
    backgroundColor: colors.dark[600],
    marginTop: -16, // Align with center of circles
  },
  connectorCompleted: {
    backgroundColor: colors.accent.primary,
  },
  label: {
    color: colors.text.muted,
    fontSize: 9,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  labelActive: {
    color: colors.text.primary,
    fontSize: 9,
    fontWeight: '800',
  },
  labelCompleted: {
    color: colors.text.secondary,
  },
});
