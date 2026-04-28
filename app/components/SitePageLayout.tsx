import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { FloatingContactButton } from "./FloatingContactButton";

export function SitePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <FloatingContactButton />
      <SiteFooter />
    </>
  );
}
