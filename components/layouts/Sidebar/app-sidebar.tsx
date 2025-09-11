"use client";

import * as React from "react";

import { IconInnerShadowTop } from "@tabler/icons-react";

import { AuthUseCases } from "@/useCases/Auth";

import { useAuthStore } from "@/hooks/use-auth";

import { SIDEBAR_ADMIN, SIDEBAR_SUPER_ADMIN } from "@/constants/routes";

import { NavMain } from "@/components/layouts/Sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

import NavUser from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [sidebar, setSidebar] = React.useState<
    typeof SIDEBAR_ADMIN | typeof SIDEBAR_SUPER_ADMIN
  >([]);

  const { setData } = useAuthStore();
  const queryMe = AuthUseCases.useGetProfile();

  React.useEffect(() => {
    if (queryMe.data) {
      setData(queryMe.data);
      switch (queryMe.data.role) {
        case "superadmin":
          setSidebar(SIDEBAR_SUPER_ADMIN);
          break;
        case "admin":
          setSidebar(SIDEBAR_ADMIN);
          break;
        default:
          setSidebar(SIDEBAR_ADMIN);
      }
    }
  }, [queryMe.isSuccess, queryMe.data, setData]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebar} isLoading={queryMe.isLoading} />
      </SidebarContent>
      <SidebarFooter>
        {queryMe.isLoading ? (
          <Skeleton className="h-12 w-full bg-neutral-200" />
        ) : (
          <NavUser user={queryMe.data ?? null} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
