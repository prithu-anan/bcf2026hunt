import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getLeaderboard, type LeaderboardEntryResponse } from "@/utils/leaderboardApi";
import { getApiErrorMessage } from "@/utils/apiClient";

export default function TeamsList() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<LeaderboardEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getLeaderboard();
        setTeams(data);
      } catch (error) {
        toast.error("Failed to load teams", {
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "No activity";
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Teams</h1>
        <p className="text-muted-foreground">
          {teams.length} teams participating
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team, index) => {
          const rank = index + 1;
          const isCurrentTeam = team.name === user?.name;

          return (
            <Link key={team.name} to={`/team/teams/${encodeURIComponent(team.name)}`}>
              <Card
                className={`hover:border-primary/50 transition-colors cursor-pointer h-full ${
                  isCurrentTeam ? "border-primary/50 bg-primary/5" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{team.name}</h3>
                      {isCurrentTeam && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      #{rank}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      <span>Level {team.level_completed}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(team.last_time)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {teams.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <Users className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No teams found</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
