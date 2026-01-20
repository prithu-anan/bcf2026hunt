import { useEffect, useState } from "react";
import { levelService } from "@/services/levelService";
import { submissionService } from "@/services/submissionService";
import { LevelCard } from "@/components/LevelCard";
import { Level, Submission } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminLevels() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", image: "", description: "", correctAnswer: "" });

  useEffect(() => {
    levelService.getAllLevels().then(setLevels);
    submissionService.getAllSubmissions().then(setSubmissions);
  }, []);

  const handleCreate = async () => {
    await levelService.createLevel(form);
    const updated = await levelService.getAllLevels();
    setLevels(updated);
    setOpen(false);
    setForm({ title: "", image: "", description: "", correctAnswer: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Level Management</h1><p className="text-muted-foreground">Create and manage puzzles</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Level</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Level</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-2"><Label>Correct Answer</Label><Input value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} /></div>
              <Button onClick={handleCreate} className="w-full">Create Level</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {levels.map((level) => <LevelCard key={level.levelId} level={level} submissionCount={submissions.filter((s) => s.level === level.levelId).length} />)}
      </div>
    </div>
  );
}
