import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { teamService } from "@/services/teamService";
import { ProgressChart } from "@/components/ProgressChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Team } from "@/types";

export default function TeamDetail() {
  const { teamId } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  useEffect(() => { if (teamId) teamService.getTeamById(teamId).then(setTeam); }, [teamId]);

  if (!team) return <div className="animate-pulse">Loading...</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">{team.name}</h1><p className="text-muted-foreground">{team.members.length} members • Level {team.progress.length}</p></div>
      <Card><CardHeader><CardTitle>Team Members</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{team.members.map((m, i) => <Badge key={i} variant="secondary">{m}</Badge>)}</div></CardContent></Card>
      <ProgressChart teams={[team]} title="Progress Timeline" showLegend={false} />
    </div>
  );
}
