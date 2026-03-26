import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// ── Auth Stack ──
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

// ── Projects Stack (nested inside tabs) ──
export type ProjectsStackParamList = {
  ProjectsList: undefined;
  ProjectDetail: { projectId: string };
  AddEditProject: { projectId?: string };
};

// ── Manager Tabs ──
export type ManagerTabParamList = {
  Projects: NavigatorScreenParams<ProjectsStackParamList>;
  MonthlyPlan: undefined;
  QuickAdd: undefined;
  Profile: undefined;
};

// ── Developer Tabs ──
export type DeveloperTabParamList = {
  MyProjects: NavigatorScreenParams<ProjectsStackParamList>;
  MonthlyPlan: undefined;
  Profile: undefined;
};

// ── Screen Props ──

export type ProjectsListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProjectsStackParamList, 'ProjectsList'>,
  BottomTabScreenProps<ManagerTabParamList>
>;

export type ProjectDetailScreenProps = NativeStackScreenProps<
  ProjectsStackParamList,
  'ProjectDetail'
>;

export type AddEditProjectScreenProps = NativeStackScreenProps<
  ProjectsStackParamList,
  'AddEditProject'
>;

export type MonthlyPlanScreenProps = BottomTabScreenProps<
  ManagerTabParamList,
  'MonthlyPlan'
>;

export type QuickAddScreenProps = BottomTabScreenProps<
  ManagerTabParamList,
  'QuickAdd'
>;
