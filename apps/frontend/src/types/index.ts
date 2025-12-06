export interface AccessibilityPrefs {
  fontSize: "small" | "normal" | "large";
  highContrast: boolean;
  reduceMotion: boolean;
}

export interface Student {
  id: string;
  email: string;
  name: string;
  class?: string;
  avatar_url?: string;
  accessibility_prefs: AccessibilityPrefs;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  student: Student;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  student: Student | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, studentClass?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Student>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
