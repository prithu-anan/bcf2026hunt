import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";
import { Level, Team } from "@/types";

interface Filters {
  level?: number;
  isCorrect?: boolean;
  startTime?: number;
  endTime?: number;
  teamId?: string;
}

interface FiltersPanelProps {
  levels: Level[];
  teams?: Team[];
  onFiltersChange: (filters: Filters) => void;
}

export function FiltersPanel({
  levels,
  teams,
  onFiltersChange,
}: FiltersPanelProps) {
  const [filters, setFilters] = useState<Filters>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Level filter */}
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={filters.level?.toString() || ""}
                onValueChange={(v) =>
                  updateFilter("level", v ? parseInt(v) : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem
                      key={level.levelId}
                      value={level.levelId.toString()}
                    >
                      Level {level.levelId}: {level.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Team filter (if teams provided) */}
            {teams && (
              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Select
                  value={filters.teamId || ""}
                  onValueChange={(v) =>
                    updateFilter("teamId", v || undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All teams</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Correctness filter */}
            <div className="space-y-2">
              <Label htmlFor="correctness">Result</Label>
              <Select
                value={
                  filters.isCorrect === undefined
                    ? ""
                    : filters.isCorrect
                    ? "correct"
                    : "incorrect"
                }
                onValueChange={(v) =>
                  updateFilter(
                    "isCorrect",
                    v === "" ? undefined : v === "correct"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All results" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All results</SelectItem>
                  <SelectItem value="correct">Correct only</SelectItem>
                  <SelectItem value="incorrect">Incorrect only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time filter - simplified */}
            <div className="space-y-2">
              <Label htmlFor="time">Time Range</Label>
              <Select
                onValueChange={(v) => {
                  const now = Date.now();
                  const hour = 3600000;
                  switch (v) {
                    case "1h":
                      updateFilter("startTime", now - hour);
                      break;
                    case "3h":
                      updateFilter("startTime", now - 3 * hour);
                      break;
                    case "6h":
                      updateFilter("startTime", now - 6 * hour);
                      break;
                    case "24h":
                      updateFilter("startTime", now - 24 * hour);
                      break;
                    default:
                      updateFilter("startTime", undefined);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All time</SelectItem>
                  <SelectItem value="1h">Last hour</SelectItem>
                  <SelectItem value="3h">Last 3 hours</SelectItem>
                  <SelectItem value="6h">Last 6 hours</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
