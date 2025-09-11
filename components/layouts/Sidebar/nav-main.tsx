"use client";

import { type Icon, IconDashboard } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/constants/routes";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function NavMain({
  items,
  isLoading,
}: {
  items: {
    label: string;
    url: string;
    icon?: Icon;
  }[];
  isLoading?: boolean;
}) {
  const pathName = usePathname();

  const isActive = (url: string) => {
    // exclude /dashboard from start of url
    const baseUrl = url.replace(ROUTES.DASHBOARD.ROOT, "");
    const currentUrl = pathName.replace(ROUTES.DASHBOARD.ROOT, "");
    return baseUrl === currentUrl || currentUrl.startsWith(baseUrl);
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem key="Dashboard">
              <SidebarMenuButton
                tooltip="Dashboard"
                isActive={ROUTES.DASHBOARD.ROOT === pathName}
                asChild
              >
                <Link href={ROUTES.DASHBOARD.ROOT}>
                  <IconDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {isLoading
              ? Array.from({ length: 2 }, (_, index) => (
                  <Skeleton key={index} className="h-8 w-full rounded-md" />
                ))
              : items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={isActive(item.url)}
                      asChild
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
