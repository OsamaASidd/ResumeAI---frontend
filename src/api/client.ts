// src/api/client.ts
import axios from "axios";
import { API_BASE_URL } from "../config/env";

// Create an axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add this export function to manually set auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("Token set in API client:", token.substring(0, 15) + "...");
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    console.log("Token cleared from API client");
  }
};

// Add auth token interceptor using Clerk
apiClient.interceptors.request.use(async (config) => {
  try {
    // If Authorization header is already set, use that one
    if (config.headers.Authorization) {
      return config;
    }
    
    // Otherwise try to get token from Clerk
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken({
        template: "ResumeAi"
      });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Error getting auth token from Clerk:", error);
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
        console.log("Unauthorized API request - redirecting to sign-in");
        
        // Check if we're already on the sign-in page to avoid redirect loops
        if (!window.location.pathname.includes('/sign-in')) {
          window.location.href = '/sign-in';
        }
      }
      
      // Log detailed server errors
      if (error.response.data && process.env.NODE_ENV === 'development') {
        console.error("Server response error:", error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;