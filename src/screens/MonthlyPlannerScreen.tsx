import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useProjectStore } from '../store/useProjectStore';
import { MonthlyPlanScreenProps } from '../navigation/types';
import { StatusBadge } from '../components/StatusBadge';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../types';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export const MonthlyPlannerScreen: React.FC<MonthlyPlanScreenProps> = () => {
  const projects = useProjectStore((state) => state.projects);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    projects.forEach((project) => {
      // Mark deadline
      if (project.deadline) {
        if (!marks[project.deadline]) {
          marks[project.deadline] = { dots: [], selected: false };
        }
        const hasDot = marks[project.deadline].dots.some(
          (d: any) => d.key === 'deadline'
        );
        if (!hasDot) {
          marks[project.deadline].dots.push({
            key: `deadline-${project.id}`,
            color: project.status === 'delivered' ? colors.success : colors.danger,
          });
        }
      }

      // Mark delivery date
      if (project.deliveryDate) {
        if (!marks[project.deliveryDate]) {
          marks[project.deliveryDate] = { dots: [], selected: false };
        }
        marks[project.deliveryDate].dots.push({
          key: `delivery-${project.id}`,
          color: colors.info,
        });
      }
    });

    // Mark selected date
    if (selectedDate && marks[selectedDate]) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: colors.accent.primary + '40',
      };
    } else if (selectedDate) {
      marks[selectedDate] = {
        dots: [],
        selected: true,
        selectedColor: colors.accent.primary + '40',
      };
    }

    return marks;
  }, [projects, selectedDate]);

  const selectedDateProjects = useMemo(() => {
    if (!selectedDate) return [];
    return projects.filter(
      (p) => p.deadline === selectedDate || p.deliveryDate === selectedDate
    );
  }, [projects, selectedDate]);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    const projectsOnDate = projects.filter(
      (p) => p.deadline === day.dateString || p.deliveryDate === day.dateString
    );
    if (projectsOnDate.length > 0) {
      setModalVisible(true);
    }
  };

  // Stats
  const activeProjects = projects.filter((p) => p.status !== 'delivered');
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const dueThisMonth = activeProjects.filter((p) => p.deadline.startsWith(thisMonth));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark[900] }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark[900]} />

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ color: colors.text.primary, fontSize: 28, fontWeight: '800' }}>
          Monthly Plan
        </Text>
        <Text style={{ color: colors.text.muted, fontSize: 14, marginTop: 2 }}>
          {dueThisMonth.length} deadline{dueThisMonth.length !== 1 ? 's' : ''} this month
        </Text>
      </View>

      {/* Summary Cards */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          gap: 10,
          marginVertical: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.dark[700],
            borderRadius: 14,
            padding: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.danger, fontSize: 24, fontWeight: '800' }}>
            {dueThisMonth.length}
          </Text>
          <Text style={{ color: colors.text.muted, fontSize: 11, marginTop: 4 }}>
            Due This Month
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.dark[700],
            borderRadius: 14,
            padding: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.info, fontSize: 24, fontWeight: '800' }}>
            {activeProjects.length}
          </Text>
          <Text style={{ color: colors.text.muted, fontSize: 11, marginTop: 4 }}>
            Active Projects
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.dark[700],
            borderRadius: 14,
            padding: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.success, fontSize: 24, fontWeight: '800' }}>
            {projects.filter((p) => p.status === 'delivered').length}
          </Text>
          <Text style={{ color: colors.text.muted, fontSize: 11, marginTop: 4 }}>
            Delivered
          </Text>
        </View>
      </View>

      {/* Calendar */}
      <View style={{ marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' }}>
        <Calendar
          markingType="multi-dot"
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={{
            backgroundColor: colors.dark[800],
            calendarBackground: colors.dark[800],
            textSectionTitleColor: colors.text.muted,
            selectedDayBackgroundColor: colors.accent.primary,
            selectedDayTextColor: '#ffffff',
            todayTextColor: colors.accent.primary,
            dayTextColor: colors.text.primary,
            textDisabledColor: colors.dark[500],
            monthTextColor: colors.text.primary,
            arrowColor: colors.accent.secondary,
            textDayFontWeight: '500',
            textMonthFontWeight: '700',
            textDayFontSize: 14,
            textMonthFontSize: 16,
          }}
        />
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 24,
          marginTop: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger }} />
          <Text style={{ color: colors.text.muted, fontSize: 12 }}>Deadline</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.info }} />
          <Text style={{ color: colors.text.muted, fontSize: 12 }}>Delivery</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success }} />
          <Text style={{ color: colors.text.muted, fontSize: 12 }}>Delivered</Text>
        </View>
      </View>

      {/* Date Projects Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: '#00000080', justifyContent: 'flex-end' }}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={{
              backgroundColor: colors.dark[800],
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 16,
              paddingBottom: 40,
              maxHeight: '60%',
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
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 18,
                fontWeight: '700',
                paddingHorizontal: 20,
                marginBottom: 16,
              }}
            >
              {selectedDate ? formatDate(selectedDate) : ''}
            </Text>
            <FlatList
              data={selectedDateProjects}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              renderItem={({ item }) => {
                const isDeadline = item.deadline === selectedDate;
                const isDelivery = item.deliveryDate === selectedDate;
                return (
                  <View
                    style={{
                      backgroundColor: colors.dark[700],
                      borderRadius: 12,
                      padding: 14,
                      borderLeftWidth: 3,
                      borderLeftColor: isDeadline ? colors.danger : colors.info,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: colors.text.secondary,
                            fontSize: 11,
                            textTransform: 'uppercase',
                          }}
                        >
                          {item.clientName}
                        </Text>
                        <Text
                          style={{
                            color: colors.text.primary,
                            fontSize: 15,
                            fontWeight: '600',
                            marginTop: 2,
                          }}
                        >
                          {item.projectTitle}
                        </Text>
                      </View>
                      <StatusBadge status={item.status} size="sm" />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                      {isDeadline && (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                            backgroundColor: '#FF6B6B20',
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 6,
                          }}
                        >
                          <Ionicons name="flag" size={12} color={colors.danger} />
                          <Text style={{ color: colors.danger, fontSize: 11, fontWeight: '600' }}>
                            Deadline
                          </Text>
                        </View>
                      )}
                      {isDelivery && (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                            backgroundColor: '#4DA6FF20',
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 6,
                          }}
                        >
                          <Ionicons name="checkmark-circle" size={12} color={colors.info} />
                          <Text style={{ color: colors.info, fontSize: 11, fontWeight: '600' }}>
                            Delivery
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={
                <Text style={{ color: colors.text.muted, textAlign: 'center', paddingVertical: 20 }}>
                  No projects on this date
                </Text>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};
