import { getPayload as initPayload, type Payload } from "payload";
import config from "@payload-config";

/**
 * Local API singleton. Llamar a `getPayload()` desde Server Components / route
 * handlers para hablar con la BD sin hacer fetch HTTP (mismo proceso, mismo
 * pool de conexiones). En cliente NO debe importarse este módulo.
 *
 * En desarrollo Next reusa módulos vía HMR; cacheamos en `globalThis` para
 * evitar inicializar Payload en cada reload.
 */
declare global {
  // eslint-disable-next-line no-var
  var __payloadInstance: Payload | undefined;
  // eslint-disable-next-line no-var
  var __payloadPromise: Promise<Payload> | undefined;
}

export async function getPayload(): Promise<Payload> {
  if (globalThis.__payloadInstance) return globalThis.__payloadInstance;
  if (!globalThis.__payloadPromise) {
    globalThis.__payloadPromise = initPayload({ config }).then((p) => {
      globalThis.__payloadInstance = p;
      return p;
    });
  }
  return globalThis.__payloadPromise;
}
