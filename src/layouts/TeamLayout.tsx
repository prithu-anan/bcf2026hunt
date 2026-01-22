import { useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  Target,
  Trophy,
  Menu,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/team/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/team/profile", label: "Profile", icon: User },
  { href: "/team/teams", label: "Teams", icon: Users },
  { href: "/team/challenge", label: "Challenge", icon: Target },
  { href: "/team/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function TeamLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/team/login");
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
          <Logo size="md" />
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
            "fixed inset-y-0 left-0 z-50 bg-sidebar border-r transform transition-all duration-200 ease-in-out lg:relative lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            collapsed ? "lg:w-16" : "w-64"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar header */}
            <div className="flex h-14 items-center justify-between border-b px-4">
              {/* Desktop collapse button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex"
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </Button>
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden ml-auto"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className={cn("flex-1 space-y-1 p-4", collapsed && "lg:px-2")}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const linkContent = (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent",
                      collapsed && "lg:justify-center lg:px-2"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className={cn(collapsed && "lg:hidden")}>{item.label}</span>
                  </Link>
                );

                if (collapsed) {
                  return (
                    <Tooltip key={item.href} delayDuration={0}>
                      <TooltipTrigger asChild className="hidden lg:flex">
                        {linkContent}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="hidden lg:block">
                        {item.label}
                      </TooltipContent>
                      {/* Mobile version without tooltip */}
                      <div className="lg:hidden">{linkContent}</div>
                    </Tooltip>
                  );
                }

                return linkContent;
              })}
            </nav>

            {/* Sidebar footer */}
            <div className={cn("border-t p-4", collapsed && "lg:px-2")}>
              {collapsed ? (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild className="hidden lg:flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="hidden lg:block">
                    Logout
                  </TooltipContent>
                  {/* Mobile version */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 lg:hidden"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              )}
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
