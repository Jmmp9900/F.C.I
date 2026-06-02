import path from "path";
import { fileURLToPath } from "url";

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** Dominios ngrok fijos + patrones opcionales (p. ej. dominio reservado de pago). Ver `ngrok.env.example`. */
function extraNgrokDevOrigins(): string[] {
  const raw = process.env.NEXT_DEV_NGROK_HOST_PATTERNS?.trim();
  if (!raw) return [];
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Si el usuario configuró un custom domain para R2 (p. ej. media.fci.com),
 * extraemos el hostname y lo añadimos a `remotePatterns` automáticamente.
 * Así no hay que tocar este archivo cuando cambian el dominio público.
 */
function r2CustomHost(): string | null {
  const url = process.env.R2_PUBLIC_URL?.trim();
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/** CSP para el sitio público (no aplica a /admin ni /api — Payload necesita más permisos). */
function contentSecurityPolicy(): string {
  const r2Host = r2CustomHost();
  const imgHosts = [
    "'self'",
    "data:",
    "blob:",
    "https://*.r2.dev",
    "https://images.unsplash.com",
    ...(r2Host ? [`https://${r2Host}`] : []),
  ];
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgHosts.join(" ")}`,
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), usb=(), payment=()",
  },
  ...(process.env.NODE_ENV === "production"
    ? ([
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ] as const)
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /* Evita que el tracer de módulos suba hasta `C:\Users\Roy\` cuando hay un
     package.json/lockfile suelto en el home del usuario. */
  outputFileTracingRoot: projectRoot,
  /* Evita que Turbopack tome `C:\Users\Roy\package-lock.json` como raíz del
     monorepo cuando hay un lockfile suelto fuera del proyecto. */
  turbopack: {
    root: projectRoot,
  },
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.io",
    "*.ngrok.app",
    ...extraNgrokDevOrigins(),
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    /* Permite `quality` alto en <Image> (p. ej. 88–93) */
    qualities: [75, 80, 85, 88, 90, 92, 93, 95],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      /* Cloudflare R2 — subdominio público por defecto (`pub-<hash>.r2.dev`). */
      { protocol: "https", hostname: "*.r2.dev", pathname: "/**" },
      /* Cloudflare R2 — custom domain del usuario (si está configurado). */
      ...(r2CustomHost()
        ? [{ protocol: "https" as const, hostname: r2CustomHost()!, pathname: "/**" }]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/((?!admin|api).*)",
        headers: [
          ...securityHeaders,
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Content-Security-Policy",
                  value: contentSecurityPolicy(),
                },
              ]
            : []),
        ],
      },
      {
        source: "/admin/:path*",
        headers: securityHeaders,
      },
      {
        source: "/api/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

/**
 * Orden importa: `withNextIntl` se aplica primero (configura el plugin de i18n),
 * luego `withPayload` envuelve el resultado y registra los packages que Payload
 * necesita transpilar (drizzle-kit, sharp, etc.). Ver docs/Payload installation.
 */
export default withPayload(withNextIntl(nextConfig));
