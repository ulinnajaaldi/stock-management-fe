"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthUseCases } from "@/useCases/Auth";
import { UserUseCases } from "@/useCases/User";

import useModal from "@/hooks/use-modal";

import { DataTable } from "@/components/common/data-table";
import { LoaderTable } from "@/components/common/loader";
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

import { columns } from "./components/columns";

const formSchema = z
  .object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    email: z.email().min(1, "Email is required"),
    gender: z.enum(["male", "female"]),
    password: z.string().min(6, "Password is required"),
    confirm_password: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const AdminManagementFeature = () => {
  const { openDrawer, closeDrawer, id, isOpen, type } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const mutation = AuthUseCases.useRegister();
  const queryAdmins = UserUseCases.getAllAdmin();

  console.log(queryAdmins.data);

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(
      {
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        gender: values.gender,
        last_name: values.last_name,
        role: "admin",
      },
      {
        onSuccess: () => {
          closeDrawer();
          form.reset();
        },
      },
    );
  }

  return (
    <main className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <Button onClick={() => openDrawer("form-add-admin")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>
      <div>
        {queryAdmins.isLoading ? (
          <LoaderTable />
        ) : (
          <DataTable
            columns={columns}
            data={queryAdmins.data?.data.data || []}
          />
        )}
      </div>
      <Dialog
        open={isOpen && type === "form-add-admin"}
        onOpenChange={closeDrawer}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Add new Admin</DialogTitle>
          <DialogDescription>
            Fill the form below to add a new admin to the system.
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="" {...field} />
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>Re-enter your password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={mutation.isPending}
                  onClick={closeDrawer}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminManagementFeature;
