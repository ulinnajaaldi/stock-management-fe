import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AuthService } from "@/services/Auth";

export const AuthUseCases = {
  useGetProfile: () => {
    const query = useQuery({
      queryKey: ["use-get-profile"],
      queryFn: AuthService.getProfile,
    });

    return query;
  },

  useRegister: () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: (data: {
        first_name: string;
        last_name: string;
        email: string;
        role: "admin";
        gender: "male" | "female";
        password: string;
      }) =>
        AuthService.register(
          data.first_name,
          data.last_name,
          data.email,
          data.role,
          data.gender,
          data.password,
        ),
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

  useLogin: () => {
    const mutation = useMutation({
      mutationFn: (data: { email: string; password: string }) =>
        AuthService.login(data.email, data.password),
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

    return mutation;
  },
};
