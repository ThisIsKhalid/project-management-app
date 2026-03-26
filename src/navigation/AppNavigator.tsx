import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import {
  AuthStackParamList,
  ProjectsStackParamList,
  ManagerTabParamList,
  DeveloperTabParamList,
} from './types';
import { useAuthStore } from '../store/useAuthStore';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { ProjectDetailScreen } from '../screens/ProjectDetailScreen';
import { AddEditProjectScreen } from '../screens/AddEditProjectScreen';
import { MonthlyPlannerScreen } from '../screens/MonthlyPlannerScreen';
import { QuickAddScreen } from '../screens/QuickAddScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';

// ── Stacks ──
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const ProjectsStack = createNativeStackNavigator<ProjectsStackParamList>();

// ── Tabs ──
const ManagerTab = createBottomTabNavigator<ManagerTabParamList>();
const DeveloperTab = createBottomTabNavigator<DeveloperTabParamList>();

const stackScreenOptions = {
  headerShown: false as const,
  contentStyle: { backgroundColor: colors.dark[900] },
  animation: 'slide_from_right' as const,
};

function ProjectsStackNavigator() {
  return (
    <ProjectsStack.Navigator screenOptions={stackScreenOptions}>
      <ProjectsStack.Screen name="ProjectsList" component={ProjectsScreen} />
      <ProjectsStack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
      <ProjectsStack.Screen name="AddEditProject" component={AddEditProjectScreen} />
    </ProjectsStack.Navigator>
  );
}

function DevProjectsStackNavigator() {
  return (
    <ProjectsStack.Navigator screenOptions={stackScreenOptions}>
      <ProjectsStack.Screen name="ProjectsList" component={ProjectsScreen} />
      <ProjectsStack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
    </ProjectsStack.Navigator>
  );
}

const tabBarStyle = {
  backgroundColor: colors.dark[800],
  borderTopColor: colors.dark[600],
  borderTopWidth: 1,
  paddingTop: 8,
  paddingBottom: 24,
  height: 80,
};

const tabBarLabelStyle = {
  fontSize: 11,
  fontWeight: '600' as const,
  marginTop: 4,
};

function ManagerTabs() {
  return (
    <ManagerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'list';
          if (route.name === 'Projects') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'MonthlyPlan') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'QuickAdd') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <ManagerTab.Screen
        name="Projects"
        component={ProjectsStackNavigator}
        options={{ tabBarLabel: 'Projects' }}
      />
      <ManagerTab.Screen
        name="MonthlyPlan"
        component={MonthlyPlannerScreen}
        options={{ tabBarLabel: 'Monthly Plan' }}
      />
      <ManagerTab.Screen
        name="QuickAdd"
        component={QuickAddScreen}
        options={{ tabBarLabel: 'Quick Add' }}
      />
      <ManagerTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </ManagerTab.Navigator>
  );
}

function DeveloperTabs() {
  return (
    <DeveloperTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: colors.success,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'list';
          if (route.name === 'MyProjects') {
            iconName = focused ? 'code-slash' : 'code-slash-outline';
          } else if (route.name === 'MonthlyPlan') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <DeveloperTab.Screen
        name="MyProjects"
        component={DevProjectsStackNavigator}
        options={{ tabBarLabel: 'My Projects' }}
      />
      <DeveloperTab.Screen
        name="MonthlyPlan"
        component={MonthlyPlannerScreen}
        options={{ tabBarLabel: 'Monthly Plan' }}
      />
      <DeveloperTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </DeveloperTab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.dark[900] },
        animation: 'fade',
      }}
    >
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

export const AppNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : user?.role === 'manager' ? (
        <ManagerTabs />
      ) : (
        <DeveloperTabs />
      )}
    </NavigationContainer>
  );
};
