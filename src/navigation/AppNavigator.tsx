import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabParamList, ProjectsStackParamList } from './types';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { ProjectDetailScreen } from '../screens/ProjectDetailScreen';
import { AddEditProjectScreen } from '../screens/AddEditProjectScreen';
import { MonthlyPlannerScreen } from '../screens/MonthlyPlannerScreen';
import { QuickAddScreen } from '../screens/QuickAddScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<ProjectsStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function ProjectsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.dark[900] },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ProjectsList" component={ProjectsScreen} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
      <Stack.Screen name="AddEditProject" component={AddEditProjectScreen} />
    </Stack.Navigator>
  );
}

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.dark[800],
            borderTopColor: colors.dark[600],
            borderTopWidth: 1,
            paddingTop: 8,
            paddingBottom: 24,
            height: 80,
          },
          tabBarActiveTintColor: colors.accent.primary,
          tabBarInactiveTintColor: colors.text.muted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'list';

            if (route.name === 'Projects') {
              iconName = focused ? 'folder' : 'folder-outline';
            } else if (route.name === 'MonthlyPlan') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'QuickAdd') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }

            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Projects"
          component={ProjectsStack}
          options={{ tabBarLabel: 'Projects' }}
        />
        <Tab.Screen
          name="MonthlyPlan"
          component={MonthlyPlannerScreen}
          options={{ tabBarLabel: 'Monthly Plan' }}
        />
        <Tab.Screen
          name="QuickAdd"
          component={QuickAddScreen}
          options={{ tabBarLabel: 'Quick Add' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
