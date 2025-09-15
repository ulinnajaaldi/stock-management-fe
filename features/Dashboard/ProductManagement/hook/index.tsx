"use client";

import React, { createContext, useContext, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { parseAsInteger, useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { CategoryUseCases } from "@/useCases/Category";
import { ProductUseCases } from "@/useCases/Product";

import useModal from "@/hooks/use-modal";

import {
  ProductFormEditType,
  ProductFormSchema,
  ProductFormType,
} from "../types";

interface ProductManagementProps {
  form: ReturnType<typeof useForm<ProductFormType>>;
  mutationCreate: ReturnType<typeof ProductUseCases.useCreate>;
  onSubmitCreate: (values: ProductFormType) => void;
  mutationUpdate: ReturnType<typeof ProductUseCases.useUpdate>;
  onSubmitUpdate: (values: ProductFormType) => void;
  limit?: number | null;
  page?: number | null;
  search: string;
  setSearch: (value: string) => void;
  searchValue: string;
  queryProduct: ReturnType<typeof ProductUseCases.useGetAll>;
  currentProduct: any | null;
  queryCategories: ReturnType<typeof CategoryUseCases.useGetAll>;
  queryProductById: ReturnType<typeof ProductUseCases.useGetById>;
  handleToNextPage: () => void;
  handleToPrevPage: () => void;
  handleChangeLimit: (value: string) => void;
  handleOpenAddModal: () => void;
}

const ProductManagement = createContext<ProductManagementProps | undefined>(
  undefined,
);

export const ProductManagementStore: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { openDrawer, closeDrawer, id } = useModal();

  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 500);
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10),
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const form = useForm<ProductFormType>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      image: "",
      stock: "",
    },
  });

  const queryProduct = ProductUseCases.useGetAll({
    page: page || 1,
    limit: limit || 10,
    search: searchValue,
  });
  const mutationCreate = ProductUseCases.useCreate();
  const mutationUpdate = ProductUseCases.useUpdate();
  const queryCategories = CategoryUseCases.useGetAll({
    limit: 100,
    page: 1,
    search: "",
  });
  const queryProductById = ProductUseCases.useGetById(id || "");

  const currentProduct = React.useMemo(() => {
    if (!id || !queryProduct.data?.data?.data) return null;
    return (
      queryProduct.data.data.data.find((product: any) => product.id === id) ||
      null
    );
  }, [id, queryProduct.data]);

  useEffect(() => {
    if (
      currentProduct &&
      id &&
      queryCategories.data &&
      !queryCategories.isLoading
    ) {
      form.reset({
        name: currentProduct.name,
        description: currentProduct.description || "",
        categoryId: currentProduct.category.id,
        image: currentProduct.image,
        stock: String(currentProduct.stock),
      });
    }
  }, [
    currentProduct,
    queryCategories.data,
    queryCategories.isLoading,
    id,
    form,
  ]);

  const onSubmitCreate = (values: ProductFormType) => {
    mutationCreate.mutate(
      {
        name: values.name,
        description: values.description || "",
        categoryId: values.categoryId,
        image: values.image,
        stock: values.stock,
      },
      {
        onSuccess: () => {
          closeDrawer();
          form.reset();
        },
      },
    );
  };

  const onSubmitUpdate = (values: ProductFormEditType) => {
    mutationUpdate.mutate(
      {
        id: id || "",
        data: {
          name: values.name,
          stock: values.stock,
          categoryId: values.categoryId,
          description: values.description || "",
          image: values.image,
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

  const handleOpenAddModal = () => {
    if (queryCategories.data?.data.meta.total === 0) {
      toast.error("Please create a category first");
      return;
    }

    form.reset({
      name: "",
      description: "",
      categoryId: "",
      image: "",
      stock: "",
    });
    openDrawer("form-add-product");
  };

  const handleToNextPage = () => {
    const currentPage = Number(page) || 1;
    const totalPages = queryProduct.data?.data.meta.totalPages || 1;
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
    <ProductManagement.Provider
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
        queryProduct,
        currentProduct,
        queryCategories,
        queryProductById,
        handleToNextPage,
        handleToPrevPage,
        handleChangeLimit,
        handleOpenAddModal,
      }}
    >
      {children}
    </ProductManagement.Provider>
  );
};

export const useProductManagement = () => {
  const context = useContext(ProductManagement);
  if (context === undefined) {
    throw new Error(
      "useProductManagement must be used within a ProductManagement",
    );
  }
  return context;
};
