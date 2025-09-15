import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { UserServices } from "@/services/User";

import { AdminEditFormType } from "@/features/Dashboard/AdminManagement/types";

export const UserUseCases = {
  useGetAllAdmin: ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const query = useQuery({
      queryKey: ["get-all-admin", { page, limit, search }],
      queryFn: () =>
        UserServices.getAllAdmin({
          search: search,
          limit: limit,
          page: page,
        }),
    });

    return query;
  },

  useDeleteAdmin: (id: string) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: () => UserServices.deleteAdmin(id),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["get-all-admin"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

    return mutation;
  },

  useGetAdminById: (id: string) => {
    const query = useQuery({
      queryKey: ["get-admin-by-id", id],
      queryFn: () => UserServices.getAdminById(id),
      enabled: !!id,
    });

    return query;
  },

  useUpdateAdmin: () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: AdminEditFormType }) =>
        UserServices.editAdmin(id, data),
      onSuccess: (data) => {
        toast.success(data.message || "Admin updated successfully");
        queryClient.invalidateQueries({ queryKey: ["get-all-admin"] });
        queryClient.invalidateQueries({ queryKey: ["use-get-profile"] });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update admin");
      },
    });

    return mutation;
  },
};
