import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { teamService } from "@/services/teamService";
import { ProgressChart } from "@/components/ProgressChart";
import { Team } from "@/types";

export default function TeamDetail() {
  const { teamId } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  useEffect(() => { if (teamId) teamService.getTeamById(teamId).then(setTeam); }, [teamId]);

  if (!team) return <div className="animate-pulse">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{team.name}</h1>
        <p className="text-muted-foreground">Level {team.progress.length}</p>
      </div>
      <ProgressChart teams={[team]} title="Progress Timeline" showLegend={false} />
    </div>
  );
}
