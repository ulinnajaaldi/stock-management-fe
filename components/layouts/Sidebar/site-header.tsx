"use client";

import { usePathname } from "next/navigation";

import { getRouteName } from "@/lib/route";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  const pathName = usePathname();

  const routeName = getRouteName(pathName);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex w-full items-center gap-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Ticket Management</h1>
        </div>
        <p className="shrink-0 text-sm font-medium">{routeName}</p>
      </div>
    </header>
  );
}
