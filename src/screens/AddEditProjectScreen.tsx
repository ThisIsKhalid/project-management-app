import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 }}
            >
              <Ionicons name="chevron-back" size={22} color={colors.accent.secondary} />
              <Text style={{ color: colors.accent.secondary, fontSize: 15 }}>Back</Text>
            </Pressable>
            <Text style={{ color: colors.text.primary, fontSize: 24, fontWeight: '800' }}>
              {isEditing ? 'Edit Project' : 'New Project'}
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
              <TextField
                label="Start Date (YYYY-MM-DD)"
                value={startDate}
                onChange={setStartDate}
                placeholder="e.g. 2026-03-01"
              />
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
              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 13,
                  fontWeight: '600',
                  marginBottom: 12,
                }}
              >
                Status
              </Text>
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

            {/* Next Action */}
            <View
              style={{
                backgroundColor: colors.dark[800],
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
              }}
            >
              <TextField
                label="Next Action"
                value={nextAction}
                onChange={setNextAction}
                placeholder="What needs to happen next?"
              />
            </View>

            {/* Submit */}
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
              })}
            >
              <Ionicons
                name={isEditing ? 'checkmark-circle' : 'add-circle'}
                size={22}
                color="#fff"
              />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                {isEditing ? 'Save Changes' : 'Create Project'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
