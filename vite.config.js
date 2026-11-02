import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The dev server forwards API, image and socket requests to the backend,
// so the React code can use relative URLs like fetch('/api/tasks').
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
      '/socket.io': { target: 'http://localhost:5000', ws: true },
    },
  },
});
