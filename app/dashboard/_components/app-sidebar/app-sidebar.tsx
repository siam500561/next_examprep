"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebarContent } from "./sidebar-content";
import { AppSidebarFooter } from "./sidebar-footer";
import { AppSidebarHeader } from "./sidebar-header";

export function AppSidebar() {
  return (
    <SidebarProvider className="w-fit">
      <Sidebar className="border-none">
        <SidebarHeader className="p-4">
          <AppSidebarHeader />
        </SidebarHeader>

        <SidebarContent className="flex justify-center">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <AppSidebarContent />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-2">
          <AppSidebarFooter />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
