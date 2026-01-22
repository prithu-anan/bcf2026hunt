import { apiClient, getBaseUrl, withAuth } from "./apiClient";

export interface RegisterUserPayload {
  id: string;
  name: string;
  password: string;
  token: string;
  role?: "TEAM" | "ADMIN";
}

export interface RegisterUserResponse {
  message: string;
  user: {
    id: string;
    name: string;
    role: "TEAM" | "ADMIN";
  };
}

export interface SubmissionRecord {
  _id: string;
  level_name: number;
  puzzle_id: string;
  team: string;
  answer: string;
  timestamp: string;
}

export interface SubmissionQueryParams {
  team?: string;
  level?: number;
  limit?: number;
}

export interface TeamRecord {
  id: string;
  name: string;
  level_completed: number;
  last_time: string;
  token: string;
}

export interface UpdateTeamProgressResponse {
  message: string;
  team: {
    id: string;
    name: string;
    level_completed: number;
  };
}

export interface UpdateTeamTokenResponse {
  message: string;
  team: {
    id: string;
    name: string;
    token: string;
  };
}

export interface AdminPuzzle {
  _id: string;
  id: string;
  imageFileId?: string;
  link?: string;
  type: string;
  answer: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const registerUser = async (
  payload: RegisterUserPayload,
  token?: string
) => {
  const { data } = await apiClient.post<RegisterUserResponse>(
    "/admin/register",
    payload,
    withAuth({}, token)
  );
  return data;
};

export const getSubmissions = async (params: SubmissionQueryParams, token?: string) => {
  const { data } = await apiClient.get<SubmissionRecord[]>(
    "/admin/answers",
    withAuth({ params }, token)
  );
  return data;
};

export const getTeams = async (token?: string) => {
  const { data } = await apiClient.get<TeamRecord[]>(
    "/admin/teams",
    withAuth({}, token)
  );
  return data;
};

export const updateTeamProgress = async (
  teamId: string,
  level_completed: number,
  token?: string
) => {
  const { data } = await apiClient.patch<UpdateTeamProgressResponse>(
    `/admin/teams/${teamId}/progress`,
    { level_completed },
    withAuth({}, token)
  );
  return data;
};

export const updateTeamToken = async (
  teamId: string,
  newToken: string,
  authToken?: string
) => {
  const { data } = await apiClient.patch<UpdateTeamTokenResponse>(
    `/admin/teams/${teamId}/token`,
    { token: newToken },
    withAuth({}, authToken)
  );
  return data;
};

export const getPuzzles = async (token?: string) => {
  const { data } = await apiClient.get<AdminPuzzle[]>(
    "/admin/puzzles",
    withAuth({}, token)
  );
  return data;
};

export const addPuzzle = async (formData: FormData, token?: string) => {
  const { data } = await apiClient.post<{ message: string; puzzle: AdminPuzzle }>(
    "/admin/puzzles",
    formData,
    withAuth({ headers: { "Content-Type": "multipart/form-data" } }, token)
  );
  return data;
};

export const updatePuzzle = async (
  id: string,
  formData: FormData,
  token?: string
) => {
  const { data } = await apiClient.put<{ message: string; puzzle: AdminPuzzle }>(
    `/admin/puzzles/${id}`,
    formData,
    withAuth({ headers: { "Content-Type": "multipart/form-data" } }, token)
  );
  return data;
};

export const deletePuzzle = async (id: string, token?: string) => {
  const { data } = await apiClient.delete<{ message: string }>(
    `/admin/puzzles/${id}`,
    withAuth({}, token)
  );
  return data;
};

export const getPuzzleImageUrl = (id: string) =>
  `${getBaseUrl()}/admin/puzzles/${id}/image`;
