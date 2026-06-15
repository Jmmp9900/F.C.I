"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  ariaLabel: string;
  poster?: string;
};

/** Video de fondo para las tarjetas Tierra / Espacio (autoplay silenciado, accesible). */
export function DomainHeroVideo({ src, ariaLabel, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      video.pause();
      video.removeAttribute("autoplay");
      return;
    }

    void video.play().catch(() => {
      /* Algunos navegadores bloquean autoplay aunque esté muted. */
    });
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={ariaLabel}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
