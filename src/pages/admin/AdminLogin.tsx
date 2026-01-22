import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/utils/apiClient";
import { Loader2, Shield, AlertCircle } from "lucide-react";
import { ADMIN_BASE_PATH } from "@/config/routes";

export default function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from state or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || `${ADMIN_BASE_PATH}/dashboard`;

  // If already authenticated, redirect
  if (isAuthenticated && user) {
    if (user.role === "ADMIN") {
      navigate(from, { replace: true });
    } else {
      navigate("/team/dashboard", { replace: true });
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const loggedInUser = await login(adminId, password);

      // Check if logged in user is actually an admin
      if (loggedInUser.role !== "ADMIN") {
        setError("Access denied. Admin credentials required.");
        return;
      }

      navigate(from, { replace: true });
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>Access the admin dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="adminId">Admin ID</Label>
            <Input
              id="adminId"
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="admin_id"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
