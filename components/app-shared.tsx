import type { ReactNode } from "react";

import { IconBrandGithub } from "@tabler/icons-react";
import {
  ActivityIcon,
  CreditCard,
  HelpCircleIcon,
  LayoutGridIcon,
  SettingsIcon,
  Sparkles,
} from "lucide-react";

export type SidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <LayoutGridIcon />,
        isActive: true,
      },
      {
        title: "Repository",
        path: "/dashboard/repository",
        icon: <IconBrandGithub />,
      },
      {
        title: "Review",
        path: "/dashboard/reviews",
        icon: <Sparkles />,
      },
      {
        title: "Subscription",
        path: "/dashboard/subscription",
        icon: <CreditCard />,
      },
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <SettingsIcon />,
      },
    ],
  },
];

export const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Help Center",
    path: "#/help",
    icon: <HelpCircleIcon />,
  },
  {
    title: "System status",
    path: "#/status",
    icon: <ActivityIcon />,
  },
];

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item]
    )
  ),
  ...footerNavLinks,
];
