import { useEffect, useState } from "react";
import { ChallengeViewer } from "@/components/ChallengeViewer";
import { SubmissionInput } from "@/components/SubmissionInput";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  getCurrentPuzzle,
  submitAnswer,
  type PuzzleResponse,
} from "@/utils/puzzleApi";
import { getApiErrorMessage } from "@/utils/apiClient";

export default function TeamChallenge() {
  const [puzzle, setPuzzle] = useState<PuzzleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const loadPuzzle = async () => {
    setIsLoading(true);
    setImageError(false);
    try {
      const data = await getCurrentPuzzle();
      setPuzzle(data);
    } catch (error) {
      toast.error("Failed to load challenge", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPuzzle();
  }, []);

  const handleSubmit = async (answer: string): Promise<boolean> => {
    try {
      const result = await submitAnswer(answer);

      if (result.success) {
        toast.success("Correct!", {
          description: result.message || "Moving to next level...",
        });
        // Reload puzzle after a short delay
        setTimeout(() => {
          loadPuzzle();
        }, 1500);
        return true;
      } else {
        toast.error("Wrong answer", {
          description: result.error || "Try again!",
        });
        return false;
      }
    } catch (error) {
      toast.error("Submission failed", {
        description: getApiErrorMessage(error),
      });
      return false;
    }
  };

  const isComplete = puzzle && "completed" in puzzle;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="gradient-accent rounded-full p-6 glow-accent">
          <Trophy className="h-16 w-16 text-accent-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-gradient-accent">Congratulations!</h1>
        <p className="text-muted-foreground max-w-md">
          You've completed all challenges! Check the leaderboard to see your final ranking.
        </p>
        <p className="text-sm text-muted-foreground">
          Final Level: {puzzle.level}
        </p>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">No puzzle available</p>
      </div>
    );
  }

  const currentPuzzle = puzzle as { level: number; puzzle_link: string; puzzle_type: string };
  // puzzle_link now contains data URI or external URL directly - no additional fetching needed
  const imageUrl = currentPuzzle.puzzle_link;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Challenge</h1>
          <p className="text-muted-foreground">Solve this puzzle to advance</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-1">
          Level {currentPuzzle.level}
        </Badge>
      </div>

      {currentPuzzle.puzzle_type && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-muted-foreground">
              <span className="font-medium">Type:</span> {currentPuzzle.puzzle_type}
            </p>
          </CardContent>
        </Card>
      )}

      {imageUrl && !imageError ? (
        <ChallengeViewer 
          image={imageUrl} 
          title="Puzzle Image" 
          onError={() => setImageError(true)}
        />
      ) : imageUrl ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-muted p-4">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Puzzle image unavailable</p>
                <p className="text-sm text-muted-foreground">
                  The image couldn't be loaded. Please contact an admin if this persists.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <SubmissionInput onSubmit={handleSubmit} />
    </div>
  );
}
