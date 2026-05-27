import type { Metadata } from "next";
import { Calendar, Mail, MessageCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SitePageLayout } from "../../../components/SitePageLayout";
import { ContactForm } from "../../../components/ContactForm";
import {
  getWhatsAppChatHref,
  isWhatsAppChatHref,
} from "../../../lib/whatsapp";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
      locale: locale === "en" ? "en_US" : "es_ES",
    },
    alternates: {
      languages: {
        es: "/es/contacto",
        en: "/en/contact",
      },
    },
  };
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ContactPage");
  const tAlt = await getTranslations("ContactPage.alternativeContact");
  const whatsappHref = getWhatsAppChatHref();
  const whatsAppExternal = isWhatsAppChatHref(whatsappHref);
  const institutionalEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

  return (
    <SitePageLayout>
      <section className="border-b border-white/10 bg-fci-void/30 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-center font-serif text-3xl text-fci-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-fci-muted text-balance">
            {t("intro")}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <ContactForm />
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg border border-white/10 bg-fci-surface/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fci-gold">
                {tAlt("title")}
              </p>

              <ul className="mt-4 space-y-3 text-sm">
                {institutionalEmail ? (
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-fci-gold" aria-hidden />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-fci-muted">
                        {tAlt("emailLabel")}
                      </p>
                      <a
                        href={`mailto:${institutionalEmail}`}
                        className="text-fci-foreground underline-offset-4 hover:text-fci-gold hover:underline"
                      >
                        {institutionalEmail}
                      </a>
                    </div>
                  </li>
                ) : null}

                {whatsAppExternal ? (
                  <li className="flex items-start gap-3">
                    <MessageCircle
                      className="mt-0.5 size-4 shrink-0 text-fci-gold"
                      aria-hidden
                    />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-fci-muted">
                        {tAlt("whatsappLabel")}
                      </p>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fci-foreground underline-offset-4 hover:text-fci-gold hover:underline"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </li>
                ) : null}

                {process.env.NEXT_PUBLIC_SCHEDULE_URL ? (
                  <li className="flex items-start gap-3">
                    <Calendar
                      className="mt-0.5 size-4 shrink-0 text-fci-gold"
                      aria-hidden
                    />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-fci-muted">
                        {tAlt("scheduleLabel")}
                      </p>
                      <a
                        href={process.env.NEXT_PUBLIC_SCHEDULE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fci-foreground underline-offset-4 hover:text-fci-gold hover:underline"
                      >
                        Cal.com / Calendly
                      </a>
                    </div>
                  </li>
                ) : null}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SitePageLayout>
  );
}
