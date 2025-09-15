import React from "react";

import useModal from "@/hooks/use-modal";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCategoriesManagement } from "../hook";

const FormEdit = () => {
  const { closeDrawer, isOpen, type, id } = useModal();

  const { form, mutationUpdate, onSubmitUpdate } = useCategoriesManagement();

  return (
    <Dialog
      open={isOpen && type === "form-edit-category" && id !== undefined}
      onOpenChange={closeDrawer}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Edit Category</DialogTitle>
        <DialogDescription>
          Fill the form below to edit the category details.
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="mx-auto flex w-full max-w-3xl flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Furniture" type="text" {...field} />
                  </FormControl>
                  <FormDescription>This is category name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Lorem Ipsum.."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is for category description
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={mutationUpdate.isPending}
                onClick={closeDrawer}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutationUpdate.isPending}>
                {mutationUpdate.isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FormEdit;
