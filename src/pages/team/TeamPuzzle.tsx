import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { teamService } from "@/services/teamService";
import { levelService } from "@/services/levelService";
import { submissionService } from "@/services/submissionService";
import { PuzzleViewer } from "@/components/PuzzleViewer";
import { PDFViewer } from "@/components/PDFViewer";
import { SubmissionInput } from "@/components/SubmissionInput";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Level } from "@/types";
import { Trophy } from "lucide-react";

export default function TeamPuzzle() {
  const { user } = useAuth();
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [levelNum, setLevelNum] = useState(1);
  const [totalLevels, setTotalLevels] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const loadLevel = async () => {
    if (user?.teamId) {
      const [num, total] = await Promise.all([
        teamService.getCurrentLevel(user.teamId),
        levelService.getTotalLevels(),
      ]);
      setLevelNum(num);
      setTotalLevels(total);
      if (num > total) {
        setIsComplete(true);
      } else {
        const level = await levelService.getLevelById(num);
        setCurrentLevel(level);
      }
    }
  };

  useEffect(() => { loadLevel(); }, [user]);

  const handleSubmit = async (answer: string): Promise<boolean> => {
    if (!user?.teamId || !currentLevel) return false;
    const { isCorrect } = await submissionService.submitAnswer(user.teamId, currentLevel.levelId, answer);
    if (isCorrect) {
      setTimeout(() => loadLevel(), 1500);
    }
    return isCorrect;
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="gradient-accent rounded-full p-6 glow-accent">
          <Trophy className="h-16 w-16 text-accent-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-gradient-accent">Congratulations!</h1>
        <p className="text-muted-foreground max-w-md">You've completed all puzzles! Check the leaderboard to see your final ranking.</p>
      </div>
    );
  }

  if (!currentLevel) {
    return <div className="flex items-center justify-center min-h-[40vh]"><div className="animate-pulse">Loading puzzle...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{currentLevel.title}</h1>
          <p className="text-muted-foreground">Solve this puzzle to advance</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-1">Level {levelNum}/{totalLevels}</Badge>
      </div>

      {currentLevel.description && (
        <Card><CardContent className="pt-4"><p className="text-muted-foreground">{currentLevel.description}</p></CardContent></Card>
      )}

      <PuzzleViewer image={currentLevel.image} title="Puzzle Image" />
      {currentLevel.attachment && <PDFViewer url={currentLevel.attachment} title="Puzzle Attachment" />}
      <SubmissionInput onSubmit={handleSubmit} />
    </div>
  );
}
