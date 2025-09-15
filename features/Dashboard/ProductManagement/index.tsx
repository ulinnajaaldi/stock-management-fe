"use client";

import React from "react";

import { Plus } from "lucide-react";

import { DataTable } from "@/components/common/data-table";
import DataTablePagination from "@/components/common/data-table-pagination";
import { LoaderTable } from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { columns } from "./components/columns";
import FormAdd from "./components/form-add";
import FormEdit from "./components/form-edit";
import SheetDetail from "./components/sheet-detail";
import { useProductManagement } from "./hook";

const ProductManagementFeature = () => {
  const {
    queryProduct,
    limit,
    page,
    search,
    setSearch,
    handleToNextPage,
    handleToPrevPage,
    handleChangeLimit,
    handleOpenAddModal,
  } = useProductManagement();

  return (
    <main className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products Management</h1>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Input
            type="search"
            value={search || ""}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search product..."
            className="w-fit lg:w-64"
          />
          <Button onClick={handleOpenAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
        {queryProduct.isLoading ? (
          <LoaderTable />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={queryProduct.data?.data.data || []}
            />
            <DataTablePagination
              handleChangeLimit={handleChangeLimit}
              handleToNextPage={handleToNextPage}
              handleToPrevPage={handleToPrevPage}
              meta={{
                limit: limit || 10,
                page: page || 1,
                total: queryProduct.data?.data.meta.total || 0,
                totalPages: queryProduct.data?.data.meta.totalPages || 0,
                hasNext: queryProduct.data?.data.meta.hasNext || false,
                hasPrev: queryProduct.data?.data.meta.hasPrev || false,
              }}
            />
          </>
        )}
      </div>
      <FormAdd />
      <FormEdit />
      <SheetDetail />
    </main>
  );
};

export default ProductManagementFeature;
