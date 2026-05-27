"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium">
      <Link
        href="/"
        locale="es"
        className={
          locale === "es"
            ? "text-fci-foreground"
            : "text-fci-muted transition hover:text-fci-foreground"
        }
        scroll={false}
      >
        ES
      </Link>
      <span className="text-fci-muted/50" aria-hidden>
        |
      </span>
      <Link
        href="/"
        locale="en"
        className={
          locale === "en"
            ? "text-fci-foreground"
            : "text-fci-muted transition hover:text-fci-foreground"
        }
        scroll={false}
      >
        EN
      </Link>
    </div>
  );
}
