import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { authService } from "@/services/authService";
import { CheckCircle } from "lucide-react";

export default function TeamProfile() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saved, setSaved] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await authService.changePassword(currentPassword, newPassword);
    setSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Profile Settings</h1><p className="text-muted-foreground">Manage your account</p></div>
      
      <Card>
        <CardHeader><CardTitle>Account Info</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p><span className="text-muted-foreground">Name:</span> {user?.name}</p>
          <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4">
          <span className="text-muted-foreground">Current: {theme}</span>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2"><Label>Current Password</Label><Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></div>
            <div className="space-y-2"><Label>New Password</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
            <Button type="submit">{saved && <CheckCircle className="mr-2 h-4 w-4" />}{saved ? "Saved!" : "Update Password"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
