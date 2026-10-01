import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import seoFeed from './build/seo-feed.js'

const root = dirname(fileURLToPath(import.meta.url))

/* The site URL lives in one place. Vite needs it at build time and the
   app needs it at runtime, so it is read from the same config module
   rather than duplicated here — a mismatched canonical URL is the kind of
   bug that only shows up in a Search Console report weeks later.
   pathToFileURL matters on Windows, where a bare "C:\..." is rejected
   by the ESM loader. */
const { site, profile } = await import(
  pathToFileURL(resolve(root, 'src/config.js')).href
)

export default defineConfig({
  plugins: [
    react(),
    seoFeed({
      siteUrl: site.url,
      postsDir: resolve(root, 'src/content/posts'),
      author: {
        name: profile.name,
        description: site.seo.description,
      },
    }),
  ],

  build: {
    /* Split the vendor code out of the app chunk. React rarely changes
       between deploys; keeping it in its own long-lived file means a
       content-only change does not invalidate 90 kB of vendor code in
       every visitor's cache. */
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-router')) return 'router'
          if (id.includes('react-dom') || id.includes('/react/')) return 'react'
        },
      },
    },
  },
})
