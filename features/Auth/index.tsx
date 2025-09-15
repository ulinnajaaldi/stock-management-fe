"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthUseCases } from "@/useCases/Auth";

import { ROUTES } from "@/constants/routes";

import { ButtonTheme } from "@/components/common/button-theme";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const formSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(6, "Password is required"),
});

const AuthFeature = () => {
  const router = useRouter();
  const mutateLogin = AuthUseCases.useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutateLogin.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          form.reset();
          router.push(ROUTES.DASHBOARD.ROOT);
        },
      },
    );
  }

  return (
    <main className="relative container mx-auto flex h-screen w-full items-center justify-center px-4">
      <div className="absolute top-0 right-0 left-0 mt-3 flex w-full items-center justify-between px-4">
        <h1 className="text-sm font-bold">Stock Management</h1>
        <ButtonTheme />
      </div>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="sample@gmail.com"
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
                    <FormDescription>Enter your password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={mutateLogin.isPending} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default AuthFeature;
