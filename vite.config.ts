import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function poseidonServiceWorkerPlugin(): Plugin {
  const buildVersion = `v${Date.now()}`
  const buildTime = new Date().toISOString()

  return {
    name: 'poseidon-sw-versioning',
    // Inject unique version into dist/sw.js after Vite copies public/ files
    closeBundle() {
      const swDistPath = path.resolve(__dirname, 'dist/sw.js')
      if (fs.existsSync(swDistPath)) {
        let swContent = fs.readFileSync(swDistPath, 'utf-8')
        swContent = swContent
          .replace(/__SW_VERSION__/g, buildVersion)
          .replace(/__BUILD_TIME__/g, buildTime)
        fs.writeFileSync(swDistPath, swContent, 'utf-8')
        console.log(`\n[Poseidon SW Plugin] Injected build version ${buildVersion} into dist/sw.js`)
      }
    },
    // Serve sw.js with fresh dev version and no-cache headers in development mode
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/sw.js') {
          const swSrcPath = path.resolve(__dirname, 'public/sw.js')
          if (fs.existsSync(swSrcPath)) {
            const devVersion = `dev-${Date.now()}`
            let swContent = fs.readFileSync(swSrcPath, 'utf-8')
            swContent = swContent
              .replace(/__SW_VERSION__/g, devVersion)
              .replace(/__BUILD_TIME__/g, new Date().toISOString())
            res.setHeader('Content-Type', 'application/javascript')
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            return res.end(swContent)
          }
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    poseidonServiceWorkerPlugin(),
  ],
})
