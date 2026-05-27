"use client";

import { useEffect } from "react";

/**
 * En dev detrás de ngrok, los `fetch` del navegador (RSC, server actions,
 * /api/*) reciben el HTML del aviso de interstitial si les falta el header
 * `ngrok-skip-browser-warning`, lo que rompe la app o la deja en bucle.
 *
 * Este componente parchea `window.fetch` para añadir ese header cuando
 * detecta que el host actual contiene "ngrok". En localhost (caso normal)
 * o en producción es un no-op.
 *
 * Se ejecuta una sola vez por sesión de navegación (flag `__ngrokFetchPatched`).
 * Usar un componente client con `useEffect` evita el warning de React 19 que
 * disparan los `<script dangerouslySetInnerHTML>` en sub-layouts del App Router.
 */
export function NgrokFetchPatch() {
  useEffect(() => {
    try {
      const w = window as unknown as {
        __ngrokFetchPatched?: number;
        fetch: typeof fetch;
      };
      if (typeof location === "undefined") return;
      if (location.hostname.indexOf("ngrok") === -1) return;
      if (!w.fetch || w.__ngrokFetchPatched) return;
      w.__ngrokFetchPatched = 1;

      const original = w.fetch.bind(w);
      w.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
        const nextInit: RequestInit = init ? { ...init } : {};

        if (typeof Request !== "undefined" && input instanceof Request) {
          const headers = new Headers(input.headers);
          if (!headers.has("ngrok-skip-browser-warning")) {
            headers.set("ngrok-skip-browser-warning", "1");
          }
          const patched = new Request(input, { headers });
          return original(patched, nextInit);
        }

        const headers = new Headers(nextInit.headers ?? {});
        if (!headers.has("ngrok-skip-browser-warning")) {
          headers.set("ngrok-skip-browser-warning", "1");
        }
        nextInit.headers = headers;
        return original(input, nextInit);
      };
    } catch {
      /* silencioso: si algo del polyfill falla, no queremos romper la página */
    }
  }, []);

  return null;
}
