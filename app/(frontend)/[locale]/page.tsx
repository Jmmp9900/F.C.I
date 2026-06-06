import { SitePageLayout } from "../../components/SitePageLayout";
import { Reveal } from "../../components/Reveal";
import { HeroHome } from "../../components/HeroHome";
import { ValuesPillars } from "../../components/ValuesPillars";
import { SplitDomains } from "../../components/SplitDomains";
import { EconomyTransitionInfographic } from "../../components/EconomyTransitionInfographic";
import { NosotrosSection } from "../../components/NosotrosSection";
import { EducacionTeaser } from "../../components/EducacionTeaser";
import { PublicationsTeaser } from "../../components/PublicationsTeaser";
import { NexusTeaser } from "../../components/NexusTeaser";
import { FciConnectTeaser } from "../../components/FciConnectTeaser";

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
      <Reveal delayMs={35}>
        <EconomyTransitionInfographic />
      </Reveal>
      <Reveal delayMs={30}>
        <NosotrosSection />
      </Reveal>
      <Reveal>
        <EducacionTeaser />
      </Reveal>
      <Reveal delayMs={25}>
        <NexusTeaser />
      </Reveal>
      <Reveal delayMs={25}>
        <FciConnectTeaser />
      </Reveal>
      <Reveal delayMs={20}>
        <PublicationsTeaser />
      </Reveal>
    </SitePageLayout>
  );
}
