"use client";

import React, { createContext, useContext, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { parseAsInteger, useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";

import { User } from "@/domains/User";

import { AuthUseCases } from "@/useCases/Auth";
import { UserUseCases } from "@/useCases/User";

import useModal from "@/hooks/use-modal";

import {
  AdminEditFormSchema,
  AdminEditFormType,
  AdminFormSchema,
} from "../types";

interface AdminManagementProps {
  form: ReturnType<typeof useForm<AdminEditFormType>>;
  mutationCreate: ReturnType<typeof AuthUseCases.useRegister>;
  mutationUpdate: ReturnType<typeof UserUseCases.useUpdateAdmin>;
  queryAdmins: ReturnType<typeof UserUseCases.useGetAllAdmin>;
  onSubmitCreate: (values: AdminEditFormType) => void;
  onSubmitUpdate: (values: AdminEditFormType) => void;
  currentAdmin: any | null;
  isEditing: boolean;
  limit?: number | null;
  page?: number | null;
  search: string;
  setSearch: (value: string) => void;
  searchValue: string;
  handleToNextPage: () => void;
  handleToPrevPage: () => void;
  handleChangeLimit: (value: string) => void;
}

const AdminManagement = createContext<AdminManagementProps | undefined>(
  undefined,
);

export const AdminManagementStore: React.FC<{
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

  const mutationCreate = AuthUseCases.useRegister();
  const mutationUpdate = UserUseCases.useUpdateAdmin();
  const queryAdmins = UserUseCases.useGetAllAdmin({
    limit: limit || 10,
    page: page || 1,
    search: searchValue,
  });

  const isEditing = !!id;

  const currentAdmin = React.useMemo(() => {
    if (!id || !queryAdmins.data?.data?.data) return null;
    return (
      queryAdmins.data.data.data.find((admin: User) => admin.id === id) || null
    );
  }, [id, queryAdmins.data]);

  useEffect(() => {
    const schema = isEditing ? AdminEditFormSchema : AdminFormSchema;
  }, [isEditing]);

  useEffect(() => {
    if (currentAdmin && id) {
      form.reset({
        email: currentAdmin.email,
        first_name: currentAdmin.first_name,
        last_name: currentAdmin.last_name,
        gender:
          currentAdmin.gender === "male" || currentAdmin.gender === "female"
            ? currentAdmin.gender
            : undefined,
        password: "",
        confirm_password: "",
      });
    }
  }, [currentAdmin, id, form]);

  const handleToNextPage = () => {
    const currentPage = Number(page) || 1;
    const totalPages = queryAdmins.data?.data.meta.totalPages || 1;
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

  const onSubmitCreate = (values: AdminEditFormType) => {
    if (!values.password || values.password.trim() === "") {
      form.setError("password", {
        message: "Password is required for new admin",
      });
      return;
    }

    mutationCreate.mutate(
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
  };

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
    <AdminManagement.Provider
      value={{
        form,
        mutationCreate,
        mutationUpdate,
        queryAdmins,
        onSubmitCreate,
        onSubmitUpdate,
        currentAdmin,
        isEditing,
        limit,
        page,
        search,
        setSearch,
        searchValue,
        handleToNextPage,
        handleToPrevPage,
        handleChangeLimit,
      }}
    >
      {children}
    </AdminManagement.Provider>
  );
};

export const useAdminManagement = () => {
  const context = useContext(AdminManagement);
  if (context === undefined) {
    throw new Error("useAdminManagement must be used within a AdminManagement");
  }
  return context;
};
