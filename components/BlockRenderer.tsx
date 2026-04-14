import dynamic from "next/dynamic";

/* ─── Lazy-load all block components ────────────────────── */

const HeroSection = dynamic(() => import("@/components/blocks/HeroSection"));
const TrustBar = dynamic(() => import("@/components/blocks/TrustBar"));
const IntroSnippet = dynamic(() => import("@/components/blocks/IntroSnippet"));
const ServicePillars = dynamic(
  () => import("@/components/blocks/ServicePillars")
);
const WhyChoose = dynamic(() => import("@/components/blocks/WhyChoose"));
const Sectors = dynamic(() => import("@/components/blocks/Sectors"));
const WavePlusTeaser = dynamic(
  () => import("@/components/blocks/WavePlusTeaser")
);
const CtaBanner = dynamic(() => import("@/components/blocks/CtaBanner"));
const MissionVision = dynamic(() => import("@/components/blocks/MissionVision"));
const CoreValues = dynamic(() => import("@/components/blocks/CoreValues"));
const Timeline = dynamic(() => import("@/components/blocks/Timeline"));
const TeamSection = dynamic(() => import("@/components/blocks/TeamSection"));
const Coverage = dynamic(() => import("@/components/blocks/Coverage"));
const CommercialWorkflow = dynamic(() => import("@/components/blocks/CommercialWorkflow"));
const CategoryGrid = dynamic(() => import("@/components/blocks/CategoryGrid"));
const ProductGrid = dynamic(() => import("@/components/blocks/ProductGrid"));
const QhsePillars = dynamic(() => import("@/components/blocks/QhsePillars"));
const Commitments = dynamic(() => import("@/components/blocks/Commitments"));
const StandardsGrid = dynamic(() => import("@/components/blocks/StandardsGrid"));
const PolicyCTA = dynamic(() => import("@/components/blocks/PolicyCTA"));
const WavePlusHero = dynamic(() => import("@/components/blocks/WavePlusHero"));
const PlatformFeatures = dynamic(() => import("@/components/blocks/PlatformFeatures"));
const WhyWavePlus = dynamic(() => import("@/components/blocks/WhyWavePlus"));
const AboutPartner = dynamic(() => import("@/components/blocks/AboutPartner"));
const ContactHero = dynamic(() => import("@/components/blocks/ContactHero"));
const ContactInfoGrid = dynamic(() => import("@/components/blocks/ContactInfoGrid"));
const ContactFormSection = dynamic(() => import("@/components/blocks/ContactFormSection"));
const EmergencyBanner = dynamic(() => import("@/components/blocks/EmergencyBanner"));
const FaqSection = dynamic(() => import("@/components/blocks/FaqSection"));
const FeaturedProducts = dynamic(
  () => import("@/components/blocks/FeaturedProducts")
);
const CustomOrderCta = dynamic(
  () => import("@/components/blocks/CustomOrderCta")
);

/* ─── Block type map ────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockComponents: Record<string, React.ComponentType<{ data: any; pageSlug?: string }>> = {
  heroSection: HeroSection,
  trustBar: TrustBar,
  introSnippet: IntroSnippet,
  servicePillars: ServicePillars,
  whyChoose: WhyChoose,
  sectors: Sectors,
  wavePlusTeaser: WavePlusTeaser,
  ctaBanner: CtaBanner,
  missionVision: MissionVision,
  coreValues: CoreValues,
  timeline: Timeline,
  teamSection: TeamSection,
  coverage: Coverage,
  commercialWorkflow: CommercialWorkflow,
  categoryGrid: CategoryGrid,
  productGrid: ProductGrid,
  qhsePillars: QhsePillars,
  commitments: Commitments,
  standardsGrid: StandardsGrid,
  policyCTA: PolicyCTA,
  wavePlusHero: WavePlusHero,
  platformFeatures: PlatformFeatures,
  whyWavePlus: WhyWavePlus,
  aboutPartner: AboutPartner,
  contactHero: ContactHero,
  contactInfoGrid: ContactInfoGrid,
  contactFormSection: ContactFormSection,
  emergencyBanner: EmergencyBanner,
  faqSection: FaqSection,
  featuredProducts: FeaturedProducts,
  customOrderCta: CustomOrderCta,
};

/* ─── Renderer ──────────────────────────────────────────── */

interface ContentBlock {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

interface BlockRendererProps {
  blocks: ContentBlock[];
  pageSlug?: string;
}

export default function BlockRenderer({ blocks, pageSlug }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        const Component = blockComponents[block._type];

        if (!Component) {
          if (process.env.NODE_ENV === "development") {
            return (
              <div
                key={block._key}
                className="ss-container py-8 text-ss-grey-400 text-sm border border-dashed border-ss-grey-700 my-4 rounded"
              >
                ⚠️ No component found for block type:{" "}
                <code className="text-ss-red">{block._type}</code>
              </div>
            );
          }
          return null;
        }

        return <Component key={block._key} data={block} pageSlug={pageSlug} />;
      })}
    </>
  );
}
