import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { FloatingContactButton } from "./FloatingContactButton";

export function SitePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main
        id="contenido-principal"
        tabIndex={-1}
        className="flex-1 outline-none"
      >
        {children}
      </main>
      <FloatingContactButton />
      <SiteFooter />
    </>
  );
}
