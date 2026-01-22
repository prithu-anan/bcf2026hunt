import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function AdminSettings() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Manage your admin account</p></div>
      
      <Card>
        <CardHeader><CardTitle>Account Info</CardTitle></CardHeader>
        <CardContent>
          <p><span className="text-muted-foreground">Name:</span> {user?.name}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4">
          <span className="text-muted-foreground">Current: {theme}</span>
          <ThemeToggle />
        </CardContent>
      </Card>

    </div>
  );
}
