/**
 * GROQ Queries for Sanity CMS
 *
 * These queries fetch page data from the modular page-builder schema.
 * Each content block (heroSection, trustBar, servicePillars, etc.)
 * is expanded inline so the client receives the full data tree.
 */

export const HOME_PAGE_QUERY = `
  *[_type == "page" && slug.current == "home"][0] {
    _id,
    title,
    slug,
    seo {
      metaTitle,
      metaDescription
    },
    content[] {
      _key,
      _type,

      // heroSection
      _type == "heroSection" => {
        headline,
        subheadline,
        primaryCta,
        secondaryCta,
        ctas[] {
          _key,
          label,
          url,
          primary
        },
        visual {
          asset-> {
            _id,
            url
          }
        }
      },

      // trustBar
      _type == "trustBar" => {
        stats[] {
          _key,
          number,
          label
        }
      },

      // introSnippet
      _type == "introSnippet" => {
        sectionLabel,
        headline,
        description,
        cta
      },

      // servicePillars
      _type == "servicePillars" => {
        pillars[] {
          _key,
          title,
          description
        }
      },

      // whyChoose
      _type == "whyChoose" => {
        sectionTitle,
        reasons[] {
          _key,
          point
        }
      },

      // sectors
      _type == "sectors" => {
        sectionLabel,
        description,
        sectorList[] {
          _key,
          name
        }
      },

      // wavePlusTeaser
      _type == "wavePlusTeaser" => {
        headline,
        description,
        cta
      },

      // ctaBanner
      _type == "ctaBanner" => {
        headline,
        description,
        primaryCta,
        secondaryCta
      }
    }
  }
`;

/**
 * Generic page query — fetch any page by slug.
 */
export const PAGE_QUERY = `
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    seo {
      metaTitle,
      metaDescription
    },
    content[] {
      _key,
      _type,
      
      // Expand everything from the block
      ... ,

      // Specific expansions for references
      _type == "timeline" => {
        milestones[]-> {
          _id,
          year,
          description
        }
      },

      // Add others if they use references (none currently in About, but good practice)
      _type == "servicePillars" => {
        pillars[] {
          _key,
          title,
          description,
          details
        }
      },
      _type == "commercialWorkflow" => {
        sectionLabel,
        title,
        description,
        steps[] {
          _key,
          label,
          title,
          description
        }
      },
      _type == "categoryGrid" => {
        title,
        categories[]-> {
          _id,
          title,
          description,
          image,
          tags
        }
      },
      _type == "productGrid" => {
        sectionLabel,
        title,
        products[] {
          _key,
          name,
          description,
          category,
          specs[] {
            label,
            value
          }
        }
      },
      _type == "qhsePillars" => {
        pillars[] {
          _key,
          label,
          title,
          description,
          points
        }
      },
      _type == "commitments" => {
        title,
        items
      },
      _type == "standardsGrid" => {
        title,
        certifications[] {
          _key,
          title,
          domain,
          description
        },
        standards[] {
          _key,
          standard,
          domain
        }
      },
      _type == "policyCTA" => {
        headline,
        description,
        cta,
        contactEmail,
        contactPhone
      },
      _type == "featuredProducts" => {
        title,
        products
      },
      _type == "customOrderCta" => {
        headline,
        description,
        cta
      },
      _type == "wavePlusHero" => {
        headline,
        subheadline,
        tags
      },
      _type == "platformFeatures" => {
        title,
        features[] {
          _key,
          title,
          description
        }
      },
      _type == "whyWavePlus" => {
        title,
        benefits[] {
          _key,
          title,
          description
        }
      },
      _type == "aboutPartner" => {
        headline,
        description,
        partnerName,
        supportEmail,
        supportPhone
      },
      _type == "contactHero" => {
        headline,
        description
      },
      _type == "contactInfoGrid" => {
        title,
        items[] {
          _key,
          label,
          value,
          icon
        }
      },
      _type == "contactFormSection" => {
        title,
        subtitle,
        subjects
      },
      _type == "emergencyBanner" => {
        headline,
        description,
        phone
      },
      _type == "faqSection" => {
        title,
        faqs[] {
          _key,
          question,
          answer
        }
      },
      _type == "teamSection" => {
        teamMembers[]-> {
          _id,
          name,
          title,
          bio,
          image { asset-> { url } }
        }
      }
    }
  }
`;

/**
 * Localized page query with language fallback.
 *
 * Expected slug shape:
 * - en: "about", "services", ...
 * - fr: "a-propos", "services", ...
 */
export const PAGE_BY_LOCALE_QUERY = `
  *[_type == "page" && slug.current in $slugs && (language == $locale || !defined(language))] | order(select(language == $locale => 1, 0) desc)[0] {
    _id,
    language,
    title,
    slug,
    seo {
      metaTitle,
      metaDescription
    },
    content[] {
      _key,
      _type,
      ...,

      // Resolve timeline milestone references for localized pages
      _type == "timeline" => {
        milestones[]-> {
          _id,
          year,
          description
        }
      }
    }
  }
`;
