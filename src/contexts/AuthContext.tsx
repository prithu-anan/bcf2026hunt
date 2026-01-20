import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "@/types";
import { authService } from "@/services/authService";

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: "team" | "admin") => Promise<void>;
  signup: (email: string, password: string, name: string, teamName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      setState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    });
  }, []);

  const login = async (email: string, password: string, role: "team" | "admin") => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.login(email, password, role);
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, teamName?: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.signup(email, password, name, teamName);
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
