import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmissionInputProps {
  onSubmit: (answer: string) => Promise<boolean>;
  disabled?: boolean;
}

export function SubmissionInput({
  onSubmit,
  disabled = false,
}: SubmissionInputProps) {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const isCorrect = await onSubmit(answer.trim());
      setResult(isCorrect ? "success" : "error");
      if (isCorrect) {
        setAnswer("");
      }
    } catch (error) {
      setResult("error");
    } finally {
      setIsSubmitting(false);
    }

    // Clear result after 3 seconds
    setTimeout(() => setResult(null), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Submit Your Answer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              disabled={disabled || isSubmitting}
              className={cn(
                "flex-1",
                result === "success" && "border-green-500",
                result === "error" && "border-destructive"
              )}
            />
            <Button type="submit" disabled={disabled || isSubmitting || !answer.trim()}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Inline feedback */}
          {result && (
            <div
              className={cn(
                "flex items-center gap-2 text-sm p-2 rounded-lg",
                result === "success"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {result === "success" ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Correct! Moving to next level...</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Incorrect answer. Try again!</span>
                </>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
