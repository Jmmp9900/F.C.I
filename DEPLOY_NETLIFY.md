# Deploy a Netlify + Neon + Cloudflare R2 + dominio en HostGator

Guía paso a paso end-to-end. Tres servicios externos, todos **gratis** dentro de los free tiers, todos con uso comercial permitido por sus términos.

> **Tiempo estimado total:** 2–3 horas la primera vez, incluyendo propagación de DNS.
>
> **Pre-requisitos cumplidos:**
> - Repositorio en GitHub ✓
> - Dominio registrado en HostGator ✓
> - Código preparado para producción (adapter dual SQLite/Postgres, storage S3-compatible, hardening) ✓
> - `netlify.toml` con plugin de Next.js ✓
>
> **Cuentas que vas a crear (todas gratis):**
> - **Netlify** — hosting + funciones serverless (uso comercial permitido en Free tier).
> - **Neon** — PostgreSQL gestionado (Free 500 MB).
> - **Cloudflare** — bucket R2 para imágenes (Free 10 GB + sin egress fees).
>
> **Costo total:** $0/mes mientras estés dentro de los free tiers. Margen amplio para una consultora arrancando.

---

## Resumen del flujo

```
┌─────────────────┐
│ GitHub (repo)   │ ──── git push ────► auto-deploy
└─────────────────┘
         │
         ▼
┌─────────────────┐     queries SQL     ┌──────────────┐
│ Netlify         │ ◄──────────────────► │ Neon         │
│ (Next.js + API) │                      │ (PostgreSQL) │
└─────────────────┘                      └──────────────┘
         │
         │ uploads vía S3 API
         ▼
┌─────────────────┐     CDN              ┌──────────────┐
│ Cloudflare R2   │ ──────────────────► │ media.tu...  │
│ (bucket)        │                      │ (custom dom) │
└─────────────────┘                      └──────────────┘
```

---

## Fase 0 — Verificar el código local antes de subir

Desde la raíz del proyecto, en tu PowerShell:

```powershell
# 1. Instala las nuevas dependencias (storage-s3, aws-sdk, plugin-nextjs)
npm install --legacy-peer-deps

# 2. Verifica que el sitio sigue corriendo en local con SQLite
npm run dev
```

Debes ver `Local: http://localhost:3000` y poder visitar `/es`, `/es/publicaciones`, `/es/contacto`. Si algo se rompe, lo arreglamos antes de seguir. **No subas a Netlify código que no compila localmente.**

Cuando esté OK, detén el server (Ctrl+C) y continúa.

---

## Fase 1 — Subir el repo a GitHub

```powershell
git status
git add -A
git commit -m "feat: deploy a Netlify (storage-s3 + Cloudflare R2 + Neon)"
git push
```

Si la rama es `main`, listo. Si trabajas en otra rama, podemos hacer merge a `main` después; Netlify deploya desde la rama que le digas.

---

## Fase 2 — Crear cuenta en Neon (PostgreSQL gestionado)

1. Ve a https://neon.tech
2. Click en **"Sign up"** → elige **"Continue with GitHub"** (más rápido).
3. Una vez dentro, te pedirá crear un proyecto:
   - **Project name:** `fci-sitio` (o como quieras, es interno)
   - **PostgreSQL version:** la última (17 al momento de escribir esto)
   - **Region:** elige la más cercana a tu audiencia. Para LatAm/España, **AWS US East (N. Virginia)** funciona bien. Para Europa, **AWS Europe (Frankfurt)**.
   - **Database name:** `sitio` (o lo que prefieras)
4. Click en **"Create project"**.
5. Te muestra una pantalla con el **connection string**. Tiene este formato:

   ```
   postgres://neondb_owner:abc123def456@ep-cool-name-xx.us-east-2.aws.neon.tech/sitio?sslmode=require
   ```

6. **Cópialo y guárdalo** en un archivo temporal seguro. Lo vas a usar en Netlify.

> ⚠️ Si no ves el connection string, ve a **Dashboard → tu proyecto → Connection Details** y cópialo. Usa la versión **"pooled connection"** (importante para serverless): el host incluye `-pooler` en el subdominio. Sin pooler, en picos de tráfico vas a agotar las conexiones de Postgres.

---

## Fase 3 — Crear bucket en Cloudflare R2

R2 es el storage S3-compatible de Cloudflare. 10 GB gratis para siempre, sin cobros por egress (el ancho de banda saliente es gratis, a diferencia de AWS S3). Aquí guardamos todas las imágenes que el cliente sube al admin.

### 3.1 — Activar R2 en Cloudflare

1. Ve a https://dash.cloudflare.com (si no tienes cuenta, créala con email — no requiere tarjeta).
2. En el menú lateral, click en **"R2 Object Storage"**.
3. La primera vez te pide aceptar términos y **añadir un método de pago**. Sí, R2 exige tarjeta aunque el free tier sea $0 (es para evitar abuso). **No te cobra nada** mientras no superes 10 GB de storage o 1M de operaciones/mes.
4. Acepta y agrega la tarjeta.

### 3.2 — Crear el bucket

1. Dentro de R2, click en **"Create bucket"**.
2. **Bucket name:** `fci-media` (o como quieras, en minúsculas, sin espacios).
3. **Location:** *Automatic* (Cloudflare elige la región óptima).
4. **Storage class:** *Standard*.
5. Click en **"Create bucket"**.

### 3.3 — Hacer el bucket accesible públicamente

Hay dos opciones. Recomiendo la (b) en producción, pero la (a) sirve para probar primero.

**Opción (a) — Subdominio gratuito de R2 (rápido para testing):**

1. Dentro del bucket → tab **"Settings"**.
2. Sección **"Public access"** → click en **"Allow Access"** bajo **"R2.dev subdomain"**.
3. Confirma. Cloudflare habilita una URL pública como `https://pub-abcd1234efgh5678.r2.dev`.
4. **Copia esa URL** — la usarás como `R2_PUBLIC_URL` en Netlify.

**Opción (b) — Custom domain (recomendado en producción):**

> Pre-requisito: el dominio debe estar gestionado por Cloudflare (o al menos sus DNS). Si HostGator gestiona el DNS, primero hay que mover los DNS a Cloudflare (es gratis, lo explico al final).

1. Tab **"Settings"** → **"Custom Domains"** → **"Connect Domain"**.
2. Escribe `media.tudominio.com` (subdominio, no el apex).
3. Cloudflare crea automáticamente el CNAME y emite el certificado SSL en ~1 minuto.
4. **Copia la URL final:** `https://media.tudominio.com` — esa es tu `R2_PUBLIC_URL`.

### 3.4 — Crear API token para Payload

1. Sal del bucket. En el menú lateral de R2 → click en **"Manage R2 API Tokens"**.
2. Click en **"Create API token"**.
3. Configura:
   - **Token name:** `payload-fci-prod`
   - **Permissions:** **Object Read & Write**
   - **Specify bucket:** selecciona `fci-media` (el que creaste).
   - **TTL:** deja "Forever" o pon una fecha lejana (recomendado: 1 año, para rotación).
4. Click en **"Create API Token"**.
5. ⚠️ Cloudflare te muestra **una sola vez** estos cuatro valores. Cópialos a un archivo temporal seguro:
   - **Access Key ID** → será tu `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → será tu `R2_SECRET_ACCESS_KEY`
   - **S3 API endpoint** → del formato `https://<account_id>.r2.cloudflarestorage.com` → será tu `R2_ENDPOINT`
   - (Account ID también aparece, lo necesitas si no muestra el endpoint completo).

### 3.5 — Configurar CORS del bucket

Para que el admin de Payload pueda subir desde el browser, el bucket necesita CORS:

1. Vuelve al bucket `fci-media` → tab **"Settings"** → sección **"CORS Policy"**.
2. Click en **"Add CORS policy"** y pega:

   ```json
   [
     {
       "AllowedOrigins": [
         "https://tudominio.com",
         "https://www.tudominio.com",
         "https://NOMBRE-PROYECTO.netlify.app",
         "http://localhost:3000"
       ],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

   > Reemplaza `tudominio.com` y `NOMBRE-PROYECTO.netlify.app` por los que correspondan. Si todavía no sabes el subdominio de Netlify, puedes agregarlo después del primer deploy.

3. Guarda.

---

## Fase 4 — Crear cuenta en Netlify y conectar el repo

1. Ve a https://netlify.com
2. Click en **"Sign up"** → **"GitHub"** (usa la misma cuenta de GitHub donde está el repo).
3. Acepta los permisos para que Netlify lea tus repos.
4. En el dashboard, click en **"Add new site"** → **"Import an existing project"** → **"Deploy with GitHub"**.
5. Aparece la lista de tus repos. Busca el del sitio y click en él.
6. Pantalla **"Site configuration"**:
   - **Team:** tu cuenta personal.
   - **Branch to deploy:** `main` (o la rama que uses).
   - **Base directory:** déjalo vacío.
   - **Build command:** `npm run build` (Netlify lo lee de `netlify.toml`, pero confírmalo).
   - **Publish directory:** `.next` (también lo lee de `netlify.toml`).
   - **Functions directory:** déjalo por defecto.
7. **NO hagas click en "Deploy site" todavía.** Primero hay que poner las variables de entorno.

---

## Fase 5 — Variables de entorno en Netlify

Antes de deployar, configurar todas las variables. En la misma pantalla de "Site configuration":

1. Click en **"Add environment variables"** → **"New variable"** (o ve a "Site settings → Environment variables" después).
2. Una a una, agrega estas:

### 5.1 — `PAYLOAD_SECRET` (obligatoria)

Genera un secreto nuevo (NO uses el de tu `.env.local`):

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copia la cadena. En Netlify:

- **Key:** `PAYLOAD_SECRET`
- **Value:** la cadena que copiaste
- **Deploy contexts:** marca *All scopes / All deploy contexts*

### 5.2 — `DATABASE_URI` (obligatoria)

- **Key:** `DATABASE_URI`
- **Value:** el connection string de Neon (Fase 2, paso 6 — el **pooled**).
- **Deploy contexts:** All scopes.

### 5.3 — Variables de Cloudflare R2 (obligatorias)

Estas activan el storage de Media. Sin ellas, las subidas de imágenes fallan con error de filesystem.

| Key | Value (de la Fase 3) |
|---|---|
| `R2_BUCKET` | `fci-media` |
| `R2_ENDPOINT` | `https://<account_id>.r2.cloudflarestorage.com` |
| `R2_ACCESS_KEY_ID` | (lo que copiaste en 3.4) |
| `R2_SECRET_ACCESS_KEY` | (lo que copiaste en 3.4) |
| `R2_PUBLIC_URL` | `https://media.tudominio.com` *o* `https://pub-<hash>.r2.dev` |

> ⚠️ `R2_ENDPOINT` debe incluir `https://`. `R2_PUBLIC_URL` también, **sin** slash final.

### 5.4 — `NEXT_PUBLIC_SITE_URL` (obligatoria)

Por ahora pon la URL temporal que te dará Netlify (algo como `https://fci-sitio.netlify.app`). Después la cambiaremos por el dominio del cliente en la Fase 9.

- **Key:** `NEXT_PUBLIC_SITE_URL`
- **Value:** `https://NOMBRE-PROYECTO.netlify.app` (lo verás definitivo después del primer deploy)
- **Deploy contexts:** Production.

> Si todavía no sabes el nombre exacto, déjalo en blanco y vuelves a esta sección después del primer deploy.

### 5.5 — Variables opcionales

Si las tienes ahora, agrégalas; si no, las pones después en **Site settings → Environment variables**.

| Variable | Para qué | Ejemplo |
|---|---|---|
| `NEXT_PUBLIC_CONTACT_EMAIL` | mailto: en `/contacto` | `hola@tudominio.com` |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | botón WhatsApp del hero/contacto | `573001234567` |
| `NEXT_PUBLIC_WHATSAPP_MESSAGE` | mensaje inicial WhatsApp | `Hola, vengo del sitio FCI` |
| `NEXT_PUBLIC_SCHEDULE_URL` | botón Cal.com/Calendly | `https://cal.com/tuusuario` |

Cuando termines, click en **"Deploy site"** abajo.

---

## Fase 6 — Primer build en Netlify (3–6 minutos)

Netlify arranca el build. Verás logs en vivo. Pasos que ocurren:

1. ✓ Clone del repo
2. ✓ `npm install --legacy-peer-deps` (lo activa `NPM_FLAGS` en `netlify.toml`)
3. ✓ `next build` (Payload genera importmap, Next compila todo)
4. ✓ `@netlify/plugin-nextjs` empaqueta las funciones serverless
5. ✓ Deploy a la CDN global

Cuando termina, Netlify muestra el **link público** del sitio: `https://NOMBRE-ALEATORIO.netlify.app`. Click en ese link.

### Qué deberías ver

- ✓ El home del sitio FCI carga correctamente.
- ✓ Las rutas `/es`, `/es/publicaciones`, `/es/contacto`, `/en`, etc. funcionan.
- ⚠️ El admin `/admin` puede tardar 10–30 segundos la primera vez (Payload está corriendo migraciones contra Neon). Es normal — solo pasa una vez.

### Personalizar el subdominio

Por defecto Netlify te da un nombre aleatorio (`festive-tesla-abc123.netlify.app`). Cambiarlo:

1. **Site configuration → Site details → Change site name**.
2. Escribe `fci-sitio` (o lo que prefieras). Te queda `fci-sitio.netlify.app`.
3. Actualiza `NEXT_PUBLIC_SITE_URL` con esta nueva URL si todavía no estabas usando dominio propio.

---

## Fase 7 — Crear primer usuario admin en producción

1. Abre `https://NOMBRE-PROYECTO.netlify.app/admin`
2. Verás el formulario **"Create First User"** (la BD está vacía).
3. Crea el usuario admin del cliente:
   - **Email:** el del cliente o un alias administrativo
   - **Password:** algo robusto (guárdalo en un gestor)
4. Una vez dentro, ve a **Collections → Media** y sube al menos una imagen de prueba. **Verifica que la URL de la imagen apunte a `R2_PUBLIC_URL` y NO a `/api/media/...`** — eso confirma que el storage S3 está activo.
5. Ve a **Collections → Posts** y crea un post para verificar que todo funciona.

Si los posts no aparecen en el frontend (`/es/publicaciones`), revisa que estén en estado **"Published"** y que tengan idiomas en ambos `es` y `en`.

### (Opcional) Correr el seed en producción

Si quieres poblar contenido de muestra (categorías + tags + 3 posts):

```powershell
# En tu máquina local, apuntando a la BD de producción:
$env:DATABASE_URI="postgres://...la-misma-string-de-neon..."
$env:PAYLOAD_SECRET="...el-mismo-secret-de-netlify..."
$env:R2_BUCKET="fci-media"
$env:R2_ENDPOINT="https://..."
$env:R2_ACCESS_KEY_ID="..."
$env:R2_SECRET_ACCESS_KEY="..."
$env:R2_PUBLIC_URL="https://..."
npm run seed
```

Para que cree los posts, ya tienes que haber subido al menos UNA imagen en `/admin/collections/media`.

---

## Fase 8 — Apuntar el dominio del cliente desde HostGator a Netlify

### 8.1 — En Netlify: añadir el dominio

1. Abre tu sitio en Netlify.
2. **Site configuration → Domain management → Add a domain**.
3. Escribe el dominio del cliente sin `https://`:
   - `tudominio.com` (sin www)
4. Netlify pregunta si lo posees → click en **"Yes, add domain"**.
5. Netlify te muestra los **registros DNS** que debes configurar en HostGator. Apúntalos.

Para el apex (raíz) tienes dos opciones — Netlify recomienda la primera:

**Opción A (recomendada): registros A apex apuntando a la load balancer de Netlify**

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` (o `tudominio.com`) | `75.2.60.5` *(la IP que Netlify te muestra; verifícala en pantalla)* |
| CNAME | `www` | `NOMBRE-PROYECTO.netlify.app` |

**Opción B: ALIAS / ANAME apex (si HostGator lo soporta — algunos paneles cPanel no)**

| Tipo | Nombre | Valor |
|---|---|---|
| ALIAS | `@` | `apex-loadbalancer.netlify.com` |
| CNAME | `www` | `NOMBRE-PROYECTO.netlify.app` |

### 8.2 — En HostGator: configurar los DNS

1. Entra al **cPanel de HostGator** (https://gator####.hostgator.com:2083 o el que te dieron).
2. Busca el ícono **"Zone Editor"** (o "Editor de zonas DNS").
3. Click en **"Manage"** al lado del dominio del cliente.
4. **Elimina** los registros A existentes para `@` y `www` que apuntan a IPs de HostGator (ej. `192.185.x.x`).
5. **Crea los nuevos registros** con los valores que te dio Netlify:

| Tipo | Nombre | Valor | TTL |
|---|---|---|---|
| A | `@` | `75.2.60.5` *(o la IP que te muestre Netlify)* | 14400 |
| CNAME | `www` | `NOMBRE-PROYECTO.netlify.app` | 14400 |

6. Guarda los cambios.

### 8.3 — Esperar propagación DNS

Los DNS tardan entre **5 minutos y 24 horas** en propagarse. Lo normal es 15–60 minutos.

Verificar progreso: https://dnschecker.org → pega `tudominio.com`.

Netlify detecta automáticamente cuando los DNS están correctos y emite el certificado SSL (Let's Encrypt). Verás un check verde junto al dominio en **Domain management**.

### 8.4 — Forzar HTTPS

Cuando el SSL esté listo:

1. **Domain management → HTTPS** → activa **"Force HTTPS"**.
2. Activa también **"Asset optimization"** si quieres minificación adicional (opcional, Next.js ya lo hace).

### 8.5 — Actualizar `NEXT_PUBLIC_SITE_URL` y CORS de R2

Cuando el dominio ya funcione:

1. **Site settings → Environment variables** → edita `NEXT_PUBLIC_SITE_URL` → cámbiala a `https://tudominio.com`.
2. **Deploys → Trigger deploy → Deploy site** (re-deploy para que el cambio surta efecto).
3. Vuelve al bucket R2 en Cloudflare → **Settings → CORS Policy** y agrega `https://tudominio.com` y `https://www.tudominio.com` a `AllowedOrigins` si no lo hiciste en la Fase 3.5.

Esto actualiza sitemap.xml, robots.txt, canonical URLs y OpenGraph para usar el dominio real.

---

## Fase 9 — Verificación final

Visita todo esto en orden y confirma que funciona:

| URL | Esperado |
|---|---|
| `https://tudominio.com` | Redirige a `/es` |
| `https://tudominio.com/es` | Home, sin errores en consola |
| `https://tudominio.com/es/publicaciones` | Listado del blog |
| `https://tudominio.com/es/publicaciones/<slug>` | Detalle de un post |
| `https://tudominio.com/es/contacto` | Form de contacto |
| `https://tudominio.com/en/posts` | Versión EN |
| `https://tudominio.com/sitemap.xml` | XML con todas las URLs |
| `https://tudominio.com/robots.txt` | Texto plano |
| `https://tudominio.com/admin` | Login de Payload |

Pruebas funcionales:

- **Sube una imagen** desde `/admin/collections/media` → verifica que la URL pública apunte a R2 (`media.tudominio.com/...` o `pub-xxx.r2.dev/...`).
- **Envía el formulario de contacto** → verifica que aparezca en `/admin/collections/contacts`.
- **Suscríbete al newsletter** desde el footer → verifica que aparezca en `/admin/collections/newsletter-subscribers`.
- **Crea un nuevo post**, márcalo *Published*, y verifica que aparezca en `/es/publicaciones` en <30 segundos (la revalidación ISR es automática gracias a los hooks de Payload).

---

## 🎉 Listo

El sitio está en producción. El cliente puede entrar a `/admin` con sus credenciales y empezar a publicar contenido.

Cada vez que hagas `git push` al `main`, Netlify deploya automáticamente la nueva versión en ~3 minutos.

---

## Troubleshooting

### Build falla: `Module not found: '@payloadcms/storage-s3'`
Olvidaste correr `npm install --legacy-peer-deps` localmente antes del primer commit. Hazlo, commitea el `package-lock.json` actualizado y push.

### Error 500 en `/admin`
Verifica que `DATABASE_URI` esté seteada correctamente y empieza con `postgres://`. En Neon → "Operations" puedes ver si las queries están llegando. Confirma que estás usando la connection string **pooled**.

### Imágenes 404 después de subirlas
1. Verifica que las 5 variables de R2 estén en Netlify.
2. Verifica que el bucket tenga **public access** activado (Fase 3.3).
3. Verifica que `R2_PUBLIC_URL` no tenga slash final (ej. `https://media.tudominio.com` ✓, `https://media.tudominio.com/` ✗).
4. Mira los logs en Netlify (**Functions → tu función → Logs**) durante la subida.

### Subida desde el admin falla con CORS error
Falta agregar el dominio actual a la **CORS Policy del bucket R2** (Fase 3.5). El error en consola del browser dice algo como `blocked by CORS policy: No 'Access-Control-Allow-Origin' header`.

### Build excede 60 segundos o se queda colgado en `next build`
Netlify Free tiene 1 build concurrente y 300 minutos/mes. Un build de este proyecto toma 3–6 minutos. Si te quedas sin minutos: Netlify Personal $9/mes o Pro $20/mes.

### Función excede 60s de timeout
60s es el límite del Free tier. Si Payload se queda colgado en alguna operación pesada (importar 1000 posts, migración grande), considera:
- Optimizar la operación (paginar, batchear).
- Mover a una Background Function (15 min de timeout, disponible en Free).
- Upgradear a Pro (26s → bumpeable, pero ya tienes 60s; el upgrade no ayuda mucho aquí).

### El cliente quiere migrar el dominio fuera de HostGator después
No es necesario tocar Netlify. Solo cambia los DNS donde el dominio esté apuntando (Cloudflare, Namecheap, etc.) con los mismos valores de la Fase 8.

### Quieres mover DNS de HostGator a Cloudflare (para usar custom domain de R2)
1. En Cloudflare → **Add a Site** → escribe `tudominio.com`.
2. Cloudflare escanea los DNS actuales de HostGator y los importa.
3. Cloudflare te da **2 nameservers** (algo como `ada.ns.cloudflare.com` y `bob.ns.cloudflare.com`).
4. En HostGator → **Domain Manager → Name Servers** → reemplaza los de HostGator por los de Cloudflare.
5. Espera 24h. Después, todos los DNS los gestionas desde Cloudflare (gratis) y desbloquea el custom domain de R2.

---

## Costos reales

| Servicio | Plan free | Cuando upgradear |
|---|---|---|
| **Netlify Free** | $0/mes — 300 créditos (~100 GB-h de funciones), bandwidth generoso, 60s timeout. **Uso comercial permitido.** | Si pasas de los créditos → Personal $9/mes o Pro $20/mes |
| **Neon Free** | $0/mes — 0.5 GB storage, autosuspend después de 5 min inactividad | Si pasas de 0.5 GB → Neon Launch $19/mes |
| **Cloudflare R2 Free** | $0/mes — 10 GB storage, 1M class A ops/mes, 10M class B ops/mes, **0 egress fees** | Si pasas de 10 GB → $0.015/GB/mes (muy barato) |
| **Cloudflare DNS** | $0/mes — ilimitado | Nunca |
| **Total inicial** | **$0/mes** | Solo pagas cuando crece de verdad |

Para una consultora arrancando con ~10 000 visitas/mes y ~500 MB de imágenes, todo gratis durante años.

### Cuándo considerar el upgrade

- **Tráfico real >50 000 visitas/mes:** evaluar Netlify Personal ($9/mes) o Pro ($20/mes).
- **Storage de imágenes >10 GB:** R2 cobra $0.15/GB/mes después → $1.50/mes extra por cada 10 GB.
- **BD >500 MB:** Neon Launch $19/mes (10 GB).

En el peor caso, el stack completo cuesta $20–30/mes para volúmenes que ya implican un negocio sólido.

---

## Apéndice — Resumen de variables de entorno

```ini
# Obligatorias
PAYLOAD_SECRET=secret_largo_aleatorio
DATABASE_URI=postgres://user:pass@host-pooler/db?sslmode=require
NEXT_PUBLIC_SITE_URL=https://tudominio.com

# Storage de Media (Cloudflare R2)
R2_BUCKET=fci-media
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_PUBLIC_URL=https://media.tudominio.com

# Opcionales
NEXT_PUBLIC_CONTACT_EMAIL=hola@tudominio.com
NEXT_PUBLIC_WHATSAPP_PHONE=573001234567
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hola, vengo del sitio
NEXT_PUBLIC_SCHEDULE_URL=https://cal.com/tu-usuario

# Cuando integremos email transaccional (futuro)
# RESEND_API_KEY=re_xxxx
# CONTACT_NOTIFY_TO=admin@tudominio.com
```
