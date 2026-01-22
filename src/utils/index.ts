// API Client and auth utilities
export {
  apiClient,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  clearAuth,
  withAuth,
  setAuthErrorCallback,
  getApiErrorMessage,
  getBaseUrl,
  type StoredUser,
  type UserRole,
  type AuthErrorType,
  type AuthErrorCallback,
} from "./apiClient";

// Auth API
export { login, type AuthUser, type AuthLoginResponse } from "./authApi";

// Puzzle API
export {
  getCurrentPuzzle,
  submitAnswer,
  type PuzzleResponse,
  type PuzzleInProgress,
  type PuzzleCompleted,
  type SubmitAnswerResponse,
} from "./puzzleApi";

// Leaderboard API
export {
  getLeaderboard,
  clearLeaderboardCache,
  type LeaderboardEntryResponse,
} from "./leaderboardApi";

// Admin API
export {
  registerUser,
  getSubmissions,
  getTeams,
  updateTeamProgress,
  getPuzzles,
  addPuzzle,
  updatePuzzle,
  deletePuzzle,
  getPuzzleImageUrl,
  type RegisterUserPayload,
  type RegisterUserResponse,
  type SubmissionRecord,
  type SubmissionQueryParams,
  type TeamRecord,
  type UpdateTeamProgressResponse,
  type AdminPuzzle,
} from "./adminApi";
