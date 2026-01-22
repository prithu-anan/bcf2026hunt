import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { RefreshCw, Trophy } from "lucide-react";
import { getLeaderboard, clearLeaderboardCache, type LeaderboardEntryResponse } from "@/utils/leaderboardApi";
import { getApiErrorMessage } from "@/utils/apiClient";

export default function AdminLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  const loadLeaderboard = async () => {
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

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      await clearLeaderboardCache();
      toast.success("Cache cleared", {
        description: "Leaderboard will refresh with fresh data.",
      });
      await loadLeaderboard();
    } catch (error) {
      toast.error("Failed to clear cache", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsClearing(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500 text-yellow-950">🥇 1st</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400 text-gray-900">🥈 2nd</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600 text-amber-50">🥉 3rd</Badge>;
    return <Badge variant="outline">#{rank}</Badge>;
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">
            Live rankings based on progress and completion time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadLeaderboard}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleClearCache}
            disabled={isClearing}
          >
            {isClearing ? "Clearing..." : "Clear Cache"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{entries.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Highest Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {entries.length > 0 ? Math.max(...entries.map((e) => e.level_completed)) : 0}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Teams Finished
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {entries.filter((e) => e.level_completed >= 10).length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 w-[100px]">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">Level Completed</TableHead>
                  <TableHead className="pr-6">Last Activity</TableHead>
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
                  entries.map((entry, index) => (
                    <TableRow key={entry.name}>
                      <TableCell className="pl-6">
                        {getRankBadge(index + 1)}
                      </TableCell>
                      <TableCell className="font-medium">{entry.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-sm">
                          Level {entry.level_completed}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-muted-foreground">
                        {entry.last_time ? formatDate(entry.last_time) : "No activity"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
