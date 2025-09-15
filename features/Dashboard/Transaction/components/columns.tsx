"use client";

import { ColumnDef } from "@tanstack/react-table";

import { TransactionUseCases } from "@/useCases/Transactions";

import { cn } from "@/lib/utils";

import { DataTableColumnHeader } from "@/components/common/data-table-column-header";

export type ResponseType =
  ReturnType<typeof TransactionUseCases.useGetHistory> extends {
    data: { data: { data: (infer U)[] } } | undefined;
  }
    ? U
    : never;

export const columns: ColumnDef<ResponseType>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const typeLabel = type === "stock_in" ? "Stock In" : "Stock Out";
      return (
        <span
          className={cn(
            "text-sm font-semibold capitalize",
            type === "stock_in" ? "text-green-600" : "text-red-600",
          )}
        >
          {typeLabel}
        </span>
      );
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Notes" />;
    },
  },
  {
    accessorKey: "items",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Transaction Product" />
      );
    },
    cell: ({ row }) => {
      const items = row.original.items;
      const type = row.original.type;
      return (
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between gap-1 rounded-md border px-2 py-1",
                type === "stock_in"
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50",
              )}
            >
              <p>{item.product.name}</p>
              <p>
                {type === "stock_in" ? "+" : "-"}
                {item.quantity}
              </p>
            </div>
          ))}
        </div>
      );
    },
  },
];
