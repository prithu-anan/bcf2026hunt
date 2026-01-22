import { useEffect, useMemo, useState } from "react";
import { TeamCard } from "@/components/TeamCard";
import { Team } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { getApiErrorMessage } from "@/utils/apiClient";
import { getTeams, registerUser, TeamRecord } from "@/utils/adminApi";
import { toast } from "sonner";
import { ADMIN_BASE_PATH } from "@/config/routes";

export default function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    password: "",
    token: "",
    role: "TEAM" as "TEAM" | "ADMIN",
  });

  const mappedTeams = useMemo(
    () =>
      teams.sort((a, b) => {
        const levelA = a.progress.length;
        const levelB = b.progress.length;
        return levelB - levelA;
      }),
    [teams]
  );

  const mapTeamRecord = (record: TeamRecord): Team => ({
    id: record.id,
    name: record.name,
    members: [],
    theme: "dark",
    progress: Array.from({ length: record.level_completed ?? 0 }, (_, index) => ({
      level: index + 1,
      timestamp: 0,
    })),
    createdAt: Date.now(),
  });

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const data = await getTeams();
      setTeams(data.map(mapTeamRecord));
    } catch (error) {
      toast.error("Failed to load teams", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      password: "",
      token: "",
      role: "TEAM",
    });
  };

  const handleCreate = async () => {
    if (!form.id || !form.name || !form.password || !form.token) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        id: form.id.trim(),
        name: form.name.trim(),
        password: form.password,
        token: form.token.trim(),
        role: form.role,
      });
      toast.success("Team created");
      resetForm();
      setOpen(false);
      await fetchTeams();
    } catch (error) {
      toast.error("Failed to create team", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">View and manage all teams</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-id">Team ID</Label>
                <Input
                  id="team-id"
                  placeholder="team05"
                  value={form.id}
                  onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  placeholder="Team Epsilon"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-password">Password</Label>
                <Input
                  id="team-password"
                  type="password"
                  placeholder="SecurePass123"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-token">Puzzle Token</Label>
                <Input
                  id="team-token"
                  placeholder="acbde"
                  value={form.token}
                  onChange={(e) => setForm((prev) => ({ ...prev, token: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(value: "TEAM" | "ADMIN") =>
                    setForm((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEAM">TEAM</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mappedTeams.map((team) => (
          <TeamCard key={team.id} team={team} basePath={ADMIN_BASE_PATH} />
        ))}
      </div>
    </div>
  );
}
