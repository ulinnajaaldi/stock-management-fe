import React from "react";

import { MoreHorizontal } from "lucide-react";

import { ProductUseCases } from "@/useCases/Product";

import { useConfirm } from "@/hooks/use-confirm";
import useModal from "@/hooks/use-modal";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ColumnAction = ({ id }: { id: string }) => {
  const { openDrawer, closeDrawer } = useModal();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are to delete this data. This action cannot be undone.",
  );

  const mutateDelete = ProductUseCases.useDelete(id);

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      mutateDelete.mutate(undefined, {
        onSuccess: () => {
          closeDrawer();
        },
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              openDrawer("sheet-detail", id);
            }}
          >
            Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              openDrawer("form-edit-category", id);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog />
    </>
  );
};

export default ColumnAction;
