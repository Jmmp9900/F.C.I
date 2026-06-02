import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { rateLimit } from "./lib/rate-limit";

const handleI18n = createMiddleware(routing);

function clientIpFromRequest(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/api/users/login" && request.method === "POST") {
    const ip = clientIpFromRequest(request);
    const { allowed } = rateLimit(`login:${ip}`, {
      limit: 10,
      windowMs: 15 * 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        {
          errors: [
            {
              message:
                "Demasiados intentos de inicio de sesión. Espera unos minutos.",
            },
          ],
        },
        { status: 429 },
      );
    }
    return NextResponse.next();
  }

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
  matcher: [
    "/api/users/login",
    "/((?!api|admin|_next|_vercel|.*\\..*).*)",
  ],
};
