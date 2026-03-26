import React, { useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
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
      <Pressable
        style={{ flex: 1, backgroundColor: '#00000080', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: colors.dark[800],
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 16,
            paddingBottom: 40,
            maxHeight: '70%',
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: colors.dark[500],
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 16,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 18,
                fontWeight: '700',
              }}
            >
              Assign Developers
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text.muted} />
            </Pressable>
          </View>

          <Text
            style={{
              color: colors.text.muted,
              fontSize: 13,
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            Tap to assign or remove developers from this project
          </Text>

          <FlatList
            data={developers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
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
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: isAssigned
                      ? '#6C5CE715'
                      : colors.dark[700],
                    borderRadius: 12,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: isAssigned
                      ? colors.accent.primary + '40'
                      : colors.dark[500],
                    gap: 12,
                  }}
                >
                  {/* Avatar */}
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: isAssigned
                        ? colors.accent.primary
                        : colors.dark[500],
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: '700',
                      }}
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text.primary,
                        fontSize: 15,
                        fontWeight: '600',
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: colors.text.muted,
                        fontSize: 12,
                        marginTop: 2,
                      }}
                    >
                      {item.email}
                    </Text>
                  </View>

                  {/* Toggle Icon */}
                  <Ionicons
                    name={isAssigned ? 'checkmark-circle' : 'add-circle-outline'}
                    size={24}
                    color={isAssigned ? colors.accent.primary : colors.text.muted}
                  />
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Ionicons name="people-outline" size={32} color={colors.text.muted} />
                <Text style={{ color: colors.text.muted, fontSize: 14, marginTop: 8 }}>
                  No developers available
                </Text>
              </View>
            }
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};
