import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trophy, Medal, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getLeaderboard, type LeaderboardEntryResponse } from "@/utils/leaderboardApi";
import { getApiErrorMessage } from "@/utils/apiClient";

export default function TeamLeaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getLeaderboard();
        setEntries(data);
      } catch (error) {
        toast.error("Failed to load leaderboard", {
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-mono">#{rank}</span>;
    }
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Find current team's rank
  const currentTeamIndex = entries.findIndex((e) => e.name === user?.name);
  const currentTeamRank = currentTeamIndex >= 0 ? currentTeamIndex + 1 : null;

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
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how teams are progressing</p>
      </div>

      {/* Current team rank highlight */}
      {currentTeamRank && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  {getRankIcon(currentTeamRank)}
                </div>
                <div>
                  <p className="font-semibold">Your Rank</p>
                  <p className="text-sm text-muted-foreground">
                    {currentTeamRank === 1
                      ? "You're in the lead!"
                      : `${currentTeamRank - 1} team${currentTeamRank - 1 > 1 ? "s" : ""} ahead of you`}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-1">
                #{currentTeamRank}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 pl-6">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">Level</TableHead>
                  <TableHead className="text-right pr-6">Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      No teams on the leaderboard yet
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry, index) => {
                    const rank = index + 1;
                    const isCurrentTeam = entry.name === user?.name;
                    return (
                      <TableRow
                        key={entry.name}
                        className={isCurrentTeam ? "bg-primary/5" : undefined}
                      >
                        <TableCell className="pl-6">
                          <div className="flex items-center justify-center w-8">
                            {getRankIcon(rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={isCurrentTeam ? "font-bold" : "font-medium"}>
                              {entry.name}
                            </span>
                            {isCurrentTeam && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            Level {entry.level_completed}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6 text-muted-foreground">
                          {formatDate(entry.last_time)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
