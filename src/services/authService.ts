import { User } from "@/types";
import { mockTeams } from "@/data/mockData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 400);

const STORAGE_KEY = "treasure_hunt_auth";

export const authService = {
  async login(
    username: string,
    password: string,
    role: "team" | "admin"
  ): Promise<User> {
    await randomDelay();

    // Mock: accept any credentials
    const user: User = {
      id: `user-${Date.now()}`,
      username,
      name: username,
      role,
      teamId: role === "team" ? mockTeams[0].id : undefined,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    await randomDelay();
    localStorage.removeItem(STORAGE_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    await randomDelay();
    // Mock: always succeed
    return true;
  },
};
