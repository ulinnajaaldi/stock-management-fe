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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { useProductManagement } from "../hook";

const FormEdit = () => {
  const { closeDrawer, isOpen, type, id } = useModal();

  const {
    form,
    mutationUpdate,
    onSubmitUpdate,
    queryCategories,
    queryProduct,
  } = useProductManagement();

  return (
    <Dialog
      open={isOpen && type === "form-edit-category" && id !== undefined}
      onOpenChange={closeDrawer}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogDescription>
          Fill the form below to edit the product in the system.
        </DialogDescription>

        {queryProduct.isLoading ? (
          <div className="flex justify-center py-8">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        ) : (
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
                      <Input
                        disabled
                        placeholder="Furniture"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is Product name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {queryCategories.isLoading ? (
                <Skeleton className="h-10 w-full rounded-md" />
              ) : (
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-full">
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {queryCategories.data?.data.data.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input disabled type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is for product stock quantity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} placeholder="https://" />
                    </FormControl>
                    <FormDescription>
                      Make sure image url can be access
                    </FormDescription>
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FormEdit;
