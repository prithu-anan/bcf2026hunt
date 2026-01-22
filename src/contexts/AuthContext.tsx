import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, AuthUser } from "@/utils/authApi";
import {
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
  clearAuth,
  setAuthErrorCallback,
  getApiErrorMessage,
  StoredUser,
  UserRole,
} from "@/utils/apiClient";
import { ADMIN_BASE_PATH } from "@/config/routes";
import { toast } from "sonner";

export interface AuthState {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (id: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  isTeam: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();

    if (token && user) {
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      // Clear any partial auth data
      clearAuth();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // Handle global auth errors (401/403 from API)
  useEffect(() => {
    setAuthErrorCallback((type, message) => {
      if (type === "session_expired") {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        toast.error("Session Expired", {
          description: message,
        });
      } else if (type === "access_denied") {
        toast.error("Access Denied", {
          description: message,
        });
      }
    });

    return () => setAuthErrorCallback(null);
  }, []);

  const login = useCallback(async (id: string, password: string): Promise<AuthUser> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await apiLogin(id, password);
      const { token, user } = response;

      // Store auth data
      setStoredToken(token);
      setStoredUser(user);

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return user;
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const isTeam = state.user?.role === "TEAM";
  const isAdmin = state.user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ ...state, login, logout, isTeam, isAdmin }}>
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

// Hook for handling auth errors in components
export function useAuthErrorHandler() {
  const { logout } = useAuth();

  const handleAuthError = useCallback(
    (error: unknown) => {
      const message = getApiErrorMessage(error);
      toast.error("Error", { description: message });
    },
    []
  );

  return { handleAuthError };
}
