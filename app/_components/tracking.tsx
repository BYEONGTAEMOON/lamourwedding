'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { matchingFields } from '@/lib/meta-matching';
import { isRegion } from '@/lib/regions';
import { sanitizeSource, SOURCE_KEYS, type ReservationSource } from '@/lib/reservations';
import { GA_ID, GTM_ID, META_PIXEL_ID } from '@/lib/tracking-ids';

// Google Tag Manager, Google Analytics 4 and Meta Pixel. Mounted once in the root layout;
// skipped on the admin so staff visits don't count as traffic. GA4 counts client-side
// navigations itself (enhanced measurement: history changes).

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
        fbq?: (...args: unknown[]) => void;
    }
}

// Query flag on the completion URL (e.g. /daegu?rsvp=done), used by URL-based ad conversions.
export const RSVP_DONE_PARAM = 'rsvp';

const setRsvpDone = (done: boolean) => {
    const url = new URL(window.location.href);
    if (done) url.searchParams.set(RSVP_DONE_PARAM, 'done');
    else url.searchParams.delete(RSVP_DONE_PARAM);
    window.history.replaceState(window.history.state, '', url);
};

// Drops a leftover ?rsvp=done (reload, shared link) so it isn't counted as a new completion.
export function clearRsvpDone() {
    if (new URLSearchParams(window.location.search).has(RSVP_DONE_PARAM)) setRsvpDone(false);
}

/* ---------- Ad attribution ---------- */

// The ad that brought the visitor (last click wins), kept for 30 days so it still
// applies when they come back to book later.
const SOURCE_STORAGE_KEY = 'lamour_source';
const SOURCE_DAYS = 30;

function captureSource() {
    const params = new URLSearchParams(window.location.search);
    const found = SOURCE_KEYS.filter((k) => k !== 'landing' && params.get(k));
    if (!found.length) return;
    const source: ReservationSource = { landing: window.location.pathname };
    for (const k of found) source[k] = params.get(k)!;
    try {
        localStorage.setItem(SOURCE_STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), source }));
    } catch {
        // Storage blocked (private mode); the reservation is just saved without a source.
    }
}

export function storedSource(): ReservationSource {
    try {
        const saved = JSON.parse(localStorage.getItem(SOURCE_STORAGE_KEY) ?? 'null');
        if (!saved || Date.now() - saved.savedAt > SOURCE_DAYS * 86400_000) return {};
        return sanitizeSource(saved.source);
    } catch {
        return {};
    }
}

// Shared by the browser Lead and the server's Conversions API Lead so Meta counts one.
export const newEventId = () =>
    typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// A region page view ("/daegu" …), reported as ViewContent for retargeting audiences.
const regionOf = (pathname: string) => {
    const slug = pathname.slice(1);
    return isRegion(slug) ? slug : null;
};

// Reports a completed reservation. The URL becomes /<region>?rsvp=done first, then a Pixel
// PageView marks that URL (for "URL contains" custom conversions per region) and the same
// Meta "Lead" fires for every region, alongside GA4 "generate_lead" and GTM "reservation_submit".
// The visitor's name and phone are only known now, so the pixel is re-initialised with
// advanced matching data right before those events.
export function trackReservation(
    region: string,
    visitor: { name: string; phone: string },
    eventId: string,
) {
    setRsvpDone(true);
    window.fbq?.('init', META_PIXEL_ID, matchingFields(visitor.name, visitor.phone));
    window.fbq?.('track', 'PageView');
    window.fbq?.('track', 'Lead', { content_name: region }, { eventID: eventId });
    window.gtag?.('event', 'generate_lead', { region });
    window.dataLayer?.push({ event: 'reservation_submit', region });
}

export function Tracking() {
    const pathname = usePathname();
    const first = useRef(true);

    useEffect(() => {
        captureSource();
        // The pixel's snippet counts the first page; client-side navigations need their own events.
        if (first.current) {
            first.current = false;
            return;
        }
        window.fbq?.('track', 'PageView');
        const region = regionOf(pathname);
        if (region) window.fbq?.('track', 'ViewContent', { content_name: region, content_category: 'wedding_fair' });
    }, [pathname]);

    if (pathname.startsWith('/admin')) return null;

    return (
        <>
            <Script id="gtm" strategy="afterInteractive">
                {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
            <Script id="meta-pixel" strategy="afterInteractive">
                {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
${regionOf(pathname) ? `fbq('track', 'ViewContent', { content_name: '${regionOf(pathname)}', content_category: 'wedding_fair' });` : ''}`}
            </Script>
            {/* Fallbacks for visitors without JavaScript. */}
            <noscript>
                <iframe
                    src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                    height="0"
                    width="0"
                    style={{ display: 'none', visibility: 'hidden' }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    alt=""
                    src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                />
            </noscript>
        </>
    );
}
