import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RotateCw } from "lucide-react";

interface ChallengeViewerProps {
  image: string;
  title: string;
  onError?: () => void;
}

export function ChallengeViewer({ image, title, onError }: ChallengeViewerProps) {
  const [rotation, setRotation] = useState(0);

  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  // Generate download filename
  const getDownloadFilename = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    return `puzzle-${timestamp}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={image} download={getDownloadFilename()}>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-center overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-auto rounded-lg transition-transform duration-200"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "center center",
            }}
            onError={onError}
          />
        </div>
      </CardContent>
    </Card>
  );
}
