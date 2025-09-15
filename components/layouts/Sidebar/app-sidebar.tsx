"use client";

import * as React from "react";

import { IconInnerShadowTop } from "@tabler/icons-react";
import Cookies from "js-cookie";

import { AuthUseCases } from "@/useCases/Auth";

import { useAuthStore } from "@/hooks/use-auth";

import { ACCESS_TOKEN } from "@/constants/config";
import { ROUTES, SIDEBAR_ADMIN, SIDEBAR_SUPER_ADMIN } from "@/constants/routes";

import { ButtonTheme } from "@/components/common/button-theme";
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

import FormEditAdmin from "./form-edit";
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
      if (!queryMe.data.first_name) {
        Cookies.remove(ACCESS_TOKEN);
        window.location.href = ROUTES.HOME;
      }
    }
  }, [queryMe.isSuccess, queryMe.data, setData]);

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu className="flex flex-row items-center justify-between gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="#">
                  <IconInnerShadowTop className="!size-5" />
                  <span className="text-base font-semibold">
                    Ulinnaja Aldi.
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <ButtonTheme />
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
      <FormEditAdmin />
    </>
  );
}
