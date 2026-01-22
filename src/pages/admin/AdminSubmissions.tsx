import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle2, ChevronLeft, ChevronRight, Filter, X, XCircle } from "lucide-react";
import { ADMIN_BASE_PATH } from "@/config/routes";
import {
  getSubmissions,
  getTeams,
  getPuzzles,
  type SubmissionRecord,
  type TeamRecord,
  type AdminPuzzle,
} from "@/utils/adminApi";
import { getApiErrorMessage } from "@/utils/apiClient";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [teams, setTeams] = useState<TeamRecord[]>([]);
  const [puzzles, setPuzzles] = useState<AdminPuzzle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [puzzleFilter, setPuzzleFilter] = useState<string>("all");
  const [afterTime, setAfterTime] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [subs, teamList, puzzleList] = await Promise.all([
          getSubmissions({ limit: 1000 }),
          getTeams(),
          getPuzzles(),
        ]);
        setSubmissions(subs);
        setTeams(teamList);
        setPuzzles(puzzleList);
      } catch (error) {
        toast.error("Failed to load submissions", {
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Create a mapping of puzzle_id to correct answer (case-insensitive comparison)
  const puzzleAnswerMap = useMemo(() => {
    const map = new Map<string, string>();
    puzzles.forEach((puzzle) => {
      map.set(puzzle.id, puzzle.answer.toLowerCase().trim());
    });
    return map;
  }, [puzzles]);

  // Check if a submission is correct
  const isCorrectAnswer = useCallback((sub: SubmissionRecord) => {
    const correctAnswer = puzzleAnswerMap.get(sub.puzzle_id);
    if (!correctAnswer) return false;
    return sub.answer.toLowerCase().trim() === correctAnswer;
  }, [puzzleAnswerMap]);

  const filteredSubmissions = useMemo(() => {
    let result = [...submissions];

    if (teamFilter !== "all") {
      result = result.filter((s) => s.team === teamFilter);
    }

    if (puzzleFilter !== "all") {
      result = result.filter((s) => s.puzzle_id === puzzleFilter);
    }

    if (afterTime) {
      const after = new Date(afterTime).getTime();
      result = result.filter((s) => new Date(s.timestamp).getTime() >= after);
    }

    if (typeFilter !== "all") {
      result = result.filter((s) => {
        const isCorrect = isCorrectAnswer(s);
        return typeFilter === "correct" ? isCorrect : !isCorrect;
      });
    }

    // Sort by timestamp descending (most recent first)
    result.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return result;
  }, [submissions, teamFilter, puzzleFilter, afterTime, typeFilter, isCorrectAnswer]);

  const totalPages = Math.ceil(filteredSubmissions.length / PAGE_SIZE);
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSubmissions.slice(start, start + PAGE_SIZE);
  }, [filteredSubmissions, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [teamFilter, puzzleFilter, afterTime, typeFilter]);

  const clearFilters = () => {
    setTeamFilter("all");
    setPuzzleFilter("all");
    setAfterTime("");
    setTypeFilter("all");
  };

  const hasFilters =
    teamFilter !== "all" || puzzleFilter !== "all" || afterTime || typeFilter !== "all";

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading submissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Submissions</h1>
        <p className="text-muted-foreground">
          View and filter all answer submissions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Team</Label>
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All teams</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.name}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Puzzle</Label>
              <Select value={puzzleFilter} onValueChange={setPuzzleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All puzzles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All puzzles</SelectItem>
                  {puzzles.map((puzzle) => (
                    <SelectItem key={puzzle.id} value={puzzle.id}>
                      Puzzle {puzzle.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>After Time</Label>
              <Input
                type="datetime-local"
                value={afterTime}
                onChange={(e) => setAfterTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Submission Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="correct">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Correct
                    </span>
                  </SelectItem>
                  <SelectItem value="incorrect">
                    <span className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Incorrect
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            Submissions ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 w-10"></TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Puzzle</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead className="pr-6">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No submissions found
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
                            to={`${ADMIN_BASE_PATH}/teams/${teams.find((t) => t.name === sub.team)?.id || sub.team}`}
                            className="hover:underline text-primary"
                          >
                            {sub.team}
                          </Link>
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
