import {
  IconBrandProducthunt,
  IconCategory,
  IconMoneybag,
  IconUsers,
} from "@tabler/icons-react";

export const ROUTES = {
  HOME: "/",
  DASHBOARD: {
    ROOT: "/dashboard",
    ADMIN: "/dashboard/admin-management",
    CATEGORY: "/dashboard/categories-management",
    PRODUCT: "/dashboard/product-management",
    TRANSACTION: "/dashboard/transaction",
  },
};

export const SIDEBAR_SUPER_ADMIN = [
  {
    label: "Admin Management",
    url: ROUTES.DASHBOARD.ADMIN,
    icon: IconUsers,
  },
  {
    label: "Category",
    url: ROUTES.DASHBOARD.CATEGORY,
    icon: IconCategory,
  },
  {
    label: "Product",
    url: ROUTES.DASHBOARD.PRODUCT,
    icon: IconBrandProducthunt,
  },
  {
    label: "Transactions",
    url: ROUTES.DASHBOARD.TRANSACTION,
    icon: IconMoneybag,
  },
];

export const SIDEBAR_ADMIN = [
  {
    label: "Category",
    url: ROUTES.DASHBOARD.CATEGORY,
    icon: IconCategory,
  },
  {
    label: "Product",
    url: ROUTES.DASHBOARD.PRODUCT,
    icon: IconBrandProducthunt,
  },
  {
    label: "Transactions",
    url: ROUTES.DASHBOARD.TRANSACTION,
    icon: IconMoneybag,
  },
];
