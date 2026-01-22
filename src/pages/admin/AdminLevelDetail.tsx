import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ADMIN_BASE_PATH } from "@/config/routes";
import { toast } from "sonner";
import {
  deletePuzzle,
  getPuzzles,
  getSubmissions,
  getTeams,
  updatePuzzle,
  type AdminPuzzle,
  type SubmissionRecord,
  type TeamRecord,
} from "@/utils/adminApi";
import { apiClient, getApiErrorMessage, getBaseUrl } from "@/utils/apiClient";
import { CheckCircle2, ChevronLeft, ChevronRight, Download, Upload, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 15;

export default function AdminLevelDetail() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [puzzle, setPuzzle] = useState<AdminPuzzle | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [teams, setTeams] = useState<TeamRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBlobUrl, setImageBlobUrl] = useState<string>("");
  const imageBlobUrlRef = useRef<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    type: "",
    answer: "",
    link: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const resolvedImageUrl = useMemo(() => {
    if (!puzzle?.imageUrl) return "";
    if (puzzle.imageUrl.startsWith("http://") || puzzle.imageUrl.startsWith("https://")) {
      return puzzle.imageUrl;
    }
    return `${getBaseUrl()}${puzzle.imageUrl}`;
  }, [puzzle]);

  useEffect(() => {
    let isMounted = true;
    const loadImage = async () => {
      if (!puzzle?.imageUrl) return;
      if (puzzle.imageUrl.startsWith("http://") || puzzle.imageUrl.startsWith("https://")) {
        setImageBlobUrl("");
        return;
      }
      if (imageBlobUrlRef.current) {
        URL.revokeObjectURL(imageBlobUrlRef.current);
        imageBlobUrlRef.current = null;
      }
      try {
        const { data } = await apiClient.get<Blob>(puzzle.imageUrl, {
          responseType: "blob",
        });
        const objectUrl = URL.createObjectURL(data);
        if (!isMounted) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        imageBlobUrlRef.current = objectUrl;
        setImageBlobUrl(objectUrl);
      } catch (error) {
        toast.error("Failed to load puzzle image", {
          description: getApiErrorMessage(error),
        });
      }
    };
    loadImage();
    return () => {
      isMounted = false;
      if (imageBlobUrlRef.current) {
        URL.revokeObjectURL(imageBlobUrlRef.current);
        imageBlobUrlRef.current = null;
      }
    };
  }, [puzzle]);

  useEffect(() => {
    const fetchPuzzle = async () => {
      if (!levelId) return;
      setIsLoading(true);
      try {
        const [puzzles, allSubs, teamList] = await Promise.all([
          getPuzzles(),
          getSubmissions({ limit: 1000 }),
          getTeams(),
        ]);
        const found = puzzles.find((item) => item.id === levelId);
        setPuzzle(found ?? null);
        setTeams(teamList);
        // Filter submissions for this puzzle
        const puzzleSubs = allSubs.filter((s) => s.puzzle_id === levelId);
        setSubmissions(puzzleSubs);
        setForm({
          type: found?.type ?? "",
          answer: found?.answer ?? "",
          link: found?.link ?? "",
        });
      } catch (error) {
        toast.error("Failed to load challenge", {
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPuzzle();
  }, [levelId]);

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

  // Check if a submission is correct
  const isCorrectAnswer = (sub: SubmissionRecord) => {
    if (!puzzle) return false;
    return sub.answer.toLowerCase().trim() === puzzle.answer.toLowerCase().trim();
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTeamId = (teamName: string) => {
    return teams.find((t) => t.name === teamName)?.id || teamName;
  };

  const handleUpdate = async () => {
    if (!levelId) return;
    const typeValue = form.type.trim() || "image";
    const hasChanges =
      (typeValue && typeValue !== puzzle?.type) ||
      (form.answer.trim() && form.answer.trim() !== puzzle?.answer) ||
      (form.link.trim() && form.link.trim() !== (puzzle?.link ?? "")) ||
      !!imageFile;

    if (!hasChanges) {
      toast.error("No changes", {
        description: "Update at least one field before saving.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("type", typeValue);
      if (form.answer) payload.append("answer", form.answer.trim());
      if (form.link) payload.append("link", form.link.trim());
      if (imageFile) payload.append("image", imageFile);

      await updatePuzzle(levelId, payload);
      const puzzles = await getPuzzles();
      const updated = puzzles.find((item) => item.id === levelId) ?? null;
      setPuzzle(updated);
      setOpen(false);
      setImageFile(null);
      toast.success("Challenge updated");
    } catch (error) {
      toast.error("Failed to update challenge", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!levelId) return;
    setIsLoading(true);
    try {
      await deletePuzzle(levelId);
      toast.success("Challenge deleted");
      navigate(`${ADMIN_BASE_PATH}/levels`);
    } catch (error) {
      toast.error("Failed to delete challenge", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !puzzle) return <div className="animate-pulse">Loading...</div>;
  if (!puzzle) return <div className="text-muted-foreground">Challenge not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Puzzle {puzzle.id}</h1>
          <p className="text-muted-foreground">Type: {puzzle.type}</p>
        </div>
        <Badge>Answer: {puzzle.answer}</Badge>
      </div>

      {puzzle.imageUrl && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Puzzle Image</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={imageBlobUrl || resolvedImageUrl}
                  download={`puzzle-${puzzle.id}`}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <img
              src={imageBlobUrl || resolvedImageUrl}
              alt={`Puzzle ${puzzle.id}`}
              className="w-full max-w-3xl rounded-md border"
            />
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={() => setOpen(true)}>Edit Challenge</Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Challenge</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Input
                  value={form.type}
                  onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                  placeholder="image (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Input
                  value={form.answer}
                  onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>External Link</Label>
                <Input
                  value={form.link}
                  onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
                  placeholder="https://example.com/puzzle.png"
                />
              </div>
              <div className="space-y-2">
                <Label>Replace Image</Label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {imageFile ? (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <span className="text-sm truncate flex-1">{imageFile.name}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setImageFile(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />Choose Image
                  </Button>
                )}
              </div>
              <Button onClick={handleUpdate} className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" disabled={isLoading}>
              Delete Challenge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Challenge?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This will permanently delete puzzle {puzzle.id} and its image. This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
              <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                {isLoading ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({submissions.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 w-10"></TableHead>
                  <TableHead>Team</TableHead>
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
                      No submissions for this puzzle yet
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
                            to={`${ADMIN_BASE_PATH}/teams/${getTeamId(sub.team)}`}
                            className="hover:underline text-primary"
                          >
                            {sub.team}
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
