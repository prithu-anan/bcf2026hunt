import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ADMIN_BASE_PATH } from "@/config/routes";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const { user } = useAuth();
  
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  // Determine where logo should link based on auth state
  const logoHref = user 
    ? (user.role === "admin" ? `${ADMIN_BASE_PATH}/dashboard` : "/team/dashboard")
    : "/team/login";

  return (
    <Link to={logoHref} className="flex items-center gap-2 font-bold">
      <div className="gradient-primary rounded-lg p-1.5 glow-primary">
        <MapPin className={`${sizeClasses[size]} text-primary-foreground`} />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${textSizeClasses[size]} text-gradient-primary font-bold`}>
            Treasure Hunt
          </span>
          <span className="text-xs text-muted-foreground">CSE Fest 2026</span>
        </div>
      )}
    </Link>
  );
}
