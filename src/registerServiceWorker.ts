/**
 * POSEIDON PWA Service Worker Lifecycle & Auto-Update Manager
 *
 * Guarantees that:
 * 1. Legacy/poisoned caches (e.g. 'poseidon-cache-v1') are immediately purged.
 * 2. Service worker updates are checked proactively on page load, tab visibility change,
 *    and window focus using { updateViaCache: 'none' }.
 * 3. Whenever a new deployment is detected, the new worker activates immediately
 *    and the active page reloads seamlessly to display the latest deployed version.
 */

const LEGACY_CACHE_NAMES = ['poseidon-cache-v1'];

export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // 1. Proactively purge known legacy caches directly from window context
  if ('caches' in window) {
    window.caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          if (LEGACY_CACHE_NAMES.includes(key)) {
            console.log('[Poseidon PWA] Removing legacy cache key from window:', key);
            window.caches.delete(key);
          }
        });
      })
      .catch((err) => {
        console.debug('[Poseidon PWA] Cache inspection error:', err);
      });
  }

  // 2. Only register on HTTP/HTTPS
  if (!window.location.protocol.startsWith('http')) {
    return;
  }

  let registrationRef: ServiceWorkerRegistration | null = null;

  window.addEventListener('load', async () => {
    try {
      // updateViaCache: 'none' ensures browser ignores any HTTP cache for sw.js itself
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      registrationRef = registration;
      console.log('[Poseidon PWA] Service Worker registered with scope:', registration.scope);

      // Immediately check for a fresh version from network
      registration.update().catch((err) => {
        console.debug('[Poseidon PWA] SW initial update check error:', err);
      });

      // Detect when an updated service worker is found and installed
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        console.log('[Poseidon PWA] New service worker version found, installing...');

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('[Poseidon PWA] New service worker installed. Triggering skipWaiting.');
              installingWorker.postMessage({ type: 'SKIP_WAITING' });
            } else {
              console.log('[Poseidon PWA] Service worker installed for the first time.');
            }
          }
        });
      });

      // Periodically check for updates (every 15 minutes)
      setInterval(() => {
        if (registrationRef) {
          registrationRef.update().catch(() => {});
        }
      }, 15 * 60 * 1000);

      // Proactively check for updates whenever user returns to tab
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && registrationRef) {
          registrationRef.update().catch(() => {});
        }
      });

      window.addEventListener('focus', () => {
        if (registrationRef) {
          registrationRef.update().catch(() => {});
        }
      });
    } catch (error) {
      console.warn('[Poseidon PWA] Service Worker registration failed:', error);
    }
  });

  // 3. Controller change listener: When new SW activates and claims clients, reload page
  let isRefreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (isRefreshing) return;
    isRefreshing = true;
    console.log('[Poseidon PWA] Controller changed: auto-reloading to load the latest deployed version.');
    window.location.reload();
  });
}
