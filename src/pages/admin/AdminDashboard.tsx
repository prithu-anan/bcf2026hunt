import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Trophy, Target, Layers, FileText, Clock } from "lucide-react";
import { StatsWidget } from "@/components/StatsWidget";
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
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";
import { ADMIN_BASE_PATH } from "@/config/routes";
import {
  getTeams,
  getPuzzles,
  getSubmissions,
  type TeamRecord,
  type AdminPuzzle,
  type SubmissionRecord,
} from "@/utils/adminApi";
import { getLeaderboard, type LeaderboardEntryResponse } from "@/utils/leaderboardApi";
import { getApiErrorMessage } from "@/utils/apiClient";

export default function AdminDashboard() {
  const [teams, setTeams] = useState<TeamRecord[]>([]);
  const [puzzles, setPuzzles] = useState<AdminPuzzle[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [teamData, puzzleData, subData, lbData] = await Promise.all([
          getTeams(),
          getPuzzles(),
          getSubmissions({ limit: 1000 }),
          getLeaderboard(),
        ]);
        setTeams(teamData);
        setPuzzles(puzzleData);
        setSubmissions(subData);
        setLeaderboard(lbData);
      } catch (error) {
        toast.error("Failed to load dashboard data", {
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate stats
  const totalTeams = teams.length;
  const totalPuzzles = puzzles.length;
  const totalSubmissions = submissions.length;

  const highestCompleted = leaderboard.length > 0
    ? Math.max(...leaderboard.map((e) => e.level_completed))
    : 0;

  const avgProgress = leaderboard.length > 0
    ? (leaderboard.reduce((sum, e) => sum + e.level_completed, 0) / leaderboard.length).toFixed(1)
    : "0";

  // Puzzle completion distribution (how many teams completed each puzzle)
  const puzzleCompletionData = puzzles.map((puzzle) => {
    // Count teams that have this puzzle in their sequence and have passed it
    const completedCount = teams.filter((team) => {
      const puzzleIndex = team.token.indexOf(puzzle.id);
      return puzzleIndex !== -1 && team.level_completed > puzzleIndex;
    }).length;
    return {
      puzzle: `P-${puzzle.id}`,
      count: completedCount,
    };
  });

  // Level distribution (how many teams are at each level)
  const maxLevel = Math.max(highestCompleted, totalPuzzles, 5);
  const levelDistribution = Array.from({ length: maxLevel + 1 }, (_, i) => ({
    level: `L${i}`,
    count: leaderboard.filter((e) => e.level_completed === i).length,
  }));

  // Recent submissions (last 5)
  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  // Top 5 teams
  const topTeams = leaderboard.slice(0, 5);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of the treasure hunt</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsWidget title="Total Teams" value={totalTeams} icon={Users} />
        <StatsWidget title="Total Puzzles" value={totalPuzzles} icon={Layers} />
        <StatsWidget title="Total Submissions" value={totalSubmissions} icon={FileText} />
        <StatsWidget
          title="Highest Level"
          value={highestCompleted}
          icon={Target}
        />
      </div>


      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Team Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={levelDistribution}>
                  <XAxis
                    dataKey="level"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Puzzle Completion */}
        {puzzleCompletionData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Puzzle Completion Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={puzzleCompletionData}>
                    <XAxis
                      dataKey="puzzle"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-2))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tables Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Teams */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Teams
              </CardTitle>
              <Link
                to={`${ADMIN_BASE_PATH}/leaderboard`}
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 w-[60px]">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="pr-6 text-right">Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topTeams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                      No teams yet
                    </TableCell>
                  </TableRow>
                ) : (
                  topTeams.map((entry, i) => (
                    <TableRow key={entry.name}>
                      <TableCell className="pl-6">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </TableCell>
                      <TableCell className="font-medium">{entry.name}</TableCell>
                      <TableCell className="pr-6 text-right">
                        <Badge variant="secondary">L{entry.level_completed}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Submissions
              </CardTitle>
              <Link
                to={`${ADMIN_BASE_PATH}/submissions`}
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Team</TableHead>
                  <TableHead>Puzzle</TableHead>
                  <TableHead className="pr-6 text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                      No submissions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  recentSubmissions.map((sub) => (
                    <TableRow key={sub._id}>
                      <TableCell className="pl-6">{sub.team}</TableCell>
                      <TableCell>
                        <Badge variant="outline">P-{sub.puzzle_id}</Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right text-muted-foreground">
                        {formatTimeAgo(sub.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
