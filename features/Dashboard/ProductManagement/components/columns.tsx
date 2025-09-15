"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ProductUseCases } from "@/useCases/Product";

import { DataTableColumnHeader } from "@/components/common/data-table-column-header";

import ColumnAction from "./column-action";

export type ResponseType =
  ReturnType<typeof ProductUseCases.useGetAll> extends {
    data: { data: { data: (infer U)[] } } | undefined;
  }
    ? U
    : never;

export const columns: ColumnDef<ResponseType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "category.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Description" />;
    },
    cell: ({ row }) => {
      const description = row.original.description;
      return <span>{description || "-"}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ColumnAction id={row.original.id} />;
    },
  },
];
