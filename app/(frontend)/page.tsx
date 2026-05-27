import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/** La home vive en `/[locale]`; sin esta ruta, `/` puede responder 404 si el proxy no corre en el entorno. */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
