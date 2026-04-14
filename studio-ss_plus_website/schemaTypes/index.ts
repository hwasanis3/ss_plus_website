import { type SchemaTypeDefinition } from 'sanity';

// Documents
import page from './documents/page';
import service from './documents/service';
import productCategory from './documents/productCategory';
import teamMember from './documents/teamMember';
import milestone from './documents/milestone';
import feature from './documents/feature';

// Objects
import heroSection from './objects/heroSection';
import trustBar from './objects/trustBar';
import introSnippet from './objects/introSnippet';
import servicePillars from './objects/servicePillars';
import whyChoose from './objects/whyChoose';
import sectors from './objects/sectors';
import wavePlusTeaser from './objects/wavePlusTeaser';
import ctaBanner from './objects/ctaBanner';
import missionVision from './objects/missionVision';
import coreValues from './objects/coreValues';
import timeline from './objects/timeline';
import teamSection from './objects/teamSection';
import coverage from './objects/coverage';
import commercialWorkflow from './objects/commercialWorkflow';
import serviceDetail from './objects/serviceDetail';
import categoryGrid from './objects/categoryGrid';
import productGrid from './objects/productGrid';
import featuredProducts from './objects/featuredProducts';
import customOrderCta from './objects/customOrderCta';
import qhseIntro from './objects/qhseIntro';
import qhsePillars from './objects/qhsePillars';
import commitments from './objects/commitments';
import standards from './objects/standards';
import policyCta from './objects/policyCta';
import standardsGrid from './objects/standardsGrid';
import wavePlusHero from './objects/wavePlusHero';
import whatIsWavePlus from './objects/whatIsWavePlus';
import platformFeatures from './objects/platformFeatures';
import whyWavePlus from './objects/whyWavePlus';
import aboutPartner from './objects/aboutPartner';
import accessAvailability from './objects/accessAvailability';
import screenshotSection from './objects/screenshotSection';
import contactHero from './objects/contactHero';
import contactInfo from './objects/contactInfo';
import contactForm from './objects/contactForm';
import contactInfoGrid from './objects/contactInfoGrid';
import contactFormSection from './objects/contactFormSection';
import emergencyBanner from './objects/emergencyBanner';
import faqSection from './objects/faqSection';
import mapEmbed from './objects/mapEmbed';
import emergencyContact from './objects/emergencyContact';
import socialLinks from './objects/socialLinks';
import header from './objects/header';
import footer from './objects/footer';
import seo from './objects/seo';

export const schemaTypes: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    page,
    service,
    productCategory,
    teamMember,
    milestone,
    feature,

    // Objects
    heroSection,
    trustBar,
    introSnippet,
    servicePillars,
    whyChoose,
    sectors,
    wavePlusTeaser,
    ctaBanner,
    missionVision,
    coreValues,
    timeline,
    teamSection,
    coverage,
    commercialWorkflow,
    serviceDetail,
    categoryGrid,
    productGrid,
    featuredProducts,
    customOrderCta,
    qhseIntro,
    qhsePillars,
    commitments,
    standards,
    standardsGrid,
    policyCta,
    wavePlusHero,
    whatIsWavePlus,
    platformFeatures,
    whyWavePlus,
    aboutPartner,
    accessAvailability,
    screenshotSection,
    contactHero,
    contactInfo,
    contactForm,
    contactInfoGrid,
    contactFormSection,
    emergencyBanner,
    faqSection,
    mapEmbed,
    emergencyContact,
    socialLinks,
    header,
    footer,
    seo,
  ],
};