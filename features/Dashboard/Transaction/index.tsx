"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigDown, Plus, Trash2 } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { ProductUseCases } from "@/useCases/Product";
import { TransactionUseCases } from "@/useCases/Transactions";

import useModal from "@/hooks/use-modal";

import { DataTable } from "@/components/common/data-table";
import DataTablePagination from "@/components/common/data-table-pagination";
import { LoaderTable } from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { columns } from "./components/columns";
import { useTransaction } from "./hook";

const TransactionFeature = () => {
  const { openDrawer, closeDrawer, isOpen, type } = useModal();

  const {
    form,
    fields,
    addProduct,
    removeProduct,
    queryProducts,
    mutationCreate,
    onSubmit,
    queryHistory,
    limit,
    page,
    handleChangeLimit,
    handleToNextPage,
    handleToPrevPage,
  } = useTransaction();

  return (
    <main className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button onClick={() => openDrawer("form-add-transaction")}>
          <Plus className="mr-2 h-4 w-4" />
          Make new Transactions
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {queryHistory.isLoading ? (
          <LoaderTable />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={queryHistory.data?.data.data || []}
            />
            <DataTablePagination
              handleChangeLimit={handleChangeLimit}
              handleToNextPage={handleToNextPage}
              handleToPrevPage={handleToPrevPage}
              meta={{
                limit: limit || 10,
                page: page || 1,
                total: queryHistory.data?.data.meta.total || 0,
                totalPages: queryHistory.data?.data.meta.totalPages || 0,
                hasNext: queryHistory.data?.data.meta.hasNext || false,
                hasPrev: queryHistory.data?.data.meta.hasPrev || false,
              }}
            />
          </>
        )}
      </div>
      <Sheet
        open={isOpen && type === "form-add-transaction"}
        onOpenChange={closeDrawer}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Make new Transaction</SheetTitle>
            <SheetDescription>
              Fill the form below to add a new transaction to the system.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 px-4"
            >
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stock_in">
                          <ArrowBigDown className="size-4" />
                          Stock In
                        </SelectItem>
                        <SelectItem value="stock_out">
                          <ArrowBigDown className="size-4 rotate-180" />
                          Stock Out
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Transaction Notes"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Products</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProduct}
                    className="h-8"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Product
                  </Button>
                </div>

                {queryProducts.isLoading ? (
                  <Skeleton className="h-10 w-full rounded-md" />
                ) : (
                  <div className="flex flex-col gap-3">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-12 items-start gap-2 rounded-lg border p-3"
                      >
                        <div className="col-span-6">
                          <FormField
                            control={form.control}
                            name={`items.${index}.productId`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-xs">
                                  Product
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {queryProducts.data?.data.data.map(
                                      (product) => (
                                        <SelectItem
                                          key={product.id}
                                          value={product.id}
                                        >
                                          {product.name}
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="col-span-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">
                                  Quantity
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Qty"
                                    type="number"
                                    min="1"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="col-span-2 flex items-end justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeProduct(index)}
                            disabled={fields.length === 1}
                            className="h-9 w-9 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {fields.length === 0 && (
                  <div className="text-muted-foreground text-center">
                    No products added
                  </div>
                )}
              </div>

              <SheetFooter className="flex flex-row items-center p-0">
                <Button type="button" variant="outline" onClick={closeDrawer}>
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </main>
  );
};

export default TransactionFeature;
