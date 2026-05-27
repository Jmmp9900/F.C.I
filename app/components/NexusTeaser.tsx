import { Cpu, Network } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function NexusTeaser() {
  const t = await getTranslations("Nexus");

  return (
    <section
      id="nexus-fci"
      className="scroll-mt-24 border-t border-white/5 bg-gradient-to-b from-fci-void/80 to-fci-base py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-fci-violet/35 bg-fci-navy/60 p-6 shadow-[0_0_40px_rgba(148,88,255,0.12)] sm:p-10">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fci-violet/15 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-fci-violet/40 bg-fci-space/30 text-fci-violet">
              <Network className="size-7" strokeWidth={1.25} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
                {t("eyebrow")}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-fci-foreground sm:text-3xl">
                {t("title")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-balance text-fci-muted sm:text-base">
                {t("body")}
              </p>
              <p className="mt-3 flex items-start gap-2.5 text-xs leading-relaxed text-balance text-fci-muted sm:text-sm">
                <Cpu className="size-4 shrink-0 text-fci-gold" aria-hidden />
                {t("footnote")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
