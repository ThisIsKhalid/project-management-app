import React, { useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useProjectStore } from '../store/useProjectStore';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface AssignDeveloperModalProps {
  visible: boolean;
  onClose: () => void;
  projectId: string;
}

export const AssignDeveloperModal: React.FC<AssignDeveloperModalProps> = ({
  visible,
  onClose,
  projectId,
}) => {
  const users = useAuthStore((s) => s.users);
  const developers = useMemo(() => users.filter((u) => u.role === 'developer'), [users]);
  const project = useProjectStore((s) =>
    s.projects.find((p) => p.id === projectId)
  );
  const { assignDeveloper, removeDeveloper } = useProjectStore();

  if (!project) return null;

  const assignedIds = project.assignedDeveloperIds;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          {/* Handle */}
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.subtitle}>PROJECT ACCESS</Text>
              <Text style={styles.title}>Assign Developers</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.text.secondary} />
            </Pressable>
          </View>

          <Text style={styles.instruction}>
            Manage team access for <Text style={styles.projectHighlight}>{project.projectTitle}</Text>
          </Text>

          <FlatList
            data={developers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isAssigned = assignedIds.includes(item.id);
              return (
                <Pressable
                  onPress={() => {
                    if (isAssigned) {
                      removeDeveloper(projectId, item.id);
                    } else {
                      assignDeveloper(projectId, item.id);
                    }
                  }}
                  style={[
                    styles.userCard,
                    isAssigned && styles.userCardActive,
                  ]}
                >
                  <View style={[styles.avatar, isAssigned && styles.avatarActive]}>
                    <Text style={styles.avatarText}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                    {isAssigned && (
                      <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={10} color="#fff" />
                      </View>
                    )}
                  </View>

                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                  </View>

                  <View style={[styles.toggleBtn, isAssigned && styles.toggleBtnActive]}>
                    <Text style={[styles.toggleText, isAssigned && styles.toggleTextActive]}>
                      {isAssigned ? 'Assigned' : 'Add'}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color={colors.dark[600]} />
                <Text style={styles.emptyText}>No developers available</Text>
              </View>
            }
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.dark[900],
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
    paddingBottom: 40,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.dark[600],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  subtitle: {
    color: colors.accent.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.dark[800],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  instruction: {
    color: colors.text.muted,
    fontSize: 14,
    paddingHorizontal: 24,
    marginBottom: 24,
    lineHeight: 20,
  },
  projectHighlight: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[800],
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.dark[600],
    gap: 16,
  },
  userCardActive: {
    borderColor: colors.accent.primary + '40',
    backgroundColor: colors.accent.soft,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  avatarActive: {
    backgroundColor: colors.accent.primary,
    borderColor: 'transparent',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 8,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.dark[900],
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    color: colors.text.muted,
    fontSize: 12,
    marginTop: 2,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.dark[700],
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  toggleBtnActive: {
    backgroundColor: colors.accent.primary,
    borderColor: 'transparent',
  },
  toggleText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '800',
  },
  toggleTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    opacity: 0.5,
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: 14,
    marginTop: 12,
    fontWeight: '600',
  },
});
