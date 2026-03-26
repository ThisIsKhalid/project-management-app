import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Project } from '../types';
import { StatusBadge } from './StatusBadge';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
}

function getDaysUntilDeadline(deadline: string): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffMs / 86400000);
}

function getUrgencyColor(days: number, status: string): string {
  if (status === 'delivered') return colors.success;
  if (days < 0) return colors.danger;
  if (days <= 3) return colors.danger;
  if (days <= 7) return colors.warning;
  return colors.success;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress }) => {
  const daysLeft = getDaysUntilDeadline(project.deadline);
  const urgencyColor = getUrgencyColor(daysLeft, project.status);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: colors.dark[700],
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: urgencyColor,
        opacity: pressed ? 0.85 : 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      })}
    >
      {/* Header Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 12,
              fontWeight: '500',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {project.clientName}
          </Text>
          <Text
            style={{
              color: colors.text.primary,
              fontSize: 16,
              fontWeight: '700',
            }}
            numberOfLines={2}
          >
            {project.projectTitle}
          </Text>
        </View>
        <StatusBadge status={project.status} size="sm" />
      </View>

      {/* Deadline Info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="calendar-outline" size={14} color={colors.text.muted} />
          <Text style={{ color: colors.text.muted, fontSize: 12 }}>
            Due {formatDate(project.deadline)}
          </Text>
        </View>
        {project.status !== 'delivered' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons
              name={daysLeft < 0 ? 'alert-circle' : 'time-outline'}
              size={14}
              color={urgencyColor}
            />
            <Text style={{ color: urgencyColor, fontSize: 12, fontWeight: '600' }}>
              {daysLeft < 0
                ? `${Math.abs(daysLeft)}d overdue`
                : daysLeft === 0
                ? 'Due today'
                : `${daysLeft}d left`}
            </Text>
          </View>
        )}
      </View>

      {/* Next Action Preview */}
      {project.nextAction ? (
        <View
          style={{
            backgroundColor: colors.dark[600],
            borderRadius: 8,
            padding: 10,
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Ionicons name="arrow-forward-circle" size={16} color={colors.accent.secondary} />
          <Text
            style={{ color: colors.text.secondary, fontSize: 12, flex: 1 }}
            numberOfLines={1}
          >
            {project.nextAction}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};
