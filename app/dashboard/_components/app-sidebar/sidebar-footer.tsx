"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AppCredits } from "./app-credits";
import { AppProfile } from "./app-profile";

export function AppSidebarFooter() {
  return (
    <div className="space-y-2">
      {/* Create new button */}
      <Button
        asChild
        className="w-full bg-primary text-primary-foreground hover:bg-primary/95 hover:text-primary-foreground/95 transition-all text-xs"
      >
        <a href="/dashboard/create">
          <Plus className="h-3 w-3" />
          <span>Create new</span>
        </a>
      </Button>

      {/* Credits card */}
      <AppCredits />

      {/* User profile */}
      <AppProfile />
    </div>
  );
}
