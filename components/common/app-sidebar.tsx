"use client";

import * as React from "react";

import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  IconBrandGithub,
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import { BookOpen, LogOut, Moon, Sun } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import Logout from "@/module/auth/components/logout";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Repository",
      url: "/dashboard/repository",
      icon: IconBrandGithub,
    },
    {
      title: "Review",
      url: "/dashboard/review",
      icon: BookOpen,
    },
    {
      title: "Subscription",
      url: "/dashboard/subscription",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const pathName = usePathname();

  const { data: session } = useSession();

  const isActive = (url: string) => {
    return pathName === url || pathName.startsWith(url + "/dashboard");
  };

  if (!mounted || !session) return null;

  const user = session.user;
  const userName = user.name || "GUEST";
  const userEmail = user.email || "";
  const userAvatar = user.image || "";

  // rushi tele dev --> RTD
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b">
        <div className="flex flex-col gap-4 px-2 py-6">
          <div className="bg-sidebar-accent/50 hover:bg-sidebar-accent/70 flex items-center gap-4 rounded-lg px-3 py-4">
            <div className="bg-primary text-primary-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
              <IconBrandGithub className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground text-xs font-semibold tracking-wide">
                Connected Accounts
              </p>
              <p className="text-sidebar-foreground/90 text-sm font-medium">
                @{userName}
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-col gap-1 px-3 py-6">
        <div className="mb-2">
          <p className="text-sidebar-foreground/60 mb-3 px-3 text-xs font-semibold tracking-widest uppercase">
            Menu
          </p>
        </div>
        <SidebarMenu className="gap-2">
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={`h-11 rounded-lg px-4 transition-all duration-200 ${
                  isActive(item.url)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "hover:bg-sidebar-accent/60 text-sidebar-foreground"
                }`}
              >
                <Link href={item.url} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size={"lg"}
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 h-12 rounded-lg px-4 transition-colors"
                >
                  <Avatar className="h-10 w-10 shrink-0 rounded-lg">
                    <AvatarImage
                      src={userAvatar || "/placeholder.svg"}
                      alt={userName}
                    />
                    <AvatarFallback className="rounded-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1 text-left text-sm leading-relaxed">
                    <span className="truncate text-base font-semibold">
                      {userName}
                    </span>
                    <span className="text-sidebar-foreground/70 truncate text-xs">
                      {userEmail}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-80 rounded-lg"
                align="end"
                side="right"
                sideOffset={8}
              >
                <div className="border-t border-b px-2 py-3">
                  <DropdownMenuItem asChild>
                    <button
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="hover:bg-sidebar-accent/50 flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors"
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="h-5 w-5 shrink-0" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="h-5 w-5 shrink-0" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="my-1 cursor-pointer rounded-md px-3 py-3 font-medium transition-colors hover:bg-red-500/10 hover:text-red-600">
                    <LogOut className="mr-3 h-5 w-5 shrink-0" />
                    <Logout>Sign Out</Logout>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
