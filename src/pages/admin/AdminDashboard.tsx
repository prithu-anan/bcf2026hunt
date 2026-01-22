import { useEffect, useState } from "react";
import { Users, Trophy, Target, Layers } from "lucide-react";
import { StatsWidget } from "@/components/StatsWidget";
import { ProgressChart } from "@/components/ProgressChart";
import { teamService } from "@/services/teamService";
import { levelService } from "@/services/levelService";
import { Team } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function AdminDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [totalLevels, setTotalLevels] = useState(0);
  
  useEffect(() => {
    teamService.getAllTeams().then(setTeams);
    levelService.getTotalLevels().then(setTotalLevels);
  }, []);

  const highestCompleted = teams.length > 0 ? Math.max(...teams.map((t) => t.progress.length)) : 0;
  const avgProgress = teams.length > 0 ? (teams.reduce((sum, t) => sum + t.progress.length, 0) / teams.length).toFixed(1) : "0";
  const levelDist = [1, 2, 3, 4].map((level) => ({ level: `C${level}`, count: teams.filter((t) => t.progress.some((p) => p.level === level)).length }));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-muted-foreground">Overview of the treasure hunt</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsWidget title="Total Teams" value={teams.length} icon={Users} />
        <StatsWidget title="Total Challenges" value={totalLevels} icon={Layers} />
        <StatsWidget title="Highest Completed" value={highestCompleted} icon={Target} />
        <StatsWidget title="Avg. Progress" value={avgProgress} subtitle="challenges completed" icon={Trophy} />
      </div>
      <Card><CardHeader><CardTitle>Challenge Completion Distribution</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer><BarChart data={levelDist}><XAxis dataKey="level" tick={{ fill: "hsl(var(--muted-foreground))" }} /><YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} /><Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} /><Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
      {teams.length > 0 && <ProgressChart teams={teams} title="All Teams Progress" />}
    </div>
  );
}
