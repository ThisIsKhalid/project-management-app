export type ProjectStatus = 'not_started' | 'in_progress' | 'review' | 'delivered';

export interface Note {
  id: string;
  text: string;
  createdAt: string; // ISO date string
}

export interface Project {
  id: string;
  clientName: string;
  projectTitle: string;
  startDate: string;   // ISO date string
  deadline: string;    // ISO date string
  deliveryDate: string; // ISO date string
  status: ProjectStatus;
  nextAction: string;
  notes: Note[];
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  review: 'Review',
  delivered: 'Delivered',
};

export const STATUS_ORDER: ProjectStatus[] = [
  'not_started',
  'in_progress',
  'review',
  'delivered',
];
