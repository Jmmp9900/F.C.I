"use client";

import { useEffect, useState, type ReactNode } from "react";

type HeroParallaxLayerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Mueve el fondo del hero con el scroll; se desactiva con prefers-reduced-motion.
 */
export function HeroParallaxLayer({
  children,
  className = "",
}: HeroParallaxLayerProps) {
  const [y, setY] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      return;
    }

    const onScroll = () => {
      setY(window.scrollY);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const offset = Math.min(y * 0.4, 84);

  return (
    <div
      className={className}
      style={
        offset
          ? { transform: `translate3d(0, ${offset}px, 0)` }
          : undefined
      }
    >
      {children}
    </div>
  );
}
