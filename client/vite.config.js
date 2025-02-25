import {defineConfig,createLogger} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'access-log',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const logger = createLogger();
          logger.info(`Accessed URL: ${req.url}`);
          next();
        });
      }
    }
  ],
  envDir: '../',
  server: {
    host: true,
    allowedHosts:[
      "xenfo.org",
      "localhost",
      "ex-riverside-thats-taiwan.trycloudflare.com"
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    hmr: {
      clientPort: 443,
    },
  },
});
