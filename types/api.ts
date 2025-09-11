/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginatedResponse<T = any> {
  status: string;
  message: string;
  data: PaginatedData<T>;
}
