import { apiClient, withAuth } from "./apiClient";

export interface LeaderboardEntryResponse {
  name: string;
  level_completed: number;
  last_time: string;
}

export const getLeaderboard = async () => {
  const { data } = await apiClient.get<LeaderboardEntryResponse[]>(
    "/leaderboard"
  );
  return data;
};

export const clearLeaderboardCache = async (token?: string) => {
  const { data } = await apiClient.post<{ message: string }>(
    "/leaderboard/clear-cache",
    {},
    withAuth({}, token)
  );
  return data;
};
