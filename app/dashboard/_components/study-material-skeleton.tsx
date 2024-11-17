import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StudyMaterialSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-5 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-6 w-[80%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-28" />
      </CardFooter>
    </Card>
  );
}
