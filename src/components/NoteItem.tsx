import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Note } from '../types';
import { colors } from '../theme/colors';

interface NoteItemProps {
  note: Note;
}

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  return (
    <View style={styles.container}>
      <View style={styles.accentBar} />
      <View style={styles.content}>
        <Text style={styles.text}>{note.text}</Text>
        <Text style={styles.timestamp}>{getRelativeTime(note.createdAt)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark[800],
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  accentBar: {
    width: 4,
    backgroundColor: colors.accent.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  text: {
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  timestamp: {
    color: colors.text.muted,
    fontSize: 11,
    marginTop: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
