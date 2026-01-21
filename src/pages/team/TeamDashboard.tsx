import { useEffect, useState } from "react";
import { Target, Trophy } from "lucide-react";
import { StatsWidget } from "@/components/StatsWidget";
import { ProgressChart } from "@/components/ProgressChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { teamService } from "@/services/teamService";
import { levelService } from "@/services/levelService";
import { useAuth } from "@/contexts/AuthContext";
import { Team, Level } from "@/types";

export default function TeamDashboard() {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [totalLevels, setTotalLevels] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (user?.teamId) {
        const [teamData, levelNum, total] = await Promise.all([
          teamService.getTeamById(user.teamId),
          teamService.getCurrentLevel(user.teamId),
          levelService.getTotalLevels(),
        ]);
        setTeam(teamData);
        setTotalLevels(total);
        const level = await levelService.getLevelById(levelNum);
        setCurrentLevel(level);
      }
    };
    loadData();
  }, [user]);

  const completedLevels = team?.progress.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Team: {team?.name || "Loading..."}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatsWidget title="Current Level" value={completedLevels + 1} subtitle={currentLevel?.title} icon={Target} />
        <StatsWidget title="Completed" value={`${completedLevels}/${totalLevels}`} icon={Trophy} />
      </div>

      {currentLevel && (
        <Card>
          <CardHeader>
            <CardTitle>Current Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {currentLevel.image && (
                <img src={currentLevel.image} alt={currentLevel.title} className="w-full sm:w-48 h-32 object-cover rounded-lg" />
              )}
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">{currentLevel.title}</h3>
                <p className="text-sm text-muted-foreground">{currentLevel.description}</p>
                <Button asChild><Link to="/team/challenge">Solve Challenge →</Link></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {team && <ProgressChart teams={[team]} title="Your Progress" showLegend={false} />}
    </div>
  );
}
