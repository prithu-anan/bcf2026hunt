import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ADMIN_BASE_PATH } from "@/config/routes";
import { Loader2 } from "lucide-react";

interface SmartRedirectProps {
  loginPath: string;
  dashboardPath: string;
}

export function SmartRedirect({ loginPath, dashboardPath }: SmartRedirectProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={loginPath} replace />;
  }

  // Redirect based on user role
  if (user.role === "ADMIN") {
    return <Navigate to={`${ADMIN_BASE_PATH}/dashboard`} replace />;
  }

  return <Navigate to={dashboardPath} replace />;
}
