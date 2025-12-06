export interface Student {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  class?: string;
  avatar_url?: string;
  accessibility_prefs: AccessibilityPrefs;
  created_at: Date;
  updated_at: Date;
}

export interface AccessibilityPrefs {
  fontSize: "small" | "normal" | "large";
  highContrast: boolean;
  reduceMotion: boolean;
}

export interface Session {
  id: string;
  student_id: string;
  token: string;
  created_at: Date;
  expires_at: Date;
  created_ip?: string;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  student: Omit<Student, "password_hash">;
}

export interface JWTPayload {
  studentId: string;
  email: string;
  iat: number;
  exp: number;
}
