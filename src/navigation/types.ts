import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

export type ProjectsStackParamList = {
  ProjectsList: undefined;
  ProjectDetail: { projectId: string };
  AddEditProject: { projectId?: string };
};

export type BottomTabParamList = {
  Projects: NavigatorScreenParams<ProjectsStackParamList>;
  MonthlyPlan: undefined;
  QuickAdd: undefined;
};

export type ProjectsListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProjectsStackParamList, 'ProjectsList'>,
  BottomTabScreenProps<BottomTabParamList>
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
  BottomTabParamList,
  'MonthlyPlan'
>;

export type QuickAddScreenProps = BottomTabScreenProps<
  BottomTabParamList,
  'QuickAdd'
>;
