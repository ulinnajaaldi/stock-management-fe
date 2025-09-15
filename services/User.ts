import type { IGetProfile } from "@/domains/User";

import { AdminEditFormType } from "@/features/Dashboard/AdminManagement/types";

import { httpClient } from "@/lib/http-client";

import type { ApiResponse, PaginatedResponse } from "@/types/api";

export const UserServices = {
  getAllAdmin: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<IGetProfile>> => {
    const searchParams = new URLSearchParams();

    if (params?.search) searchParams.append("search", params.search);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();

    const response = await httpClient.get<PaginatedResponse<IGetProfile>>(
      `/users${queryString ? `?${queryString}` : ""}`,
    );
    return response;
  },

  getAdminById: async (id: string): Promise<IGetProfile> => {
    const response = await httpClient.get<ApiResponse<IGetProfile>>(
      `/users/${id}`,
    );
    return response.data || ({} as IGetProfile);
  },

  editAdmin: async (
    id: string,
    data: AdminEditFormType,
  ): Promise<ApiResponse> => {
    const response = await httpClient.patch<ApiResponse>(`/users/${id}`, data);
    return response;
  },

  deleteAdmin: async (id: string): Promise<ApiResponse> => {
    const response = await httpClient.delete<ApiResponse>(`/users/${id}`);
    return response;
  },
};
