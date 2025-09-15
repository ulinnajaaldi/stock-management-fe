"use client";

import React from "react";

import { Plus } from "lucide-react";

import useModal from "@/hooks/use-modal";

import { DataTable } from "@/components/common/data-table";
import DataTablePagination from "@/components/common/data-table-pagination";
import { LoaderTable } from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { columns } from "./components/columns";
import FormAdd from "./components/form-add";
import FormEdit from "./components/form-edit";
import { useCategoriesManagement } from "./hook";

const CategoriesManagementFeature = () => {
  const { openDrawer } = useModal();
  const {
    queryCategories,
    limit,
    page,
    search,
    setSearch,
    handleToNextPage,
    handleToPrevPage,
    handleChangeLimit,
    form,
  } = useCategoriesManagement();

  return (
    <main className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories Management</h1>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Input
            type="search"
            value={search || ""}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search category..."
            className="w-fit lg:w-64"
          />
          <Button
            onClick={() => {
              form.reset({
                name: "",
                description: "",
              });
              openDrawer("form-add-category");
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Category
          </Button>
        </div>
        {queryCategories.isLoading ? (
          <LoaderTable />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={queryCategories.data?.data.data || []}
            />
            <DataTablePagination
              handleChangeLimit={handleChangeLimit}
              handleToNextPage={handleToNextPage}
              handleToPrevPage={handleToPrevPage}
              meta={{
                limit: limit || 10,
                page: page || 1,
                total: queryCategories.data?.data.meta.total || 0,
                totalPages: queryCategories.data?.data.meta.totalPages || 0,
                hasNext: queryCategories.data?.data.meta.hasNext || false,
                hasPrev: queryCategories.data?.data.meta.hasPrev || false,
              }}
            />
          </>
        )}
      </div>
      <FormAdd />
      <FormEdit />
    </main>
  );
};

export default CategoriesManagementFeature;
