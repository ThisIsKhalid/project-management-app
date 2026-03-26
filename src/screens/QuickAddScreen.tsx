import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark[900] }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark[900]} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
            <Text style={{ color: colors.text.primary, fontSize: 28, fontWeight: '800' }}>
              Quick Add
            </Text>
            <Text style={{ color: colors.text.muted, fontSize: 14, marginTop: 2 }}>
              Create a new project in seconds
            </Text>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {/* Client & Project Info */}
            <View
              style={{
                backgroundColor: colors.dark[800],
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Ionicons name="business-outline" size={18} color={colors.accent.secondary} />
                <Text style={{ color: colors.text.secondary, fontSize: 14, fontWeight: '600' }}>
                  Project Info
                </Text>
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

            {/* Dates */}
            <View
              style={{
                backgroundColor: colors.dark[800],
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Ionicons name="calendar-outline" size={18} color={colors.accent.secondary} />
                <Text style={{ color: colors.text.secondary, fontSize: 14, fontWeight: '600' }}>
                  Dates
                </Text>
              </View>
              <TextField
                label="Deadline * (YYYY-MM-DD)"
                value={deadline}
                onChange={setDeadline}
                placeholder="e.g. 2026-04-15"
              />
              <TextField
                label="Delivery Date (YYYY-MM-DD)"
                value={deliveryDate}
                onChange={setDeliveryDate}
                placeholder="e.g. 2026-04-18"
              />
            </View>

            {/* Status */}
            <View
              style={{
                backgroundColor: colors.dark[800],
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Ionicons name="pulse-outline" size={18} color={colors.accent.secondary} />
                <Text style={{ color: colors.text.secondary, fontSize: 14, fontWeight: '600' }}>
                  Status
                </Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {STATUS_ORDER.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => setStatus(s)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 10,
                      backgroundColor:
                        status === s ? colors.accent.primary : colors.dark[600],
                      borderWidth: status === s ? 0 : 1,
                      borderColor: colors.dark[500],
                    }}
                  >
                    <Text
                      style={{
                        color: status === s ? '#fff' : colors.text.secondary,
                        fontSize: 13,
                        fontWeight: status === s ? '600' : '400',
                      }}
                    >
                      {STATUS_LABELS[s]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Quick Details */}
            <View
              style={{
                backgroundColor: colors.dark[800],
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Ionicons name="flash-outline" size={18} color={colors.accent.secondary} />
                <Text style={{ color: colors.text.secondary, fontSize: 14, fontWeight: '600' }}>
                  Quick Details
                </Text>
              </View>
              <TextField
                label="Next Action"
                value={nextAction}
                onChange={setNextAction}
                placeholder="What's the first thing to do?"
              />
              <TextField
                label="Initial Note"
                value={note}
                onChange={setNote}
                placeholder="Any initial notes about this project?"
                multiline
              />
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => ({
                backgroundColor: colors.accent.primary,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
                opacity: pressed ? 0.85 : 1,
                shadowColor: colors.accent.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 6,
                marginTop: 8,
              })}
            >
              <Ionicons name="add-circle" size={22} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                Create Project
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
