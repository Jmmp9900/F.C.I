import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  /* Raíz sin prefijo de idioma: redirigir (no rewrite). Un rewrite deja la URL en `/`
     y next-intl ve `/es` por dentro; detrás de ngrok eso suele provocar bucles o recargas. */
  if (pathname === "/" || pathname === "") {
    const url = request.nextUrl.clone();
    url.pathname = "/es";
    return NextResponse.redirect(url);
  }

  return handleI18n(request);
}

export const config = {
  /* `admin` está excluido para que Payload sirva su propio panel sin que
     next-intl intente prefijarle el locale. Lo mismo con `api` (REST/GraphQL
     de Payload viven ahí). */
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
