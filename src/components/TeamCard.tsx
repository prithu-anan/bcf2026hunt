import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { Team } from "@/types";
import { Link } from "react-router-dom";

interface TeamCardProps {
  team: Team;
  basePath?: string;
}

export function TeamCard({ team, basePath = "/team" }: TeamCardProps) {
  const currentLevel =
    team.progress.length > 0
      ? Math.max(...team.progress.map((p) => p.level))
      : 0;

  return (
    <Link to={`${basePath}/teams/${team.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg">{team.name}</h3>
            <Badge variant="secondary" className="text-xs">
              Level {currentLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>{team.progress.length} completed</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
