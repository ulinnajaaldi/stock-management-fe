import React from "react";

import useModal from "@/hooks/use-modal";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import { useProductManagement } from "../hook";

const SheetDetail = () => {
  const { isOpen, type, id, closeDrawer } = useModal();
  const { queryProductById } = useProductManagement();

  return (
    <Sheet
      open={isOpen && type === "sheet-detail" && id !== undefined}
      onOpenChange={closeDrawer}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detail Product</SheetTitle>
          <SheetDescription>
            This is detail product of the system.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          {queryProductById.isLoading ? (
            <div>
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-3">
                <p className="text-sm font-semibold">Name</p>
                <p className="col-span-2 text-sm">
                  : {queryProductById.data?.name}
                </p>
              </div>
              <div className="grid grid-cols-3">
                <p className="text-sm font-semibold">Category</p>
                <p className="col-span-2 text-sm">
                  : {queryProductById.data?.category.name}
                </p>
              </div>
              <div className="grid grid-cols-3">
                <p className="text-sm font-semibold">Stock</p>
                <p className="col-span-2 text-sm">
                  : {queryProductById.data?.stock}
                </p>
              </div>
              <div className="grid grid-cols-3">
                <p className="text-sm font-semibold">Image</p>
                <div className="relative col-span-2 w-full">
                  <img
                    src={queryProductById.data?.image}
                    alt={queryProductById.data?.name}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3">
                <p className="text-sm font-semibold">Description</p>
                <p className="col-span-2 text-sm">
                  : {queryProductById.data?.description || "-"}
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetDetail;
