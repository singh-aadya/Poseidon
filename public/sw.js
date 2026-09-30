/**
 * POSEIDON PWA Service Worker
 *
 * Update & Caching Strategy:
 * - HTML / Navigation: Network-First (with 2.5s timeout) -> offline cache fallback
 * - Vite Hashed Assets (/assets/*): Cache-First -> network fallback
 * - Static Shell Assets (/manifest.json, icons, workers): Stale-While-Revalidate
 * - External Map & Metocean Data: Stale-While-Revalidate
 * - Obsolete Caches: Purged completely on activate
 */

// Placeholder tokens replaced during Vite build with unique build version & timestamp
const SW_VERSION = '__SW_VERSION__';
const BUILD_TIME = '__BUILD_TIME__';

const CACHE_PREFIX = 'poseidon';
const SHELL_CACHE = `${CACHE_PREFIX}-shell-${SW_VERSION}`;
const ASSETS_CACHE = `${CACHE_PREFIX}-assets-${SW_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${SW_VERSION}`;

const CURRENT_CACHES = [SHELL_CACHE, ASSETS_CACHE, RUNTIME_CACHE];

// Precache list for offline shell fallback
const PRECACHE_SHELL = [
  '/manifest.json',
  '/favicon.svg',
  '/icons.svg',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
  '/maplibre-gl-worker.mjs',
];

/**
 * Helper to fetch with an abortable timeout
 */
function fetchWithTimeout(request, timeoutMs = 2500) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Network timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// 1. INSTALL: Precache minimal shell and skip waiting immediately
self.addEventListener('install', (event) => {
  console.log(`[Poseidon SW] Installing version ${SW_VERSION}`);
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => {
        return cache.addAll(PRECACHE_SHELL).catch((err) => {
          console.warn('[Poseidon SW] Some precache items skipped:', err);
        });
      })
      .then(() => {
        // Activate new service worker immediately without waiting for existing tabs to close
        return self.skipWaiting();
      })
  );
});

// 2. ACTIVATE: Purge all stale/legacy caches and claim clients immediately
self.addEventListener('activate', (event) => {
  console.log(`[Poseidon SW] Activating version ${SW_VERSION}, purging outdated caches...`);
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            // Delete ANY cache not belonging to the current version
            // (including the legacy 'poseidon-cache-v1' or prior versions)
            if (!CURRENT_CACHES.includes(key)) {
              console.log(`[Poseidon SW] Purging obsolete cache: ${key}`);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => {
        // Take immediate control of all open pages
        return self.clients.claim();
      })
  );
});

// 3. FETCH: Strategy routing based on request type
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only intercept GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip unsupported schemes (chrome-extension, ws, wss, etc.)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // -------------------------------------------------------------
  // STRATEGY A: NAVIGATION / HTML REQUESTS (Root URL & Page loads)
  // -------------------------------------------------------------
  // NETWORK-FIRST: Always fetch latest index.html from network when online.
  // Fall back to cached shell ONLY when offline or network times out.
  const isNavigation =
    request.mode === 'navigate' ||
    Boolean(request.headers.get('accept') && request.headers.get('accept').includes('text/html'));

  if (isNavigation) {
    event.respondWith(
      fetchWithTimeout(request, 2500)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(SHELL_CACHE).then((cache) => {
              // Cache both the requested navigation URL and '/index.html' for offline fallback
              cache.put(request, responseClone);
              cache.put('/index.html', networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(async (error) => {
          console.warn(`[Poseidon SW] Network unavailable (${error.message}). Loading cached offline shell.`);
          const cached = await caches.match(request);
          if (cached) return cached;

          const cachedIndex = (await caches.match('/index.html')) || (await caches.match('/'));
          if (cachedIndex) return cachedIndex;

          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>POSEIDON — Offline</title>
                <style>
                  body { background: #070a0f; color: #94a3b8; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 24px; box-sizing: border-box; }
                  .card { max-width: 420px; background: #0c121e; border: 1px solid #1e293b; border-radius: 12px; padding: 32px 24px; }
                  h1 { color: #22d3ee; margin: 0 0 12px; font-size: 22px; letter-spacing: 0.05em; }
                  p { font-size: 14px; line-height: 1.6; margin: 0 0 20px; }
                  button { background: #0284c7; color: #fff; border: 0; border-radius: 6px; padding: 10px 20px; font-weight: 600; cursor: pointer; }
                </style>
              </head>
              <body>
                <div class="card">
                  <h1>POSEIDON</h1>
                  <p>You are currently offline. Check your internet connection and try reloading.</p>
                  <button onclick="window.location.reload()">Retry Connection</button>
                </div>
              </body>
            </html>`,
            {
              headers: { 'Content-Type': 'text/html' },
              status: 200,
            }
          );
        })
    );
    return;
  }

  // -------------------------------------------------------------
  // STRATEGY B: VITE IMMUTABLE ASSETS (/assets/*-[hash].js, etc.)
  // -------------------------------------------------------------
  // CACHE-FIRST: Vite generates immutable content hashes in filenames.
  // Content never changes for a given filename; safe to cache permanently.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(ASSETS_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // -------------------------------------------------------------
  // STRATEGY C: CORE STATIC SHELL ASSETS (/manifest.json, icons, workers)
  // -------------------------------------------------------------
  // STALE-WHILE-REVALIDATE: Serve cached for immediate load, fetch fresh copy in background.
  if (
    url.origin === self.location.origin &&
    (url.pathname === '/manifest.json' ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.mjs'))
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(SHELL_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => null);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // -------------------------------------------------------------
  // STRATEGY D: EXTERNAL MAP TILES & FONTS (CARTO, Esri, Google Fonts)
  // -------------------------------------------------------------
  // STALE-WHILE-REVALIDATE: Cache cartographic tiles & fonts for fast rendering & offline display.
  if (
    url.hostname.includes('basemaps.cartocdn.com') ||
    url.hostname.includes('arcgisonline.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              (networkResponse.status === 200 || networkResponse.type === 'opaque')
            ) {
              const responseClone = networkResponse.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network fetch with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// 4. MESSAGE: Allow clients to command the SW directly
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'GET_VERSION' && event.ports && event.ports[0]) {
    event.ports[0].postMessage({
      version: SW_VERSION,
      buildTime: BUILD_TIME,
    });
  }
});
