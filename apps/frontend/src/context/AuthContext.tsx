import React, { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";
import { Student, AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedStudent = localStorage.getItem("student");

        if (storedToken && storedStudent) {
          setToken(storedToken);
          setStudent(JSON.parse(storedStudent));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("student");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.login(email, password);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("student", JSON.stringify(response.student));
      setToken(response.token);
      setStudent(response.student);
      setIsAuthenticated(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, studentClass?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.register(email, password, name, studentClass);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("student", JSON.stringify(response.student));
      setToken(response.token);
      setStudent(response.student);
      setIsAuthenticated(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("student");
      setToken(null);
      setStudent(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Student>) => {
    try {
      setIsLoading(true);
      const updatedStudent = await authApi.updateProfile(updates);
      setStudent(updatedStudent);
      localStorage.setItem("student", JSON.stringify(updatedStudent));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        student,
        token,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
