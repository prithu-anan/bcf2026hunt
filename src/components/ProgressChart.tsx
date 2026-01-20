import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from "@/types";

interface ProgressChartProps {
  teams: Team[];
  title?: string;
  showLegend?: boolean;
}

const COLORS = [
  "hsl(187, 94%, 50%)",
  "hsl(45, 93%, 50%)",
  "hsl(262, 83%, 58%)",
  "hsl(142, 76%, 36%)",
  "hsl(0, 84%, 60%)",
];

export function ProgressChart({
  teams,
  title = "Progress Over Time",
  showLegend = true,
}: ProgressChartProps) {
  // Transform data for chart
  const allTimestamps = new Set<number>();
  teams.forEach((team) => {
    team.progress.forEach((p) => allTimestamps.add(p.timestamp));
  });

  const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

  const chartData = sortedTimestamps.map((timestamp) => {
    const point: Record<string, any> = {
      time: new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp,
    };

    teams.forEach((team) => {
      const progressAtTime = team.progress
        .filter((p) => p.timestamp <= timestamp)
        .length;
      point[team.name] = progressAtTime;
    });

    return point;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="time"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                label={{
                  value: "Levels",
                  angle: -90,
                  position: "insideLeft",
                  fill: "hsl(var(--muted-foreground))",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              {showLegend && <Legend />}
              {teams.map((team, index) => (
                <Line
                  key={team.id}
                  type="monotone"
                  dataKey={team.name}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: COLORS[index % COLORS.length] }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
