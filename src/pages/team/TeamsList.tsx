import { useEffect, useState } from "react";
import { teamService } from "@/services/teamService";
import { TeamCard } from "@/components/TeamCard";
import { Team } from "@/types";

export default function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([]);
  useEffect(() => { teamService.getAllTeams().then(setTeams); }, []);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">All Teams</h1><p className="text-muted-foreground">Browse participating teams</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => <TeamCard key={team.id} team={team} />)}
      </div>
    </div>
  );
}
