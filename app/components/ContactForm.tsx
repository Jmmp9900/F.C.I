"use client";

import { useActionState, useMemo } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Send } from "lucide-react";

import { CONTACT_SUBJECT_KEYS } from "../lib/contact-subjects";
import { submitContact, type ContactState } from "../actions/contact";

const initialState: ContactState = { status: "idle" };

function SubmitButton() {
  const t = useTranslations("ContactPage.form");
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-fci-gold px-5 py-3 text-sm font-semibold text-fci-base transition hover:bg-fci-gold-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      <Send className="size-4" aria-hidden />
      {pending ? t("submitting") : t("submit")}
    </button>
  );
}

export function ContactForm() {
  const t = useTranslations("ContactPage.form");
  const locale = useLocale();
  const [state, formAction] = useActionState(submitContact, initialState);

  /* Timestamp del primer render: lo enviamos como hidden field para que la
     server action pueda comparar y descartar envíos demasiado rápidos (bots). */
  const renderedAt = useMemo(() => Date.now(), []);

  const fieldError = (key: string) =>
    state.status === "error" && state.message === key
      ? t(`errors.${key}` as "errors.server_error")
      : null;

  const serverError =
    state.status === "error" && state.message === "server_error"
      ? t("errors.server_error")
      : null;

  const fields = state.fields ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="renderedAt" value={renderedAt} />
      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field
        id="contact-name"
        name="name"
        label={t("name")}
        placeholder={t("namePlaceholder")}
        required
        defaultValue={fields.name ?? ""}
        error={fieldError("invalid_name")}
        autoComplete="name"
      />
      <Field
        id="contact-email"
        name="email"
        type="email"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        required
        defaultValue={fields.email ?? ""}
        error={fieldError("invalid_email")}
        autoComplete="email"
      />
      <Field
        id="contact-organization"
        name="organization"
        label={t("organization")}
        placeholder={t("organizationPlaceholder")}
        defaultValue={fields.organization ?? ""}
        error={fieldError("invalid_organization")}
        autoComplete="organization"
      />
      <Field
        id="contact-phone"
        name="phone"
        type="tel"
        label={t("phone")}
        placeholder={t("phonePlaceholder")}
        defaultValue={fields.phone ?? ""}
        error={fieldError("invalid_phone")}
        autoComplete="tel"
      />
      <Field
        id="contact-country"
        name="country"
        label={t("country")}
        placeholder={t("countryPlaceholder")}
        defaultValue={fields.country ?? ""}
        error={fieldError("invalid_country")}
        autoComplete="country-name"
      />
      <SelectField
        id="contact-subject"
        name="subject"
        label={t("subject")}
        required
        defaultValue={fields.subject ?? ""}
        error={fieldError("invalid_subject")}
        placeholder={t("subjectPlaceholder")}
        options={CONTACT_SUBJECT_KEYS.map((key) => ({
          value: key,
          label: t(`subjectOptions.${key}`),
        }))}
      />
      <TextArea
        id="contact-message"
        name="message"
        label={t("message")}
        placeholder={t("messagePlaceholder")}
        required
        defaultValue={fields.message ?? ""}
        error={fieldError("invalid_message")}
        rows={6}
      />

      {serverError ? (
        <p
          role="alert"
          className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {serverError}
        </p>
      ) : null}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Subcomponentes de campo                                                    */
/* -------------------------------------------------------------------------- */

type FieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  error?: string | null;
  type?: string;
  autoComplete?: string;
};

function Field({
  id,
  name,
  label,
  placeholder,
  required,
  defaultValue,
  error,
  type = "text",
  autoComplete,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-fci-muted"
      >
        {label}
        {required ? <span className="ml-1 text-fci-gold">*</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`rounded-md border bg-fci-base/30 px-3 py-2.5 text-sm text-fci-foreground placeholder:text-fci-muted/60 focus:border-fci-gold/60 focus:outline-none focus:ring-1 focus:ring-fci-gold/40 ${
          error ? "border-red-500/50" : "border-white/10"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  defaultValue?: string;
  error?: string | null;
  options: { value: string; label: string }[];
};

function SelectField({
  id,
  name,
  label,
  placeholder,
  required,
  defaultValue,
  error,
  options,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-fci-muted"
      >
        {label}
        {required ? <span className="ml-1 text-fci-gold">*</span> : null}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`fci-select rounded-md border bg-fci-base/30 px-3 py-2.5 text-sm text-fci-foreground focus:border-fci-gold/60 focus:outline-none focus:ring-1 focus:ring-fci-gold/40 ${
          error ? "border-red-500/50" : "border-white/10"
        } ${!defaultValue ? "text-fci-muted/70" : ""}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextArea({
  id,
  name,
  label,
  placeholder,
  required,
  defaultValue,
  error,
  rows = 4,
}: FieldProps & { rows?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-fci-muted"
      >
        {label}
        {required ? <span className="ml-1 text-fci-gold">*</span> : null}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`resize-y rounded-md border bg-fci-base/30 px-3 py-2.5 text-sm text-fci-foreground placeholder:text-fci-muted/60 focus:border-fci-gold/60 focus:outline-none focus:ring-1 focus:ring-fci-gold/40 ${
          error ? "border-red-500/50" : "border-white/10"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
