import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
<<<<<<< HEAD

// https://vite.dev/config/
export default defineConfig({
  plugins: 
  [react(),tailwindcss()],
  

=======
export default defineConfig({
plugins: [
react(),
tailwindcss(),
],
>>>>>>> f0508147ab85022abb8c8d1d3e42f06a4a0a0e30
})
