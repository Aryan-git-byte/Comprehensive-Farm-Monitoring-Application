import React from 'react';
import { Helmet } from 'react-helmet-async';

export type SeoProps = {
  title: string;
  description: string;
  /** Absolute URL strongly recommended for SEO. Example: https://example.com/ */
  siteUrl?: string;
  /** Route path ("/", "/help"). Used to build canonical if canonicalUrl not provided. */
  path?: string;
  canonicalUrl?: string;
  /** Absolute image URL preferred. Falls back to /icons/icon-512x512.png under siteUrl if possible. */
  imageUrl?: string;
  locale?: string;
  /** Search engines: true => noindex,nofollow */
  noIndex?: boolean;
  /** Brand/application name */
  siteName?: string;
  /** Twitter handle like @farmbot_ai (optional) */
  twitterHandle?: string;
};

function normalizeUrl(base: string, maybePath: string) {
  const trimmedBase = base.replace(/\/+$/, '');
  const trimmedPath = maybePath.startsWith('/') ? maybePath : `/${maybePath}`;
  return `${trimmedBase}${trimmedPath}`;
}

export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  siteUrl,
  path,
  canonicalUrl,
  imageUrl,
  locale = 'en_IN',
  noIndex = false,
  siteName = 'FarmBot AI',
  twitterHandle
}) => {
  const canonical = canonicalUrl || (siteUrl && path ? normalizeUrl(siteUrl, path) : undefined);
  const image =
    imageUrl || (siteUrl ? normalizeUrl(siteUrl, '/icons/icon-512x512.png') : '/icons/icon-512x512.png');

  const robots = noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';

  const jsonLd = React.useMemo(() => {
    if (!siteUrl) return null;

    const homeUrl = siteUrl.replace(/\/+$/, '') + '/';
    const canonicalForSchema = canonical || homeUrl;

    const organizationId = `${homeUrl}#organization`;
    const websiteId = `${homeUrl}#website`;
    const appId = `${homeUrl}#app`;

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': organizationId,
          name: siteName,
          url: homeUrl,
          logo: normalizeUrl(siteUrl, '/icons/icon-512x512.png')
        },
        {
          '@type': 'WebSite',
          '@id': websiteId,
          url: homeUrl,
          name: siteName,
          publisher: { '@id': organizationId },
          inLanguage: 'en-IN',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${homeUrl}?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'SoftwareApplication',
          '@id': appId,
          name: siteName,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description,
          url: canonicalForSchema,
          offers: {
            '@type': 'Offer',
            price: 0,
            priceCurrency: 'INR'
          }
        }
      ]
    };
  }, [canonical, description, siteName, siteUrl]);

  return (
    <Helmet>
      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:locale" content={locale} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}

      {/* Helpful: colors for SERP/pwa */}
      <meta name="application-name" content={siteName} />

      {/* Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};
