import Link from "next/link";

import type { SidebarNavGroup } from "@/components/app-shared";
import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavGroup({ label, items }: SidebarNavGroup) {
  return (
    <SidebarGroup className="mt-1">
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            asChild
            className="group/collapsible"
            defaultOpen={
              !!item.isActive || item.subItems?.some((i) => !!i.isActive)
            }
            key={item.title}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                className="mb-2"
              >
                <Link href={item.path ?? "/"}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
