import Image from "next/image";
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";

import {
  type MediaDoc,
  getMediaAlt,
  getMediaUrl,
  isMediaDoc,
} from "../../lib/blog-types";

type UploadNodeValue = MediaDoc | string | number | null | undefined;

type UploadNode = {
  type: "upload";
  relationTo?: string;
  value: UploadNodeValue;
  fields?: {
    /** Tamaño preferido (lo controlamos abajo, pero permitimos override desde el editor). */
    size?: "card" | "hero" | "original";
    align?: "left" | "center" | "right";
  };
};

/**
 * Convertidores custom para `<RichText />` de Payload.
 *
 * El default de Payload no sabe renderizar bonito un nodo `upload` (imagen
 * insertada dentro del cuerpo del post). Aquí lo mapeamos a un `<figure>`
 * con `next/image` aprovechando los tamaños generados por sharp.
 *
 * Cómo se usa:
 *
 *   import { jsxConverters } from "./lexical-converters";
 *   <RichText data={post.body} converters={jsxConverters} />
 */
export const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const n = node as unknown as UploadNode;
    if (!isMediaDoc(n.value)) return null;
    const media: MediaDoc = n.value;

    const size = n.fields?.size ?? "hero";
    const url = getMediaUrl(media, size === "original" ? "original" : size);
    if (!url) return null;

    const alt = getMediaAlt(media);
    const width =
      (size === "card" ? media.sizes?.card?.width : media.sizes?.hero?.width) ??
      media.width ??
      1200;
    const height =
      (size === "card" ? media.sizes?.card?.height : media.sizes?.hero?.height) ??
      media.height ??
      Math.round(width * 0.5625);

    const alignClass =
      n.fields?.align === "left"
        ? "ml-0 mr-auto max-w-[60%]"
        : n.fields?.align === "right"
          ? "mr-0 ml-auto max-w-[60%]"
          : "mx-auto";

    return (
      <figure className={`my-8 ${alignClass}`}>
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 768px, 100vw"
          className="rounded-lg border border-white/10"
        />
        {media.caption ? (
          <figcaption className="mt-2 text-center text-sm text-fci-muted">
            {media.caption}
            {media.credit ? (
              <span className="ml-2 text-fci-muted/70">— {media.credit}</span>
            ) : null}
          </figcaption>
        ) : null}
      </figure>
    );
  },
});
