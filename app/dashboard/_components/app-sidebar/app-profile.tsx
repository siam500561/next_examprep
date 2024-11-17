"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Image from "next/image";

export function AppProfile() {
  const { openUserProfile, signOut } = useClerk();
  const { user, isLoaded } = useUser();

  return (
    <div className="space-y-1">
      <div
        role="button"
        onClick={() => openUserProfile()}
        className="p-3 h-[60px] flex items-center gap-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
      >
        <div className="relative h-8 w-8 flex-shrink-0 rounded-full overflow-hidden bg-muted">
          {isLoaded ? (
            user?.imageUrl && (
              <Image
                src={user.imageUrl}
                alt={user?.fullName || "User"}
                fill
                className="object-cover"
              />
            )
          ) : (
            <Skeleton className="h-full w-full rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          {isLoaded ? (
            <>
              <p className="text-sm font-medium truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.emailAddresses[0]?.emailAddress || ""}
              </p>
            </>
          ) : (
            <>
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[160px]" />
            </>
          )}
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="w-full p-2 text-xs text-destructive flex items-center justify-center gap-2 rounded-lg bg-destructive/5 transition-all">
            <LogOut className="h-3 w-3" />
            Sign out
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to sign out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => signOut()}
              className="bg-destructive hover:bg-destructive/90"
            >
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
