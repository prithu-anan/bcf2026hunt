import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/utils/apiClient";
import { Loader2, AlertCircle } from "lucide-react";
import { ADMIN_BASE_PATH } from "@/config/routes";

export default function TeamLogin() {
  const [teamId, setTeamId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from state or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/team/dashboard";

  // If already authenticated, redirect
  if (isAuthenticated && user) {
    if (user.role === "TEAM") {
      navigate(from, { replace: true });
    } else {
      navigate(`${ADMIN_BASE_PATH}/dashboard`, { replace: true });
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const loggedInUser = await login(teamId, password);
      
      // Check if logged in user is actually a team
      if (loggedInUser.role !== "TEAM") {
        // Admin logged in from team login - redirect to admin dashboard
        navigate(`${ADMIN_BASE_PATH}/dashboard`, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
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
        <CardTitle className="text-2xl">Team Login</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
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
            <Label htmlFor="teamId">Team ID</Label>
            <Input
              id="teamId"
              type="text"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="team01"
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
