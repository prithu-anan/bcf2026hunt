import { useEffect, useState } from "react";
import { teamService } from "@/services/teamService";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { ProgressChart } from "@/components/ProgressChart";
import { Team, LeaderboardEntry } from "@/types";

export default function TeamLeaderboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    teamService.getAllTeams().then((data) => {
      setTeams(data);
      const sorted = [...data].sort((a, b) => {
        const aLevels = a.progress.length;
        const bLevels = b.progress.length;
        if (bLevels !== aLevels) return bLevels - aLevels;
        const aTime = a.progress.length > 0 ? Math.max(...a.progress.map((p) => p.timestamp)) : Infinity;
        const bTime = b.progress.length > 0 ? Math.max(...b.progress.map((p) => p.timestamp)) : Infinity;
        return aTime - bTime;
      });
      setEntries(sorted.map((team, i) => ({
        rank: i + 1,
        team,
        levelsCompleted: team.progress.length,
        lastCompletionTime: team.progress.length > 0 ? Math.max(...team.progress.map((p) => p.timestamp)) : 0,
      })));
    });
  }, []);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Leaderboard</h1><p className="text-muted-foreground">See how teams are progressing</p></div>
      <LeaderboardTable entries={entries} />
      {teams.length > 0 && <ProgressChart teams={teams} title="Team Progress Comparison" />}
    </div>
  );
}
