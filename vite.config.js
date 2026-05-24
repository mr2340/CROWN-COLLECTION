import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to mock Vercel serverless functions in Vite dev server
const vercelApiMiddleware = () => ({
  name: 'vercel-api-middleware',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url.startsWith('/api/')) {
        return next();
      }

      // Extract endpoint and query string
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
      const endpoint = parsedUrl.pathname.replace(/^\/api\//, '');
      const query = Object.fromEntries(parsedUrl.searchParams.entries());

      // Find corresponding handler file
      const handlerPath = path.join(__dirname, 'api', `${endpoint}.js`);

      if (!fs.existsSync(handlerPath)) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: `API route /api/${endpoint} not found` }));
        return;
      }

      try {
        // Parse request body for POST/PUT requests
        let body = {};
        if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const rawBody = Buffer.concat(buffers).toString();
          if (rawBody) {
            try {
              body = JSON.parse(rawBody);
            } catch (e) {
              // Fallback if not JSON
              body = rawBody;
            }
          }
        }

        // Decorate request and response objects to match Vercel API signatures
        req.query = query;
        req.body = body;

        res.status = (statusCode) => {
          res.statusCode = statusCode;
          return res;
        };

        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };

        // Dynamically import the handler (clear cache in dev if needed)
        // Adding a timestamp query to bust the node import cache for hot reloading api code
        const modulePath = `./api/${endpoint}.js?t=${Date.now()}`;
        const { default: handler } = await import(modulePath);
        
        await handler(req, res);
      } catch (err) {
        console.error('Error running API handler:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error', details: err.message }));
      }
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiMiddleware()],
  server: {
    port: 3500,
    host: true,
    open: true
  }
});
