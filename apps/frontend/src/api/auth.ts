import apiClient from "./client";
import { AuthResponse, Student } from "../types";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  return response.data;
}

export async function register(
  email: string,
  password: string,
  name: string,
  studentClass?: string
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/register", {
    email,
    password,
    name,
    class: studentClass,
  });
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function verify(): Promise<{ student: Student; token: string }> {
  const response = await apiClient.post<{ student: Student; token: string }>("/auth/verify");
  return response.data;
}

export async function getProfile(): Promise<Student> {
  const response = await apiClient.get<Student>("/users/me");
  return response.data;
}

export async function updateProfile(updates: Partial<Student>): Promise<Student> {
  const response = await apiClient.patch<Student>("/users/me", updates);
  return response.data;
}
