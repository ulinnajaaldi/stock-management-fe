import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const useConfirm = (
  title: string,
  message: string,
): [() => React.ReactElement, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent showCloseButton={false} className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
          <div className="w-full space-y-5">
            <p className="text-muted-foreground text-center text-sm">
              {message}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
