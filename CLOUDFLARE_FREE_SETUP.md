# Cloudflare Free: auditoria e inspeccion

Guia corta para dejar el sitio listo en plan Free con foco en seguridad, inspeccion y rendimiento.

## 1) DNS y SSL

1. Agrega tu dominio a Cloudflare y cambia nameservers en tu registrador.
2. En `DNS`, crea/valida tus registros (`A`, `CNAME`).
3. Activa proxy naranja en los registros web (`Proxied`).
4. En `SSL/TLS`:
   - `Overview` -> modo `Full (strict)`.
   - `Edge Certificates` -> activa `Always Use HTTPS`.
   - `Automatic HTTPS Rewrites` -> ON.

## 2) Seguridad basica (Free)

1. `Security` -> `WAF`:
   - Activa Managed Ruleset de Cloudflare.
   - En Browser Integrity Check -> ON.
2. `Security` -> `Bots`:
   - Bot Fight Mode -> ON.
3. `Security` -> `Settings`:
   - Security Level -> `Medium` (inicio recomendado).
4. `Security` -> `DDoS`:
   - Deja proteccion automatica activa (default).

## 3) Rate Limiting (inspeccion y control)

En `Security` -> `WAF` -> `Rate limiting rules`:

- Regla 1 (global suave):
  - Path: `/*`
  - Umbral inicial: 120 req / 1 min por IP
  - Accion: `Managed Challenge`
- Regla 2 (rutas sensibles cuando existan):
  - Path: `/api/*` o `/login*`
  - Umbral inicial: 30 req / 1 min por IP
  - Accion: `Block` o `Managed Challenge`

## 4) Observabilidad para auditorias

1. `Security` -> `Events`: revisa bloqueos/challenges.
2. `Analytics` -> `Security`: monitorea picos y ASNs.
3. `Web Analytics` (si aun no):
   - Activa y agrega script para metricas de trafico.
4. Crea alertas en `Notifications`:
   - Incremento de amenazas.
   - Picos de 4xx/5xx.

## 5) Reglas de cache y rendimiento

1. `Speed`:
   - Brotli -> ON
   - Early Hints -> ON (si disponible)
2. `Caching`:
   - Browser Cache TTL: 4h a 1d (inicio).
3. `Rules` -> `Cache Rules`:
   - Para `/_next/static/*`: cache agresiva (respeta hash).
   - Excluir rutas dinamicas si luego agregas API sensible.

## 6) CSP en modo auditoria (recomendado primero)

Evita bloquear trafico real al inicio. Configura un header:

- `Content-Security-Policy-Report-Only`

Ejemplo inicial:

`default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; font-src 'self' https: data:; connect-src 'self' https:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'`

Cuando no veas violaciones criticas en reportes, pasalo a `Content-Security-Policy` estricto.

## 7) Lo que ya quedo en este proyecto

Se agregaron headers base en `next.config.ts`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-DNS-Prefetch-Control: on`
- `Permissions-Policy` restrictiva
- `Strict-Transport-Security`
- `poweredByHeader: false`

Estos ayudan en auditorias (Mozilla Observatory / SecurityHeaders) y complementan Cloudflare.
