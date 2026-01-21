import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Image } from "lucide-react";
import { Level } from "@/types";
import { Link } from "react-router-dom";

interface LevelCardProps {
  level: Level;
  submissionCount?: number;
  basePath?: string;
}

export function LevelCard({
  level,
  submissionCount = 0,
  basePath = "/admin",
}: LevelCardProps) {
  return (
    <Link to={`${basePath}/levels/${level.levelId}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full overflow-hidden">
        {level.image && (
          <div className="aspect-video relative overflow-hidden bg-muted">
            <img
              src={level.image}
              alt={level.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge className="bg-primary/90">Level {level.levelId}</Badge>
            </div>
          </div>
        )}
        <CardHeader className={level.image ? "pb-2" : "pb-2"}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{level.title}</h3>
            {!level.image && (
              <Badge className="bg-primary/90">Level {level.levelId}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {level.image && (
              <div className="flex items-center gap-1">
                <Image className="h-4 w-4" />
                <span>Image</span>
              </div>
            )}
            {level.attachment && (
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </div>
            )}
            {submissionCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {submissionCount} submissions
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
