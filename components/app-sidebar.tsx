import Link from "next/link";

import { PlusIcon, SearchIcon } from "lucide-react";

import { navGroups } from "@/components/app-shared";
import { LogoIcon } from "@/components/logo";
import { NavGroup } from "@/components/nav-group";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenuButton asChild>
          <Link href="#link">
            <LogoIcon />
            <span className="text-sm font-semibold">Anvaya</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear hover:cursor-pointer"
              tooltip="Quick Create"
            >
              <PlusIcon />
              <span>New</span>
            </SidebarMenuButton>
            <Button
              aria-label="Search conversations"
              className="size-8 group-data-[collapsible=icon]:opacity-0 hover:cursor-pointer"
              size="icon"
              variant="outline"
            >
              <SearchIcon />
              <span className="sr-only">Search</span>
            </Button>
          </SidebarMenuItem>
        </SidebarGroup>

        {navGroups.map((group, index) => (
          <NavGroup key={`sidebar-group-${index}`} {...group} />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
