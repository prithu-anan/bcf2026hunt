import { apiClient } from "./apiClient";

export interface AuthUser {
  id: string;
  name: string;
  role: "TEAM" | "ADMIN";
  level_completed?: number;
}

export interface AuthLoginResponse {
  token: string;
  user: AuthUser;
}

export const login = async (id: string, password: string) => {
  const { data } = await apiClient.post<AuthLoginResponse>("/auth/login", {
    id,
    password,
  });
  return data;
};
