"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Mail, Send } from "lucide-react";

import {
  subscribeNewsletter,
  type NewsletterState,
} from "../actions/newsletter";

const initialState: NewsletterState = { status: "idle" };

function SubmitButton() {
  const t = useTranslations("Newsletter");
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-1.5 rounded-md bg-fci-gold px-4 py-2.5 text-sm font-semibold text-fci-base transition hover:bg-fci-gold-hover disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Send className="size-4" aria-hidden />
      {pending ? t("submitting") : t("submit")}
    </button>
  );
}

type Props = {
  /** `compact` para footer, `card` para una sección dedicada. */
  variant?: "compact" | "card";
};

export function NewsletterForm({ variant = "compact" }: Props) {
  const t = useTranslations("Newsletter");
  const locale = useLocale();
  const [state, formAction] = useActionState(subscribeNewsletter, initialState);

  const message =
    state.status === "ok"
      ? t("success")
      : state.status === "duplicate"
        ? t("duplicate")
        : state.status === "error"
          ? t(`errors.${state.message ?? "server_error"}` as "errors.server_error")
          : null;

  const messageTone =
    state.status === "ok"
      ? "text-fci-gold"
      : state.status === "duplicate"
        ? "text-fci-foreground"
        : state.status === "error"
          ? "text-red-300"
          : "text-fci-muted";

  if (variant === "card") {
    return (
      <div className="rounded-lg border border-white/10 bg-fci-surface/40 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
          {t("title")}
        </p>
        <p className="mt-2 text-sm text-fci-muted">{t("subtitle")}</p>
        <Form
          formAction={formAction}
          locale={locale}
          message={message}
          messageTone={messageTone}
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fci-gold">
        {t("title")}
      </p>
      <p className="mt-1 text-xs text-fci-muted">{t("subtitle")}</p>
      <Form
        formAction={formAction}
        locale={locale}
        message={message}
        messageTone={messageTone}
        variant="compact"
      />
    </div>
  );
}

function Form({
  formAction,
  locale,
  message,
  messageTone,
  variant,
}: {
  formAction: (formData: FormData) => void;
  locale: string;
  message: string | null;
  messageTone: string;
  variant: "compact" | "card";
}) {
  const t = useTranslations("Newsletter");

  return (
    <form action={formAction} className={variant === "card" ? "mt-5" : "mt-3"}>
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot anti-spam: invisible para humanos, visible para bots. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label htmlFor="newsletter-email" className="sr-only">
        {t("emailLabel")}
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fci-muted"
            aria-hidden
          />
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder={t("emailPlaceholder")}
            className="w-full rounded-md border border-white/10 bg-fci-base/30 py-2.5 pl-10 pr-3 text-sm text-fci-foreground placeholder:text-fci-muted/70 focus:border-fci-gold/60 focus:outline-none focus:ring-1 focus:ring-fci-gold/40"
            autoComplete="email"
          />
        </div>
        <SubmitButton />
      </div>

      {message ? (
        <p
          className={`mt-2 text-xs ${messageTone}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : (
        <p className="mt-2 text-[0.7rem] text-fci-muted/70">
          {t("privacyHint")}
        </p>
      )}
    </form>
  );
}
