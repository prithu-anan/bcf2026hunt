import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface SmartRedirectProps {
  loginPath: string;
  dashboardPath: string;
}

export function SmartRedirect({ loginPath, dashboardPath }: SmartRedirectProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return <Navigate to={user ? dashboardPath : loginPath} replace />;
}
