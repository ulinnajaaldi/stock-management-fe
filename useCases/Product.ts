import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ProductServices } from "@/services/Product";

import {
  ProductFormEditType,
  ProductFormType,
} from "@/features/Dashboard/ProductManagement/types";

export const ProductUseCases = {
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
      queryKey: ["get-all-products", { page, limit, search }],
      queryFn: () =>
        ProductServices.getAllProduct({
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
      mutationFn: (data: ProductFormType) =>
        ProductServices.createProduct(data),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["get-all-products"] });
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
      mutationFn: () => ProductServices.deleteProduct(id),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["get-all-products"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

    return mutation;
  },

  useGetById: (id: string) => {
    const query = useQuery({
      queryKey: ["get-product-by-id", id],
      queryFn: () => ProductServices.getProductById(id),
      enabled: !!id,
    });

    return query;
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: ProductFormEditType }) =>
        ProductServices.editProduct(id, data),
      onSuccess: (data) => {
        toast.success(data.message || "Product updated successfully");
        queryClient.invalidateQueries({ queryKey: ["get-all-products"] });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update product");
      },
    });

    return mutation;
  },
};
