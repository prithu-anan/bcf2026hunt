import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Shield } from "lucide-react";
import { ADMIN_BASE_PATH } from "@/config/routes";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password, "admin");
      navigate(`${ADMIN_BASE_PATH}/dashboard`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2"><div className="rounded-lg bg-primary/10 p-2"><Shield className="h-6 w-6 text-primary" /></div></div>
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>Access the admin dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="username">Username</Label><Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin_username" required /></div>
          <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required /></div>
          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign In</Button>
        </form>
      </CardContent>
    </Card>
  );
}
