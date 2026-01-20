import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Layouts
import { AuthLayout } from "@/layouts/AuthLayout";
import { TeamLayout } from "@/layouts/TeamLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

// Team pages
import TeamLogin from "@/pages/team/TeamLogin";
import TeamSignup from "@/pages/team/TeamSignup";
import TeamDashboard from "@/pages/team/TeamDashboard";
import TeamProfile from "@/pages/team/TeamProfile";
import TeamsList from "@/pages/team/TeamsList";
import TeamDetail from "@/pages/team/TeamDetail";
import TeamPuzzle from "@/pages/team/TeamPuzzle";
import TeamLeaderboard from "@/pages/team/TeamLeaderboard";

// Admin pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminTeams from "@/pages/admin/AdminTeams";
import AdminTeamDetail from "@/pages/admin/AdminTeamDetail";
import AdminLevels from "@/pages/admin/AdminLevels";
import AdminLevelDetail from "@/pages/admin/AdminLevelDetail";
import AdminLeaderboard from "@/pages/admin/AdminLeaderboard";
import AdminSettings from "@/pages/admin/AdminSettings";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Redirect root to team login */}
              <Route path="/" element={<Navigate to="/team/login" replace />} />

              {/* Team auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/team/login" element={<TeamLogin />} />
                <Route path="/team/signup" element={<TeamSignup />} />
                <Route path="/admin/login" element={<AdminLogin />} />
              </Route>

              {/* Team protected routes */}
              <Route path="/team" element={<TeamLayout />}>
                <Route path="dashboard" element={<TeamDashboard />} />
                <Route path="profile" element={<TeamProfile />} />
                <Route path="teams" element={<TeamsList />} />
                <Route path="teams/:teamId" element={<TeamDetail />} />
                <Route path="puzzle" element={<TeamPuzzle />} />
                <Route path="leaderboard" element={<TeamLeaderboard />} />
              </Route>

              {/* Admin protected routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="teams" element={<AdminTeams />} />
                <Route path="teams/:teamId" element={<AdminTeamDetail />} />
                <Route path="levels" element={<AdminLevels />} />
                <Route path="levels/:levelId" element={<AdminLevelDetail />} />
                <Route path="leaderboard" element={<AdminLeaderboard />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
