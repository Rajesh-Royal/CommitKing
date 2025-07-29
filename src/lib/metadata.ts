import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://commitking.app";
const siteName = "CommitKings";
const title = "CommitKings - Rate & Discover GitHub Talent";
const description = "Discover amazing developers and repositories on GitHub. Rate profiles with 🔥 Hotty or 🧊 Notty, climb the leaderboards, and connect with the best developers in the community.";
const keywords = [
  "GitHub",
  "developers",
  "rating",
  "leaderboard",
  "open source",
  "programming",
  "code review",
  "developer community",
  "repositories",
  "software engineers",
  "coding",
  "tech talent",
  "developer showcase",
  "GitHub profiles"
];

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: keywords.join(", "),
  authors: [{ name: "CommitKings Team" }],
  creator: "CommitKings",
  publisher: "CommitKings",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title,
    description,
    images: [
      {
        url: "/commit-kings-preview.png",
        width: 1200,
        height: 630,
        alt: "CommitKings - Rate & Discover GitHub Talent",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@commitkings",
    creator: "@commitkings",
    title,
    description,
    images: ["/commit-kings-preview.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
  classification: "Developer Tools",
  other: {
    // LinkedIn
    "linkedin:owner": "commitkings",
    // Pinterest
    "pinterest-rich-pin": "true",
    // Telegram
    "telegram:channel": "@commitkings",
    // WhatsApp
    "whatsapp:share": "true",
    // Apple
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": siteName,
    // Microsoft
    "msapplication-TileColor": "#4f46e5",
    "msapplication-TileImage": "/commit-kings-preview.png",
    "msapplication-config": "/browserconfig.xml",
    // Theme
    "theme-color": "#4f46e5",
    "color-scheme": "light dark",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#4f46e5",
      },
    ],
  },
};

export const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  description,
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  sameAs: [
    "https://twitter.com/commitkings",
    "https://github.com/commitking",
  ],
};

export const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  description,
  url: siteUrl,
  logo: `${siteUrl}/commit-kings-preview.png`,
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@commitkings.com",
  },
  sameAs: [
    "https://twitter.com/commitkings",
    "https://github.com/commitking",
  ],
};

export const jsonLdWebApplication = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteName,
  description,
  url: siteUrl,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  permissions: "GitHub OAuth",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150",
    bestRating: "5",
    worstRating: "1",
  },
};

export function generateJsonLd() {
  return {
    __html: JSON.stringify([
      jsonLdWebsite,
      jsonLdOrganization,
      jsonLdWebApplication,
    ]),
  };
}
