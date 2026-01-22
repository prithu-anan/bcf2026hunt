import { useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Layers,
  Trophy,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ADMIN_BASE_PATH } from "@/config/routes";

const navItems = [
  { href: `${ADMIN_BASE_PATH}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
  { href: `${ADMIN_BASE_PATH}/teams`, label: "Teams", icon: Users },
  { href: `${ADMIN_BASE_PATH}/levels`, label: "Challenges", icon: Layers },
  { href: `${ADMIN_BASE_PATH}/leaderboard`, label: "Leaderboard", icon: Trophy },
  { href: `${ADMIN_BASE_PATH}/settings`, label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(`${ADMIN_BASE_PATH}/login`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Mobile header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Logo size="sm" />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar header */}
            <div className="flex h-14 items-center justify-end border-b px-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar footer */}
            <div className="border-t p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container max-w-6xl py-6 px-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
