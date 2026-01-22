import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";

const DEFAULT_BASE_URL = "http://localhost:5000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;
const AUTH_TOKEN_KEY = "treasure_hunt_token";
const AUTH_USER_KEY = "treasure_hunt_user";

export type UserRole = "TEAM" | "ADMIN";

export interface StoredUser {
  id: string;
  name: string;
  role: UserRole;
  level_completed?: number;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Token helpers
export const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
export const setStoredToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};
export const clearStoredToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// User helpers
export const getStoredUser = (): StoredUser | null => {
  const data = localStorage.getItem(AUTH_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as StoredUser;
  } catch {
    return null;
  }
};
export const setStoredUser = (user: StoredUser) => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};
export const clearStoredUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};

// Clear all auth data
export const clearAuth = () => {
  clearStoredToken();
  clearStoredUser();
};

export const withAuth = (config: AxiosRequestConfig = {}, token?: string) => {
  const authToken = token ?? getStoredToken();
  if (!authToken) return config;
  const headers = AxiosHeaders.from(config.headers ?? {});
  headers.set("Authorization", `Bearer ${authToken}`);
  return {
    ...config,
    headers,
  };
};

// Request interceptor - attach token
apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers ?? {});
  if (!headers.has("Authorization")) {
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }
  }
  return config;
});

// Auth error event for global handling
export type AuthErrorType = "invalid_token" | "access_denied" | "session_expired";
export type AuthErrorCallback = (type: AuthErrorType, message: string) => void;

let authErrorCallback: AuthErrorCallback | null = null;

export const setAuthErrorCallback = (callback: AuthErrorCallback | null) => {
  authErrorCallback = callback;
};

// Response interceptor - handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data as { error?: string; message?: string } | undefined;
      const errorMsg = data?.error ?? data?.message ?? error.message;

      if (status === 401) {
        // Unauthorized - invalid or expired token
        clearAuth();
        authErrorCallback?.("session_expired", errorMsg || "Session expired. Please log in again.");
      } else if (status === 403) {
        // Forbidden - access denied
        authErrorCallback?.("access_denied", errorMsg || "Access denied. Insufficient permissions.");
      }
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: string; message?: string; errors?: Array<{ msg: string }> }
      | undefined;
    // Handle validation errors array
    if (data?.errors && data.errors.length > 0) {
      return data.errors.map((e) => e.msg).join(", ");
    }
    return data?.error ?? data?.message ?? error.message;
  }
  return "Unknown error";
};

export const getBaseUrl = () => API_BASE_URL;
