"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Leaf, Mail, Satellite } from "lucide-react";

type TeamDomain = "tierra" | "espacio" | "ambos";
type TeamFilter = "todos" | "tierra" | "espacio";

type TeamMember = {
  id: number;
  nombre: string;
  cargo: string;
  resumen: string;
  credencial: string;
  dominio: TeamDomain;
  avatar: string;
};

const filters: TeamFilter[] = ["todos", "tierra", "espacio"];

/** Rotación automática del carrusel por parejas (ms). */
const TEAM_PAIR_AUTOPLAY_MS = 6000;

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function filterButtonClass(key: TeamFilter, active: boolean): string {
  const base =
    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition";
  if (key === "todos") {
    return active
      ? `${base} border-fci-gold bg-fci-gold/25 text-fci-gold shadow-[0_0_22px_rgba(212,181,110,0.25)]`
      : `${base} border-white/15 text-fci-muted hover:border-fci-gold/45 hover:text-fci-foreground`;
  }
  if (key === "tierra") {
    return active
      ? `${base} border-emerald-400/70 bg-emerald-950/40 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.2)]`
      : `${base} border-emerald-500/35 text-fci-muted hover:border-emerald-400/55`;
  }
  return active
    ? `${base} border-violet-400/70 bg-fci-space/40 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.22)]`
    : `${base} border-violet-500/35 text-fci-muted hover:border-violet-400/55`;
}

function domainBadgeClass(d: TeamDomain): string {
  if (d === "tierra") {
    return "border-emerald-400/60 bg-emerald-950/35 text-emerald-100";
  }
  if (d === "espacio") {
    return "border-violet-400/55 bg-fci-space/35 text-violet-100";
  }
  return "border-fci-gold/45 bg-gradient-to-r from-emerald-950/40 to-fci-space/35 text-fci-gold";
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function TeamMemberArticle({
  member,
  domainLabel,
}: {
  member: TeamMember;
  domainLabel: string;
}) {
  const t = useTranslations("Nosotros");
  const isAmbos = member.dominio === "ambos";

  const cardInner = (
    <div className="rounded-2xl bg-fci-navy/95 p-4 sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-full border-2 border-fci-gold/25 shadow-inner ring-1 ring-white/10">
          <Image
            src={member.avatar}
            alt=""
            fill
            className="object-cover"
            sizes="72px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex w-full min-w-0 flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <h4 className="min-w-0 flex-1 font-serif text-lg font-semibold leading-snug text-balance text-fci-foreground">
              {member.nombre}
            </h4>
            <span
              className={`shrink-0 whitespace-nowrap rounded-full border px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide sm:px-2.5 sm:text-sm ${domainBadgeClass(member.dominio)}`}
            >
              {domainLabel}
            </span>
          </div>
          <p className="mt-1 text-sm italic text-fci-gold">{member.cargo}</p>
          <p className="mt-2 text-xs leading-relaxed text-fci-muted">
            {member.resumen}
          </p>
          <p className="mt-1 text-xs text-fci-muted/90">{member.credencial}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-3 border-t border-white/10 pt-3">
        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("linkedinAria", { name: member.nombre })}
          className="rounded-md border border-white/10 p-1.5 text-fci-gold transition hover:border-fci-gold/50 hover:text-fci-gold-hover"
        >
          <IconLinkedIn className="size-4" />
        </a>
        <a
          href="#contacto"
          aria-label={t("mailAria", { name: member.nombre })}
          className="rounded-md border border-white/10 p-1.5 text-fci-gold transition hover:border-fci-gold/50 hover:text-fci-gold-hover"
        >
          <Mail className="size-4" />
        </a>
      </div>
    </div>
  );

  const slideShell =
    "min-w-0 w-full transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_18px_56px_rgba(0,0,0,0.55)] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none motion-reduce:transition-none";

  if (isAmbos) {
    return (
      <article
        className={`${slideShell} rounded-2xl bg-gradient-to-br from-emerald-400/45 via-fci-gold/25 to-violet-500/45 p-[1px] shadow-[0_8px_32px_rgba(0,0,0,0.35)]`}
      >
        <div className="overflow-hidden rounded-2xl">{cardInner}</div>
      </article>
    );
  }

  return (
    <article
      className={`${slideShell} ${
        member.dominio === "tierra"
          ? "rounded-2xl border border-emerald-500/45 shadow-[0_0_24px_rgba(34,197,94,0.12)]"
          : "rounded-2xl border border-violet-500/45 shadow-[0_0_24px_rgba(167,139,250,0.15)]"
      }`}
    >
      {cardInner}
    </article>
  );
}

export function NosotrosSection() {
  const t = useTranslations("Nosotros");
  const teamMembers = t.raw("teamMembers") as TeamMember[];

  const [activeFilter, setActiveFilter] = useState<TeamFilter>("todos");
  const [teamSlideIndex, setTeamSlideIndex] = useState(0);
  const [teamCarouselPaused, setTeamCarouselPaused] = useState(false);

  const filteredMembers = useMemo(() => {
    if (activeFilter === "todos") {
      return teamMembers;
    }
    return teamMembers.filter(
      (member) =>
        member.dominio === activeFilter || member.dominio === "ambos"
    );
  }, [activeFilter, teamMembers]);

  const teamPairSlides = useMemo(() => {
    const pairs: TeamMember[][] = [];
    for (let i = 0; i < filteredMembers.length; i += 2) {
      pairs.push(filteredMembers.slice(i, i + 2));
    }
    return pairs;
  }, [filteredMembers]);

  const effectiveSlideIndex = Math.min(
    teamSlideIndex,
    Math.max(0, teamPairSlides.length - 1)
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (teamPairSlides.length <= 1) return;
    if (teamCarouselPaused) return;
    const id = window.setInterval(() => {
      setTeamSlideIndex((prev) => (prev + 1) % teamPairSlides.length);
    }, TEAM_PAIR_AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [teamPairSlides.length, teamCarouselPaused]);

  return (
    <section
      id="nosotros"
      className="scroll-mt-24 border-y border-white/5 bg-fci-base"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="relative overflow-hidden rounded-2xl border border-fci-gold/25 bg-gradient-to-r from-[#0a1628] via-[#0e1d3d] to-[#13254a] p-5 shadow-[inset_0_1px_0_rgba(212,181,110,0.12)] sm:p-7">
          <div className="fci-nosotros-stars pointer-events-none absolute inset-0 opacity-90" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(212,181,110,0.08),transparent_38%)]" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <div className="min-w-0 pr-0 lg:pr-2">
              <p className="font-serif text-4xl leading-tight tracking-wide text-fci-foreground sm:text-5xl">
                {t("whoHeading")}
              </p>
              <div className="mt-3 h-px w-28 bg-fci-gold/85" />
              <div className="mt-5 flex max-w-xl items-start gap-3 rounded-lg border border-emerald-500/20 bg-gradient-to-br from-emerald-950/35 via-fci-void/20 to-transparent px-3 py-2.5 sm:gap-3.5 sm:px-4 sm:py-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-emerald-400/25 bg-emerald-950/50 text-emerald-300/95 shadow-[0_0_20px_rgba(52,211,153,0.12)]">
                  <Leaf className="size-[1.15rem]" strokeWidth={1.5} aria-hidden />
                </span>
                <p className="min-w-0 text-xs font-semibold uppercase leading-snug tracking-[0.18em] text-emerald-100/90 sm:text-sm sm:tracking-[0.2em]">
                  {t("whoSustainEyebrow")}
                </p>
              </div>
              <div className="mt-5 max-w-xl border-l-2 border-emerald-500/45 pl-4 sm:pl-5">
                <p className="text-sm leading-relaxed text-fci-muted sm:text-base">
                  {t.rich("whoP1", {
                    years: (chunks) => (
                      <span className="text-fci-foreground">{chunks}</span>
                    ),
                  })}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-fci-muted sm:text-base">
                  {t("whoP2Lead")}
                </p>
                <p className="mt-3 space-y-1 font-sans text-sm leading-relaxed sm:text-base">
                  <span className="block italic tracking-normal text-[#d4af37] [text-shadow:0_0_20px_rgba(212,175,55,0.18)]">
                    {t("whoP2Accent1")}
                  </span>
                  <span className="block italic tracking-normal text-[#d4af37] [text-shadow:0_0_20px_rgba(212,175,55,0.18)]">
                    {t("whoP2Accent2")}
                  </span>
                </p>
              </div>
            </div>

            <div className="relative mx-auto flex min-h-[16rem] w-full max-w-[320px] items-center justify-center lg:mx-0 lg:max-w-none lg:justify-end">
              <div className="pointer-events-none absolute inset-0 rounded-[40%] bg-gradient-to-l from-transparent via-fci-violet/10 to-transparent blur-2xl" />
              <div className="fci-globe-green-glow pointer-events-none absolute inset-0 rounded-full opacity-90" />

              <div className="fci-orbit-ring fci-orbit-ring--earth pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/30 sm:h-[24rem] sm:w-[24rem]" />
              <div className="fci-orbit-ring fci-orbit-ring--space pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fci-violet/35 opacity-80 sm:h-[28rem] sm:w-[28rem]" />

              <div className="relative z-[1] h-[15.5rem] w-[15.5rem] sm:h-[17.5rem] sm:w-[17.5rem]">
                <div className="fci-planet-wrap absolute left-1/2 top-4 z-[3] -translate-x-[120%] drop-shadow-[0_0_12px_rgba(148,88,255,0.5)]">
                  <Satellite
                    className="size-8 text-fci-muted/90 sm:size-9"
                    strokeWidth={1.15}
                  />
                </div>
                <div className="fci-planet-wrap absolute bottom-10 right-[-4%] z-[3] drop-shadow-[0_0_12px_rgba(52,211,153,0.35)]">
                  <Satellite
                    className="size-7 rotate-[-25deg] text-fci-muted/85 sm:size-8"
                    strokeWidth={1.15}
                  />
                </div>

                <div className="relative mx-auto h-full w-full overflow-hidden rounded-full border border-fci-violet/40 shadow-[0_0_48px_rgba(148,88,255,0.35)]">
                  <Image
                    src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=90&w=1600&auto=format&fit=crop&crop=entropy"
                    alt={t("globeAlt")}
                    fill
                    sizes="(max-width: 1024px) 280px, 320px"
                    className="fci-brand-drift fci-planet-img object-cover object-[45%_center] opacity-95 saturate-125"
                    priority={false}
                  />
                  <div
                    className="fci-globe-grid-overlay pointer-events-none absolute inset-0 rounded-full"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/25 via-transparent to-fci-violet/20 mix-blend-soft-light"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-serif text-3xl text-fci-foreground">
              {t("equipoLabel")}
            </span>
            <div className="flex flex-wrap gap-2">
              {filters.map((filterKey) => {
                const active = activeFilter === filterKey;
                return (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => {
                      setActiveFilter(filterKey);
                      setTeamSlideIndex(0);
                    }}
                    className={filterButtonClass(filterKey, active)}
                    aria-pressed={active}
                  >
                    {filterKey !== "todos" && (
                      <span
                        className={`size-2 shrink-0 rounded-full ${
                          filterKey === "tierra"
                            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                            : "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.7)]"
                        }`}
                        aria-hidden
                      />
                    )}
                    {t(`filters.${filterKey}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <h3 className="mt-8 text-center font-serif text-3xl tracking-wide text-fci-foreground sm:text-4xl">
            {t("equipoTitle")}
          </h3>
          <div className="mx-auto mt-3 h-px w-44 bg-gradient-to-r from-transparent via-fci-gold/80 to-transparent" />

          <div
            className="relative mt-8"
            role="region"
            aria-roledescription={t("carouselRole")}
            aria-label={t("carouselRegion")}
            onMouseEnter={() => setTeamCarouselPaused(true)}
            onMouseLeave={() => setTeamCarouselPaused(false)}
          >
            {filteredMembers.length === 0 ? (
              <p className="text-center text-sm text-fci-muted">
                {t("emptyFilter")}
              </p>
            ) : (
              <div className="relative space-y-4">
                <div className="flex w-full min-w-0 items-center gap-1.5 sm:gap-3">
                  {teamPairSlides.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setTeamSlideIndex(
                          (i) =>
                            (i - 1 + teamPairSlides.length) %
                            teamPairSlides.length
                        )
                      }
                      className="flex size-11 shrink-0 items-center justify-center self-center rounded-full border border-white/15 bg-fci-navy/95 text-fci-gold shadow-[0_6px_24px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-fci-gold/40 hover:bg-fci-surface/95 sm:size-12"
                      aria-controls="equipo-carrusel-vista"
                      aria-label={t("carouselPrev")}
                    >
                      <ChevronLeft className="size-5 sm:size-6" aria-hidden />
                    </button>
                  )}

                  <div className="min-w-0 flex-1 overflow-x-clip overflow-y-visible rounded-xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_48px_rgba(0,0,0,0.35)]">
                    <div
                      id="equipo-carrusel-vista"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (teamPairSlides.length <= 1) return;
                        if (e.key === "ArrowLeft") {
                          e.preventDefault();
                          setTeamSlideIndex(
                            (i) =>
                              (i - 1 + teamPairSlides.length) %
                              teamPairSlides.length
                          );
                        }
                        if (e.key === "ArrowRight") {
                          e.preventDefault();
                          setTeamSlideIndex(
                            (i) => (i + 1) % teamPairSlides.length
                          );
                        }
                      }}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fci-gold/50"
                    >
                      <div className="overflow-x-clip overflow-y-visible py-4 sm:py-5 md:py-6">
                        <div
                          className="flex w-full min-w-0 transition-transform duration-700 ease-out motion-reduce:transition-none"
                          style={{
                            transform: `translateX(-${effectiveSlideIndex * 100}%)`,
                          }}
                        >
                          {teamPairSlides.map((pair, slideIdx) => (
                            <div
                              key={`${pair.map((m) => m.id).join("-")}-${slideIdx}`}
                              className="box-border min-w-full max-w-full shrink-0 px-3 sm:px-4 md:px-5"
                            >
                              <div
                                className={
                                  pair.length === 2
                                    ? "grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:items-stretch sm:gap-x-3 sm:gap-y-4 md:gap-x-5 lg:gap-x-6"
                                    : "mx-auto grid w-full min-w-0 max-w-lg justify-items-stretch gap-4"
                                }
                              >
                              {pair.map((member) => (
                                <div
                                  key={member.id}
                                  className="min-w-0 max-w-full"
                                >
                                  <TeamMemberArticle
                                    member={member}
                                    domainLabel={t(`domain.${member.dominio}`)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {teamPairSlides.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setTeamSlideIndex(
                          (i) => (i + 1) % teamPairSlides.length
                        )
                      }
                      className="flex size-11 shrink-0 items-center justify-center self-center rounded-full border border-white/15 bg-fci-navy/95 text-fci-gold shadow-[0_6px_24px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-fci-gold/40 hover:bg-fci-surface/95 sm:size-12"
                      aria-controls="equipo-carrusel-vista"
                      aria-label={t("carouselNext")}
                    >
                      <ChevronRight
                        className="size-5 sm:size-6"
                        aria-hidden
                      />
                    </button>
                  )}
                </div>

                {teamPairSlides.length > 1 && (
                  <div
                    className="flex flex-wrap items-center justify-center gap-2"
                    role="tablist"
                    aria-label={t("dotsLabel")}
                  >
                    {teamPairSlides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={effectiveSlideIndex === i}
                        aria-label={t("dotShow", {
                          n: i + 1,
                          total: teamPairSlides.length,
                        })}
                        onClick={() => setTeamSlideIndex(i)}
                        className={`size-2.5 rounded-full transition ${
                          effectiveSlideIndex === i
                            ? "scale-125 bg-fci-gold shadow-[0_0_12px_rgba(212,181,110,0.55)]"
                            : "bg-white/25 hover:bg-white/45"
                        }`}
                      />
                    ))}
                  </div>
                )}

                <p className="sr-only" aria-live="polite">
                  {t("carouselLive", {
                    current: effectiveSlideIndex + 1,
                    total: teamPairSlides.length,
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
