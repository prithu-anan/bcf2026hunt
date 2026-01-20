import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy } from "lucide-react";
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
        <CardContent className="pb-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{team.members.length} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span>{team.progress.length} completed</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex flex-wrap gap-1">
            {team.members.slice(0, 3).map((member, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {member.split(" ")[0]}
              </Badge>
            ))}
            {team.members.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{team.members.length - 3}
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
