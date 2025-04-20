// vite-server-plugin.mjs
import { createServer } from 'node:http';
import { serve } from '@hono/node-server';
import appRouter from './src/server/index.js';

/**
 * Vite plugin to run the backend server alongside the frontend dev server
 * This allows you to run both frontend and backend in one command during development
 */
export function viteBackendServer() {
  let serverInstance = null;
  
  return {
    name: 'vite:backend-server',
    
    configureServer(server) {
      // Start the backend server when Vite starts
      const startBackendServer = async () => {
        try {
          const httpServer = createServer();
          const port = process.env.API_PORT || 3000;
          
          // Apply the Hono app to the server
          serve({
            fetch: appRouter.fetch,
            server: httpServer,
            port,
          });
          
          serverInstance = httpServer;
          
          console.log(`Backend server running at http://localhost:${port}`);
        } catch (error) {
          console.error('Failed to start backend server:', error);
        }
      };
      
      // Start backend server
      server.httpServer.once('listening', () => {
        startBackendServer();
      });
      
      // Proxy API requests to backend server during development
      server.middlewares.use('/api', (req, res, next) => {
        // Modify request URL to match backend routes
        const url = new URL(req.url, `http://${req.headers.host}`);
        
        // Forward the request to the backend server
        const backendPort = process.env.API_PORT || 3000;
        const proxyTarget = `http://localhost:${backendPort}${url.pathname}${url.search}`;
        
        // Create and send the proxy request
        const proxyReq = new Request(proxyTarget, {
          method: req.method,
          headers: req.headers,
          body: req.body,
        });
        
        fetch(proxyReq)
          .then(proxyRes => {
            // Copy status and headers
            res.statusCode = proxyRes.status;
            proxyRes.headers.forEach((value, key) => {
              res.setHeader(key, value);
            });
            
            // Stream the response body
            return proxyRes.arrayBuffer();
          })
          .then(body => {
            res.end(Buffer.from(body));
          })
          .catch(error => {
            console.error('Proxy error:', error);
            res.statusCode = 500;
            res.end('Internal Server Error');
          });
      });
    },
    
    // Close the server when Vite closes
    closeBundle() {
      if (serverInstance) {
        serverInstance.close();
        serverInstance = null;
        console.log('Backend server stopped');
      }
    },
  };
}