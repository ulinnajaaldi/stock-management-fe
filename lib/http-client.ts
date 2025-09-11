/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";

import { ACCESS_TOKEN, API_URL } from "@/constants/config";

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  baseURL?: string;
}

export class HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL || API_URL;
    this.timeout = config.timeout || 10000;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.headers,
    };
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const url = config.baseURL
      ? `${config.baseURL}${endpoint}`
      : `${this.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, config.timeout || this.timeout);

    try {
      const headers: Record<string, string> = {
        ...this.defaultHeaders,
        ...(config.headers as Record<string, string>),
      };

      const token = Cookies.get(ACCESS_TOKEN);
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...config,
        headers,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpError(
          errorData.message || `HTTP Error: ${response.status}`,
          response.status,
          errorData,
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return response.text() as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new HttpError("Request timeout", 408);
      }

      throw new HttpError(
        error instanceof Error ? error.message : "Network error",
        0,
      );
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  removeHeader(key: string) {
    delete this.defaultHeaders[key];
  }

  setAuthToken(token: string) {
    Cookies.set(ACCESS_TOKEN, token);
  }

  clearAuthToken() {
    Cookies.remove(ACCESS_TOKEN);
    delete this.defaultHeaders.Authorization;
  }
}

export class HttpError extends Error {
  public status: number;
  public data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

export const httpClient = new HttpClient();

export default httpClient;
