import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig({  
  server: {  
    proxy: {  
      '/api': {  
        //target: 'http://40.233.6.181',  
        target: 'http://localhost:8080',  
        changeOrigin: true,  
        rewrite: path => path.replace(/^\/api/, '')  
      }  
    }  
  },  
  plugins: [react()],  
  resolve: {  
    alias: {  
      "@": path.resolve(__dirname, "src"),  
    },  
  },   
});