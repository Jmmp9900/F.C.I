import Image from "next/image";
import { brandImage, type BrandImageKey } from "../lib/brand-assets";

export type BrandImageDriftVariant =
  | "split-earth"
  | "split-space"
  | "about"
  | "educacion"
  | "pub1"
  | "pub2"
  | "pub3";

const variantClass: Record<BrandImageDriftVariant, string> = {
  "split-earth": "",
  "split-space": "fci-brand-drift--rev",
  about: "fci-brand-drift--rev",
  educacion: "",
  pub1: "fci-brand-drift--pub1",
  pub2: "fci-brand-drift--pub2",
  pub3: "fci-brand-drift--pub3",
};

type BrandImageDriftProps = {
  k: BrandImageKey;
  alt: string;
  sizes: string;
  quality?: number;
  variant: BrandImageDriftVariant;
  /** Clases extra en la <Image> (p. ej. transición + group-hover) */
  imageClassName?: string;
};

export function BrandImageDrift({
  k,
  alt,
  sizes,
  quality = 88,
  variant,
  imageClassName = "",
}: BrandImageDriftProps) {
  const mod = variantClass[variant];
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-[-6%] fci-brand-drift${mod ? ` ${mod}` : ""}`.trim()}
      >
        <Image
          src={brandImage(k)}
          alt={alt}
          fill
          quality={quality}
          sizes={sizes}
          className={`fci-brand-drift__img object-cover${imageClassName ? ` ${imageClassName}` : ""}`.trim()}
        />
      </div>
    </div>
  );
}
