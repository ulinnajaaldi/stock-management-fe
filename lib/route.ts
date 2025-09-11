import { ROUTES } from "@/constants/routes";

export function getRouteName(pathname: string): string {
  switch (pathname) {
    case ROUTES.DASHBOARD.ROOT:
      return "Dashboard";
    case ROUTES.DASHBOARD.ADMIN:
      return "Admin Management";
    // case ROUTES.DASHBOARD.TICKET_EDIT(pathname.split("/")[3]):
    //   return "Edit Ticket";
    // case ROUTES.DASHBOARD.TICKET(pathname.split("/")[3]):
    //   return "Ticket Detail";
    default:
      return "";
  }
}
