"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  getWhatsAppChatHref,
  isWhatsAppChatHref,
} from "../lib/whatsapp";

const SCROLL_SHOW_PX = 140;

export function FloatingContactButton() {
  const [visible, setVisible] = useState(false);
  const whatsappHref = getWhatsAppChatHref();
  const whatsAppExternal = isWhatsAppChatHref(whatsappHref);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      if (reduced) {
        setVisible(true);
        return;
      }
      setVisible(window.scrollY > SCROLL_SHOW_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappHref}
      {...(whatsAppExternal
        ? {
            target: "_blank",
            rel: "noopener noreferrer",
          }
        : {})}
      className={`fixed bottom-5 right-4 z-40 inline-flex items-center justify-center gap-2 rounded-xl bg-[#9d66ff] px-5 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_8px_28px_rgba(157,102,255,0.45)] outline-none transition-[opacity,transform,box-shadow] duration-300 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#c9a8ff] focus-visible:ring-offset-2 focus-visible:ring-offset-fci-base sm:bottom-6 sm:right-6 md:px-8 md:py-3.5 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      Contáctanos
      <ArrowRight className="size-4 shrink-0" aria-hidden />
    </a>
  );
}
