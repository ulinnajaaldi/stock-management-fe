import { IconFolder, IconUsers } from "@tabler/icons-react";

export const ROUTES = {
  AUTH: "/auth",
  HOME: "/",
  DASHBOARD: {
    ROOT: "/dashboard",
    ADMIN: "/dashboard/admin-management",
  },
};

export const SIDEBAR_SUPER_ADMIN = [
  {
    label: "Admin Management",
    url: ROUTES.DASHBOARD.ADMIN,
    icon: IconUsers,
  },
];

export const SIDEBAR_ADMIN = [
  {
    label: "Dashboard",
    url: ROUTES.DASHBOARD.ROOT,
    icon: IconFolder,
  },
];
