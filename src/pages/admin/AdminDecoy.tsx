import { Card, CardContent } from "@/components/ui/card";

export default function AdminDecoy() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <img
            src="https://i.imgflip.com/1ur9b0.jpg"
            alt="Nice try"
            className="w-full rounded-lg"
          />
          <p className="text-lg font-medium text-muted-foreground">
            Nothing to see here... 👀
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
