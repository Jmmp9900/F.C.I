"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getHeroCarouselImages } from "@/app/lib/hero-carousel-images";

const HERO_IMAGE = "/images/brand/hero-noche-orbita.png";
const HERO_VIDEO = "/videos/sistema-internacional.mp4";

const STEP_MS = 1500;
const HOLD_MS = 3000;
const HERO_REST_MS = 2500;
const SLOT_GAP_PX = 14;

type Phase = "hero" | "video" | "images";
type ImageMode = "entering" | "hold";

function CarouselImageRow({
  images,
  visibleCount,
}: {
  images: readonly string[];
  visibleCount: number;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const strip = stripRef.current;
    if (!viewport || !strip || visibleCount <= 0) {
      setScrollOffset(0);
      return;
    }

    const updateOffset = () => {
      const overflow = strip.scrollWidth - viewport.clientWidth;
      setScrollOffset(Math.max(0, overflow));
    };

    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(viewport);
    observer.observe(strip);
    return () => observer.disconnect();
  }, [visibleCount]);

  if (visibleCount <= 0) return null;

  const overflow = scrollOffset > 0;

  return (
    <div ref={viewportRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={stripRef}
        className="flex h-full items-center transition-transform duration-[1200ms] ease-in-out"
        style={{
          gap: `${SLOT_GAP_PX}px`,
          paddingInline: overflow ? 0 : "12px",
          transform: overflow ? `translateX(-${scrollOffset}px)` : "none",
          marginInline: overflow ? undefined : "auto",
          width: overflow ? "max-content" : "auto",
          justifyContent: overflow ? "flex-start" : "center",
        }}
      >
        {images.slice(0, visibleCount).map((src, index) => (
          <div
            key={src}
            className="fci-hero-carousel-item relative h-full w-auto shrink-0 aspect-[2/3]"
          >
            <Image
              src={src}
              alt=""
              width={1024}
              height={1536}
              sizes="(max-width: 768px) 40vw, 280px"
              priority={index === 0}
              className="h-full w-auto max-w-none object-contain object-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroCarouselBackground() {
  const locale = useLocale();
  const carouselImages = useMemo(
    () => getHeroCarouselImages(locale),
    [locale],
  );
  const [phase, setPhase] = useState<Phase>("hero");
  const [imageMode, setImageMode] = useState<ImageMode>("entering");
  const [visibleCount, setVisibleCount] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) clearTimeout(id);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    clearTimers();
    setPhase("hero");
    setImageMode("entering");
    setVisibleCount(0);
  }, [locale, reducedMotion, clearTimers]);

  useEffect(() => {
    if (reducedMotion) return;

    clearTimers();

    if (phase === "hero") {
      schedule(() => setPhase("video"), HERO_REST_MS);
      return clearTimers;
    }

    if (phase === "images") {
      if (imageMode === "entering") {
        if (visibleCount < carouselImages.length) {
          schedule(() => setVisibleCount((c) => c + 1), STEP_MS);
        } else {
          schedule(() => setImageMode("hold"), 0);
        }
      } else {
        schedule(() => {
          setPhase("hero");
          setImageMode("entering");
          setVisibleCount(0);
        }, HOLD_MS);
      }
    }

    return clearTimers;
  }, [
    phase,
    imageMode,
    visibleCount,
    reducedMotion,
    clearTimers,
    schedule,
    carouselImages.length,
  ]);

  const startImageSequence = useCallback(() => {
    setPhase("images");
    setImageMode("entering");
    setVisibleCount(1);
  }, []);

  const handleVideoEnded = useCallback(() => {
    startImageSequence();
  }, [startImageSequence]);

  const handleVideoError = useCallback(() => {
    startImageSequence();
  }, [startImageSequence]);

  useEffect(() => {
    if (phase !== "video" || reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => handleVideoError());
  }, [phase, reducedMotion, handleVideoError]);

  useEffect(() => clearTimers, [clearTimers]);

  if (reducedMotion) {
    return (
      <div className="relative h-full min-h-[inherit] w-full bg-fci-void" aria-hidden>
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
      </div>
    );
  }

  const showHero = phase === "hero";
  const showVideo = phase === "video";
  const showImages = phase === "images";

  return (
    <div className="relative h-full min-h-[inherit] w-full bg-fci-void" aria-hidden>
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          showHero ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          showVideo ? "opacity-100" : "opacity-0"
        }`}
      >
        {showVideo ? (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="metadata"
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : null}
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          showImages ? "opacity-100" : "opacity-0"
        }`}
      >
        <CarouselImageRow images={carouselImages} visibleCount={visibleCount} />
      </div>

      <span className="sr-only" aria-live="polite">
        {showHero
          ? "Imagen principal"
          : showVideo
            ? "Transición del sistema internacional"
            : `Infografías del carrusel: ${visibleCount} de ${carouselImages.length}`}
      </span>
    </div>
  );
}
