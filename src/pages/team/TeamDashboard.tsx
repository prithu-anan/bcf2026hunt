import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Target, Trophy, Loader2, ImageIcon } from "lucide-react";
import { StatsWidget } from "@/components/StatsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  getCurrentPuzzle,
  type PuzzleResponse,
} from "@/utils/puzzleApi";
import { getLeaderboard, type LeaderboardEntryResponse } from "@/utils/leaderboardApi";
import { getApiErrorMessage } from "@/utils/apiClient";

export default function TeamDashboard() {
  const { user } = useAuth();
  const [puzzle, setPuzzle] = useState<PuzzleResponse | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [puzzleData, lbData] = await Promise.all([
          getCurrentPuzzle(),
          getLeaderboard(),
        ]);
        setPuzzle(puzzleData);
        setLeaderboard(lbData);
      } catch (error) {
        toast.error("Failed to load dashboard", {
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Reset image error when puzzle changes
  useEffect(() => {
    setImageError(false);
  }, [puzzle]);

  // Find current team in leaderboard
  const currentTeam = leaderboard.find((entry) => entry.name === user?.name);
  const currentRank = currentTeam
    ? leaderboard.indexOf(currentTeam) + 1
    : leaderboard.length + 1;

  const isComplete = puzzle && "completed" in puzzle;
  const currentLevel = puzzle && !isComplete ? puzzle.level : (currentTeam?.level_completed ?? 0);
  const levelCompleted = currentTeam?.level_completed ?? 0;

  // puzzle_link now contains data URI or external URL directly - no additional fetching needed
  const imageUrl = puzzle && !("completed" in puzzle) ? puzzle.puzzle_link : "";

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
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          {isComplete ? "You've completed all challenges!" : "Keep solving to climb the leaderboard"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsWidget
          title="Current Level"
          value={isComplete ? "Done!" : currentLevel}
          icon={Target}
        />
        <StatsWidget
          title="Levels Completed"
          value={levelCompleted}
          icon={Trophy}
        />
        <StatsWidget
          title="Your Rank"
          value={currentRank <= 3 ? ["🥇", "🥈", "🥉"][currentRank - 1] : `#${currentRank}`}
          subtitle={`of ${leaderboard.length} teams`}
          icon={Trophy}
        />
        <StatsWidget
          title="Teams Ahead"
          value={Math.max(0, currentRank - 1)}
          icon={Target}
        />
      </div>

      {!isComplete && puzzle && !("completed" in puzzle) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Challenge</CardTitle>
              <Badge variant="secondary">Level {puzzle.level}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {imageUrl && !imageError ? (
                <img
                  src={imageUrl}
                  alt="Current Challenge"
                  className="w-full sm:w-48 h-32 object-cover rounded-lg"
                  onError={() => setImageError(true)}
                />
              ) : imageUrl ? (
                <div className="w-full sm:w-48 h-32 rounded-lg bg-muted flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              ) : null}
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">Puzzle {puzzle.level}</h3>
                <p className="text-sm text-muted-foreground">
                  Type: {puzzle.puzzle_type}
                </p>
                <Button asChild>
                  <Link to="/team/challenge">Solve Challenge →</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isComplete && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-green-500/10 p-4">
                <Trophy className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-500">All Challenges Complete!</h3>
              <p className="text-muted-foreground max-w-md">
                Congratulations! You've solved all the puzzles. Check the leaderboard to see your final ranking.
              </p>
              <Button asChild variant="outline">
                <Link to="/team/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
