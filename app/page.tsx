import { SitePageLayout } from "./components/SitePageLayout";
import { Reveal } from "./components/Reveal";
import { HeroHome } from "./components/HeroHome";
import { ValuesPillars } from "./components/ValuesPillars";
import { SplitDomains } from "./components/SplitDomains";
import { StatsBar } from "./components/StatsBar";
import { NosotrosSection } from "./components/NosotrosSection";
import { ServicesGrid } from "./components/ServicesGrid";
import { MethodologyStrip } from "./components/MethodologyStrip";
import { EducacionTeaser } from "./components/EducacionTeaser";
import { PublicationsTeaser } from "./components/PublicationsTeaser";
export default function Home() {
  return (
    <SitePageLayout>
        <HeroHome />
        <Reveal>
          <ValuesPillars />
        </Reveal>
        <Reveal delayMs={40}>
          <SplitDomains />
        </Reveal>
        <Reveal>
          <StatsBar />
        </Reveal>
        <Reveal delayMs={30}>
          <NosotrosSection />
        </Reveal>
        <Reveal>
          <ServicesGrid />
        </Reveal>
        <Reveal delayMs={40}>
          <MethodologyStrip />
        </Reveal>
        <Reveal>
          <EducacionTeaser />
        </Reveal>
        <Reveal delayMs={20}>
          <PublicationsTeaser />
        </Reveal>
    </SitePageLayout>
  );
}
