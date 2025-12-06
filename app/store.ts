import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  progress: number;
}

interface AppStore {
  user: User | null;
  setUser: (user: User | null) => void;
  lessonProgress: Record<string, LessonProgress>;
  setLessonProgress: (lessonId: string, progress: LessonProgress) => void;
  updateLessonProgress: (lessonId: string, progress: Partial<LessonProgress>) => void;
}

export const useStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  lessonProgress: {},
  setLessonProgress: (lessonId, progress) =>
    set((state) => ({
      lessonProgress: {
        ...state.lessonProgress,
        [lessonId]: progress,
      },
    })),
  updateLessonProgress: (lessonId, progress) =>
    set((state) => ({
      lessonProgress: {
        ...state.lessonProgress,
        [lessonId]: {
          ...(state.lessonProgress[lessonId] || {}),
          ...progress,
        } as LessonProgress,
      },
    })),
}));
