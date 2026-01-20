import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { levelService } from "@/services/levelService";
import { submissionService } from "@/services/submissionService";
import { teamService } from "@/services/teamService";
import { PuzzleViewer } from "@/components/PuzzleViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Level, Submission, Team } from "@/types";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminLevelDetail() {
  const { levelId } = useParams();
  const [level, setLevel] = useState<Level | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (levelId) {
      levelService.getLevelById(parseInt(levelId)).then(setLevel);
      submissionService.getSubmissionsByLevel(parseInt(levelId)).then(setSubmissions);
      teamService.getAllTeams().then(setTeams);
    }
  }, [levelId]);

  if (!level) return <div className="animate-pulse">Loading...</div>;

  const getTeamName = (teamId: string) => teams.find((t) => t.id === teamId)?.name || teamId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">{level.title}</h1><p className="text-muted-foreground">Level {level.levelId}</p></div>
        <Badge>Answer: {level.correctAnswer}</Badge>
      </div>
      <PuzzleViewer image={level.image} title="Puzzle Image" />
      <Card><CardHeader><CardTitle>Submissions ({submissions.length})</CardTitle></CardHeader><CardContent className="px-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead className="pl-6">Team</TableHead><TableHead>Answer</TableHead><TableHead>Result</TableHead><TableHead className="pr-6">Time</TableHead></TableRow></TableHeader><TableBody>{submissions.map((s) => (<TableRow key={s.id}><TableCell className="pl-6">{getTeamName(s.teamId)}</TableCell><TableCell className="font-mono">{s.submittedAnswer}</TableCell><TableCell>{s.isCorrect ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-destructive" />}</TableCell><TableCell className="pr-6 text-muted-foreground">{new Date(s.timestamp).toLocaleTimeString()}</TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
    </div>
  );
}
