import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { CategoryServices } from "@/services/Category";

import { CategoryFormType } from "@/features/Dashboard/CategoriesManagement/types";

export const CategoryUseCases = {
  useGetAll: ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const query = useQuery({
      queryKey: ["get-all-categories", { page, limit, search }],
      queryFn: () =>
        CategoryServices.getAllCategory({
          search: search,
          limit: limit,
          page: page,
        }),
    });

    return query;
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: (data: CategoryFormType) =>
        CategoryServices.createCategory(data),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["get-all-categories"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

    return mutation;
  },

  useDelete: (id: string) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: () => CategoryServices.deleteCategory(id),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["get-all-categories"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

    return mutation;
  },

  useGetById: (id: string) => {
    const query = useQuery({
      queryKey: ["get-category-by-id", id],
      queryFn: () => CategoryServices.getCategoryById(id),
      enabled: !!id,
    });

    return query;
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: CategoryFormType }) =>
        CategoryServices.editCategory(id, data),
      onSuccess: (data) => {
        toast.success(data.message || "Category updated successfully");
        queryClient.invalidateQueries({ queryKey: ["get-all-categories"] });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update category");
      },
    });

    return mutation;
  },
};
