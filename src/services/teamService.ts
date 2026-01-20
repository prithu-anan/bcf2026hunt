import { Team, TeamProgress } from "@/types";
import { mockTeams } from "@/data/mockData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 400);

// In-memory store (clone of mock data)
let teams = [...mockTeams];

export const teamService = {
  async getAllTeams(): Promise<Team[]> {
    await randomDelay();
    return [...teams];
  },

  async getTeamById(teamId: string): Promise<Team | null> {
    await randomDelay();
    return teams.find((t) => t.id === teamId) || null;
  },

  async updateTeam(
    teamId: string,
    updates: Partial<Pick<Team, "name" | "members" | "theme">>
  ): Promise<Team> {
    await randomDelay();
    const index = teams.findIndex((t) => t.id === teamId);
    if (index === -1) throw new Error("Team not found");

    teams[index] = { ...teams[index], ...updates };
    return teams[index];
  },

  async addProgress(teamId: string, progress: TeamProgress): Promise<Team> {
    await randomDelay();
    const index = teams.findIndex((t) => t.id === teamId);
    if (index === -1) throw new Error("Team not found");

    teams[index].progress.push(progress);
    return teams[index];
  },

  async getCurrentLevel(teamId: string): Promise<number> {
    await delay(100);
    const team = teams.find((t) => t.id === teamId);
    if (!team) return 1;
    return team.progress.length > 0
      ? Math.max(...team.progress.map((p) => p.level)) + 1
      : 1;
  },

  async createTeam(name: string, members: string[]): Promise<Team> {
    await randomDelay();
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name,
      members,
      theme: "dark",
      progress: [],
      createdAt: Date.now(),
    };
    teams.push(newTeam);
    return newTeam;
  },

  async deleteTeam(teamId: string): Promise<void> {
    await randomDelay();
    teams = teams.filter((t) => t.id !== teamId);
  },
};
