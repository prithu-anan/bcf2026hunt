// Team data model
export interface Team {
  id: string;
  name: string;
  members: string[];
  theme: "light" | "dark" | "custom";
  progress: TeamProgress[];
  createdAt: number;
}

export interface TeamProgress {
  level: number;
  timestamp: number;
}

// Level data model
export interface Level {
  levelId: number;
  title: string;
  image?: string;
  description?: string;
  attachment?: string; // pdf or file link
  correctAnswer: string;
}

// Submission data model
export interface Submission {
  id: string;
  teamId: string;
  level: number;
  submittedAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

// Auth types
export interface User {
  id: string;
  username: string;
  name: string;
  role: "team" | "admin";
  teamId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  team: Team;
  levelsCompleted: number;
  lastCompletionTime: number;
}

// Stats for admin dashboard
export interface DashboardStats {
  totalTeams: number;
  averageCompletionTime: number;
  activeTeams: number;
  inactiveTeams: number;
  levelDistribution: { level: number; count: number }[];
}
