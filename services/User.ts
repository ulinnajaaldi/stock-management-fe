import type { IGetProfile, LoginResponse } from "@/domains/User";

import { httpClient } from "@/lib/http-client";

import type { ApiResponse, PaginatedResponse } from "@/types/api";

export const UserServices = {
  getAllAdmin: async (): Promise<PaginatedResponse<IGetProfile>> => {
    const response = await httpClient.get<ApiResponse<any>>("/users");
    return response;
  },

  getAdminById: async (id: string): Promise<any> => {
    const response = await httpClient.get<ApiResponse<any>>(`/users/${id}`);
    return response;
  },

  editAdmin: async (id: string, data: any): Promise<any> => {
    const response = await httpClient.put<ApiResponse<any>>(
      `/users/${id}`,
      data,
    );
    return response;
  },

  deleteAdmin: async (id: string): Promise<any> => {
    const response = await httpClient.delete<ApiResponse<any>>(`/users/${id}`);
    return response;
  },
};
