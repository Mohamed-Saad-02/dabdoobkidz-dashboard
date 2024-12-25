import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiResponse } from "../types/ApiResponse";

// Define a type for the API response


// Create an instance of axios with default settings
const apiClient = axios.create({


  baseURL: import.meta.env.VITE_BASE_URL as string,



  timeout: 10000, // Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to headers if needed
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization token if available
    const token = localStorage.getItem("accessToken"); // Example: getting token from local storage


    if (token) {
      config.headers = config.headers || {}; // Initialize headers if undefined
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Handle error responses
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized, delete the token
        localStorage.removeItem("accessToken");
      }
      // Server responded with a status other than 2xx
      //   console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      //   console.error("Network Error:", error.request);
    } else {
      // Something else happened
      //   console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Generic function for making API requests
const apiRequest = async <T, K extends string = 'items'>(
  method: "get" | "post" | "put" | "delete"| "patch",
  url: string,
  data: unknown = null,
  params: unknown = {}
): Promise<ApiResponse<T, K>> => {
  const response: AxiosResponse<ApiResponse<T, K>> = await apiClient({
    method,
    url,
    data,
    params,
  });
  return response?.data;
};

// Exported functions for different HTTP methods
export const get = <T, K extends string = 'items'>(url: string, params?: unknown) =>
  apiRequest<T, K>("get", url, null, params);
export const post = <T, K extends string = 'items'>(url: string, data?: unknown) =>
  apiRequest<T, K>("post", url, data);
export const put = <T, K extends string = 'items'>(url: string, data?: unknown) =>
  apiRequest<T, K>("put", url, data);
export const patch = <T, K extends string = 'items'>(url: string, data?: unknown) =>
  apiRequest<T, K>("patch", url, data);
export const del = <T, K extends string = 'items'>(url: string) =>
  apiRequest<T, K>("delete", url , {});
