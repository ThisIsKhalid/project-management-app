import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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

function getUrgencyColors(days: number, status: string): { main: string; soft: string } {
  if (status === 'delivered') return { main: colors.success, soft: colors.success + '20' };
  if (days < 0) return { main: colors.danger, soft: colors.danger + '20' };
  if (days <= 3) return { main: colors.danger, soft: colors.danger + '20' };
  if (days <= 7) return { main: colors.warning, soft: colors.warning + '20' };
  return { main: colors.success, soft: colors.success + '20' };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress }) => {
  const daysLeft = getDaysUntilDeadline(project.deadline);
  const { main: urgencyColor, soft: urgencyBg } = getUrgencyColors(daysLeft, project.status);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      {/* Visual Accent */}
      <View style={[styles.accent, { backgroundColor: urgencyColor }]} />

      <View style={styles.cardContent}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.clientName}>{project.clientName}</Text>
            <Text style={styles.projectTitle} numberOfLines={1}>
              {project.projectTitle}
            </Text>
          </View>
          <StatusBadge status={project.status} size="sm" />
        </View>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={12} color={colors.text.muted} />
            <Text style={styles.metaText}>Due {formatDate(project.deadline)}</Text>
          </View>

          {project.status !== 'delivered' && (
            <View style={[styles.urgencyBadge, { backgroundColor: urgencyBg }]}>
              <Ionicons
                name={daysLeft < 0 ? 'alert-circle' : 'time-outline'}
                size={12}
                color={urgencyColor}
              />
              <Text style={[styles.urgencyText, { color: urgencyColor }]}>
                {daysLeft < 0
                  ? `${Math.abs(daysLeft)}d overdue`
                  : daysLeft === 0
                  ? 'Due today'
                  : `${daysLeft}d left`}
              </Text>
            </View>
          )}
        </View>

        {/* Next Action Block */}
        {project.nextAction ? (
          <View style={styles.nextActionBlock}>
            <View style={styles.nextActionIconOuter}>
               <Ionicons name="flash" size={10} color={colors.accent.primary} />
            </View>
            <Text style={styles.nextActionText} numberOfLines={1}>
              {project.nextAction}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark[800],
    borderRadius: 20,
    marginHorizontal: colors.spacing.screen,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark[600],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardContent: {
    padding: 16,
    paddingLeft: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  clientName: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  projectTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.text.muted,
    fontSize: 13,
    fontWeight: '500',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  nextActionBlock: {
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  nextActionIconOuter: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: colors.accent.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextActionText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});
