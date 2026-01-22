import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getLeaderboard, type LeaderboardEntryResponse } from "@/utils/leaderboardApi";
import { getApiErrorMessage } from "@/utils/apiClient";

export default function TeamDetail() {
  const { teamId } = useParams();
  const [team, setTeam] = useState<LeaderboardEntryResponse | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!teamId) return;
      setIsLoading(true);
      try {
        const data = await getLeaderboard();
        // teamId could be the team name URL-encoded
        const decodedId = decodeURIComponent(teamId);
        const index = data.findIndex(
          (t) => t.name === decodedId || t.name.toLowerCase() === decodedId.toLowerCase()
        );
        if (index >= 0) {
          setTeam(data[index]);
          setRank(index + 1);
        }
      } catch (error) {
        toast.error("Failed to load team", {
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [teamId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link to="/team/teams">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teams
          </Link>
        </Button>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Team not found</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "No activity";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/team/teams">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teams
        </Link>
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <p className="text-muted-foreground">Team Details</p>
        </div>
        {rank && (
          <Badge variant="secondary" className="text-lg px-4 py-1">
            Rank #{rank}
          </Badge>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{team.level_completed}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-lg">{formatDate(team.last_time)}</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
