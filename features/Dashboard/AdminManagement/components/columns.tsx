"use client";

import { ColumnDef } from "@tanstack/react-table";

import { UserServices } from "@/services/User";

import { UserUseCases } from "@/useCases/User";

import { DataTableColumnHeader } from "@/components/common/data-table-column-header";

import ColumnAction from "./column-action";

// Helper function to format role display
const formatRole = (role: string) => {
  switch (role) {
    case "admin":
      return "Admin";
    case "superadmin":
      return "Super Admin";
    default:
      return role;
  }
};

export type ResponseType =
  ReturnType<typeof UserUseCases.getAllAdmin> extends {
    data: { data: { data: (infer U)[] } } | undefined;
  }
    ? U
    : never;

export const columns: ColumnDef<ResponseType>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.original.role;
      return <span>{formatRole(role)}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ColumnAction teamId={row.original.id} />;
    },
  },
];
