import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This tells the app it is hosted in a sub-folder, not the root domain
  base: '/Direct-Debit/', 
})
