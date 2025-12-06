import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
});

export interface Module {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  order: number;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  moduleId: string;
  module?: Module;
  order: number;
  content: string;
  videoUrl?: string;
  duration?: number;
  interactiveComponents?: InteractiveComponent[];
  mediaAssets?: MediaAsset[];
  createdAt: string;
  updatedAt: string;
}

export interface InteractiveComponent {
  id: string;
  type: string;
  lessonId: string;
  title: string;
  prompt: string;
  options?: string;
  order: number;
}

export interface MediaAsset {
  id: string;
  type: string;
  url: string;
  lessonId: string;
  title?: string;
  metadata?: string;
  order: number;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  progress: number;
  startedAt: string;
  completedAt?: string;
}

export const api = {
  modules: {
    getAll: () => client.get<Module[]>('/modules'),
    getBySubject: (subjectId: string) => client.get<Module[]>(`/subjects/${subjectId}/modules`),
  },
  lessons: {
    get: (lessonId: string) => client.get<Lesson>(`/lessons/${lessonId}`),
  },
  progress: {
    getAll: (userId: string) => client.get<LessonProgress[]>(`/users/${userId}/progress`),
    get: (userId: string, lessonId: string) =>
      client.get<LessonProgress>(`/users/${userId}/lessons/${lessonId}/progress`),
    update: (userId: string, lessonId: string, data: { completed?: boolean; progress?: number }) =>
      client.put<LessonProgress>(`/users/${userId}/lessons/${lessonId}/progress`, data),
  },
  milestones: {
    getAll: (userId: string) => client.get(`/users/${userId}/milestones`),
  },
};
