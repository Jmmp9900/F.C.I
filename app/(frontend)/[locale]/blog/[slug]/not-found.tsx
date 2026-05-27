import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { SitePageLayout } from "../../../../components/SitePageLayout";
import { EmptyState } from "../../../../components/blog/EmptyState";

export default async function PostNotFound() {
  const t = await getTranslations("Blog");

  return (
    <SitePageLayout>
      <section className="py-24">
        <EmptyState
          title={t("noPostsYet")}
          action={
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-md bg-fci-gold px-4 py-2 text-sm font-semibold text-fci-base transition hover:bg-fci-gold-hover"
            >
              {t("back")}
            </Link>
          }
        />
      </section>
    </SitePageLayout>
  );
}
