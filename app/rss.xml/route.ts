import { getContentUpdatedAt, getSiteContent } from '@/lib/content';
import { REGIONS, regionInfo, regionPath } from '@/lib/regions';
import { regionDescription, SITE_NAME, SITE_PUBLISHED, SITE_URL } from '@/lib/seo';

// RSS for Naver Search Advisor: one item per fair page, with the same description
// the page uses. Regions added to lib/regions.ts and admin edits show up automatically.
// Naver rejects items without pubDate, so each carries the region's last admin save.

const escapeXml = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

// RFC 822, e.g. "Tue, 20 Oct 2026 05:42:00 GMT".
const rfc822 = (iso: string) => new Date(iso).toUTCString();

export async function GET() {
    const fairs = await Promise.all(
        REGIONS.map(async (r) => ({
            url: `${SITE_URL}${regionPath(r.id)}`,
            title: `${regionInfo(r.id).label} 웨딩박람회 | ${SITE_NAME}`,
            description: regionDescription(r.id, await getSiteContent(r.id)),
            updatedAt: (await getContentUpdatedAt(r.id)) ?? SITE_PUBLISHED,
        })),
    );
    const lastBuild = fairs.map((f) => f.updatedAt).sort().at(-1)!;

    const items = fairs.map(
        (f) => `    <item>
      <title>${escapeXml(f.title)}</title>
      <link>${f.url}</link>
      <guid isPermaLink="true">${f.url}</guid>
      <description>${escapeXml(f.description)}</description>
      <pubDate>${rfc822(f.updatedAt)}</pubDate>
    </item>`,
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE_NAME} | 대구·부산·포항·김해`)}</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>대구·부산·포항·김해 웨딩박람회 일정과 혜택을 확인하세요.</description>
    <language>ko</language>
    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>
`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
