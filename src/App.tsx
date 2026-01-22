import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SmartRedirect } from "@/components/SmartRedirect";
import { ADMIN_BASE_PATH } from "@/config/routes";

// Layouts
import { AuthLayout } from "@/layouts/AuthLayout";
import { TeamLayout } from "@/layouts/TeamLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

// Team pages
import TeamLogin from "@/pages/team/TeamLogin";
import TeamDashboard from "@/pages/team/TeamDashboard";
import TeamProfile from "@/pages/team/TeamProfile";
import TeamsList from "@/pages/team/TeamsList";
import TeamDetail from "@/pages/team/TeamDetail";
import TeamChallenge from "@/pages/team/TeamChallenge";
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
import AdminDecoy from "@/pages/admin/AdminDecoy";

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
              {/* Smart redirects based on auth state */}
              <Route path="/" element={<SmartRedirect loginPath="/team/login" dashboardPath="/team/dashboard" />} />
              <Route path="/team" element={<SmartRedirect loginPath="/team/login" dashboardPath="/team/dashboard" />} />
              <Route path={ADMIN_BASE_PATH} element={<SmartRedirect loginPath={`${ADMIN_BASE_PATH}/login`} dashboardPath={`${ADMIN_BASE_PATH}/dashboard`} />} />

              {/* Decoy admin route */}
              <Route path="/admin" element={<AdminDecoy />} />
              <Route path="/admin/*" element={<AdminDecoy />} />

              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/team/login" element={<TeamLogin />} />
                <Route path={`${ADMIN_BASE_PATH}/login`} element={<AdminLogin />} />
              </Route>

              {/* Team protected routes */}
              <Route path="/team" element={<TeamLayout />}>
                <Route path="dashboard" element={<TeamDashboard />} />
                <Route path="profile" element={<TeamProfile />} />
                <Route path="teams" element={<TeamsList />} />
                <Route path="teams/:teamId" element={<TeamDetail />} />
                <Route path="challenge" element={<TeamChallenge />} />
                <Route path="leaderboard" element={<TeamLeaderboard />} />
              </Route>

              {/* Admin protected routes (obscured path) */}
              <Route path={ADMIN_BASE_PATH} element={<AdminLayout />}>
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
