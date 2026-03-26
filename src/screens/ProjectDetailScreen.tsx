import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProjectStore } from '../store/useProjectStore';
import { useAuthStore } from '../store/useAuthStore';
import { ProjectDetailScreenProps } from '../navigation/types';
import { StatusBadge } from '../components/StatusBadge';
import { StatusStepper } from '../components/StatusStepper';
import { NoteItem } from '../components/NoteItem';
import { AssignDeveloperModal } from '../components/AssignDeveloperModal';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDaysUntilDeadline(deadline: string): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  return Math.ceil((deadlineDate.getTime() - now.getTime()) / 86400000);
}

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { projectId } = route.params;
  const project = useProjectStore((state) =>
    state.projects.find((p) => p.id === projectId)
  );
  const { updateStatus, updateNextAction, addNote, deleteProject } =
    useProjectStore();
  const user = useAuthStore((s) => s.user);
  const allUsers = useAuthStore((s) => s.users);
  const isManager = user?.role === 'manager';

  const [newNote, setNewNote] = useState('');
  const [isEditingNextAction, setIsEditingNextAction] = useState(false);
  const [nextActionText, setNextActionText] = useState(project?.nextAction || '');
  const [showAssignModal, setShowAssignModal] = useState(false);

  if (!project) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark[900], alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.text.muted, fontSize: 16 }}>Project not found</Text>
      </SafeAreaView>
    );
  }

  const daysLeft = getDaysUntilDeadline(project.deadline);

  // Get assigned developer names
  const assignedDevs = allUsers.filter((u) =>
    project.assignedDeveloperIds.includes(u.id)
  );

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote(projectId, {
      id: Date.now().toString(),
      text: newNote.trim(),
      createdAt: new Date().toISOString(),
    });
    setNewNote('');
  };

  const handleSaveNextAction = () => {
    updateNextAction(projectId, nextActionText.trim());
    setIsEditingNextAction(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.projectTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProject(projectId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark[900] }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <Pressable
                onPress={() => navigation.goBack()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Ionicons name="chevron-back" size={22} color={colors.accent.secondary} />
                <Text style={{ color: colors.accent.secondary, fontSize: 15 }}>Back</Text>
              </Pressable>
              {isManager && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate('AddEditProject', { projectId: project.id })
                    }
                  >
                    <Ionicons name="create-outline" size={22} color={colors.text.secondary} />
                  </Pressable>
                  <Pressable onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={22} color={colors.danger} />
                  </Pressable>
                </View>
              )}
            </View>

            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 13,
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginTop: 16,
              }}
            >
              {project.clientName}
            </Text>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 24,
                fontWeight: '800',
                marginTop: 4,
              }}
            >
              {project.projectTitle}
            </Text>
            <View style={{ marginTop: 10 }}>
              <StatusBadge status={project.status} />
            </View>
          </View>

          {/* Status Stepper */}
          <View
            style={{
              backgroundColor: colors.dark[800],
              marginHorizontal: 16,
              marginTop: 20,
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 13,
                fontWeight: '600',
                marginBottom: 16,
                letterSpacing: 0.3,
              }}
            >
              STATUS TRACKER
            </Text>
            <StatusStepper
              currentStatus={project.status}
              onStatusChange={(status) => updateStatus(projectId, status)}
            />
          </View>

          {/* Dates Section */}
          <View
            style={{
              backgroundColor: colors.dark[800],
              marginHorizontal: 16,
              marginTop: 12,
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 13,
                fontWeight: '600',
                marginBottom: 16,
                letterSpacing: 0.3,
              }}
            >
              TIMELINE
            </Text>
            {[
              { label: 'Start Date', value: project.startDate, icon: 'play-circle' as const },
              { label: 'Deadline', value: project.deadline, icon: 'flag' as const },
              { label: 'Delivery Date', value: project.deliveryDate, icon: 'checkmark-circle' as const },
            ].map(({ label, value, icon }) => (
              <View
                key={label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.dark[600],
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons name={icon} size={18} color={colors.accent.secondary} />
                  <Text style={{ color: colors.text.secondary, fontSize: 14 }}>{label}</Text>
                </View>
                <Text style={{ color: colors.text.primary, fontSize: 14, fontWeight: '600' }}>
                  {formatDate(value)}
                </Text>
              </View>
            ))}
            {project.status !== 'delivered' && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 12,
                  paddingVertical: 8,
                  backgroundColor:
                    daysLeft < 0
                      ? '#FF6B6B15'
                      : daysLeft <= 3
                      ? '#FF6B6B15'
                      : daysLeft <= 7
                      ? '#FFC04815'
                      : '#00C9A715',
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color:
                      daysLeft < 0
                        ? colors.danger
                        : daysLeft <= 3
                        ? colors.danger
                        : daysLeft <= 7
                        ? colors.warning
                        : colors.success,
                    fontSize: 13,
                    fontWeight: '700',
                  }}
                >
                  {daysLeft < 0
                    ? `⚠️ ${Math.abs(daysLeft)} days overdue`
                    : daysLeft === 0
                    ? '⚡ Due today'
                    : `⏰ ${daysLeft} days remaining`}
                </Text>
              </View>
            )}
          </View>

          {/* Assigned Developers Section */}
          <View
            style={{
              backgroundColor: colors.dark[800],
              marginHorizontal: 16,
              marginTop: 12,
              borderRadius: 16,
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 13,
                  fontWeight: '600',
                  letterSpacing: 0.3,
                }}
              >
                ASSIGNED DEVELOPERS ({assignedDevs.length})
              </Text>
              {isManager && (
                <Pressable onPress={() => setShowAssignModal(true)}>
                  <Ionicons name="person-add" size={18} color={colors.accent.secondary} />
                </Pressable>
              )}
            </View>
            {assignedDevs.length > 0 ? (
              assignedDevs.map((dev) => (
                <View
                  key={dev.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: colors.dark[700],
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 6,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.success,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
                      {dev.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text.primary, fontSize: 14, fontWeight: '500' }}>
                      {dev.name}
                    </Text>
                    <Text style={{ color: colors.text.muted, fontSize: 11 }}>
                      {dev.email}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                <Ionicons name="people-outline" size={24} color={colors.text.muted} />
                <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 6 }}>
                  No developers assigned
                </Text>
              </View>
            )}
          </View>

          {/* Next Action */}
          <View
            style={{
              backgroundColor: colors.dark[800],
              marginHorizontal: 16,
              marginTop: 12,
              borderRadius: 16,
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 13,
                  fontWeight: '600',
                  letterSpacing: 0.3,
                }}
              >
                WHAT TO DO NEXT
              </Text>
              {!isEditingNextAction && (
                <Pressable onPress={() => setIsEditingNextAction(true)}>
                  <Ionicons name="pencil" size={16} color={colors.accent.secondary} />
                </Pressable>
              )}
            </View>
            {isEditingNextAction ? (
              <View>
                <TextInput
                  value={nextActionText}
                  onChangeText={setNextActionText}
                  style={{
                    backgroundColor: colors.dark[700],
                    borderRadius: 10,
                    padding: 12,
                    color: colors.text.primary,
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: colors.accent.primary,
                  }}
                  placeholder="What needs to happen next?"
                  placeholderTextColor={colors.text.muted}
                  multiline
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  <Pressable
                    onPress={() => {
                      setNextActionText(project.nextAction);
                      setIsEditingNextAction(false);
                    }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: colors.dark[600],
                    }}
                  >
                    <Text style={{ color: colors.text.secondary, fontSize: 13 }}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSaveNextAction}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: colors.accent.primary,
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Save</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: colors.dark[700],
                  borderRadius: 10,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Ionicons
                  name="arrow-forward-circle"
                  size={20}
                  color={colors.accent.primary}
                />
                <Text
                  style={{
                    color: project.nextAction
                      ? colors.text.primary
                      : colors.text.muted,
                    fontSize: 14,
                    flex: 1,
                    lineHeight: 20,
                  }}
                >
                  {project.nextAction || 'No action set — tap the pencil to add one'}
                </Text>
              </View>
            )}
          </View>

          {/* Notes Section */}
          <View
            style={{
              backgroundColor: colors.dark[800],
              marginHorizontal: 16,
              marginTop: 12,
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 13,
                fontWeight: '600',
                marginBottom: 16,
                letterSpacing: 0.3,
              }}
            >
              NOTES ({project.notes.length})
            </Text>

            {/* Add Note Input */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}
            >
              <TextInput
                value={newNote}
                onChangeText={setNewNote}
                placeholder="Add a note..."
                placeholderTextColor={colors.text.muted}
                style={{
                  flex: 1,
                  backgroundColor: colors.dark[700],
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  color: colors.text.primary,
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: colors.dark[500],
                }}
                multiline
              />
              <Pressable
                onPress={handleAddNote}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: newNote.trim()
                    ? colors.accent.primary
                    : colors.dark[600],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                disabled={!newNote.trim()}
              >
                <Ionicons
                  name="send"
                  size={18}
                  color={newNote.trim() ? '#fff' : colors.text.muted}
                />
              </Pressable>
            </View>

            {/* Notes List */}
            {project.notes.length > 0 ? (
              [...project.notes]
                .reverse()
                .map((note) => <NoteItem key={note.id} note={note} />)
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Ionicons name="document-text-outline" size={32} color={colors.text.muted} />
                <Text style={{ color: colors.text.muted, fontSize: 13, marginTop: 8 }}>
                  No notes yet
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Assign Developer Modal (Manager only) */}
      {isManager && (
        <AssignDeveloperModal
          visible={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          projectId={projectId}
        />
      )}
    </SafeAreaView>
  );
};
