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
  StyleSheet,
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
      <SafeAreaView style={styles.centerContainer} edges={['top']}>
        <Text style={styles.errorText}>Project not found</Text>
      </SafeAreaView>
    );
  }

  const daysLeft = getDaysUntilDeadline(project.deadline);
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Custom Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
            </Pressable>
            
            <View style={styles.headerActions}>
              {isManager && (
                <>
                  <Pressable
                    onPress={() => navigation.navigate('AddEditProject', { projectId: project.id })}
                    style={styles.actionBtn}
                  >
                    <Ionicons name="pencil" size={20} color={colors.text.secondary} />
                  </Pressable>
                  <Pressable onPress={handleDelete} style={styles.actionBtn}>
                    <Ionicons name="trash" size={20} color={colors.danger} />
                  </Pressable>
                </>
              )}
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.clientLabel}>{project.clientName}</Text>
            <Text style={styles.mainTitle}>{project.projectTitle}</Text>
            <View style={styles.badgeRow}>
              <StatusBadge status={project.status} />
              {project.status !== 'delivered' && (
                <View style={[styles.deadlineTag, { 
                  backgroundColor: daysLeft <= 3 ? colors.danger + '15' : colors.accent.soft 
                }]}>
                   <Text style={[styles.deadlineTagText, { 
                     color: daysLeft <= 3 ? colors.danger : colors.accent.secondary 
                   }]}>
                     {daysLeft < 0 ? 'Overdue' : `${daysLeft} days remaining`}
                   </Text>
                </View>
              )}
            </View>
          </View>

          {/* Quick Actions / What to do next */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionIconBg}>
                  <Ionicons name="flash" size={14} color={colors.accent.primary} />
                </View>
                <Text style={styles.sectionTitle}>NEXT PRIORITY</Text>
              </View>
              {!isEditingNextAction && (
                <Pressable onPress={() => setIsEditingNextAction(true)}>
                  <Text style={styles.editLink}>Edit</Text>
                </Pressable>
              )}
            </View>
            
            {isEditingNextAction ? (
              <View style={styles.editWrapper}>
                <TextInput
                  value={nextActionText}
                  onChangeText={setNextActionText}
                  style={styles.editInput}
                  placeholder="What's the next big thing?"
                  placeholderTextColor={colors.text.muted}
                  multiline
                  autoFocus
                />
                <View style={styles.editButtons}>
                  <Pressable
                    onPress={() => {
                      setNextActionText(project.nextAction);
                      setIsEditingNextAction(false);
                    }}
                    style={styles.cancelBtn}
                  >
                    <Text style={styles.cancelBtnText}>Discard</Text>
                  </Pressable>
                  <Pressable onPress={handleSaveNextAction} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>Update Priority</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.priorityCard}>
                <Text style={[styles.priorityText, !project.nextAction && { color: colors.text.muted }]}>
                  {project.nextAction || 'Define the next project milestone...'}
                </Text>
              </View>
            )}
          </View>

          {/* Status Tracker */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionIconBg}>
                <Ionicons name="options" size={14} color={colors.accent.primary} />
              </View>
              <Text style={styles.sectionTitle}>PROJECT STATUS</Text>
            </View>
            <View style={styles.stepperContainer}>
              <StatusStepper
                currentStatus={project.status}
                onStatusChange={(status) => updateStatus(projectId, status)}
              />
            </View>
          </View>

          {/* Timeline Info */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionIconBg}>
                <Ionicons name="calendar" size={14} color={colors.accent.primary} />
              </View>
              <Text style={styles.sectionTitle}>TIMELINE</Text>
            </View>
            <View style={styles.timelineGrid}>
              {[
                { label: 'Started', date: project.startDate, icon: 'play' },
                { label: 'Deadline', date: project.deadline, icon: 'flag' },
                { label: 'Delivered', date: project.deliveryDate, icon: 'checkmark-circle' },
              ].map((item, idx) => (
                <View key={idx} style={styles.timelineItem}>
                   <View style={styles.timelineDot} />
                   <View>
                     <Text style={styles.timelineLabel}>{item.label}</Text>
                     <Text style={styles.timelineDate}>{formatDate(item.date)}</Text>
                   </View>
                </View>
              ))}
            </View>
          </View>

          {/* Team / Collaborators */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionIconBg}>
                  <Ionicons name="people" size={14} color={colors.accent.primary} />
                </View>
                <Text style={styles.sectionTitle}>PROJECT TEAM</Text>
              </View>
              {isManager && (
                <Pressable 
                  onPress={() => setShowAssignModal(true)}
                  style={styles.addTeamBtn}
                >
                  <Ionicons name="person-add" size={14} color={colors.accent.primary} />
                  <Text style={styles.addTeamText}>Add</Text>
                </Pressable>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.teamList}>
              {assignedDevs.length > 0 ? (
                assignedDevs.map((dev) => (
                  <View key={dev.id} style={styles.teamMember}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>{dev.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.memberName} numberOfLines={1}>{dev.name.split(' ')[0]}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyTeamText}>No developers assigned yet</Text>
              )}
            </ScrollView>
          </View>

          {/* Journal / Notes */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionIconBg}>
                <Ionicons name="book" size={14} color={colors.accent.primary} />
              </View>
              <Text style={styles.sectionTitle}>PROJECT JOURNAL</Text>
            </View>
            
            {/* Note Entry */}
            <View style={styles.noteEntryWrapper}>
              <TextInput
                value={newNote}
                onChangeText={setNewNote}
                placeholder="Log a progress update..."
                placeholderTextColor={colors.text.muted}
                style={styles.noteInput}
                multiline
              />
              <Pressable
                onPress={handleAddNote}
                disabled={!newNote.trim()}
                style={[styles.noteSendBtn, !newNote.trim() && { opacity: 0.5 }]}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </Pressable>
            </View>

            {/* Notes List */}
            <View style={styles.notesList}>
              {[...project.notes].reverse().map((note) => (
                <NoteItem key={note.id} note={note} />
              ))}
              {project.notes.length === 0 && (
                <View style={styles.emptyNotes}>
                   <Text style={styles.emptyNotesText}>No updates logged yet.</Text>
                </View>
              )}
            </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark[900],
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.dark[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.text.muted,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.dark[800],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.dark[800],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  titleSection: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  clientLabel: {
    color: colors.accent.secondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  mainTitle: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 16,
    lineHeight: 38,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deadlineTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deadlineTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionIconBg: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.accent.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  editLink: {
    color: colors.accent.secondary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  priorityCard: {
    backgroundColor: colors.dark[800],
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.dark[600],
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  priorityText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  editWrapper: {
    backgroundColor: colors.dark[800],
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  editInput: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.dark[600],
  },
  cancelBtnText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.accent.primary,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  stepperContainer: {
    backgroundColor: colors.dark[800],
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  timelineGrid: {
    backgroundColor: colors.dark[800],
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.dark[600],
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.primary,
  },
  timelineLabel: {
    color: colors.text.muted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timelineDate: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  addTeamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.accent.soft,
    marginBottom: 12,
  },
  addTeamText: {
    color: colors.accent.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  teamList: {
    gap: 16,
    paddingRight: 24,
  },
  teamMember: {
    alignItems: 'center',
    width: 60,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
    marginBottom: 8,
  },
  memberAvatarText: {
    color: colors.accent.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  memberName: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyTeamText: {
    color: colors.text.muted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  noteEntryWrapper: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  noteInput: {
    flex: 1,
    backgroundColor: colors.dark[800],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text.primary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.dark[600],
    minHeight: 50,
  },
  noteSendBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  notesList: {
    gap: 12,
  },
  emptyNotes: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyNotesText: {
    color: colors.text.muted,
    fontSize: 14,
  },
});
