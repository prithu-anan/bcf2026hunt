import { useEffect, useState, useRef } from "react";
import { levelService } from "@/services/levelService";
import { submissionService } from "@/services/submissionService";
import { LevelCard } from "@/components/LevelCard";
import { Level, Submission } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLevels() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", correctAnswer: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    levelService.getAllLevels().then(setLevels);
    submissionService.getAllSubmissions().then(setSubmissions);
  }, []);

  const handleCreate = async () => {
    // For now, convert files to object URLs (in real app, would upload to storage)
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : undefined;
    const attachmentUrl = attachmentFile ? URL.createObjectURL(attachmentFile) : undefined;
    
    await levelService.createLevel({
      title: form.title,
      image: imageUrl,
      attachment: attachmentUrl,
      correctAnswer: form.correctAnswer,
    });
    const updated = await levelService.getAllLevels();
    setLevels(updated);
    setOpen(false);
    setForm({ title: "", correctAnswer: "" });
    setImageFile(null);
    setAttachmentFile(null);
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
              <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              
              <div className="space-y-2">
                <Label>Image (optional)</Label>
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
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setImageFile(null)}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => imageInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />Choose Image
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>Attachment (optional)</Label>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                />
                {attachmentFile ? (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <span className="text-sm truncate flex-1">{attachmentFile.name}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAttachmentFile(null)}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => attachmentInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />Choose File
                  </Button>
                )}
              </div>

              <div className="space-y-2"><Label>Correct Answer</Label><Input value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} /></div>
              <Button onClick={handleCreate} className="w-full">Create Challenge</Button>
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
