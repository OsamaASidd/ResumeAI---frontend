// Add proper type assertions
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api') as string;
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
export const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY as string;