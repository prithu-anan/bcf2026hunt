import { Level } from "@/types";
import { mockLevels } from "@/data/mockData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 400);

// In-memory store
let levels = [...mockLevels];

export const levelService = {
  async getAllLevels(): Promise<Level[]> {
    await randomDelay();
    return [...levels];
  },

  async getLevelById(levelId: number): Promise<Level | null> {
    await randomDelay();
    return levels.find((l) => l.levelId === levelId) || null;
  },

  async createLevel(level: Omit<Level, "levelId">): Promise<Level> {
    await randomDelay();
    const newLevel: Level = {
      ...level,
      levelId: levels.length + 1,
    };
    levels.push(newLevel);
    return newLevel;
  },

  async updateLevel(
    levelId: number,
    updates: Partial<Omit<Level, "levelId">>
  ): Promise<Level> {
    await randomDelay();
    const index = levels.findIndex((l) => l.levelId === levelId);
    if (index === -1) throw new Error("Level not found");

    levels[index] = { ...levels[index], ...updates };
    return levels[index];
  },

  async deleteLevel(levelId: number): Promise<void> {
    await randomDelay();
    levels = levels.filter((l) => l.levelId !== levelId);
  },

  async getTotalLevels(): Promise<number> {
    await delay(100);
    return levels.length;
  },
};
