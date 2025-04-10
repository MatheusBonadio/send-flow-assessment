import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(), viteTsconfigPaths()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
  },
});