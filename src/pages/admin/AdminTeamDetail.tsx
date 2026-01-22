import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { CheckCircle2, ChevronLeft, ChevronRight, Edit, Trophy, XCircle } from "lucide-react";
import { ADMIN_BASE_PATH } from "@/config/routes";
import {
  getTeams,
  getSubmissions,
  getPuzzles,
  updateTeamProgress,
  type TeamRecord,
  type SubmissionRecord,
  type AdminPuzzle,
} from "@/utils/adminApi";
import { getApiErrorMessage } from "@/utils/apiClient";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 15;

export default function AdminTeamDetail() {
  const { teamId } = useParams();
  const [team, setTeam] = useState<TeamRecord | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [puzzles, setPuzzles] = useState<AdminPuzzle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Progress update
  const [editOpen, setEditOpen] = useState(false);
  const [newLevel, setNewLevel] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      if (!teamId) return;
      setIsLoading(true);
      try {
        const [teamList, allSubs, puzzleList] = await Promise.all([
          getTeams(),
          getSubmissions({ limit: 1000 }),
          getPuzzles(),
        ]);

        const foundTeam = teamList.find((t) => t.id === teamId);
        setTeam(foundTeam ?? null);
        setPuzzles(puzzleList);

        if (foundTeam) {
          // Filter submissions for this team
          const teamSubs = allSubs.filter((s) => s.team === foundTeam.name);
          setSubmissions(teamSubs);
          setNewLevel(String(foundTeam.level_completed));
        }
      } catch (error) {
        toast.error("Failed to load team data", {
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [teamId]);

  // Create a mapping of puzzle_id to correct answer (case-insensitive comparison)
  const puzzleAnswerMap = useMemo(() => {
    const map = new Map<string, string>();
    puzzles.forEach((puzzle) => {
      map.set(puzzle.id, puzzle.answer.toLowerCase().trim());
    });
    return map;
  }, [puzzles]);

  // Check if a submission is correct
  const isCorrectAnswer = (sub: SubmissionRecord) => {
    const correctAnswer = puzzleAnswerMap.get(sub.puzzle_id);
    if (!correctAnswer) return false;
    return sub.answer.toLowerCase().trim() === correctAnswer;
  };

  const sortedSubmissions = useMemo(() => {
    return [...submissions].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [submissions]);

  const totalPages = Math.ceil(sortedSubmissions.length / PAGE_SIZE);
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedSubmissions.slice(start, start + PAGE_SIZE);
  }, [sortedSubmissions, currentPage]);

  const handleUpdateProgress = async () => {
    if (!teamId || !team) return;
    const levelNum = parseInt(newLevel, 10);
    if (isNaN(levelNum) || levelNum < 0) {
      toast.error("Invalid level", { description: "Please enter a valid number." });
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateTeamProgress(teamId, levelNum);
      setTeam((prev) =>
        prev ? { ...prev, level_completed: result.team.level_completed } : prev
      );
      setEditOpen(false);
      toast.success("Progress updated", {
        description: `${team.name} is now at level ${result.team.level_completed}`,
      });
    } catch (error) {
      toast.error("Failed to update progress", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading team...</div>;
  }

  if (!team) {
    return <div className="text-muted-foreground">Team not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <p className="text-muted-foreground">Team ID: {team.id}</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Trophy className="mr-1 h-4 w-4" />
          Level {team.level_completed}
        </Badge>
      </div>

      {/* Team Info */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{team.level_completed}</span>
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-1 h-4 w-4" />
                    Update
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Team Progress</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Manually update the progress level for {team.name}.
                    </p>
                    <div className="space-y-2">
                      <Label>Level Completed</Label>
                      <Input
                        type="number"
                        min="0"
                        value={newLevel}
                        onChange={(e) => setNewLevel(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleUpdateProgress}
                      className="w-full"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Save Changes"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{submissions.length}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-lg font-medium">
              {team.last_time
                ? new Date(team.last_time).toLocaleString()
                : "No activity"}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Puzzle Sequence */}
      <Card>
        <CardHeader>
          <CardTitle>Puzzle Sequence (Token)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {team.token.split("").map((char, i) => (
              <Link key={i} to={`${ADMIN_BASE_PATH}/levels/${char}`}>
                <Badge
                  variant={i < team.level_completed ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                >
                  {i + 1}. Puzzle {char}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Submission History ({submissions.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 w-10"></TableHead>
                  <TableHead>Puzzle</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead className="pr-6">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No submissions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSubmissions.map((sub) => {
                    const isCorrect = isCorrectAnswer(sub);
                    return (
                      <TableRow
                        key={sub._id}
                        className={cn(
                          isCorrect
                            ? "bg-green-500/10 hover:bg-green-500/15"
                            : "bg-red-500/10 hover:bg-red-500/15"
                        )}
                      >
                        <TableCell className="pl-6">
                          {isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`${ADMIN_BASE_PATH}/levels/${sub.puzzle_id}`}
                            className="hover:underline text-primary"
                          >
                            <Badge variant="outline">Puzzle {sub.puzzle_id}</Badge>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Level {sub.level_name}</Badge>
                        </TableCell>
                        <TableCell className="font-mono max-w-[200px] truncate">
                          {sub.answer}
                        </TableCell>
                        <TableCell className="pr-6 text-muted-foreground whitespace-nowrap">
                          {formatDate(sub.timestamp)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
