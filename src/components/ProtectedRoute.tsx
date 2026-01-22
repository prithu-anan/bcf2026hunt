import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ADMIN_BASE_PATH } from "@/config/routes";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "TEAM" | "ADMIN";
  redirectTo?: string;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    const loginPath = redirectTo ?? "/team/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    // User is authenticated but wrong role
    if (user.role === "ADMIN") {
      // Admin trying to access team routes - redirect to admin dashboard
      return <Navigate to={`${ADMIN_BASE_PATH}/dashboard`} replace />;
    } else {
      // Team trying to access admin routes - redirect to team dashboard
      return <Navigate to="/team/dashboard" replace />;
    }
  }

  return <>{children}</>;
}

// Convenience wrapper for team routes
export function TeamProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="TEAM" redirectTo="/team/login">
      {children}
    </ProtectedRoute>
  );
}

// Convenience wrapper for admin routes
export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="ADMIN" redirectTo={`${ADMIN_BASE_PATH}/login`}>
      {children}
    </ProtectedRoute>
  );
}
