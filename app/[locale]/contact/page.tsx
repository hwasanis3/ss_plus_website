import BlockRenderer from "@/components/BlockRenderer";
import {fetchLocalizedPage, type Locale} from "@/lib/localizedPage";

interface LocalePageProps {
  params: Promise<{locale: Locale}>;
}

export async function generateMetadata({params}: LocalePageProps) {
  const {locale} = await params;
  const page = await fetchLocalizedPage(locale, "contact");
  if (!page) return {title: "Contact Us | SS PLUS"};
  return {
    title: page.seo?.metaTitle || `${page.title} | SS PLUS`,
    description: page.seo?.metaDescription || "Get in touch with SS PLUS",
  };
}

export default async function LocalizedContactPage({params}: LocalePageProps) {
  const {locale} = await params;
  const page = await fetchLocalizedPage(locale, "contact");

  if (!page || !page.content?.length) {
    return (
      <main className="flex flex-1 items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="ss-accent-line mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold mb-4 text-ss-pure-white uppercase">Contact</h1>
          <p className="text-ss-grey-400 max-w-md mx-auto">
            The Contact page for "{locale}" has not been published in Sanity yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen">
      <BlockRenderer blocks={page.content} />
    </main>
  );
}

