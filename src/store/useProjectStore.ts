import { create } from 'zustand';
import { Project, Note, ProjectStatus } from '../types';
import { dummyProjects } from '../data/dummyProjects';

interface ProjectStore {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addNote: (projectId: string, note: Note) => void;
  updateNextAction: (projectId: string, nextAction: string) => void;
  updateStatus: (projectId: string, status: ProjectStatus) => void;
  assignDeveloper: (projectId: string, developerId: string) => void;
  removeDeveloper: (projectId: string, developerId: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: dummyProjects,

  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),

  addNote: (projectId, note) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, notes: [...p.notes, note] }
          : p
      ),
    })),

  updateNextAction: (projectId, nextAction) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, nextAction } : p
      ),
    })),

  updateStatus: (projectId, status) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, status } : p
      ),
    })),

  assignDeveloper: (projectId, developerId) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId && !p.assignedDeveloperIds.includes(developerId)
          ? { ...p, assignedDeveloperIds: [...p.assignedDeveloperIds, developerId] }
          : p
      ),
    })),

  removeDeveloper: (projectId, developerId) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, assignedDeveloperIds: p.assignedDeveloperIds.filter((id) => id !== developerId) }
          : p
      ),
    })),
}));
