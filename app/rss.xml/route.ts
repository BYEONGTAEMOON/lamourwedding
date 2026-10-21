import { getSiteContent } from '@/lib/content';
import { REGIONS, regionInfo, regionPath } from '@/lib/regions';
import { regionDescription, SITE_NAME, SITE_URL } from '@/lib/seo';

// RSS for Naver Search Advisor: one item per fair page, with the same description
// the page uses. Regions added to lib/regions.ts and admin edits show up automatically.

const escapeXml = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

export async function GET() {
    const items = await Promise.all(
        REGIONS.map(async (r) => {
            const url = `${SITE_URL}${regionPath(r.id)}`;
            return `    <item>
      <title>${escapeXml(`${regionInfo(r.id).label} 웨딩박람회 | ${SITE_NAME}`)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(regionDescription(r.id, await getSiteContent(r.id)))}</description>
    </item>`;
        }),
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${SITE_NAME} | 대구·부산·포항·김해`)}</title>
    <link>${SITE_URL}</link>
    <description>대구·부산·포항·김해 웨딩박람회 일정과 혜택을 확인하세요.</description>
    <language>ko</language>
${items.join('\n')}
  </channel>
</rss>
`;
    return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
