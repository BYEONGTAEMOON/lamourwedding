'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useRef } from 'react';

// Google Tag Manager, Google Analytics 4 and Meta Pixel. Mounted once in the root layout; skipped on the
// admin so staff visits don't count as traffic.
const GTM_ID = 'GTM-52NBVX99';
// GA4 counts client-side navigations itself (enhanced measurement: history changes).
const GA_ID = 'G-XWPJH4GMLF';
const META_PIXEL_ID = '147601669516017';

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

// Reports a completed reservation. The URL becomes /<region>?rsvp=done first, then a Pixel
// PageView marks that URL (for "URL contains" custom conversions per region) and the same
// Meta "Lead" fires for every region, alongside GA4 "generate_lead" and GTM "reservation_submit".
export function trackReservation(region: string) {
    setRsvpDone(true);
    window.fbq?.('track', 'PageView');
    window.fbq?.('track', 'Lead', { content_name: region });
    window.gtag?.('event', 'generate_lead', { region });
    window.dataLayer?.push({ event: 'reservation_submit', region });
}

export function Tracking() {
    const pathname = usePathname();
    const first = useRef(true);

    // The pixel's snippet counts the first page; client-side navigations need their own PageView.
    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        window.fbq?.('track', 'PageView');
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
fbq('track', 'PageView');`}
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
