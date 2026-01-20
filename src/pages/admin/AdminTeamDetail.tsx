import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { teamService } from "@/services/teamService";
import { submissionService } from "@/services/submissionService";
import { levelService } from "@/services/levelService";
import { ProgressChart } from "@/components/ProgressChart";
import { FiltersPanel } from "@/components/FiltersPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Team, Submission, Level } from "@/types";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminTeamDetail() {
  const { teamId } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (teamId) {
      teamService.getTeamById(teamId).then(setTeam);
      submissionService.getSubmissionsByTeam(teamId).then(setSubmissions);
      levelService.getAllLevels().then(setLevels);
    }
  }, [teamId]);

  const filteredSubs = submissions.filter((s) => {
    const f = filters as any;
    if (f.level !== undefined && s.level !== f.level) return false;
    if (f.isCorrect !== undefined && s.isCorrect !== f.isCorrect) return false;
    if (f.startTime && s.timestamp < f.startTime) return false;
    return true;
  });

  if (!team) return <div className="animate-pulse">Loading...</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">{team.name}</h1><p className="text-muted-foreground">{team.members.length} members</p></div>
      <Card><CardHeader><CardTitle>Members</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{team.members.map((m, i) => <Badge key={i} variant="secondary">{m}</Badge>)}</div></CardContent></Card>
      <ProgressChart teams={[team]} title="Progress" showLegend={false} />
      <FiltersPanel levels={levels} onFiltersChange={setFilters} />
      <Card><CardHeader><CardTitle>Submission History ({filteredSubs.length})</CardTitle></CardHeader><CardContent className="px-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead className="pl-6">Level</TableHead><TableHead>Answer</TableHead><TableHead>Result</TableHead><TableHead className="pr-6">Time</TableHead></TableRow></TableHeader><TableBody>{filteredSubs.map((s) => (<TableRow key={s.id}><TableCell className="pl-6">Level {s.level}</TableCell><TableCell className="font-mono">{s.submittedAnswer}</TableCell><TableCell>{s.isCorrect ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-destructive" />}</TableCell><TableCell className="pr-6 text-muted-foreground">{new Date(s.timestamp).toLocaleTimeString()}</TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
    </div>
  );
}
