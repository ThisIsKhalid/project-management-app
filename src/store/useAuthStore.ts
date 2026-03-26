import { create } from 'zustand';
import { User } from '../types';
import { dummyUsers } from '../data/dummyUsers';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  users: User[]; // all registered users (dummy + sign-ups)
  signIn: (email: string, password: string) => { success: boolean; error?: string };
  signUp: (name: string, email: string, password: string) => { success: boolean; error?: string };
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  users: [...dummyUsers],

  signIn: (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = get().users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    set({ user, isAuthenticated: true });
    return { success: true };
  },

  signUp: (name, email, password) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!name.trim() || !trimmedEmail || !password) {
      return { success: false, error: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const existing = get().users.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (existing) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser: User = {
      id: `dev-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      password,
      role: 'developer', // sign-up only creates developer accounts
    };

    set((state) => ({
      users: [...state.users, newUser],
      user: newUser,
      isAuthenticated: true,
    }));

    return { success: true };
  },

  signOut: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
