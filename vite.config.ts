import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      // The app compiled to one 2.5 MB chunk; splitting the heavy vendors lets
      // the browser cache them independently of app code and shortens first paint.
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            if (/[\/]node_modules[\/](react|react-dom|react-router|react-router-dom|scheduler)[\/]/.test(id)) return 'vendor-react';
            if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
            if (id.includes('leaflet')) return 'vendor-maps';
            if (id.includes('framer-motion') || /[\/]motion[\/]/.test(id) || id.includes('gsap') || id.includes('lenis') || id.includes('split-type')) return 'vendor-motion';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) return 'vendor-pdf';
            return 'vendor';
          },
        },
      },
      chunkSizeWarningLimit: 1200,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
