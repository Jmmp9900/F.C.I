# F.C.I. — Sitio institucional (Next.js)

Proyecto en **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS** + **Volta** (Node fijada en `package.json`).

## Requisitos

- [Node.js](https://nodejs.org/) (o [Volta](https://volta.sh/)) — recomendada la versión indicada en `package.json` → `volta.node`
- Cuenta en [GitHub](https://github.com/) y [Git](https://git-scm.com/) instalado en la máquina

## Puesta en marcha en local

```bash
cd sitio-institucional
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Otros scripts útiles: `npm run build`, `npm start`, `npm run lint`, `npm run git:time-travel:help` (herramienta de fechas de commits; requiere Git y repo).

## Imágenes de marca (opcional)

Ruta: `public/images/brand/`. Nombres esperados: `hero-espacio.jpg`, `tierra.jpg`, `espacio.jpg`, `quienes-somos.jpg`, `educacion.jpg`, `publicacion-1.jpg`, … (ver `app/lib/brand-assets.ts`).

Pon `USE_LOCAL_BRAND_IMAGES = true` en `app/lib/brand-assets.ts` cuando tengas los archivos allí; si no, se usan imágenes remotas de respaldo.

## Publicar en GitHub y compartir con tu compañero

### 1. Subir el código (una vez, desde la carpeta del proyecto)

Si aún no hay repositorio Git en la carpeta:

```bash
git init
git add .
git commit -m "chore: estado inicial del proyecto"
```

En GitHub: **New repository** (sin README si ya has hecho el commit en local, o luego haces `pull` con `--rebase` si el remoto trae un README). Conecta el remoto y sube la rama principal:

```bash
git remote add origin https://github.com/TU_USUARIO/sitio-institucional.git
git branch -M main
git push -u origin main
```

Sustituye la URL por la de tu repositorio.

### 2. Dar permisos a tu colaborador

1. En GitHub, abre el repositorio → **Settings** → **Collaborators** (o **Manage access**).
2. **Add people** e introduce el usuario de GitHub de tu compañero.
3. Asigna un rol: **Write** (recomendado para trabajar a diario) o **Admin** solo si hace falta administración plena.
4. Tu compañero acepta la invitación (correo o pestaña *Invitations* en GitHub).

Con eso puede clonar, crear ramas, hacer push y abrir *Pull requests* aunque tú no estés conectado.

### 3. Trabajo en equipo (recomendado)

- Cada quien: `git pull` al empezar, trabajar en una **rama** (`git checkout -b feature/...`), luego *Pull request* a `main`.
- O acordar `main` y commits directos con **Write** (más sencillo, más riesgo de solapar cambios).
- Protege `main` en **Settings → Branches** si quieres obligar a revisar PRs (opcional).

## Licencia y uso

Uso del proyecto acordado entre los colaboradores de la fundación o equipo.
