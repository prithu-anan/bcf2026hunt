import { Submission } from "@/types";
import { mockSubmissions, mockLevels } from "@/data/mockData";
import { teamService } from "./teamService";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 400);

// In-memory store
let submissions = [...mockSubmissions];

export const submissionService = {
  async getAllSubmissions(): Promise<Submission[]> {
    await randomDelay();
    return [...submissions];
  },

  async getSubmissionsByTeam(teamId: string): Promise<Submission[]> {
    await randomDelay();
    return submissions.filter((s) => s.teamId === teamId);
  },

  async getSubmissionsByLevel(level: number): Promise<Submission[]> {
    await randomDelay();
    return submissions.filter((s) => s.level === level);
  },

  async submitAnswer(
    teamId: string,
    level: number,
    answer: string
  ): Promise<{ submission: Submission; isCorrect: boolean }> {
    await randomDelay();

    const levelData = mockLevels.find((l) => l.levelId === level);
    const isCorrect =
      levelData?.correctAnswer.toLowerCase() === answer.toLowerCase();

    const submission: Submission = {
      id: `sub-${Date.now()}`,
      teamId,
      level,
      submittedAnswer: answer,
      isCorrect,
      timestamp: Date.now(),
    };

    submissions.push(submission);

    // If correct, update team progress
    if (isCorrect) {
      await teamService.addProgress(teamId, {
        level,
        timestamp: Date.now(),
      });
    }

    return { submission, isCorrect };
  },

  async getFilteredSubmissions(filters: {
    teamId?: string;
    level?: number;
    isCorrect?: boolean;
    startTime?: number;
    endTime?: number;
  }): Promise<Submission[]> {
    await randomDelay();

    return submissions.filter((s) => {
      if (filters.teamId && s.teamId !== filters.teamId) return false;
      if (filters.level !== undefined && s.level !== filters.level) return false;
      if (filters.isCorrect !== undefined && s.isCorrect !== filters.isCorrect)
        return false;
      if (filters.startTime && s.timestamp < filters.startTime) return false;
      if (filters.endTime && s.timestamp > filters.endTime) return false;
      return true;
    });
  },
};
