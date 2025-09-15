"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { UserUseCases } from "@/useCases/User";

import { useAuthStore } from "@/hooks/use-auth";
import useModal from "@/hooks/use-modal";

import {
  AdminEditFormSchema,
  AdminEditFormType,
} from "@/features/Dashboard/AdminManagement/types";

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
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormEditAdmin = () => {
  const { closeDrawer, isOpen, type, id } = useModal();
  const { data } = useAuthStore();

  const form = useForm<AdminEditFormType>({
    resolver: zodResolver(AdminEditFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const mutationUpdate = UserUseCases.useUpdateAdmin();

  useEffect(() => {
    if (data && isOpen && type === "form-edit-admin" && id !== undefined) {
      form.reset({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        gender:
          data.gender === "male" || data.gender === "female"
            ? data.gender
            : undefined,
        password: "",
        confirm_password: "",
      });
    }
  }, [data, isOpen, type, id, form]);

  const onSubmitUpdate = (values: AdminEditFormType) => {
    if (!id) return;

    const updateData: any = {
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      gender: values.gender,
    };

    if (values.password && values.password.trim() !== "") {
      updateData.password = values.password;
    }

    mutationUpdate.mutate(
      { id, data: updateData },
      {
        onSuccess: () => {
          closeDrawer();
          form.reset();
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen && type === "form-edit-admin" && id !== undefined}
      onOpenChange={closeDrawer}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Edit Admin</DialogTitle>
        <DialogDescription>
          Fill the form below to edit the admin information. Leave password
          fields empty if you don&apos;t want to change the password.
        </DialogDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="mx-auto flex max-w-3xl flex-col gap-3"
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" type="text" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" type="text" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@gmail.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password (optional)</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Leave empty to keep current password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password (optional)</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Re-enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Only required if changing password.
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

export default FormEditAdmin;
