import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { TransactionServices } from "@/services/Transaction";

import { TransactionFormType } from "@/features/Dashboard/Transaction/types";

export const TransactionUseCases = {
  useGetAll: ({ page, limit }: { page?: number; limit?: number }) => {
    const query = useQuery({
      queryKey: ["get-all-transaction", { page, limit }],
      queryFn: () =>
        TransactionServices.getAll({
          limit: limit,
          page: page,
        }),
    });

    return query;
  },

  useGetHistory: ({ page, limit }: { page?: number; limit?: number }) => {
    const query = useQuery({
      queryKey: ["get-transaction-history", { page, limit }],
      queryFn: () =>
        TransactionServices.history({
          limit: limit,
          page: page,
        }),
    });

    return query;
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: (data: TransactionFormType) =>
        TransactionServices.create(data),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["get-transaction-history"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get-all-transaction"],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

    return mutation;
  },
};
