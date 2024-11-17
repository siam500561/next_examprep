"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function AppCredits() {
  return (
    <Card className="shadow-none bg-primary/5">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium">
          Available Credits : 5
        </CardTitle>
        <Progress value={20} className="h-1 mt-2" />
        <CardDescription className="mt-1 text-xs text-muted-foreground">
          1 Out of 5 Credits Used
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Button variant="link" className="h-auto p-0 text-xs text-primary">
          Upgrade to create more
        </Button>
      </CardContent>
    </Card>
  );
}
