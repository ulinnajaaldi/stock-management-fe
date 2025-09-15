"use client";

import React, { createContext, useContext } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { parseAsInteger, useQueryState } from "nuqs";
import { useFieldArray, useForm } from "react-hook-form";

import { ProductUseCases } from "@/useCases/Product";
import { TransactionUseCases } from "@/useCases/Transactions";

import useModal from "@/hooks/use-modal";

import { transactionFormSchema, TransactionFormType } from "../types";

interface TransactionProps {
  form: ReturnType<typeof useForm<TransactionFormType>>;
  fields: ReturnType<typeof useFieldArray>["fields"];
  addProduct: () => void;
  removeProduct: (index: number) => void;
  queryProducts: ReturnType<typeof ProductUseCases.useGetAll>;
  mutationCreate: ReturnType<typeof TransactionUseCases.useCreate>;
  onSubmit: (values: TransactionFormType) => void;
  queryHistory: ReturnType<typeof TransactionUseCases.useGetHistory>;
  limit?: number | null;
  page?: number | null;
  handleChangeLimit: (value: string) => void;
  handleToNextPage: () => void;
  handleToPrevPage: () => void;
}

const Transaction = createContext<TransactionProps | undefined>(undefined);

export const TransactionStore: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { closeDrawer } = useModal();

  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10),
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const form = useForm<TransactionFormType>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: "",
      notes: "",
      items: [
        {
          productId: "",
          quantity: "1",
        },
      ],
    },
  });

  const queryProducts = ProductUseCases.useGetAll({
    limit: 100,
    page: 1,
    search: "",
  });
  const mutationCreate = TransactionUseCases.useCreate();
  const queryHistory = TransactionUseCases.useGetHistory({
    limit: limit || 10,
    page: page || 1,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const addProduct = () => {
    append({
      productId: "",
      quantity: "1",
    });
  };

  const removeProduct = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  function onSubmit(values: TransactionFormType) {
    const formattedValues = {
      ...values,
      items: values.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    mutationCreate.mutate(formattedValues, {
      onSuccess: () => {
        closeDrawer();
        form.reset();
      },
    });
  }

  const handleToNextPage = () => {
    const currentPage = Number(page) || 1;
    const totalPages = queryHistory.data?.data.meta.totalPages || 1;
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
    <Transaction.Provider
      value={{
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
      }}
    >
      {children}
    </Transaction.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(Transaction);
  if (context === undefined) {
    throw new Error("useTransaction must be used within a Transaction");
  }
  return context;
};
