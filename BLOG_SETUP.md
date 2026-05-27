# Setup del CMS (Payload) — DEMO local

Este documento te guía para arrancar la **primera demo del panel admin del blog**
en tu propia máquina con SQLite. Cuando despleguemos al VPS, migraremos a
PostgreSQL — solo cambia 1 línea del `payload.config.ts`.

## 1. Pre-requisitos

- Node.js **20.9+** (idealmente la versión fija por `volta` en `package.json` → 24.15.0).
  Si tienes [Volta](https://volta.sh), se selecciona sola.
- `npm` (viene con Node).

## 2. Borrar la carpeta vacía sobrante

Al reestructurar el `app/` quedó una carpeta vacía. Bórrala antes de instalar:

```powershell
Remove-Item -Recurse -Force "app/[locale]"
```

> Si la carpeta no existe, ignora este paso. No pasa nada si se queda — Next.js la
> ignora — pero es ruido visual.

## 3. Crear el archivo `.env`

Copia `.env.example` a `.env` y genera un secreto fuerte para Payload:

```powershell
Copy-Item .env.example .env
node -e "console.log('PAYLOAD_SECRET=' + require('crypto').randomBytes(48).toString('hex'))"
```

Pega el valor que imprime el segundo comando dentro de `.env` reemplazando el
`PAYLOAD_SECRET=...` por defecto.

## 4. Instalar dependencias

Payload pide explícitamente `--legacy-peer-deps` cuando se usa npm:

```powershell
npm install --legacy-peer-deps
```

Esto descargará Payload + SQLite adapter + Sharp + Lexical editor + Next.js
16.2.6+ + React 19. Tarda ~2-3 minutos la primera vez.

## 5. Generar el import map de Payload

Necesario solo la primera vez (y cada vez que cambien componentes custom):

```powershell
npm run generate:importmap
```

## 6. Arrancar el servidor

```powershell
npm run dev
```

Abrirá Next en `http://localhost:3000`.

- `http://localhost:3000/` → redirige a `/es` (el sitio público existente, intacto).
- `http://localhost:3000/admin` → Payload te pedirá **crear el primer usuario**
  (será admin). Email + contraseña + nombre. **Anótalos**.

## 7. Probar la creación de un post

1. Login en `/admin`.
2. Menú lateral → **Categories** → *Create new* → nombre "Educación" (es) y "Education" (en) — usa el selector de idioma arriba a la derecha del formulario para cambiar entre `es` y `en`.
3. Vuelve al dashboard → **Media** → *Create new* → sube una imagen de prueba.
   Notar que Payload genera automáticamente versiones `thumbnail`, `card`, `hero`.
4. **Posts** → *Create new*:
   - Título (en español).
   - Slug: `mi-primer-post`.
   - Excerpt corto.
   - Cover: selecciona la imagen que subiste.
   - Body: editor rico (negrita, listas, enlaces, imágenes embebidas, citas…).
   - Asocia la categoría que creaste.
   - Status: *Publicado*. Featured: marcado.
5. Cambia el selector de idioma a `en` y traduce los campos localizables.
6. Save.

El post quedó guardado en **`payload.db`** (SQLite, en la raíz del proyecto).
Puedes inspeccionarlo con [DB Browser for SQLite](https://sqlitebrowser.org/) si
quieres ver el esquema generado.

## 8. Probar la API REST

Mientras el dev server corre, en el navegador:

- `http://localhost:3000/api/posts?locale=es&draft=false&depth=2`
- `http://localhost:3000/api/categories?locale=es`
- `http://localhost:3000/api/media`

Estas son las endpoints que el frontend público consumirá cuando construyamos
las páginas `/blog`.

## 9. ¿Qué viene después? (siguiente fase)

Una vez que confirmes que el admin te gusta, sigo con:

- Página pública `/[locale]/blog` (listado).
- Página pública `/[locale]/blog/[slug]` (detalle).
- Conectar `PublicationsTeaser` y `NexusTeaser` del home a los posts `featured`.
- Buscador, posts relacionados, RSS.
- Migrar de SQLite → PostgreSQL.
- Setup del VPS HostGator Snappy (Node + Postgres + Nginx + PM2 + Let's Encrypt).
- Backups automáticos a Cloudflare R2.

## Estructura nueva del proyecto

```
sitio-institucional/
├─ app/
│  ├─ (frontend)/              ← sitio público (URL pública sin prefijo)
│  │  ├─ layout.tsx            ← layout raíz del frontend (fuentes, ngrok)
│  │  ├─ page.tsx              ← redirect / → /es
│  │  └─ [locale]/             ← rutas bilingües
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  ├─ (payload)/               ← panel admin + API (URL pública sin prefijo)
│  │  ├─ layout.tsx
│  │  ├─ custom.scss
│  │  ├─ admin/
│  │  │  ├─ importMap.js
│  │  │  └─ [[...segments]]/   ← captura /admin, /admin/users, /admin/posts/123…
│  │  └─ api/
│  │     ├─ [...slug]/         ← REST: /api/posts, /api/media, …
│  │     ├─ graphql/
│  │     └─ graphql-playground/
│  ├─ components/              ← componentes del frontend (sin cambios)
│  ├─ lib/                     ← utilidades del frontend (sin cambios)
│  └─ globals.css              ← estilos globales del frontend
├─ collections/                ← modelos del CMS
│  ├─ Users.ts
│  ├─ Media.ts
│  ├─ Categories.ts
│  ├─ Tags.ts
│  ├─ Posts.ts
│  └─ NewsletterSubscribers.ts
├─ i18n/                       ← config next-intl (sin cambios)
├─ messages/                   ← traducciones del frontend (sin cambios)
├─ public/
│  └─ uploads/                 ← imágenes subidas por Payload (gitignored)
├─ payload.config.ts           ← configuración central de Payload
├─ payload.db                  ← BD SQLite local (gitignored)
├─ payload-types.ts            ← tipos TS autogenerados (gitignored)
├─ next.config.ts              ← envuelto con withPayload
├─ proxy.ts                    ← Next 16 middleware (next-intl + redirect raíz)
└─ tsconfig.json               ← incluye alias @payload-config
```

## Solución de problemas frecuentes

### `Error: Cannot find module '@payload-config'`

`tsconfig.json` ya tiene el alias configurado, pero Next.js a veces necesita
reiniciar el dev server para recogerlo. Mata el proceso (Ctrl+C) y vuelve a
`npm run dev`.

### `ERESOLVE: unable to resolve dependency tree` al hacer `npm install`

Olvidaste `--legacy-peer-deps`. Borra `node_modules/` y `package-lock.json` y
vuelve a instalar con la flag.

### El admin se ve raro / faltan componentes

Corre `npm run generate:importmap` y reinicia el dev server.

### Error de fuentes Google (Inter / Cinzel) al arrancar

Es por proxy/firewall corporativo bloqueando `fonts.googleapis.com`. La primera
ejecución descarga las fuentes; las siguientes usan caché. Si persiste, prueba
con red móvil para que se cacheen.

### Quiero borrar todo y empezar de cero

```powershell
Remove-Item -Recurse -Force node_modules, .next, payload.db, payload.db-journal, payload-types.ts
Remove-Item -Recurse -Force public/uploads -ErrorAction SilentlyContinue
npm install --legacy-peer-deps
npm run dev
```

Te pedirá crear el primer usuario admin de nuevo.
