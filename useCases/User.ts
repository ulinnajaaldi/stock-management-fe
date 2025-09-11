import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { UserServices } from "@/services/User";

export const UserUseCases = {
  getAllAdmin: () => {
    const query = useQuery({
      queryKey: ["get-all-admin"],
      queryFn: UserServices.getAllAdmin,
    });

    return query;
  },

  deleteAdmin: (id: string) => {
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
};
