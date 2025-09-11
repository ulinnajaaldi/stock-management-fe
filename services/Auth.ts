import type {
  IGetProfile,
  LoginResponse,
  RegisterResponse,
} from "@/domains/User";

import { httpClient } from "@/lib/http-client";

import type { ApiResponse } from "@/types/api";

export const AuthService = {
  getProfile: async (): Promise<IGetProfile> => {
    const response =
      await httpClient.get<ApiResponse<IGetProfile>>("/auth/profile");
    return response.data!;
  },

  register: async (
    first_name: string,
    last_name: string,
    email: string,
    role: "admin",
    gender: "male" | "female",
    password: string,
  ): Promise<ApiResponse<RegisterResponse>> => {
    const response = await httpClient.post<ApiResponse<RegisterResponse>>(
      "/auth/register",
      {
        first_name,
        last_name,
        email,
        role,
        gender,
        password,
      },
    );

    return response;
  },

  login: async (
    email: string,
    password: string,
  ): Promise<ApiResponse<LoginResponse>> => {
    const response = await httpClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      {
        email,
        password,
      },
    );

    if (response.data?.access_token) {
      httpClient.setAuthToken(response.data.access_token);
    }

    return response;
  },
};
