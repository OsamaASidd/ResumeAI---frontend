// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CustomClerkProvider } from './auth/clerk-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomClerkProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </CustomClerkProvider>
  </StrictMode>,
)