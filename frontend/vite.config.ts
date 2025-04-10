import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https://moviepostersforintex.blob.core.windows.net; frame-ancestors 'none'; font-src 'self' data:; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:5000 https://cinenichegroup0401-backend-affvedfvhnhyc4fp.eastus-01.azurewebsites.net;",
    }    
    
  },
});