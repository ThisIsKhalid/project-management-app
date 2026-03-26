import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProjectStore } from '../store/useProjectStore';
import { useAuthStore } from '../store/useAuthStore';
import { AddEditProjectScreenProps } from '../navigation/types';
import { TextField } from '../components/DatePickerField';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { ProjectStatus, STATUS_LABELS, STATUS_ORDER } from '../types';

export const AddEditProjectScreen: React.FC<AddEditProjectScreenProps> = ({
  route,
  navigation,
}) => {
  const projectId = route.params?.projectId;
  const existingProject = useProjectStore((state) =>
    projectId ? state.projects.find((p) => p.id === projectId) : undefined
  );
  const { addProject, updateProject } = useProjectStore();
  const user = useAuthStore((s) => s.user);
  const isEditing = !!existingProject;

  const [clientName, setClientName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('not_started');

  useEffect(() => {
    if (existingProject) {
      setClientName(existingProject.clientName);
      setProjectTitle(existingProject.projectTitle);
      setStartDate(existingProject.startDate);
      setDeadline(existingProject.deadline);
      setDeliveryDate(existingProject.deliveryDate);
      setNextAction(existingProject.nextAction);
      setStatus(existingProject.status);
    }
  }, [existingProject]);

  const handleSubmit = () => {
    if (!clientName.trim() || !projectTitle.trim()) {
      Alert.alert('Required Fields', 'Please enter client name and project title.');
      return;
    }
    if (!deadline.trim()) {
      Alert.alert('Required Fields', 'Please enter a deadline date.');
      return;
    }

    if (isEditing && projectId) {
      updateProject(projectId, {
        clientName: clientName.trim(),
        projectTitle: projectTitle.trim(),
        startDate: startDate.trim() || new Date().toISOString().split('T')[0],
        deadline: deadline.trim(),
        deliveryDate: deliveryDate.trim() || deadline.trim(),
        status,
        nextAction: nextAction.trim(),
      });
      navigation.goBack();
    } else {
      const newProject = {
        id: Date.now().toString(),
        clientName: clientName.trim(),
        projectTitle: projectTitle.trim(),
        startDate: startDate.trim() || new Date().toISOString().split('T')[0],
        deadline: deadline.trim(),
        deliveryDate: deliveryDate.trim() || deadline.trim(),
        status,
        nextAction: nextAction.trim(),
        createdByManagerId: user?.id || '',
        assignedDeveloperIds: [] as string[],
        notes: [],
      };
      addProject(newProject);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
            </Pressable>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Edit Project' : 'New Project'}
            </Text>
            <View style={{ width: 44 }} />
          </View>

          <View style={styles.form}>
            {/* Core Info */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="create" size={16} color={colors.accent.primary} />
                <Text style={styles.sectionTitle}>CORE DETAILS</Text>
              </View>
              <TextField
                label="Client Name *"
                value={clientName}
                onChange={setClientName}
                placeholder="e.g. Acme Corp"
              />
              <TextField
                label="Project Title *"
                value={projectTitle}
                onChange={setProjectTitle}
                placeholder="e.g. Mobile App"
              />
            </View>

            {/* Timeline */}
            <View style={styles.section}>
               <View style={styles.sectionTitleRow}>
                <Ionicons name="calendar-clear" size={16} color={colors.accent.primary} />
                <Text style={styles.sectionTitle}>TIMELINE (YYYY-MM-DD)</Text>
              </View>
              <TextField
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                placeholder="e.g. 2026-03-01"
              />
              <View style={styles.dateRow}>
                <View style={{ flex: 1 }}>
                  <TextField
                    label="Deadline *"
                    value={deadline}
                    onChange={setDeadline}
                    placeholder="2026-04-15"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextField
                    label="Delivery Date"
                    value={deliveryDate}
                    onChange={setDeliveryDate}
                    placeholder="2026-04-18"
                  />
                </View>
              </View>
            </View>

            {/* Status */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="pulse" size={16} color={colors.accent.primary} />
                <Text style={styles.sectionTitle}>STATUS</Text>
              </View>
              <View style={styles.statusGrid}>
                {STATUS_ORDER.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => setStatus(s)}
                    style={[
                      styles.statusBadge,
                      status === s && styles.statusBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        status === s && styles.statusTextActive,
                      ]}
                    >
                      {STATUS_LABELS[s]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Priority */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="flash" size={16} color={colors.accent.primary} />
                <Text style={styles.sectionTitle}>NEXT ACTION</Text>
              </View>
              <TextField
                label="What's the immediate priority?"
                value={nextAction}
                onChange={setNextAction}
                placeholder="e.g. Complete wireframes"
              />
            </View>

            {/* Submit */}
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.submitBtnPressed,
              ]}
            >
              <View style={styles.btnContent}>
                <Ionicons
                  name={isEditing ? 'checkmark-circle' : 'add-circle'}
                  size={22}
                  color="#fff"
                />
                <Text style={styles.submitBtnText}>
                  {isEditing ? 'Save Changes' : 'Initialize Project'}
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark[900],
  },
  scrollContent: {
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.dark[800],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  form: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  section: {
    backgroundColor: colors.dark[800],
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.dark[700],
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  statusBadgeActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  statusText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#fff',
  },
  submitBtn: {
    backgroundColor: colors.accent.primary,
    borderRadius: 20,
    paddingVertical: 18,
    marginTop: 8,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginLeft: 8,
  },
});
