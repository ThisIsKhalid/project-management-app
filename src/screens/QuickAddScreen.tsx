import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useProjectStore } from '../store/useProjectStore';
import { useAuthStore } from '../store/useAuthStore';
import { QuickAddScreenProps } from '../navigation/types';
import { TextField } from '../components/DatePickerField';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { ProjectStatus, STATUS_LABELS, STATUS_ORDER } from '../types';

export const QuickAddScreen: React.FC<QuickAddScreenProps> = ({ navigation }) => {
  const addProject = useProjectStore((state) => state.addProject);
  const user = useAuthStore((s) => s.user);

  const [clientName, setClientName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('not_started');

  const handleSubmit = () => {
    if (!clientName.trim() || !projectTitle.trim()) {
      Alert.alert('Required Fields', 'Please enter client name and project title.');
      return;
    }
    if (!deadline.trim()) {
      Alert.alert('Required Fields', 'Please enter a deadline date (YYYY-MM-DD).');
      return;
    }

    const now = new Date().toISOString().split('T')[0];

    const newProject = {
      id: Date.now().toString(),
      clientName: clientName.trim(),
      projectTitle: projectTitle.trim(),
      startDate: now,
      deadline: deadline.trim(),
      deliveryDate: deliveryDate.trim() || deadline.trim(),
      status,
      nextAction: nextAction.trim(),
      createdByManagerId: user?.id || '',
      assignedDeveloperIds: [] as string[],
      notes: note.trim()
        ? [
            {
              id: Date.now().toString() + '-note',
              text: note.trim(),
              createdAt: new Date().toISOString(),
            },
          ]
        : [],
    };

    addProject(newProject);

    // Reset form
    setClientName('');
    setProjectTitle('');
    setDeadline('');
    setDeliveryDate('');
    setNextAction('');
    setNote('');
    setStatus('not_started');

    Alert.alert('✨ Project Created', `"${newProject.projectTitle}" has been added.`, [
      {
        text: 'View Projects',
        onPress: () => navigation.navigate('Projects', { screen: 'ProjectsList' }),
      },
      { text: 'Add Another', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark[900]} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerSubtitle}>NEW PROJECT</Text>
            <Text style={styles.headerTitle}>Quick Add</Text>
          </View>

          <View style={styles.form}>
            {/* Project Info Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="business" size={16} color={colors.accent.primary} />
                <Text style={styles.sectionTitle}>CLIENT & PROJECT</Text>
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
                placeholder="e.g. Website Redesign"
              />
            </View>

            {/* Dates Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="calendar-clear" size={16} color={colors.accent.primary} />
                <Text style={styles.sectionTitle}>TIMELINE</Text>
              </View>
              <View style={styles.dateRow}>
                <View style={{ flex: 1 }}>
                  <TextField
                    label="Deadline *"
                    value={deadline}
                    onChange={setDeadline}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextField
                    label="Delivery Date"
                    value={deliveryDate}
                    onChange={setDeliveryDate}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              </View>
            </View>

            {/* Status Section */}
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

            {/* Priority Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="flash" size={16} color={colors.accent.primary} />
                <Text style={styles.sectionTitle}>FIRST PRIORITY</Text>
              </View>
              <TextField
                label="What needs to happen first?"
                value={nextAction}
                onChange={setNextAction}
                placeholder="Log a next action..."
              />
              <TextField
                label="Initial Note"
                value={note}
                onChange={setNote}
                placeholder="Any context to add?"
                multiline
              />
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.submitBtnPressed,
              ]}
            >
              <View style={styles.btnContent}>
                <Ionicons name="add-circle" size={22} color="#fff" />
                <Text style={styles.submitBtnText}>Launch Project</Text>
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
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerSubtitle: {
    color: colors.accent.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  form: {
    paddingHorizontal: 24,
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
