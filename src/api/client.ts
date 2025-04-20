// src/api/client.ts
import axios from "axios";

// Create an axios instance with base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

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

export default apiClient;