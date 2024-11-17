"use client";

import { cn } from "@/lib/utils";
import { LayoutGrid, Shield, UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutGrid,
    variant: "ghost",
  },
  {
    title: "Upgrade",
    url: "/dashboard/upgrade",
    icon: Shield,
    variant: "ghost",
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: UserIcon,
    variant: "ghost",
  },
];

export function AppSidebarContent() {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive =
          item.url === pathname ||
          (pathname?.startsWith(item.url) && item.url !== "/dashboard");

        return (
          <div key={item.title}>
            <a
              href={item.url}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                "hover:bg-gray-100",
                isActive &&
                  "bg-primary/5 border border-primary/20 hover:bg-primary/15 transition-all"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </a>
          </div>
        );
      })}
    </>
  );
}
