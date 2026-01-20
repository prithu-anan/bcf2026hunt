import { useEffect, useState } from "react";
import { Users, Trophy, Clock, Activity } from "lucide-react";
import { StatsWidget } from "@/components/StatsWidget";
import { ProgressChart } from "@/components/ProgressChart";
import { teamService } from "@/services/teamService";
import { Team } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function AdminDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  useEffect(() => { teamService.getAllTeams().then(setTeams); }, []);

  const activeTeams = teams.filter((t) => t.progress.length > 0).length;
  const avgProgress = teams.length > 0 ? (teams.reduce((sum, t) => sum + t.progress.length, 0) / teams.length).toFixed(1) : "0";
  const levelDist = [1, 2, 3, 4].map((level) => ({ level: `L${level}`, count: teams.filter((t) => t.progress.some((p) => p.level === level)).length }));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-muted-foreground">Overview of the treasure hunt</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsWidget title="Total Teams" value={teams.length} icon={Users} />
        <StatsWidget title="Active Teams" value={activeTeams} icon={Activity} />
        <StatsWidget title="Avg. Progress" value={avgProgress} subtitle="levels completed" icon={Trophy} />
        <StatsWidget title="Inactive" value={teams.length - activeTeams} icon={Clock} />
      </div>
      <Card><CardHeader><CardTitle>Level Completion Distribution</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer><BarChart data={levelDist}><XAxis dataKey="level" tick={{ fill: "hsl(var(--muted-foreground))" }} /><YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} /><Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} /><Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
      {teams.length > 0 && <ProgressChart teams={teams} title="All Teams Progress" />}
    </div>
  );
}
