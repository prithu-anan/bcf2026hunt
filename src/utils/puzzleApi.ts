import { apiClient, withAuth } from "./apiClient";

export interface PuzzleData {
  type: "base64" | "url";
  data: string;
  contentType?: string;
}

export interface PuzzleInProgress {
  level: number;
  puzzle_link: string; // Now contains data URI or external URL directly
  puzzle_data?: PuzzleData;
  puzzle_type: string;
}

export interface PuzzleCompleted {
  message: string;
  level: number;
  completed: true;
}

export type PuzzleResponse = PuzzleInProgress | PuzzleCompleted;

export interface SubmitAnswerResponse {
  success: boolean;
  message?: string;
  error?: string;
  level_completed?: number;
}

export const getCurrentPuzzle = async (token?: string) => {
  const { data } = await apiClient.get<PuzzleResponse>(
    "/puzzle",
    withAuth({}, token)
  );
  return data;
};

export const submitAnswer = async (answer: string, token?: string) => {
  const { data } = await apiClient.post<SubmitAnswerResponse>(
    "/puzzle/submit",
    { answer },
    withAuth({}, token)
  );
  return data;
};
