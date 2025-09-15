import { ProductResponse } from "@/domains/Product";

import {
  ProductFormEditType,
  ProductFormType,
} from "@/features/Dashboard/ProductManagement/types";

import { httpClient } from "@/lib/http-client";

import type { ApiResponse, PaginatedResponse } from "@/types/api";

export const ProductServices = {
  getAllProduct: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<ProductResponse>> => {
    const searchParams = new URLSearchParams();

    if (params?.search) searchParams.append("search", params.search);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();

    const response = await httpClient.get<PaginatedResponse<ProductResponse>>(
      `/products${queryString ? `?${queryString}` : ""}`,
    );
    return response;
  },

  getProductById: async (id: string): Promise<ProductResponse> => {
    const response = await httpClient.get<ApiResponse<ProductResponse>>(
      `/products/${id}`,
    );
    return response.data || ({} as ProductResponse);
  },

  createProduct: async (data: ProductFormType): Promise<ApiResponse> => {
    const response = await httpClient.post<ApiResponse>(`/products`, data);
    return response;
  },

  editProduct: async (
    id: string,
    data: ProductFormEditType,
  ): Promise<ApiResponse> => {
    const response = await httpClient.patch<ApiResponse>(
      `/products/${id}`,
      data,
    );
    return response;
  },

  deleteProduct: async (id: string): Promise<ApiResponse> => {
    const response = await httpClient.delete<ApiResponse>(`/products/${id}`);
    return response;
  },
};
