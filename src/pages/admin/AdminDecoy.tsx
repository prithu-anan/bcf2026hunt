import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminDecoy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/bcf-2026-logo.png"
              alt="BCF 2026"
              className="h-10 w-10 object-contain"
            />
            <span className="text-lg font-bold text-gradient-primary">
              Treasure Hunt
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <img
              src="https://i.imgflip.com/1ur9b0.jpg"
              alt="Nice try"
              className="w-full rounded-lg"
            />
            <p className="text-lg font-medium text-muted-foreground">
              Nothing to see here... 👀
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
