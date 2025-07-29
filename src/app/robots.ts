import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://commitkings.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/waitlist', '/auth/callback', '/api/waitlist'],
      disallow: ['/api/admin/', '/api/auth/', '/_next/', '/api/priority/', '/api/ratings/', '/api/users/'],
      crawlDelay: 1,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
