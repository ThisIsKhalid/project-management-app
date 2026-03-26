import React from 'react';
import { View, Text } from 'react-native';
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
    <View
      style={{
        backgroundColor: colors.dark[700],
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.accent.primary,
      }}
    >
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 14,
          lineHeight: 20,
        }}
      >
        {note.text}
      </Text>
      <Text
        style={{
          color: colors.text.muted,
          fontSize: 11,
          marginTop: 8,
        }}
      >
        {getRelativeTime(note.createdAt)}
      </Text>
    </View>
  );
};
