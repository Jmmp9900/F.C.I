import { RichText } from "@payloadcms/richtext-lexical/react";

import { jsxConverters } from "./lexical-converters";

type Props = {
  data: unknown;
};

/**
 * Renderiza el campo `body` (Lexical JSON) a HTML con clases de marca y
 * convertidores propios para nodos `upload` (imágenes con `next/image`,
 * caption y crédito).
 */
export function PostBody({ data }: Props) {
  if (!data) return null;

  return (
    <div className="post-body">
      <RichText data={data as never} converters={jsxConverters} />
    </div>
  );
}
