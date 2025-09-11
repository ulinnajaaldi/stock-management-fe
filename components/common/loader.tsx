import React from "react";

import { LoaderCircle } from "lucide-react";

export const LoaderTable = () => {
  return (
    <div className="flex h-[20vh] animate-pulse items-center justify-center rounded-md bg-neutral-100">
      <LoaderCircle className="size-6 animate-spin text-neutral-800" />
    </div>
  );
};
