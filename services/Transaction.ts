import { TransactionResponse } from "@/domains/Transaction";

import { TransactionFormType } from "@/features/Dashboard/Transaction/types";

import { httpClient } from "@/lib/http-client";

import type { ApiResponse, PaginatedResponse } from "@/types/api";

export const TransactionServices = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<TransactionResponse>> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();

    const response = await httpClient.get<
      PaginatedResponse<TransactionResponse>
    >(`/transactions${queryString ? `?${queryString}` : ""}`);
    return response;
  },

  create: async (data: TransactionFormType): Promise<ApiResponse> => {
    const response = await httpClient.post<ApiResponse>(`/transactions`, data);
    return response;
  },

  history: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<TransactionResponse>> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();

    const response = await httpClient.get<
      PaginatedResponse<TransactionResponse>
    >(`/transactions/history${queryString ? `?${queryString}` : ""}`);
    return response;
  },
};
