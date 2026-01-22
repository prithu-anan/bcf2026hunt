import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ADMIN_BASE_PATH } from "@/config/routes";
import { addPuzzle, AdminPuzzle, getPuzzles } from "@/utils/adminApi";
import { apiClient, getApiErrorMessage, getBaseUrl } from "@/utils/apiClient";
import { toast } from "sonner";

export default function AdminLevels() {
  const [puzzles, setPuzzles] = useState<AdminPuzzle[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageBlobUrls, setImageBlobUrls] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    id: "",
    type: "",
    answer: "",
    link: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const mappedPuzzles = useMemo(() => {
    return [...puzzles].sort((a, b) => a.id.localeCompare(b.id));
  }, [puzzles]);

  const resolveImageUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${getBaseUrl()}${url}`;
  };

  const isExternalUrl = (url: string) =>
    url.startsWith("http://") || url.startsWith("https://");

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      for (const puzzle of puzzles) {
        if (!puzzle.imageUrl) continue;
        if (isExternalUrl(puzzle.imageUrl)) continue;
        if (imageBlobUrls[puzzle.id]) continue;
        try {
          const { data } = await apiClient.get<Blob>(puzzle.imageUrl, {
            responseType: "blob",
          });
          const objectUrl = URL.createObjectURL(data);
          if (!isMounted) {
            URL.revokeObjectURL(objectUrl);
            return;
          }
          setImageBlobUrls((prev) => ({
            ...prev,
            [puzzle.id]: objectUrl,
          }));
        } catch (error) {
          toast.error("Failed to load puzzle image", {
            description: getApiErrorMessage(error),
          });
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [puzzles, imageBlobUrls]);

  useEffect(() => {
    setImageBlobUrls((prev) => {
      const next = { ...prev };
      const puzzleIds = new Set(puzzles.map((puzzle) => puzzle.id));
      Object.keys(next).forEach((id) => {
        if (!puzzleIds.has(id)) {
          URL.revokeObjectURL(next[id]);
          delete next[id];
        }
      });
      return next;
    });
  }, [puzzles]);

  useEffect(() => {
    return () => {
      Object.values(imageBlobUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageBlobUrls]);

  useEffect(() => {
    const fetchPuzzles = async () => {
      setIsLoading(true);
      try {
        const data = await getPuzzles();
        setPuzzles(data);
      } catch (error) {
        toast.error("Failed to load challenges", {
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPuzzles();
  }, []);

  const handleCreate = async () => {
    if (!form.id || !form.answer) {
      toast.error("Missing fields", {
        description: "Please fill in ID and answer.",
      });
      return;
    }

    if (!imageFile && !form.link) {
      toast.error("Missing puzzle source", {
        description: "Provide either an image upload or an external link.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("id", form.id.trim());
      const typeValue = form.type.trim() || "image";
      payload.append("type", typeValue);
      payload.append("answer", form.answer.trim());
      if (imageFile) payload.append("image", imageFile);
      if (form.link) payload.append("link", form.link.trim());

      await addPuzzle(payload);
      toast.success("Challenge created");

      const updated = await getPuzzles();
      setPuzzles(updated);
      setOpen(false);
      setForm({ id: "", type: "", answer: "", link: "" });
      setImageFile(null);
    } catch (error) {
      toast.error("Failed to create challenge", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Challenge Management</h1><p className="text-muted-foreground">Create and manage challenges</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Challenge</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Challenge</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ID</Label>
                <Input
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  placeholder="a"
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Input
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  placeholder="image (optional)"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Image (optional)</Label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-label="Puzzle image"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {imageFile ? (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <span className="text-sm truncate flex-1">{imageFile.name}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setImageFile(null)}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => imageInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />Choose Image
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>External Link (optional)</Label>
                <Input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://example.com/puzzle.png"
                />
              </div>

              <div className="space-y-2">
                <Label>Answer</Label>
                <Input
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="sunset"
                />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Challenge"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mappedPuzzles.map((puzzle) => (
          <Link key={puzzle.id} to={`${ADMIN_BASE_PATH}/levels/${puzzle.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full overflow-hidden">
              {puzzle.imageUrl && (
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={
                      isExternalUrl(puzzle.imageUrl)
                        ? resolveImageUrl(puzzle.imageUrl)
                        : imageBlobUrls[puzzle.id]
                    }
                    alt={`Puzzle ${puzzle.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary/90">Puzzle {puzzle.id}</Badge>
                  </div>
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Puzzle {puzzle.id}</h3>
                  {!puzzle.imageUrl && (
                    <Badge className="bg-primary/90">Puzzle {puzzle.id}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{puzzle.type}</Badge>
                  <span className="truncate">Answer: {puzzle.answer}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {!isLoading && mappedPuzzles.length === 0 && (
          <div className="text-muted-foreground">No challenges found.</div>
        )}
      </div>
    </div>
  );
}
