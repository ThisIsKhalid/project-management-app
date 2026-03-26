import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StatusBar,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { useProjectStore } from '../store/useProjectStore';
import { useAuthStore } from '../store/useAuthStore';
import { ProjectCard } from '../components/ProjectCard';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export const MonthlyPlannerScreen: React.FC = () => {
  const projects = useProjectStore((state) => state.projects);
  const user = useAuthStore((s) => s.user);
  const isManager = user?.role === 'manager';

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showDayProjects, setShowDayProjects] = useState(false);

  // Filter projects based on role
  const visibleProjects = useMemo(() => {
    if (isManager) return projects;
    return projects.filter((p) => p.assignedDeveloperIds.includes(user?.id || ''));
  }, [projects, isManager, user]);

  const markedDates = useMemo(() => {
    const marks: any = {};
    visibleProjects.forEach((p) => {
      // Mark deadline
      if (!marks[p.deadline]) {
        marks[p.deadline] = { dots: [] };
      }
      marks[p.deadline].dots.push({
        key: `${p.id}-deadline`,
        color: colors.danger,
        selectedDotColor: colors.white,
      });

      // Mark delivery
      if (p.deliveryDate) {
        if (!marks[p.deliveryDate]) {
          marks[p.deliveryDate] = { dots: [] };
        }
        // Only add if not already added to avoid duplicates if deadline == delivery
        if (!marks[p.deliveryDate].dots.find((d: any) => d.key === `${p.id}-delivery`)) {
          marks[p.deliveryDate].dots.push({
            key: `${p.id}-delivery`,
            color: colors.success,
            selectedDotColor: colors.white,
          });
        }
      }
    });

    // Mark selected date
    if (marks[selectedDate]) {
      marks[selectedDate].selected = true;
      marks[selectedDate].selectedColor = colors.accent.primary;
    } else {
      marks[selectedDate] = {
        selected: true,
        selectedColor: colors.accent.primary,
      };
    }

    return marks;
  }, [visibleProjects, selectedDate]);

  const projectsOnSelectedDate = useMemo(() => {
    return visibleProjects.filter(
      (p) => p.deadline === selectedDate || p.deliveryDate === selectedDate
    );
  }, [visibleProjects, selectedDate]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>PLANNER</Text>
        <Text style={styles.headerTitle}>Monthly Schedule</Text>
      </View>

      <View style={styles.calendarWrapper}>
        <Calendar
          theme={{
            backgroundColor: colors.dark[900],
            calendarBackground: colors.dark[800],
            textSectionTitleColor: colors.text.secondary,
            selectedDayBackgroundColor: colors.accent.primary,
            selectedDayTextColor: '#ffffff',
            todayTextColor: colors.accent.secondary,
            dayTextColor: colors.text.primary,
            textDisabledColor: colors.dark[500],
            dotColor: colors.accent.primary,
            selectedDotColor: '#ffffff',
            arrowColor: colors.accent.secondary,
            disabledArrowColor: colors.dark[600],
            monthTextColor: colors.text.primary,
            indicatorColor: colors.accent.primary,
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontWeight: '500',
            textMonthFontWeight: '800',
            textDayHeaderFontWeight: '700',
            textDayFontSize: 14,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 12,
          }}
          style={styles.calendar}
          onDayPress={(day: DateData) => {
            setSelectedDate(day.dateString);
            if (visibleProjects.some(p => p.deadline === day.dateString || p.deliveryDate === day.dateString)) {
              setShowDayProjects(true);
            }
          }}
          markedDates={markedDates}
          markingType={'multi-dot'}
        />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
          <Text style={styles.legendText}>Deadline</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Delivery</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.accent.secondary }]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
      </View>

      {/* Daily Agenda Peek */}
      <View style={styles.agendaPeek}>
         <View style={styles.agendaHeader}>
            <Text style={styles.agendaTitle}>Agenda for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</Text>
         </View>
         
         {projectsOnSelectedDate.length > 0 ? (
           <FlatList
             data={projectsOnSelectedDate}
             keyExtractor={(p) => p.id}
             renderItem={({ item }) => (
               <View style={styles.agendaItem}>
                  <View style={[styles.agendaTypeLine, { 
                    backgroundColor: item.deadline === selectedDate ? colors.danger : colors.success 
                  }]} />
                  <View style={styles.agendaItemContent}>
                    <Text style={styles.agendaClient}>{item.clientName}</Text>
                    <Text style={styles.agendaProject}>{item.projectTitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
               </View>
             )}
             showsVerticalScrollIndicator={false}
           />
         ) : (
           <View style={styles.emptyAgenda}>
              <Ionicons name="calendar-outline" size={32} color={colors.dark[600]} />
              <Text style={styles.emptyAgendaText}>No milestones on this day</Text>
           </View>
         )}
      </View>

      {/* Day Details Modal */}
      <Modal
        visible={showDayProjects}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDayProjects(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDayProjects(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
              <Pressable onPress={() => setShowDayProjects(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color={colors.text.secondary} />
              </Pressable>
            </View>

            <FlatList
              data={projectsOnSelectedDate}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => (
                <ProjectCard
                  project={item}
                  onPress={() => {
                    setShowDayProjects(false);
                    // This might need global navigation if not in same stack
                  }}
                />
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark[900],
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
  calendarWrapper: {
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.dark[800],
    borderWidth: 1,
    borderColor: colors.dark[600],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  calendar: {
    borderRadius: 24,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  agendaPeek: {
    flex: 1,
    backgroundColor: colors.dark[800],
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  agendaHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[600],
  },
  agendaTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  agendaTypeLine: {
    width: 3,
    height: 30,
    borderRadius: 2,
    marginRight: 12,
  },
  agendaItemContent: {
    flex: 1,
  },
  agendaClient: {
    color: colors.text.muted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  agendaProject: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  emptyAgenda: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  emptyAgendaText: {
    color: colors.text.muted,
    fontSize: 13,
    marginTop: 8,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.dark[900],
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: '40%',
    maxHeight: '80%',
    paddingTop: 16,
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.dark[600],
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseBtn: {
    position: 'absolute',
    right: 24,
    top: 20,
  },
  modalList: {
    paddingVertical: 10,
  },
});
