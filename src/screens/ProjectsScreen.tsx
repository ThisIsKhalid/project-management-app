import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProjectStore } from '../store/useProjectStore';
import { useAuthStore } from '../store/useAuthStore';
import { ProjectCard } from '../components/ProjectCard';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { ProjectStatus } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ProjectsList'>;

const FILTER_OPTIONS: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Review', value: 'review' },
  { label: 'Not Started', value: 'not_started' },
  { label: 'Delivered', value: 'delivered' },
];

export const ProjectsScreen: React.FC<Props> = ({ navigation }) => {
  const allProjects = useProjectStore((state) => state.projects);
  const user = useAuthStore((s) => s.user);
  const isManager = user?.role === 'manager';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | 'all'>('all');

  // Filter projects based on role
  const projects = useMemo(() => {
    if (isManager) return allProjects;
    // Developer: only assigned projects
    return allProjects.filter((p) =>
      p.assignedDeveloperIds.includes(user?.id || '')
    );
  }, [allProjects, isManager, user?.id]);

  const filteredProjects = useMemo(() => {
    let result = projects;

    if (activeFilter !== 'all') {
      result = result.filter((p) => p.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.clientName.toLowerCase().includes(query) ||
          p.projectTitle.toLowerCase().includes(query)
      );
    }

    // Sort by deadline (closest first), then delivered at end
    return [...result].sort((a, b) => {
      if (a.status === 'delivered' && b.status !== 'delivered') return 1;
      if (a.status !== 'delivered' && b.status === 'delivered') return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [projects, searchQuery, activeFilter]);

  const activeCount = projects.filter((p) => p.status !== 'delivered').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark[900] }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark[900]} />

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: colors.text.primary, fontSize: 28, fontWeight: '800' }}>
              {isManager ? 'Projects' : 'My Projects'}
            </Text>
            <Text style={{ color: colors.text.muted, fontSize: 14, marginTop: 2 }}>
              {activeCount} active project{activeCount !== 1 ? 's' : ''}
            </Text>
          </View>
          {isManager && (
            <Pressable
              onPress={() => navigation.navigate('AddEditProject', {})}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.accent.primary,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: colors.accent.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Ionicons name="add" size={26} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <View
          style={{
            backgroundColor: colors.dark[700],
            borderRadius: 14,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            borderWidth: 1,
            borderColor: colors.dark[500],
          }}
        >
          <Ionicons name="search" size={18} color={colors.text.muted} />
          <TextInput
            placeholder="Search projects..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              color: colors.text.primary,
              fontSize: 15,
              paddingVertical: 12,
              marginLeft: 10,
            }}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.text.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Filter Pills */}
      <View style={{ paddingLeft: 16, paddingVertical: 8 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_OPTIONS}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ gap: 8, paddingRight: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setActiveFilter(item.value)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor:
                  activeFilter === item.value
                    ? isManager ? colors.accent.primary : colors.success
                    : colors.dark[600],
              }}
            >
              <Text
                style={{
                  color:
                    activeFilter === item.value
                      ? '#fff'
                      : colors.text.secondary,
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Projects List */}
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() =>
              navigation.navigate('ProjectDetail', { projectId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Ionicons name="folder-open-outline" size={48} color={colors.text.muted} />
            <Text style={{ color: colors.text.muted, fontSize: 16, marginTop: 12 }}>
              {isManager ? 'No projects found' : 'No projects assigned to you yet'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};
