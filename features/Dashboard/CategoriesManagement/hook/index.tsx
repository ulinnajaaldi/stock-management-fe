"use client";

import React, { createContext, useContext, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { parseAsInteger, useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";

import { CategoryUseCases } from "@/useCases/Category";

import useModal from "@/hooks/use-modal";

import { CategoryFormSchema, CategoryFormType } from "../types";

interface CategoriesManagementProps {
  form: ReturnType<typeof useForm<CategoryFormType>>;
  mutationCreate: ReturnType<typeof CategoryUseCases.useCreate>;
  onSubmitCreate: (values: CategoryFormType) => void;
  mutationUpdate: ReturnType<typeof CategoryUseCases.useUpdate>;
  onSubmitUpdate: (values: CategoryFormType) => void;
  limit?: number | null;
  page?: number | null;
  search: string;
  setSearch: (value: string) => void;
  searchValue: string;
  queryCategories: ReturnType<typeof CategoryUseCases.useGetAll>;
  handleToNextPage: () => void;
  handleToPrevPage: () => void;
  handleChangeLimit: (value: string) => void;
}

const CategoriesManagement = createContext<
  CategoriesManagementProps | undefined
>(undefined);

export const CategoriesManagementStore: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { closeDrawer, id } = useModal();

  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 500);
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10),
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const form = useForm<CategoryFormType>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const queryCategories = CategoryUseCases.useGetAll({
    page: page || 1,
    limit: limit || 10,
    search: searchValue,
  });
  const mutationCreate = CategoryUseCases.useCreate();
  const mutationUpdate = CategoryUseCases.useUpdate();
  const queryCategory = CategoryUseCases.useGetById(id || "");

  useEffect(() => {
    if (queryCategory.data) {
      form.reset({
        name: queryCategory.data.name,
        description: queryCategory.data.description || "",
      });
    }
  }, [queryCategory.data, id, form]);

  const onSubmitCreate = (values: CategoryFormType) => {
    mutationCreate.mutate(
      {
        name: values.name,
        description: values.description || "",
      },
      {
        onSuccess: () => {
          closeDrawer();
          form.reset();
        },
      },
    );
  };

  const onSubmitUpdate = (values: CategoryFormType) => {
    mutationUpdate.mutate(
      {
        id: id || "",
        data: {
          name: values.name,
          description: values.description || "",
        },
      },
      {
        onSuccess: () => {
          closeDrawer();
          form.reset();
        },
      },
    );
  };

  const handleToNextPage = () => {
    const currentPage = Number(page) || 1;
    const totalPages = queryCategories.data?.data.meta.totalPages || 1;
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  const handleToPrevPage = () => {
    const currentPage = Number(page) || 1;
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleChangeLimit = (value: string) => {
    setLimit(Number(value));
    setPage(1);
  };

  return (
    <CategoriesManagement.Provider
      value={{
        form,
        mutationCreate,
        onSubmitCreate,
        mutationUpdate,
        onSubmitUpdate,
        page,
        limit,
        search,
        setSearch,
        searchValue,
        queryCategories,
        handleToNextPage,
        handleToPrevPage,
        handleChangeLimit,
      }}
    >
      {children}
    </CategoriesManagement.Provider>
  );
};

export const useCategoriesManagement = () => {
  const context = useContext(CategoriesManagement);
  if (context === undefined) {
    throw new Error(
      "useCategoriesManagement must be used within a CategoriesManagement",
    );
  }
  return context;
};
