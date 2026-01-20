import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";

interface PDFViewerProps {
  url: string;
  title?: string;
}

export function PDFViewer({ url, title = "Attachment" }: PDFViewerProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {title}
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open
          </a>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden border bg-muted">
          <iframe
            src={url}
            title={title}
            className="w-full h-96"
            style={{ border: "none" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
