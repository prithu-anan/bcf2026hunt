import { Outlet } from "react-router-dom";
import { Logo } from "@/components/Logo";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 gradient-dark opacity-50 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-4 flex justify-center">
        <Logo size="lg" />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-sm text-muted-foreground">
        BUET CSE Fest 2026 © All rights reserved
      </footer>
    </div>
  );
}
