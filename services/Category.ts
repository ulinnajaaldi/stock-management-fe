import { CategoriesResponse } from "@/domains/Categories";

import { CategoryFormType } from "@/features/Dashboard/CategoriesManagement/types";

import { httpClient } from "@/lib/http-client";

import type { ApiResponse, PaginatedResponse } from "@/types/api";

export const CategoryServices = {
  getAllCategory: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<CategoriesResponse>> => {
    const searchParams = new URLSearchParams();

    if (params?.search) searchParams.append("search", params.search);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();

    const response = await httpClient.get<
      PaginatedResponse<CategoriesResponse>
    >(`/categories${queryString ? `?${queryString}` : ""}`);
    return response;
  },

  getCategoryById: async (id: string): Promise<CategoriesResponse> => {
    const response = await httpClient.get<ApiResponse<CategoriesResponse>>(
      `/categories/${id}`,
    );
    return response.data || ({} as CategoriesResponse);
  },

  createCategory: async (data: CategoryFormType): Promise<ApiResponse> => {
    const response = await httpClient.post<ApiResponse>(`/categories`, data);
    return response;
  },

  editCategory: async (
    id: string,
    data: CategoryFormType,
  ): Promise<ApiResponse> => {
    const response = await httpClient.patch<ApiResponse>(
      `/categories/${id}`,
      data,
    );
    return response;
  },

  deleteCategory: async (id: string): Promise<ApiResponse> => {
    const response = await httpClient.delete<ApiResponse>(`/categories/${id}`);
    return response;
  },
};
