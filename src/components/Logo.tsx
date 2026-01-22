import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ADMIN_BASE_PATH } from "@/config/routes";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const { user } = useAuth();

  const logoSizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  // Determine where logo should link based on auth state
  const logoHref = user
    ? user.role === "ADMIN"
      ? `${ADMIN_BASE_PATH}/dashboard`
      : "/team/dashboard"
    : "/team/login";

  return (
    <Link to={logoHref} className="flex items-center gap-2 font-bold">
      <img
        src="/bcf-2026-logo.png"
        alt="BCF 2026"
        className={`${logoSizeClasses[size]} object-contain`}
      />
      {showText && (
        <span className={`${textSizeClasses[size]} text-gradient-primary font-bold`}>
          Treasure Hunt
        </span>
      )}
    </Link>
  );
}
