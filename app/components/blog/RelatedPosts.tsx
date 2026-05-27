import { getTranslations } from "next-intl/server";

import type { Locale, PostDoc } from "../../lib/blog-types";
import { PostCard } from "./PostCard";

type Props = {
  posts: PostDoc[];
  locale: Locale;
};

export async function RelatedPosts({ posts, locale }: Props) {
  const t = await getTranslations("Blog");

  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-white/10 pt-12">
      <h2 className="mb-8 text-center font-serif text-2xl text-fci-foreground sm:text-3xl">
        {t("relatedTitle")}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={String(p.id)} post={p} locale={locale} />
        ))}
      </div>
    </section>
  );
}
