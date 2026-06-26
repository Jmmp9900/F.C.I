"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

const SERVICE_IDS = [
  "consulting",
  "training",
  "research",
  "projects",
] as const;

type ServiceId = (typeof SERVICE_IDS)[number];

const OPEN_DELAY_MS = 1500;

const goldCardClass =
  "mx-auto flex min-h-[7.5rem] w-full max-w-[10.5rem] flex-col items-center justify-center rounded-xl bg-gradient-to-b from-fci-gold-dim via-fci-gold to-fci-gold-hover px-3 py-5 text-center text-xs font-semibold uppercase tracking-wide text-fci-void shadow-[0_4px_24px_rgba(226,189,58,0.28)] transition duration-200 hover:brightness-110 hover:shadow-[0_8px_32px_rgba(226,189,58,0.38)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fci-gold/70 sm:min-h-[8.5rem] sm:max-w-[11.5rem] sm:px-4 sm:text-sm";

export function FoundationServices() {
  const t = useTranslations("FoundationServices");
  const [activeId, setActiveId] = useState<ServiceId | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const cancelScheduledOpen = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  const openNow = useCallback(
    (id: ServiceId) => {
      cancelScheduledOpen();
      setActiveId(id);
    },
    [cancelScheduledOpen],
  );

  const scheduleOpen = useCallback(
    (id: ServiceId) => {
      cancelScheduledOpen();
      openTimerRef.current = setTimeout(() => {
        openTimerRef.current = null;
        setActiveId(id);
      }, OPEN_DELAY_MS);
    },
    [cancelScheduledOpen],
  );

  const close = useCallback(() => {
    cancelScheduledOpen();
    setActiveId(null);
  }, [cancelScheduledOpen]);

  useEffect(() => {
    if (!activeId) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeId, close]);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
    };
  }, []);

  const activeService = activeId;
  const bullets =
    activeService && t.has(`items.${activeService}.bullets`)
      ? (t.raw(`items.${activeService}.bullets`) as string[])
      : [];

  return (
    <div className="mt-14 border-t border-white/10 pt-12">
      <p className="fci-section-label text-center">
        {t("eyebrow")}
      </p>
      <h3 className="fci-section-subtitle mt-2 text-center">
        {t("title")}
      </h3>

      <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:max-w-5xl sm:grid-cols-4 sm:gap-4">
        {SERVICE_IDS.map((id) => (
          <li key={id} className="flex justify-center">
            <button
              type="button"
              className={goldCardClass}
              aria-expanded={activeId === id}
              aria-controls="foundation-service-panel"
              onMouseEnter={() => scheduleOpen(id)}
              onMouseLeave={cancelScheduledOpen}
              onFocus={() => openNow(id)}
              onClick={() => openNow(id)}
            >
              <span className="block leading-snug text-balance">
                {t(`items.${id}.title`)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {activeService && portalReady
        ? createPortal(
            <div
              className="fixed inset-0 z-[200] flex min-h-[100dvh] items-center justify-center p-4 sm:p-6"
              role="presentation"
            >
              <div
                className="absolute inset-0 bg-fci-void/75 backdrop-blur-sm"
                aria-hidden
              />
              <div
                id="foundation-service-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="foundation-service-title"
                className="relative z-[1] max-h-[min(85dvh,44rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-fci-gold/35 bg-gradient-to-b from-fci-navy/95 to-fci-void p-6 shadow-[0_0_48px_rgba(226,189,58,0.22)] sm:p-8"
              >
                <button
                  type="button"
                  onClick={close}
                  className="absolute right-4 top-4 rounded-md p-1.5 text-fci-muted transition hover:bg-white/10 hover:text-fci-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-fci-gold/55"
                  aria-label={t("closeAria")}
                >
                  <X className="size-5" aria-hidden />
                </button>

                <p className="fci-section-label">
                  {t("eyebrow")}
                </p>
                <h4
                  id="foundation-service-title"
                  className="fci-section-subtitle mt-2 pr-8"
                >
                  {t(`items.${activeService}.title`)}
                </h4>
                <div className="mt-4 h-px w-16 bg-fci-gold/70" />

                <div className="fci-section-body mt-5 space-y-4 text-left">
                  <p>{t(`items.${activeService}.p1`)}</p>
                  {t.has(`items.${activeService}.p2`) ? (
                    <p>{t(`items.${activeService}.p2`)}</p>
                  ) : null}
                  {bullets.length > 0 ? (
                    <>
                      {t.has(`items.${activeService}.listIntro`) ? (
                        <p className="font-medium text-fci-foreground/90">
                          {t(`items.${activeService}.listIntro`)}
                        </p>
                      ) : null}
                      <ul className="list-disc space-y-1.5 pl-5 marker:text-fci-gold">
                        {bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {t.has(`items.${activeService}.p3`) ? (
                    <p>{t(`items.${activeService}.p3`)}</p>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
