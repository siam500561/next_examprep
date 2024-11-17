"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const refresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={refresh}
      disabled={isRefreshing}
    >
      <RefreshCw className={`size-3 ${isRefreshing ? "animate-spin" : ""}`} />
      Refresh
    </Button>
  );
}
