// src/api/client.ts
import axios from "axios";
import { CLERK_PUBLISHABLE_KEY, API_BASE_URL } from "../config/env";

// Create an axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add this export function
export const setAuthToken = (token: string | null) => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };

// Add auth token interceptor
apiClient.interceptors.request.use(async (config) => {
  try {
    // Get token from Clerk
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common API errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized - redirect to sign-in
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;